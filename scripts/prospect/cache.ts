/**
 * A tiny on-disk cache, so re-running the engine (to tweak scoring, or after a
 * crash halfway through) costs nothing and does not hammer anyone's website.
 * Lives in scripts/prospect/.cache, which is gitignored.
 */

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

// npm runs scripts from the package root, so this is stable under `npm run prospect`.
export const PROSPECT_DIR = path.join(process.cwd(), 'scripts', 'prospect')
const DIR = path.join(PROSPECT_DIR, '.cache')
const DAY = 24 * 3600 * 1000

export async function cached<T>(
  bucket: string,
  key: string,
  maxAgeDays: number,
  load: () => Promise<T>
): Promise<T> {
  const file = path.join(DIR, bucket, createHash('sha1').update(key).digest('hex') + '.json')
  try {
    const hit = JSON.parse(await readFile(file, 'utf8')) as { at: number; value: T }
    if (Date.now() - hit.at < maxAgeDays * DAY) return hit.value
  } catch {
    /* miss */
  }
  const value = await load()
  // A failed lookup (undefined) is not remembered, so the next run retries it.
  if (value === undefined) return value
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, JSON.stringify({ at: Date.now(), key, value }))
  return value
}

/** Run `fn` over `items` with at most `limit` in flight. Order is preserved. */
export async function pool<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const i = next++
      out[i] = await fn(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return out
}
