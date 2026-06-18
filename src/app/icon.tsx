import { ImageResponse } from 'next/og'
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export default function Icon() {
  return new ImageResponse(
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Document with a vault-lock circle — resume + secure storage */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2h9l4 4v16H6V2z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M15 2v4h4" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="12" cy="15" r="3" stroke="white" strokeWidth="2"/>
        <path d="M12 13.5v3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  )
}
