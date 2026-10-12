/**
 * What to search for, and where.
 *
 * Trades are grouped under the same industry names the site uses
 * (lib/content/industries.ts) so a prospect's "Industry" column reads the same
 * as an inbound lead's. "Product brands" is deliberately absent: they are not
 * found through Google Maps, and they are not who the monthly plans are for.
 */

export type IndustryName = 'Contractors' | 'Home services' | 'Auto repair'

export type Trade = {
  key: string
  industry: IndustryName
  /** Text Search queries; each runs as "<term> in <city>, UT". */
  terms: string[]
  /**
   * Lower-case fragments that mean "this business does the trade". Matched
   * against the business name (audit: "Does your business name say what you
   * do?") and the Google category (audit: "Does the primary category match
   * your main service?").
   */
  words: string[]
  /** Audit: "Do you get work year-round rather than in one short season?" */
  seasonal: boolean
}

export const TRADES: Trade[] = [
  { key: 'concrete', industry: 'Contractors', terms: ['concrete contractor'], words: ['concrete', 'cement', 'flatwork'], seasonal: true },
  { key: 'excavation', industry: 'Contractors', terms: ['excavating contractor'], words: ['excavat', 'grading', 'earthwork', 'dirt work'], seasonal: true },
  { key: 'roofing', industry: 'Contractors', terms: ['roofing contractor'], words: ['roof'], seasonal: true },
  { key: 'fencing', industry: 'Contractors', terms: ['fence contractor'], words: ['fence', 'fencing'], seasonal: true },
  { key: 'painting', industry: 'Contractors', terms: ['painting contractor'], words: ['paint'], seasonal: false },
  { key: 'electrician', industry: 'Contractors', terms: ['electrician'], words: ['electric'], seasonal: false },
  { key: 'plumbing', industry: 'Contractors', terms: ['plumber'], words: ['plumb', 'rooter', 'drain'], seasonal: false },
  // High-ticket jobs: a single new customer pays for months of a plan.
  { key: 'remodeling', industry: 'Contractors', terms: ['remodeling contractor'], words: ['remodel', 'renovat', 'kitchen', 'bath', 'basement'], seasonal: false },
  { key: 'hvac', industry: 'Home services', terms: ['HVAC contractor'], words: ['hvac', 'heating', 'air condition', 'cooling', 'furnace', 'comfort'], seasonal: false },
  { key: 'landscaping', industry: 'Home services', terms: ['landscaper'], words: ['landscap', 'lawn', 'yard', 'sprinkler'], seasonal: true },
  { key: 'exterior-cleaning', industry: 'Home services', terms: ['pressure washing service', 'window cleaning service'], words: ['wash', 'window', 'clean'], seasonal: true },
  { key: 'holiday-lighting', industry: 'Home services', terms: ['christmas light installation'], words: ['light'], seasonal: true },
  // Its season opens in November; the window to sell it is now.
  { key: 'snow-removal', industry: 'Home services', terms: ['snow removal service'], words: ['snow', 'plow'], seasonal: true },
  { key: 'garage-door', industry: 'Home services', terms: ['garage door repair'], words: ['garage', 'door'], seasonal: false },
  { key: 'tree-service', industry: 'Home services', terms: ['tree service'], words: ['tree', 'arbor', 'stump'], seasonal: false },
  { key: 'pest-control', industry: 'Home services', terms: ['pest control service'], words: ['pest', 'bug', 'termite', 'exterminat', 'rodent'], seasonal: false },
  { key: 'junk-removal', industry: 'Home services', terms: ['junk removal service'], words: ['junk', 'haul', 'dumpster'], seasonal: false },
  { key: 'auto-repair', industry: 'Auto repair', terms: ['auto repair shop'], words: ['auto', 'automotive', 'car', 'repair', 'mechanic', 'motor', 'tire', 'transmission', 'garage', 'service'], seasonal: false },
  { key: 'auto-body', industry: 'Auto repair', terms: ['auto body shop'], words: ['body', 'collision', 'paint', 'auto'], seasonal: false },
  { key: 'auto-detailing', industry: 'Auto repair', terms: ['auto detailing'], words: ['detail'], seasonal: false },
]

/** Wasatch Front, nearest first: Utah County is home turf, so it runs first. */
export const CITIES: Record<'utah' | 'salt-lake', string[]> = {
  utah: [
    'Provo', 'Orem', 'Lehi', 'American Fork', 'Pleasant Grove', 'Lindon',
    'Spanish Fork', 'Springville', 'Saratoga Springs', 'Eagle Mountain',
    'Highland', 'Payson',
  ],
  'salt-lake': [
    'Sandy', 'Draper', 'South Jordan', 'West Jordan', 'Riverton', 'Herriman',
    'Murray', 'Midvale', 'Taylorsville', 'West Valley City', 'Cottonwood Heights',
    'Salt Lake City',
  ],
}

/**
 * National chains and franchises. They buy marketing from head office, not
 * from a local studio, so calling them burns the salesperson's best hours.
 * Matching is on the lower-cased name. Anything else that shows up under the
 * same name in 4+ places is treated as a chain too (see score.ts).
 */
export const CHAINS = [
  'jiffy lube', 'midas', 'meineke', 'firestone', 'big o tires', 'les schwab',
  'pep boys', 'valvoline', 'take 5', 'discount tire', 'christian brothers automotive',
  'goodyear', 'precision tune', 'caliber collision', 'maaco', 'gerber collision',
  'service king', 'mr. rooter', 'roto-rooter', 'mr. electric', 'mr. handyman',
  'one hour heating', 'benjamin franklin plumbing', 'mister sparky', 'aire serv',
  'window genie', 'men in kilts', 'molly maid', 'merry maids', 'chem-dry',
  'two men and a truck', 'college hunks', 'lawn doctor', 'trugreen', 'weed man',
  'home depot', "lowe's", 'ace hardware', 'sears', 'christmas decor', 'leaffilter',
  'bath fitter', 're-bath', 'power home remodeling', 'window nation', 'renewal by andersen',
  'orkin', 'terminix', 'aptive', 'rentokil', 'truly nolen', '1-800-got-junk', 'junk king',
  'junkluggers', 'overhead door', 'precision door', 'precision garage door', 'a1 garage',
  'davey tree', 'bartlett tree', 'window world', 'bath planet', 'kitchen tune-up',
]

export function tradesFor(selector: string): Trade[] {
  const s = selector.toLowerCase()
  if (s === 'all') return TRADES
  const byIndustry: Record<string, IndustryName> = {
    contractors: 'Contractors',
    'home-services': 'Home services',
    auto: 'Auto repair',
  }
  const industry = byIndustry[s]
  if (industry) return TRADES.filter((t) => t.industry === industry)
  const trades = s.split(',').map((k) => TRADES.find((t) => t.key === k.trim()))
  if (trades.some((t) => !t)) {
    throw new Error(
      `Unknown --industry "${selector}". Use all, contractors, home-services, auto, ` +
        `or trade keys: ${TRADES.map((t) => t.key).join(', ')}`
    )
  }
  return trades as Trade[]
}

export function citiesFor(selector: string): string[] {
  const s = selector.toLowerCase()
  if (s === 'all') return [...CITIES.utah, ...CITIES['salt-lake']]
  if (s === 'utah' || s === 'utah-county') return CITIES.utah
  if (s === 'salt-lake' || s === 'salt-lake-county') return CITIES['salt-lake']
  // Explicit list: "Provo, UT;Orem" or "Provo,Orem". The state suffix is optional.
  return selector
    .split(/[;,]/)
    .map((c) => c.trim())
    .filter((c) => c && c.toUpperCase() !== 'UT')
}
