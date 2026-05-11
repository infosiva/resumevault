'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const ACCENT = '#1e3a5f'
const ACCENT2 = '#f59e0b'
const BOT_NAME = 'ResumeBot'
const WELCOME = '📄 Hi! I\'m ResumeBot — your AI career coach. Ask me to improve your resume bullets, decode ATS scoring, prep interview answers, or review your job description match!'
const SYSTEM_PROMPT = `You are ResumeBot, the AI career assistant for ResumeVault — an AI-powered ATS resume builder.
Help users write better resumes, understand ATS scoring, improve bullet points, prep for interviews, and navigate job searches.
Be specific, encouraging, and give actionable advice. Focus on helping them land their next role.`

interface Message { role: 'user' | 'assistant'; content: string }

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: WELCOME }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100) }, [open])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    const userMsg: Message = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, systemPrompt: SYSTEM_PROMPT }),
      })
      if (!res.ok || !res.body) throw new Error('Stream failed')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value, { stream: true })
        setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: assistantText }; return u })
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' }])
    } finally { setLoading(false) }
  }, [input, loading, messages])

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <>
      <button onClick={() => setOpen(o => !o)} aria-label="ResumeBot"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, width: 52, height: 52, borderRadius: 12, background: ACCENT, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${ACCENT}88`, transition: 'transform 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <span style={{ fontSize: 22 }}>📄</span>
        )}
      </button>

      {open && (
        <div style={{ position: 'fixed', bottom: 88, right: 24, zIndex: 9998, width: 370, height: 500, borderRadius: 12, background: '#fafafa', border: `1px solid rgba(30,58,95,0.2)`, boxShadow: '0 8px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'rv-slide 0.2s ease-out' }}>
          <style>{`@keyframes rv-slide{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} .rv-msg::-webkit-scrollbar{width:4px} .rv-msg::-webkit-scrollbar-thumb{background:rgba(30,58,95,0.2);border-radius:2px} @keyframes rv-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(30,58,95,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(30,58,95,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📄</div>
              <div>
                <div style={{ color: '#111827', fontWeight: 700, fontSize: 14 }}>{BOT_NAME}</div>
                <div style={{ color: '#6b7280', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}/>AI Career Coach</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="rv-msg" style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 6px', display: 'flex', flexDirection: 'column', gap: 10, background: '#fafafa' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '85%', padding: '9px 13px', borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px', background: m.role === 'user' ? ACCENT : '#fff', border: m.role === 'user' ? 'none' : '1px solid rgba(30,58,95,0.12)', color: m.role === 'user' ? '#fff' : '#374151', fontSize: 13.5, lineHeight: 1.6, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px 12px 12px 3px', background: '#fff', border: '1px solid rgba(30,58,95,0.12)', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0,1,2].map(d => <span key={d} style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT, display: 'inline-block', animation: `rv-bounce 1.2s ${d*0.2}s infinite ease-in-out` }}/>)}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(30,58,95,0.1)', display: 'flex', gap: 8, alignItems: 'center', background: '#f9fafb' }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} placeholder="Ask about your resume…" disabled={loading}
              style={{ flex: 1, background: '#fff', border: '1px solid rgba(30,58,95,0.2)', borderRadius: 8, padding: '9px 13px', color: '#111827', fontSize: 13.5, outline: 'none' }}
              onFocus={e => (e.target.style.borderColor = ACCENT)} onBlur={e => (e.target.style.borderColor = 'rgba(30,58,95,0.2)')}/>
            <button onClick={send} disabled={loading || !input.trim()} style={{ width: 38, height: 38, borderRadius: 8, border: 'none', background: input.trim() && !loading ? ACCENT : 'rgba(30,58,95,0.1)', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
