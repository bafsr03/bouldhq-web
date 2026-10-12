/**
 * Step 1: find local businesses with Google Places API (New) Text Search.
 *
 * "<trade> in <city>, UT" is the same search a homeowner types, so the order
 * Google returns is a fair stand-in for who wins that search — position 1–3
 * approximates the map pack the audit asks about. It is an approximation: the
 * real map pack is personalised by the searcher's location.
 *
 * Billing is per request (up to 20 places each), at the Enterprise tier
 * because rating, review count, phone, and website are Enterprise fields.
 * Check current pricing before a large run:
 * https://developers.google.com/maps/billing-and-pricing/pricing
 */

import { cached } from './cache'

const ENDPOINT = 'https://places.googleapis.com/v1/places:searchText'

const FIELDS = [
  'places.id',
  'places.displayName',
  'places.primaryType',
  'places.primaryTypeDisplayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.websiteUri',
  'places.nationalPhoneNumber',
  'places.businessStatus',
  'places.googleMapsUri',
  'nextPageToken',
].join(',')

export type Place = {
  id: string
  name: string
  primaryType?: string
  category?: string
  address?: string
  rating?: number
  reviews: number
  website?: string
  phone?: string
  status?: string
  mapsUrl?: string
  /** 1-based position in the results for `query`. */
  rank: number
  query: string
}

type ApiPlace = {
  id: string
  displayName?: { text: string }
  primaryType?: string
  primaryTypeDisplayName?: { text: string }
  formattedAddress?: string
  rating?: number
  userRatingCount?: number
  websiteUri?: string
  nationalPhoneNumber?: string
  businessStatus?: string
  googleMapsUri?: string
}

export async function searchPlaces(query: string, apiKey: string, pages = 1): Promise<Place[]> {
  return cached('search', `${query}|${pages}`, 7, async () => {
    const out: Place[] = []
    let pageToken: string | undefined
    for (let page = 0; page < pages; page++) {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': FIELDS,
        },
        body: JSON.stringify({
          textQuery: query,
          pageSize: 20,
          regionCode: 'US',
          // Contractors and cleaners often hide their address and list a service
          // area instead. Without this flag Google leaves them out entirely —
          // and they are exactly the businesses Bould builds for.
          includePureServiceAreaBusinesses: true,
          ...(pageToken ? { pageToken } : {}),
        }),
      })
      if (!res.ok) {
        throw new Error(`Places search failed for "${query}": HTTP ${res.status} ${await res.text()}`)
      }
      const data = (await res.json()) as { places?: ApiPlace[]; nextPageToken?: string }
      for (const p of data.places ?? []) {
        out.push({
          id: p.id,
          name: p.displayName?.text ?? '',
          primaryType: p.primaryType,
          category: p.primaryTypeDisplayName?.text,
          address: p.formattedAddress,
          rating: p.rating,
          reviews: p.userRatingCount ?? 0,
          website: p.websiteUri,
          phone: p.nationalPhoneNumber,
          status: p.businessStatus,
          mapsUrl: p.googleMapsUri,
          rank: out.length + 1,
          query,
        })
      }
      pageToken = data.nextPageToken
      if (!pageToken) break
    }
    return out
  })
}

/**
 * In Utah, or a service-area business with no address (which Google only
 * returned because it serves the searched city).
 */
export function inUtah(p: Place): boolean {
  if (!p.address) return true
  return /\bUT\b|\bUtah\b/.test(p.address)
}
