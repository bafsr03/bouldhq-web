import { NextResponse } from 'next/server'
import { logCheckOpen } from '@/lib/bouldleads'

/** Relays a results-page open to BouldLeads, so the secret never reaches the browser. */
export const dynamic = 'force-dynamic'

const SLUG_RE = /^[a-z0-9-]{3,120}$/

export async function POST(request: Request) {
  let slug: unknown
  try {
    slug = ((await request.json()) as { slug?: unknown }).slug
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  if (typeof slug !== 'string' || !SLUG_RE.test(slug)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  await logCheckOpen(slug)
  return NextResponse.json({ ok: true })
}
