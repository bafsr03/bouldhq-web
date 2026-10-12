/**
 * Bould Leads — Apps Script web app bound to the "Bould Leads" Google Sheet.
 *
 * Two writers, one sheet:
 *   - /api/lead on bouldhq.com posts { action: 'append_lead' } for every real
 *     audit or contact submission. Each one becomes a row on "Inbound" and an
 *     instant alert to the salesperson (email, plus a text if configured).
 *   - scripts/prospect posts { action: 'upsert_prospects' } with scored local
 *     businesses. Rows on "Prospects" are keyed by Google Place ID, so a weekly
 *     re-run refreshes the data columns and never touches what the salesperson
 *     typed (Status, Next action, Owner, Notes, Last contacted).
 *
 * Column names here are the contract. scripts/prospect/sheet.ts sends objects
 * keyed by PROSPECT_DATA_COLUMNS; keep the two in step.
 *
 * Script properties (Project Settings → Script properties):
 *   SECRET          required. Same value as LEAD_SHEET_SECRET on Vercel / .env.local.
 *   ALERT_EMAIL     where new-lead alerts go, e.g. jake@bouldhq.com.
 *   ALERT_SMS_EMAIL optional carrier email-to-SMS address, e.g. 8015551234@vtext.com.
 *
 * See README.md in this folder for setup.
 */

var INBOUND = 'Inbound'
var PROSPECTS = 'Prospects'

var STATUSES = ['New', 'Attempted', 'Connected', 'Audit sent', 'Proposal', 'Won', 'Lost', 'Do not call']

/** Columns the salesperson owns. Never overwritten by a refresh. */
var PIPELINE_COLUMNS = ['Status', 'Next action', 'Owner', 'Notes', 'Last contacted']

var INBOUND_COLUMNS = [
  'Received', 'Source', 'Name', 'Business', 'Phone', 'Email',
].concat(PIPELINE_COLUMNS).concat([
  'Website', 'Industry', 'City', 'Heard via', 'Score', 'Verdict', 'Gaps (answered no)', 'Message',
])

var PROSPECT_DATA_COLUMNS = [
  'Tier', 'Opportunity', 'Business', 'Phone', 'City', 'Industry',
  'Opener', 'Top gaps', 'Ask on call',
  'Est. score', 'Verdict', 'Plan',
  'Rating', 'Reviews', 'Map rank', 'Website', 'Site issues', 'PageSpeed (mobile)',
  'Google category', 'Maps link', 'Query', 'Place ID', 'Refreshed',
]

/** Display order on the Prospects tab: who to call, then the pipeline, then the evidence. */
var PROSPECT_COLUMNS = ['Tier', 'Opportunity', 'Business', 'Phone', 'City', 'Industry']
  .concat(PIPELINE_COLUMNS)
  .concat(PROSPECT_DATA_COLUMNS.filter(function (c) {
    return ['Tier', 'Opportunity', 'Business', 'Phone', 'City', 'Industry'].indexOf(c) === -1
  }))

// ---------------------------------------------------------------- entry points

function doPost(e) {
  var body
  try {
    body = JSON.parse(e.postData.contents)
  } catch (err) {
    return json_({ ok: false, error: 'malformed JSON' })
  }

  var secret = PropertiesService.getScriptProperties().getProperty('SECRET')
  if (!secret || body.secret !== secret) return json_({ ok: false, error: 'unauthorized' })

  var lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    if (body.action === 'append_lead') return json_(appendLead_(body.lead || {}))
    if (body.action === 'upsert_prospects') return json_(upsertProspects_(body.prospects || []))
    return json_({ ok: false, error: 'unknown action' })
  } finally {
    lock.releaseLock()
  }
}

/** Health check: opening the web app URL in a browser shows this. */
function doGet() {
  return json_({ ok: true, service: 'bould-lead-sheet' })
}

/** Run once from the editor: creates both tabs with headers, dropdowns, and frozen rows. */
function setup() {
  ensureSheet_(INBOUND, INBOUND_COLUMNS)
  ensureSheet_(PROSPECTS, PROSPECT_COLUMNS)
}

/**
 * Google's Places terms limit how long Places content may be kept. Run weekly
 * (Triggers → time-driven) to drop prospects nobody has worked that have not
 * been refreshed in 30 days. Worked rows stay: they are now your own records.
 */
function pruneStaleProspects() {
  var sheet = ensureSheet_(PROSPECTS, PROSPECT_COLUMNS)
  var data = sheet.getDataRange().getValues()
  var h = indexOf_(data[0])
  var cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000)
  for (var r = data.length - 1; r >= 1; r--) {
    var status = data[r][h['Status']]
    var refreshed = new Date(data[r][h['Refreshed']])
    if ((status === '' || status === 'New') && refreshed < cutoff) sheet.deleteRow(r + 1)
  }
}

// ---------------------------------------------------------------- inbound

function appendLead_(lead) {
  var sheet = ensureSheet_(INBOUND, INBOUND_COLUMNS)
  var audit = lead.audit || null
  var gaps = audit
    ? audit.answers.filter(function (a) { return a.answer === 'no' })
        .map(function (a) { return a.question + ' (' + a.points + ')' }).join('\n')
    : ''

  var row = {
    'Received': new Date(),
    'Source': lead.source,
    'Name': lead.name,
    'Business': lead.business,
    'Phone': lead.phone,
    'Email': lead.email,
    'Status': 'New',
    'Website': lead.website,
    'Industry': lead.industry,
    'City': lead.city,
    'Heard via': lead.heardVia,
    'Score': audit ? audit.score + '/' + audit.total : '',
    'Verdict': audit ? audit.verdict : '',
    'Gaps (answered no)': gaps,
    'Message': lead.message,
  }
  sheet.appendRow(INBOUND_COLUMNS.map(function (c) { return safe_(row[c]) }))
  alert_(lead, audit)
  return { ok: true, row: sheet.getLastRow() }
}

/**
 * The speed-to-lead alert. Someone who just filled in the audit is the hottest
 * lead Bould will ever get, and the odds of reaching them fall off within
 * minutes — so the alert says who, the number to dial, and the score.
 */
function alert_(lead, audit) {
  var props = PropertiesService.getScriptProperties()
  var to = props.getProperty('ALERT_EMAIL')
  var sms = props.getProperty('ALERT_SMS_EMAIL')
  var headline = audit
    ? 'CALL NOW: ' + lead.business + ' scored ' + audit.score + '/' + audit.total
    : 'CALL NOW: ' + lead.business + ' (' + lead.source + ')'

  if (to) {
    var lines = [
      headline, '',
      'Name:     ' + (lead.name || ''),
      'Phone:    ' + (lead.phone || '(none given; reply by email)'),
      'Email:    ' + (lead.email || ''),
      'Website:  ' + (lead.website || ''),
      'Industry: ' + (lead.industry || ''),
      'City:     ' + (lead.city || ''),
    ]
    if (audit) lines.push('', 'Verdict: ' + audit.verdict)
    if (lead.message) lines.push('', lead.message)
    lines.push('', 'Sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl())
    MailApp.sendEmail({ to: to, subject: headline, body: lines.join('\n'), replyTo: lead.email || to })
  }
  if (sms) {
    // Carrier gateways truncate around 160 characters: who, number, score.
    MailApp.sendEmail(sms, '', (headline + ' ' + (lead.phone || lead.email || '')).slice(0, 155))
  }
}

// ---------------------------------------------------------------- prospects

function upsertProspects_(prospects) {
  var sheet = ensureSheet_(PROSPECTS, PROSPECT_COLUMNS)
  var data = sheet.getDataRange().getValues()
  var h = indexOf_(data[0])
  var rowByPlace = {}
  for (var r = 1; r < data.length; r++) rowByPlace[data[r][h['Place ID']]] = r

  var inserted = 0
  var updated = 0
  var appends = []

  prospects.forEach(function (p) {
    if (!p['Place ID']) return
    var r = rowByPlace[p['Place ID']]
    if (r === -1) return // already queued for insert in this batch
    if (r !== undefined) {
      PROSPECT_DATA_COLUMNS.forEach(function (c) {
        if (p[c] !== undefined) data[r][h[c]] = safe_(p[c])
      })
      updated++
    } else {
      appends.push(PROSPECT_COLUMNS.map(function (c) {
        if (c === 'Status') return 'New'
        return PIPELINE_COLUMNS.indexOf(c) === -1 ? safe_(p[c]) : ''
      }))
      rowByPlace[p['Place ID']] = -1
      inserted++
    }
  })

  if (data.length > 1) {
    sheet.getRange(1, 1, data.length, data[0].length).setValues(data)
  }
  if (appends.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, appends.length, PROSPECT_COLUMNS.length).setValues(appends)
  }
  return { ok: true, inserted: inserted, updated: updated }
}

// ---------------------------------------------------------------- helpers

function ensureSheet_(name, columns) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(name)
  if (!sheet) sheet = ss.insertSheet(name)

  var width = Math.max(sheet.getLastColumn(), 1)
  var header = sheet.getRange(1, 1, 1, width).getValues()[0]
  var missing = columns.filter(function (c) { return header.indexOf(c) === -1 })
  if (header.join('') === '') {
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight('bold')
    sheet.setFrozenRows(1)
  } else if (missing.length) {
    // A column added in a later version of this script goes on the end, so
    // existing data never shifts under the salesperson.
    sheet.getRange(1, header.length + 1, 1, missing.length).setValues([missing]).setFontWeight('bold')
  }

  var h = indexOf_(sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0])
  var status = sheet.getRange(2, h['Status'] + 1, Math.max(sheet.getMaxRows() - 1, 1), 1)
  if (!status.getDataValidation()) {
    status.setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build()
    )
  }
  return sheet
}

function indexOf_(header) {
  var h = {}
  header.forEach(function (c, i) { h[c] = i })
  return h
}

/**
 * Form input is untrusted. A value starting with = + - @ would be evaluated
 * as a formula; a phone number like "+1 801…" would even be mangled by
 * accident. Prefixing an apostrophe makes Sheets store it as plain text.
 */
function safe_(v) {
  if (v === undefined || v === null) return ''
  if (v instanceof Date || typeof v === 'number') return v
  var s = String(v)
  return /^[=+\-@]/.test(s) ? "'" + s : s
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
