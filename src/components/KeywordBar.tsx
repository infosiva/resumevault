'use client'

interface Props {
  required: string[]
  niceToHave: string[]
  resumeText: string
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9+#.]/g, ' ')
}

export default function KeywordBar({ required, niceToHave, resumeText }: Props) {
  if (required.length === 0 && niceToHave.length === 0) return null

  const body = normalize(resumeText)

  const reqHits   = required.filter(k => body.includes(normalize(k)))
  const reqMiss   = required.filter(k => !body.includes(normalize(k)))
  const niceHits  = niceToHave.filter(k => body.includes(normalize(k)))
  const niceMiss  = niceToHave.filter(k => !body.includes(normalize(k)))

  const score = required.length > 0
    ? Math.round((reqHits.length / required.length) * 100)
    : 100

  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'
  const barColor   = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">JD Keyword Match</span>
        <span className={`text-sm font-bold ${scoreColor}`}>{score}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${score}%` }} />
      </div>

      {/* Required keywords */}
      {required.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-white/40 font-medium uppercase tracking-wide">Required</div>
          <div className="flex flex-wrap gap-1.5">
            {reqHits.map(k => (
              <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
                ✓ {k}
              </span>
            ))}
            {reqMiss.map(k => (
              <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
                ✗ {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Nice to have */}
      {niceToHave.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-white/40 font-medium uppercase tracking-wide">Nice to have</div>
          <div className="flex flex-wrap gap-1.5">
            {niceHits.map(k => (
              <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-medium">
                ✓ {k}
              </span>
            ))}
            {niceMiss.map(k => (
              <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/30">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
