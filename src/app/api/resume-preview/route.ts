import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { role } = await req.json()
  if (!role) return NextResponse.json({ error: 'Missing role' }, { status: 400 })

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'Generate exactly 3 strong resume bullet points for the given job role. Use action verbs and include quantifiable results where possible. Return JSON: {"bullets": ["bullet1", "bullet2", "bullet3"]}',
        },
        { role: 'user', content: `Job role: ${role}` },
      ],
      max_tokens: 250,
      response_format: { type: 'json_object' },
    }),
  })

  const data = await res.json()
  try {
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}')
    const bullets = parsed.bullets || []
    return NextResponse.json({ bullets: Array.isArray(bullets) ? bullets.slice(0, 3) : [] })
  } catch {
    return NextResponse.json({ bullets: [] })
  }
}
