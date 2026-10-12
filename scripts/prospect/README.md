# Prospect engine

This tool builds the outbound call list. It does four things:

1. Finds Wasatch Front service businesses on Google Maps.
2. Checks each one's website the way a customer on a phone would.
3. Scores each one on **the same 20-point visibility audit** as `/visibility-audit`. It imports `lib/content/audit.ts`; nothing is copied.
4. Ranks them into a call list in the "Bould Leads" sheet. Each row includes a ready-made opener.

```bash
npm run prospect -- --industry contractors --city "Provo, UT" --dry-run   # CSV only
npm run prospect -- --industry all --city utah                            # full Utah County run into the sheet
npm run prospect -- --help
```

Run it weekly. Re-runs are cheap: searches are cached for 7 days and site checks for 14. Rows are keyed by Google Place ID, so a re-run refreshes the data and never touches the salesperson's Status or Notes.

## Setup

1. In Google Cloud, enable **Places API (New)** and **PageSpeed Insights API**, then create an API key. Restrict it to those two APIs.
2. Add to `.env.local`:
   ```
   GOOGLE_PLACES_API_KEY=...
   PAGESPEED_API_KEY=...          # optional; without it the speed check is skipped
   LEAD_SHEET_WEBHOOK_URL=...     # from integrations/lead-sheet (not needed for --dry-run)
   LEAD_SHEET_SECRET=...
   ```
3. Run a dry run first and check 5 rows by hand against Google Maps.

**Cost.** Each search is one Places request returning up to 20 businesses. It's billed at the Text Search Enterprise rate, because rating, review count, phone and website are Enterprise fields.

- A run of `--industry all --city utah` is 14 trades × 12 cities, about 180 requests.
- Check [current pricing](https://developers.google.com/maps/billing-and-pricing/pricing) and the monthly free usage before scaling up with `--pages 3`.
- PageSpeed is free, but slow (10–40 seconds per site). Use `--no-pagespeed` for a quick pass.

## What the columns mean

| Column | Meaning |
|---|---|
| **Tier** | **A**: an established business (10+ reviews) with a gap it can see. Call these first. **B**: a smaller business or a smaller gap. **C**: everything else, including businesses already winning on every front. |
| **Opportunity** | 0–100. How much need there is (no or poor site, outside the top 3, few reviews), plus how established the business is (reviews are the best outside proxy for "can pay"). |
| **Opener** | The first lines of the call. Replace `[your name]`. |
| **Top gaps** | The audit items it fails, heaviest first, each paired with the fix from the audit. This is the pitch. |
| **Ask on call** | The audit questions that can't be checked from outside, such as profile access, posting, listings and lead tracking. These are the discovery questions. |
| **Est. score** | Confirmed points plus half of the unchecked ones. It's an estimate, so call it "around" on the phone. Once they fill in the real audit, that score replaces it. |
| **Verdict / Plan** | The site's own recommendation for that score: 14+ gets Website Build; under 14 gets Golden Formula. |
| **Map rank** | Position in Google's results for "trade in city". This approximates the map pack; real map results depend on where the searcher is standing. |

**Excluded automatically:**
- Closed businesses.
- No phone number.
- National chains and franchises (`CHAINS` in `queries.ts`).
- Any name that appears in 4 or more places.

Each run prints how many were excluded and why.

## Changing what it looks for

- **Trades, search terms, and which ones are seasonal:** `TRADES` in `queries.ts`.
- **Cities:** `CITIES` in `queries.ts`.
- **Tier thresholds and opportunity weights:** `opportunityScore()` in `score.ts`.
- **Audit questions, points, verdicts, plans:** `lib/content/audit.ts` and `lib/content/pricing.ts`. These change the website too, which is the point.

## Rules

- **Dial by hand.** Calling businesses is legal. Using an autodialer, prerecorded messages, or automated texts to cell phones without consent is not (TCPA). Many owners list a cell as the business number.
- **"Do not call" means never.** Set the Status to *Do not call*. A refresh never resets a status.
- **Cold email** needs a working opt-out and Bould's physical address (CAN-SPAM).
- **Google's Places terms limit how long Places content may be stored.** The sheet's weekly `pruneStaleProspects` trigger removes untouched rows after 30 days, and `out/` and `.cache/` are gitignored. Don't paste exports into other tools.
