import { NextRequest, NextResponse } from 'next/server'
import { AI_LIMITER } from '@/lib/rateLimit'
import { aiChat } from '@/lib/ai'

export const runtime = 'nodejs'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const DEFAULT_SYSTEM = `You are ResumeBot, the AI career assistant for ResumeVault — an AI-powered ATS resume builder.
Help users write better resumes, understand ATS scoring, improve bullet points, prep for interviews, and navigate job searches.
Be specific, encouraging, and give actionable advice. Focus on helping them land their next role.`

export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req); if (limited) return limited
  try {
    const body = await req.json()
    const messages: Message[] = body.messages
    const systemPrompt: string = body.systemPrompt ?? DEFAULT_SYSTEM

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 })
    }

    const encoder = new TextEncoder()
    const groqKey = process.env.GROQ_API_KEY

    if (groqKey) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            max_tokens: 300,
            temperature: 0.5,
            stream: true,
          }),
        })

        if (res.ok && res.body) {
          const readable = new ReadableStream({
            async start(controller) {
              const reader = res.body!.getReader()
              const decoder = new TextDecoder()
              let buffer = ''
              try {
                while (true) {
                  const { done, value } = await reader.read()
                  if (done) break
                  buffer += decoder.decode(value, { stream: true })
                  const lines = buffer.split('\n')
                  buffer = lines.pop() ?? ''
                  for (const line of lines) {
                    if (!line.startsWith('data: ')) continue
                    const data = line.slice(6).trim()
                    if (data === '[DONE]') return
                    try {
                      const text = JSON.parse(data).choices?.[0]?.delta?.content ?? ''
                      if (text) controller.enqueue(encoder.encode(text))
                    } catch { /* skip */ }
                  }
                }
              } finally { controller.close() }
            },
          })

          return new NextResponse(readable, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
          })
        }
      } catch (err) {
        console.warn('[/api/chat] Groq failed, falling back to cascade', err)
      }
    }

    // Groq unavailable — fall back to full Groq→Gemini→Claude cascade (non-streaming)
    const text = await aiChat(
      messages
        .filter((m): m is Message & { role: 'user' | 'assistant' } => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content })),
      systemPrompt,
      300,
    )
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text))
        controller.close()
      },
    })
    return new NextResponse(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
    })
  } catch (err) {
    console.error('[/api/chat]', err)
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
  }
}
