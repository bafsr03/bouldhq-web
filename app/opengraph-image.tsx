import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { LEGAL_NAME, LOCATION_LINE } from '@/lib/site'

/**
 * Brief, technical spec: "Sharing image: replace the current screenshot with a
 * branded image; set a real social title and description."
 *
 * Generated rather than a static PNG so the wording tracks lib/site.ts — a share
 * card that still said "virtual try-on" after the repositioning is exactly the
 * kind of drift the brief is trying to end.
 */
/*
  The real wordmark, read from the same public/bould.svg that the header, the
  footer and the schema.org `logo` all point at. Read rather than re-drawn so a
  logo change lands everywhere at once — a share card carrying a stale mark is
  the same drift problem as stale copy, and it is the version people see first.

  Satori cannot fetch a relative URL, so the file is inlined as a data URI. The
  single path inside is already fill="white", which is what this dark card wants.
*/
const LOGO = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), 'public', 'bould.svg')
).toString('base64')}`

// 809x230 in the source file. Kept in ratio so the mark is never stretched.
const LOGO_W = 286
const LOGO_H = Math.round((LOGO_W * 230) / 809)

export const alt = `${LEGAL_NAME} — websites that bring local businesses leads`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#080808',
          backgroundImage:
            'radial-gradient(900px 500px at 78% 12%, rgba(139,92,246,0.30), transparent 62%)',
          padding: '72px 80px',
          color: '#F0EDE8',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} width={LOGO_W} height={LOGO_H} alt={LEGAL_NAME} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.03,
              fontWeight: 700,
              letterSpacing: -2,
              maxWidth: 940,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Your website should</span>
            <span style={{ color: '#A78BFA' }}>bring you customers.</span>
          </div>
          <div style={{ fontSize: 30, color: '#888888', maxWidth: 900 }}>
            Websites for local service businesses and growing brands.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #1E1E1E',
            paddingTop: 28,
            fontSize: 24,
            color: '#888888',
          }}
        >
          <span>{LOCATION_LINE}</span>
          <span style={{ color: '#F0EDE8' }}>bouldhq.com</span>
        </div>
      </div>
    ),
    size
  )
}
