import { ImageResponse } from 'next/og'
import { MARK_PATH, MARK_VIEWBOX, logoDataUri } from '@/lib/logo'

/*
  The iOS home-screen icon. Separate from icon.tsx because Apple renders it at a
  fixed 180px with no transparency and rounds the corners itself, so it needs
  more breathing room around the mark than a 16px browser tab does.
*/
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080808',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri(MARK_PATH, MARK_VIEWBOX)} width={92} height={100} alt="" />
      </div>
    ),
    size
  )
}
