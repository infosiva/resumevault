'use client'
import { useState } from 'react'

export default function PromoCodeInput() {
  const [code, setCode] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function apply() {
    if (!code.trim()) return
    setState('loading')
    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (data.valid) {
        setState('success')
        setMessage(`Pro unlocked for ${data.daysUnlocked} days! Refresh to apply.`)
      } else {
        setState('error')
        setMessage(data.message || 'Invalid code')
      }
    } catch {
      setState('error')
      setMessage('Something went wrong')
    }
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Have a promo code?</p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && apply()}
          placeholder="Enter code"
          className="rounded-lg border px-3 py-1.5 text-[13px] outline-none bg-transparent"
          style={{ borderColor: 'rgba(124,58,237,0.3)', color: '#f1f5f9', width: 140 }}
        />
        <button
          onClick={apply}
          disabled={state === 'loading'}
          className="rounded-lg px-3 py-1.5 text-[13px] font-bold text-white"
          style={{ background: '#7c3aed' }}
        >
          {state === 'loading' ? '…' : 'Apply'}
        </button>
      </div>
      {message && (
        <p className="text-[12px] font-semibold" style={{ color: state === 'success' ? '#34d399' : '#f87171' }}>
          {message}
        </p>
      )}
    </div>
  )
}
