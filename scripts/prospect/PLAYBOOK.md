# Sales playbook

**The goal of the first call is a completed audit, not a sale.**

The audit does the selling: it's twelve yes-or-no questions, and the owner answers them. The score points to a plan, and the plan has a price on the website.

## Every day

| When | What |
|---|---|
| First thing | Check **Inbound**. Any row with Status *New* gets called before anything else. |
| 2-hour block | Work **Prospects**, Tier A first. Rubio lookalikes are at the top of it; call them first. About 40 dials. |
| End of day | Update Status, Next action and Last contacted on every row you touched. |

**The inbound rule.** When a **CALL NOW** alert arrives, call within 5 minutes during business hours, or the same evening otherwise. Someone who just took the audit is the warmest lead Bould will ever get, and the odds of reaching them drop with every hour.

## The call

1. **Open** with the row's *Opener*. It quotes two facts the owner can check while you're on the phone (map position, review count, no tap-to-call button). Say "around" for the score; it's an estimate.
   - **Rubio lookalike?** Lead with the story: "A concrete company in Pleasant Grove was where you are: great reviews, and a site that wasn't turning them into calls. First lead in two weeks after the rebuild." Send `bouldhq.com/work/rubio-brothers-concrete` with the audit link.
   - **Ad signals?** They already pay for clicks. The opener says where the clicks are leaking; the pitch is fixing the leak, not more spend.
2. **Ask the *Ask on call* questions** in plain words:
   - "Can you log into your Google profile today?"
   - "Do you know how many leads you got last month?"

   Every answer firms up the score.
3. **Close on the audit:**
   - "I'll text you the link. It takes three minutes and shows exactly where the calls are leaking."
   - Send `bouldhq.com/visibility-audit`.
   - Or go through the 12 questions with them on the call and submit it yourself with their details. It lands in **Inbound** with the real score.
4. **Book the follow-up** before hanging up. Set *Next action*.

**What the verdict sells.** This mirrors the website:

| Score | Verdict | Offer |
|---|---|---|
| 14–20 | You're ready for a new site | **Website Build**, $250/mo |
| 8–13 | Launch with a visibility package | **Golden Formula**, $450/mo |
| 0–7 | Visibility first | **Golden Formula**, $450/mo. Lead with reviews and the profile, not the site. |

## If they don't pick up (10 days)

| Day | Touch |
|---|---|
| 1 | Call. Voicemail with one fact from the opener. Text: "Hi, it's [name] from Bould. Ran your Google check, you're #7 for concrete in Provo. Want the breakdown? bouldhq.com/visibility-audit" |
| 2 | Email with the same fact, plus the top gap and its fix. |
| 4 | Call. |
| 7 | Email a 60-second screen recording of you searching their trade and city, and where they show up. |
| 10 | Break-up email: "Closing your file. The audit link stays open if timing changes." Set Status to *Lost*, or schedule a 90-day retry in Next action. |

The day 1 text is sent **by hand from your phone**, one at a time. Never use a bulk texting tool.

## More hot leads besides the engine

Add these to the sheet by hand, with the source in Notes:

- **New businesses:** Google profiles with fewer than 5 reviews, and new Utah business registrations. They need everything, and nobody else has called yet.
- **Seasonal timing:** call roofing, concrete, landscaping and exterior cleaning **from October**, as their season winds down. The owner is off the truck, has the summer's cash, and a site started in November is live well before spring. **January–February is the second wave**, not the first. Snow removal is the opposite: its season starts in November, so it's a now-or-next-year call.
- **Report-card mailers:** for Tier A prospects who don't pick up, mail a one-page printout of their row: score, map rank, top gaps, and a QR code to the audit. Owners in the trades ignore email but open mail.
- **Referral partners:** concrete and lumber supply yards, the Utah County Home Builders Association, BNI chapters, and bookkeepers who serve trades. Also vehicle wrap and sign shops (a new business buys a wrap before a website), contractor licensing course providers, and business bankers and insurance agents who work with trades.
- **Existing clients:** ask every client for one referral and a Google review. A referral that closes earns the client a free month.
- **Bould's own listings:** Bing Places, Apple Business Connect, Yelp, BBB, Clutch, DesignRush, Nextdoor, the Shopify Partners directory, and the Utah Valley Chamber. Use the name and phone exactly as on the website.

## Weekly numbers (Friday, 10 minutes)

| Metric | Where it comes from |
|---|---|
| Dials / connects / audits completed / proposals / wins | Status counts on Prospects |
| Inbound leads by source | Inbound, Source and Heard via columns |
| Median minutes from alert to first call | Received vs Last contacted |
| Close rate by tier | Won ÷ worked, per Tier |

If Tier A doesn't close better than Tier B after a month, the opportunity weights in `score.ts` are wrong. Change them there.
