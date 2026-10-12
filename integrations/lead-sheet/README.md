# Lead sheet

The "Bould Leads" Google Sheet is where the salesperson works. Everything goes into it:

- **Inbound:** every real lead from `/visibility-audit` and `/contact`. `/api/lead` sends it here as well as to the inbox.
- **Prospects:** scored local businesses from `npm run prospect` (see `scripts/prospect/`).

A new inbound lead also triggers an instant **CALL NOW** alert, by email and optionally by text. That alert is the reason to set this up: an audit lead called within five minutes is a very different conversation from one called tomorrow.

## Setup (about 10 minutes)

1. Create a Google Sheet named **Bould Leads**. Open **Extensions → Apps Script**.
2. Replace the editor's contents with `Code.gs` from this folder and save.
3. **Project Settings → Script properties.** Add these:
   - `SECRET`: a long random string, for example from `openssl rand -hex 24`.
   - `ALERT_EMAIL`: the salesperson's email.
   - `ALERT_SMS_EMAIL` (optional): his carrier's email-to-SMS address.
     - Verizon: `number@vtext.com`
     - AT&T: `number@txt.att.net`
     - T-Mobile: `number@tmomail.net`
4. Select `setup` in the function dropdown and click **Run**. Approve the permissions. This creates the **Inbound** and **Prospects** tabs.
5. **Deploy → New deployment → Web app.** Set "Execute as: Me" and "Who has access: Anyone". Copy the `/exec` URL.
   - Opening that URL in a browser should show `{"ok":true,"service":"bould-lead-sheet"}`.
6. Set the same two values everywhere they're needed:
   - On Vercel (production):
     ```bash
     vercel env add LEAD_SHEET_WEBHOOK_URL production   # the /exec URL
     vercel env add LEAD_SHEET_SECRET production        # same as SECRET
     ```
   - In `.env.local`, for the prospect engine.
7. Redeploy. `./scripts/verify.sh <url>` should print "leads are copied to the lead sheet".
8. **Triggers → Add trigger:** `pruneStaleProspects`, time-driven, weekly. Google's Places terms limit how long Places data may be stored, so this drops unworked prospects that haven't been refreshed in 30 days.

When you change `Code.gs`, use **Deploy → Manage deployments → Edit → New version**. That keeps the same URL. A *new deployment* gets a new URL and breaks the site's webhook.

## How it behaves

- **Prospect columns the salesperson owns are never overwritten:** Status, Next action, Owner, Notes and Last contacted. A refresh only updates the data columns. Inbound rows are appended once and never touched again.
- Prospects are keyed by Google Place ID, so re-running the engine never creates duplicates.
- Any input starting with `=`, `+`, `-` or `@` is stored as plain text. Form input can't become a formula.
- If the sheet is down or misconfigured, the visitor still sees success. The lead still goes to the inbox (or the runtime log), and the failure is logged as `[lead] sheet delivery failed`.
- `@example.com` probe leads from `verify.sh` never reach the sheet.
- A refresh rewrites the Prospects tab in one batch. Avoid typing in it during the few seconds a `npm run prospect` upload is running.
