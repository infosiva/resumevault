'use client'
import { useState } from 'react'

interface ResumeDemoProps {
  initialRole?: string
}

export default function ResumeDemo({ initialRole = '' }: ResumeDemoProps) {
  const [role, setRole] = useState(initialRole)
  const [bullets, setBullets] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function generate() {
    if (!role.trim()) return
    setLoading(true)
    setBullets([])
    try {
      const res = await fetch('/api/resume-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      const data = await res.json()
      setBullets(data.bullets || [])
    } catch {
      setBullets([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '560px', width: '100%' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <div className="relative flex-1">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            🎯
          </span>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generate()}
            placeholder="What role are you targeting?"
            className="w-full pl-9 pr-4 py-3 text-sm rounded-lg outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(59,130,246,0.25)',
              color: '#fff',
              minHeight: 44,
            }}
          />
        </div>
        <button
          id="hero-cta"
          onClick={generate}
          disabled={loading || !role.trim()}
          className="px-6 py-3 text-sm font-bold rounded-lg btn-press whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: '#fff',
            boxShadow: '0 4px 24px rgba(99,102,241,0.45)',
            minHeight: 44,
            border: 'none',
            cursor: loading || !role.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !role.trim() ? 0.7 : 1,
          }}
        >
          {loading ? '…' : 'Build Free →'}
        </button>
      </div>

      {loading && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.15)',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 animate-pulse" style={{ background: '#3b82f6', verticalAlign: 'middle' }} />
          AI writing your bullets…
        </div>
      )}

      {bullets.length > 0 && (
        <>
          <div
            className="rounded-xl px-5 py-4 mb-3"
            style={{
              background: 'rgba(59,130,246,0.06)',
              border: '1px solid rgba(59,130,246,0.18)',
            }}
          >
            <div
              className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />
              AI-generated bullets for {role}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.75)', paddingLeft: '1rem', position: 'relative' }}
                >
                  <span style={{ position: 'absolute', left: 0, color: '#3b82f6' }}>•</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <a
            href="#how"
            className="inline-flex items-center gap-2 text-sm font-bold rounded-lg px-5 py-2.5 btn-press"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: '#fff',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
            }}
          >
            Build your full resume →
          </a>
        </>
      )}
    </div>
  )
}
