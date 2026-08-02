'use client'

/**
 * PromoBar — inline "have a promo code?" toggle + unlocked-state banner.
 * Uses existing lib/promoCode.ts (server) + lib/usePromo.ts (client) backend.
 * Dark-themed to match ResumeVaultPage (text-white / rgba(255,255,255,*) styling).
 */

import { useState } from 'react'
import { usePromo } from '@/lib/usePromo'

const ACCENT = '#7c3aed'

export default function PromoBar() {
  const { isUnlocked, daysLeft } = usePromo()
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'invalid'>('idle')

  if (isUnlocked) {
    return (
      <div
        className="text-sm font-medium rounded-full px-4 py-2 w-fit"
        style={{ background: 'rgba(124,58,237,0.14)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}
      >
        🎉 Pro access active — {daysLeft} day{daysLeft === 1 ? '' : 's'} remaining
      </div>
    )
  }

  async function submit() {
    if (!code.trim()) return
    setStatus('checking')
    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (data.valid) {
        window.location.reload()
      } else {
        setStatus('invalid')
      }
    } catch {
      setStatus('invalid')
    }
  }

  return (
    <div className="text-sm">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: '#a78bfa' }}
        >
          Have a promo code?
        </button>
      ) : (
        <div className="inline-flex items-center gap-2">
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); setStatus('idle') }}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Enter code"
            className="rounded-md px-3 py-1.5 text-sm text-white"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(124,58,237,0.3)' }}
          />
          <button
            onClick={submit}
            disabled={status === 'checking'}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
            style={{ background: ACCENT }}
          >
            {status === 'checking' ? '...' : 'Apply'}
          </button>
        </div>
      )}
      {status === 'invalid' && <p className="text-red-400 text-xs mt-1">Invalid code</p>}
    </div>
  )
}
