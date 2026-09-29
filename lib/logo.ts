import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/*
  The wordmark, read from public/bould.svg — the one file the header, the footer,
  the schema.org `logo` and the share card all point at. Nothing here redraws it.

  Node-only (it reads from disk), so this module must be imported by server code
  only: the icon routes and the share card. Importing it from a client component
  will break the build, which is the correct outcome.
*/
const source = readFileSync(join(process.cwd(), 'public', 'bould.svg'), 'utf8')

const match = source.match(/\sd="([^"]+)"/)
if (!match) {
  throw new Error('public/bould.svg no longer contains a single <path d="…">; lib/logo.ts needs updating.')
}

/** Every glyph of "bould" in one path, as authored. */
export const WORDMARK_PATH = match[1]

/** The full mark's own box. */
export const WORDMARK_VIEWBOX = '0 0 809 230'

/*
  Just the "b", as its own path.

  A favicon is rendered at 16px in a browser tab, where the full wordmark is an
  illegible smear — so the icon shows one glyph. Narrowing the viewBox does not
  work: the mark is italic and the glyphs interlock, and the "o" reaches back to
  x=175, well inside the "b". A vertical crop leaves a sliver of it hanging in
  the corner.

  So the path is split on its subpaths instead and only the first two are kept —
  the "b" outline and its counter. Exact, and it tracks the source file.
*/
const subpaths = WORDMARK_PATH.split(/(?=M)/)
if (subpaths.length < 3) {
  throw new Error(
    `Expected the wordmark to have one subpath per glyph and counter; found ${subpaths.length}. lib/logo.ts needs updating.`
  )
}

/** The "b" outline plus its counter. */
export const MARK_PATH = subpaths.slice(0, 2).join('')

/** The "b" alone measures 211x230 within the full mark's box. */
export const MARK_VIEWBOX = '0 0 211 230'

/** An inlineable data URI for one of the two paths above. */
export function logoDataUri(d: string, viewBox: string, fill = '#F0EDE8') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="${fill}" fill-rule="evenodd" d="${d}"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
