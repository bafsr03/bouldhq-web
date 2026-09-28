/**
 * Google reviews, quoted verbatim.
 *
 * Only reviews that actually exist on the Google Business Profile, with the
 * reviewer's own wording. Nothing here is written by Bould, paraphrased, or
 * tidied up.
 *
 * `text: ''` means the review exists but its wording has not been copied across
 * yet. The homepage renders only entries that have text, so an unfinished entry
 * shows nothing rather than an empty card — and appears the moment the quote is
 * pasted in, with no other edit.
 *
 * Deliberately NOT marked up as Review/AggregateRating JSON-LD. Self-hosted
 * review markup on your own business is exactly what Google's structured-data
 * guidelines call out, and the reviews already live on the profile where they
 * carry weight. This is social proof for the reader, not a rich-result play.
 */

export type Review = {
  author: string
  /** Verbatim. Empty until someone has copied it off the profile. */
  text: string
  business?: string
  /**
   * What the review is describing, when the quote alone would be read as
   * describing Bould. Cesar's review opens by recounting what his PREVIOUS
   * agency put him through; pulled out of its thread and set under a heading
   * like "what clients say", it reads as an account of working with us.
   */
  context?: string
}

export const REVIEWS: Review[] = [
  {
    author: 'Cesar Rubio',
    business: 'Rubio Brothers Concrete',
    context: 'on the agency he used before Bould',
    text: 'It was anxiety filled because I knew they were going to bill me and just take my money without me seeing results and every time I would address issues it seems like nothing got resolved and I was told SEO takes time and I would start seeing results after a year.',
  },
  {
    author: 'Devin',
    text: '',
  },
]

export const PUBLISHED_REVIEWS = REVIEWS.filter((r) => r.text.trim() !== '')
