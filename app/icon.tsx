import { ImageResponse } from 'next/og'
import { MARK_PATH, MARK_VIEWBOX, logoDataUri } from '@/lib/logo'

/*
  The favicon. The site shipped without one, so Google drew its generic globe
  next to bouldhq.com in the search result — on a listing whose whole job is to
  look like a company worth calling.

  512px because Google wants a square that is a multiple of 48. It is served at
  /icon and Next emits the <link rel="icon"> for it.

  Shows the "b" alone: see MARK_PATH. At 16px in a tab the full wordmark is a
  smear, and a favicon that cannot be read is the same as no favicon.
*/
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
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
        <img src={logoDataUri(MARK_PATH, MARK_VIEWBOX)} width={300} height={327} alt="" />
      </div>
    ),
    size
  )
}
