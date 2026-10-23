'use client'

import { useEffect } from 'react'

/**
 * Tells BouldLeads the owner opened their results link ("Opened" on the lead
 * card, the cue for a follow-up call). Sent from the browser, not the server
 * render, because iMessage and SMS apps fetch a link to draw its preview —
 * counting those would mark every link opened the moment it was texted.
 */
export default function CheckOpenBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `bould:opened:${slug}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      /* count it anyway */
    }
    fetch('/api/check-open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {})
  }, [slug])
  return null
}
