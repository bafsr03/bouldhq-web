'use client'

import { trackContactClick } from '@/lib/track'

/**
 * A tel:/mailto: link that records the click before handing off to the dialer
 * or mail client.
 *
 * Exists as its own client component so the footer around it can stay a server
 * component — the footer renders the copyright year, and a client-rendered year
 * is a hydration mismatch waiting for New Year's Eve.
 */
export default function TrackedContact({
  method,
  location,
  value,
  display,
  className,
}: {
  method: 'phone' | 'email'
  location: string
  value: string
  display: string
  className?: string
}) {
  return (
    <a
      href={method === 'phone' ? `tel:${value}` : `mailto:${value}`}
      className={className}
      onClick={() => trackContactClick(method, location)}
    >
      {display}
    </a>
  )
}
