'use client'

import { useEffect } from 'react'
import { captureUtm } from '@/lib/utm'

/** Remembers the visit's campaign parameters for the lead forms. Renders nothing. */
export default function UtmCapture() {
  useEffect(() => {
    captureUtm()
  }, [])
  return null
}
