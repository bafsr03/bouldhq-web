import { ImageResponse } from 'next/og'
import { WORDMARK_PATH, WORDMARK_VIEWBOX, logoDataUri } from '@/lib/logo'
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
const LOGO = logoDataUri(WORDMARK_PATH, WORDMARK_VIEWBOX)

// 809x230 in the source file. Kept in ratio so the mark is never stretched.
const LOGO_W = 286
const LOGO_H = Math.round((LOGO_W * 230) / 809)

export const alt = `${LEGAL_NAME} — websites built with your competition in mind`
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
          background: '#080F22',
          backgroundImage:
            'radial-gradient(900px 500px at 78% 12%, rgba(75, 124, 255,0.30), transparent 62%)',
          padding: '72px 80px',
          color: '#F7F8FC',
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
            <span>Built with your</span>
            <span style={{ color: '#91ADFF' }}>competition in mind.</span>
          </div>
          <div style={{ fontSize: 30, color: '#9DA9C1', maxWidth: 900 }}>
            Websites for local service businesses and growing brands.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #17233F',
            paddingTop: 28,
            fontSize: 24,
            color: '#9DA9C1',
          }}
        >
          <span>{LOCATION_LINE}</span>
          <span style={{ color: '#F7F8FC' }}>bouldhq.com</span>
        </div>
      </div>
    ),
    size
  )
}
