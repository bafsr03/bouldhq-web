'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { MINNESOTA_PATH } from '@/lib/site'

/**
 * Lets a server component show something else on the Minnesota ad page.
 *
 * The footer sits in the root layout and has no idea which page it is on; only
 * a client component can read the path. This keeps that to one small switch, so
 * the footer itself stays server-rendered.
 */
export default function MinnesotaSwitch({
  minnesota = null,
  otherwise,
}: {
  minnesota?: ReactNode
  otherwise: ReactNode
}) {
  return usePathname() === MINNESOTA_PATH ? minnesota : otherwise
}
