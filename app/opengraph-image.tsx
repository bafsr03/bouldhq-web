import { ImageResponse } from 'next/og'
import { LEGAL_NAME, SERVICE_AREA_LABEL } from '@/lib/site'

/**
 * Brief, technical spec: "Sharing image: replace the current screenshot with a
 * branded image; set a real social title and description."
 *
 * Generated rather than a static PNG so the wording tracks lib/site.ts — a share
 * card that still said "virtual try-on" after the repositioning is exactly the
 * kind of drift the brief is trying to end.
 */
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: '#8B5CF6',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#888888',
            }}
          >
            {LEGAL_NAME}
          </div>
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
          <span>{SERVICE_AREA_LABEL}</span>
          <span style={{ color: '#F0EDE8' }}>bouldhq.com</span>
        </div>
      </div>
    ),
    size
  )
}
