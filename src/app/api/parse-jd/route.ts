import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai'

export async function POST(req: NextRequest) {
  let body: { jobDesc?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }) }

  const { jobDesc } = body
  if (!jobDesc?.trim()) return NextResponse.json({ error: 'jobDesc required' }, { status: 400 })

  const { text } = await callAI(
    'You are an ATS and keyword extraction expert. Return ONLY valid JSON, no markdown, no explanation.',
    [{
      role: 'user',
      content: `Extract keywords from this job description for ATS matching.

JOB DESCRIPTION:
${jobDesc.slice(0, 4000)}

Return this JSON:
{
  "required": ["keyword1", "keyword2", "keyword3"],
  "nice_to_have": ["keyword1", "keyword2"],
  "role_title": "exact job title"
}

Extract 10-20 required keywords and 3-6 nice-to-have. Focus on: skills, tools, technologies, frameworks, methodologies, certifications. Lowercase all keywords.`,
    }],
    600,
    'balanced',
  )

  try {
    const match = text.match(/\{[\s\S]*\}/)
    const parsed = match ? JSON.parse(match[0]) : {}
    return NextResponse.json({
      required: parsed.required ?? [],
      nice_to_have: parsed.nice_to_have ?? [],
      role_title: parsed.role_title ?? '',
    })
  } catch {
    return NextResponse.json({ required: [], nice_to_have: [], role_title: '' })
  }
}
