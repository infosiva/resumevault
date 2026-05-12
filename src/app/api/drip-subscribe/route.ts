/**
 * POST /api/drip-subscribe
 * Body: { email, firstName? }
 * Called after magic auth success — subscribes user to ResumeVault drip sequence.
 * Also sends the welcome email (day 0) immediately.
 */
import { NextRequest, NextResponse } from 'next/server'
import { resend, subscribeContact } from '@/lib/drip'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { email, firstName } = body as { email?: string; firstName?: string }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Subscribe to audience (idempotent)
  await subscribeContact(email, firstName).catch(e =>
    console.error('[drip-subscribe] subscribe failed:', e.message)
  )

  // Send welcome email immediately (day 0)
  if (resend) {
    await resend.emails.send({
      from: 'ResumeVault <hello@resumevault.app>',
      to: email,
      subject: 'Welcome to ResumeVault — your AI career toolkit is ready',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;">
          <div style="margin-bottom:24px;">
            <span style="font-size:13px;font-weight:700;color:#1e3a5f;letter-spacing:0.05em;text-transform:uppercase;">ResumeVault</span>
          </div>
          <h2 style="font-size:22px;font-weight:800;color:#111;margin:0 0 12px;">
            Welcome${firstName ? `, ${firstName}` : ''} — you're in ✦
          </h2>
          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">
            Your AI career toolkit is ready. Here's what you can do right now:
          </p>
          <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
            ${[
              ['📊', 'Match score', 'Paste a job description — AI scores how well your profile matches'],
              ['📄', 'AI resume', 'Get a keyword-optimised resume tailored to the exact role'],
              ['✉️', 'Cover letter', 'Personalised cover letter generated in seconds'],
              ['🎯', 'Interview prep', 'Role-specific questions + how to answer them'],
            ].map(([icon, title, desc]) => `
              <tr>
                <td style="padding:10px 12px 10px 0;vertical-align:top;font-size:20px;">${icon}</td>
                <td style="padding:10px 0;">
                  <strong style="color:#111;font-size:14px;display:block;">${title}</strong>
                  <span style="color:#777;font-size:13px;">${desc}</span>
                </td>
              </tr>`).join('')}
          </table>
          <a href="https://resumevault.app/#how" style="display:inline-block;background:#1e3a5f;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">
            Build my resume now →
          </a>
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0 16px;" />
          <p style="color:#aaa;font-size:12px;">You're getting this because you signed up at resumevault.app.<br/>
          <a href="{{unsubscribeUrl}}" style="color:#aaa;">Unsubscribe</a></p>
        </div>`,
    }).catch(e => console.error('[drip-subscribe] welcome email failed:', e.message))
  }

  return NextResponse.json({ ok: true })
}
