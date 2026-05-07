"use client";
import { useState, useEffect } from "react";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";

const SESSION_KEY = "resumevault-session";

interface Analysis {
  role_title?: string;
  company_type?: string;
  required_keywords?: string[];
  nice_to_have?: string[];
  matched_keywords?: string[];
  missing_keywords?: string[];
  match_score?: number;
  match_label?: string;
  key_gaps?: string[];
  strengths?: string[];
  job_search_terms?: string;
}

interface InterviewPrep {
  role_title?: string;
  questions?: { question: string; category: string; why_asked: string; answer_framework: string; sample_answer_start: string }[];
  red_flags_to_avoid?: string[];
  questions_to_ask_them?: string[];
  salary_range_hint?: string;
}

export default function Home() {
  const [resume, setResume] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [interviewPrep, setInterviewPrep] = useState<InterviewPrep | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'resume' | 'cover' | 'prep'>('resume');
  const [savedSession, setSavedSession] = useState<{
    jobDesc: string; experience: string; skills: string; name: string; currentTitle: string;
  } | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setSavedSession(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  return (
    <main className="min-h-screen relative z-10" style={{ background: '#0f172a', color: '#fff' }}>
      {/* Noise + liquid blobs */}
      <div className="noise-overlay" aria-hidden="true" />
      <div
        className="liquid-blob liquid-blob-1"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.45), rgba(99,102,241,0.2) 60%, transparent)', top: '-140px', left: '-80px' }}
        aria-hidden="true"
      />
      <div
        className="liquid-blob liquid-blob-2"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.3), transparent 60%)', top: '80px', right: '-100px' }}
        aria-hidden="true"
      />
      <div
        className="liquid-blob liquid-blob-3"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 60%)', bottom: '120px', left: '40%' }}
        aria-hidden="true"
      />

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" style={{ background: 'rgba(15,23,42,0.90)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <span className="font-black text-lg tracking-tight text-white">ResumeVault</span>
              <span className="pill-glass text-xs font-semibold px-3 py-1 hidden sm:inline-flex">ATS-Optimized</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#how" className="text-sm text-white/50 hover:text-white transition-colors hidden sm:block">How it works</a>
              <a
                href="#how"
                className="btn-liquid text-sm px-5 py-2 font-semibold rounded-lg transition-all"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff' }}
              >
                Get hired faster
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Split Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center min-h-[90vh] px-6 md:px-12 py-16">

          {/* Left: Copy */}
          <div className="flex flex-col gap-6 relative z-10">
            <div>
              <span className="pill-glass text-xs font-bold px-3 py-1.5 inline-flex items-center gap-1.5">
                <span style={{ color: '#22d3ee' }}>✦</span> #1 AI Resume Builder
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight text-white reveal-3d">
              Get hired<br />
              <span className="text-iridescent">3x faster</span>
            </h1>
            <p className="text-base text-white/60 max-w-md leading-relaxed">
              ATS-optimized resumes generated from your experience in 60 seconds.
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                "ATS-optimized for every job posting",
                "Job description keyword matching",
                "One-click PDF export",
                "50+ professional templates",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#how"
                className="btn-liquid px-6 py-3 text-sm font-bold rounded-lg transition-all"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff' }}
              >
                Build My Resume — Free
              </a>
              <a
                href="#how"
                className="px-6 py-3 text-sm font-semibold rounded-lg transition-all border border-white/[0.12] text-white/70 hover:text-white hover:border-white/25"
              >
                See example
              </a>
            </div>
          </div>

          {/* Right: Resume Mockup */}
          <div className="relative flex items-center justify-center">
            <div className="glass-liquid rounded-2xl p-6 w-full max-w-sm relative" style={{ border: '1px solid rgba(99,102,241,0.25)' }}>
              {/* ATS Score badge */}
              <div className="badge-3d absolute -top-3 -right-3 flex flex-col items-center justify-center w-14 h-14 rounded-full text-center" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '2px solid rgba(34,211,238,0.4)', boxShadow: '0 0 20px rgba(34,211,238,0.2)' }}>
                <span className="text-xs font-black" style={{ color: '#22d3ee' }}>94%</span>
                <span className="text-[9px] text-white/40 leading-tight">ATS</span>
              </div>

              {/* Resume header */}
              <div className="mb-4 pb-4 border-b border-white/[0.08]">
                <div className="font-black text-white text-lg leading-tight">John Smith</div>
                <div className="text-sm font-medium mb-2" style={{ color: '#6366f1' }}>Software Engineer</div>
                <div className="flex flex-wrap gap-1.5">
                  {['San Francisco', 'john@email.com', 'linkedin.com/in/john'].map((pill) => (
                    <span key={pill} className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.08] text-white/40">{pill}</span>
                  ))}
                </div>
              </div>

              {/* Experience section */}
              <div className="mb-3">
                <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#6366f1' }}>Experience</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start justify-between mb-0.5">
                      <span className="text-xs font-bold text-white">Senior Frontend Engineer</span>
                      <span className="text-[10px] text-white/30">2022–now</span>
                    </div>
                    <div className="text-[10px] text-white/40 mb-1">Acme Corp · Remote</div>
                    <p className="text-[10px] text-white/55 leading-relaxed">
                      Led migration to{' '}
                      <span className="font-semibold" style={{ color: '#22d3ee' }}>React 18</span> &amp;{' '}
                      <span className="font-semibold" style={{ color: '#22d3ee' }}>TypeScript</span>,
                      reducing bundle size by 40%. Shipped{' '}
                      <span className="font-semibold" style={{ color: '#22d3ee' }}>CI/CD</span> pipeline.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-start justify-between mb-0.5">
                      <span className="text-xs font-bold text-white">Frontend Developer</span>
                      <span className="text-[10px] text-white/30">2019–2022</span>
                    </div>
                    <div className="text-[10px] text-white/40 mb-1">Beta Inc · New York</div>
                    <p className="text-[10px] text-white/55 leading-relaxed">
                      Built{' '}
                      <span className="font-semibold" style={{ color: '#22d3ee' }}>Next.js</span> dashboard used by 50k+ users.
                      Improved{' '}
                      <span className="font-semibold" style={{ color: '#22d3ee' }}>Core Web Vitals</span> by 35%.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI generated label */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22d3ee' }} />
                <span className="text-[10px] text-white/30">AI-generated · tailored to job description</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Builder */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="glass-liquid rounded-2xl p-8 [&_h2]:text-white [&_p]:text-white/60 [&_label]:text-white/50 [&_textarea]:bg-white/5 [&_textarea]:border-white/10 [&_textarea]:text-white [&_textarea]:placeholder-white/25 [&_input]:bg-white/5 [&_input]:border-white/10 [&_input]:text-white [&_input]:placeholder-white/25 [&_.rounded-2xl]:bg-white/5 [&_.rounded-2xl]:border-white/10">
          <ResumeForm
            onGenerate={(r) => { setResume(r); setActivePreviewTab('resume'); }}
            setLoading={setLoading}
            onAnalysis={setAnalysis}
            onCoverLetter={(cl) => { setCoverLetter(cl); setActivePreviewTab('cover'); }}
            onInterviewPrep={(p) => { setInterviewPrep(p); setActivePreviewTab('prep'); }}
            initialValues={savedSession}
          />
        </div>
        <div className="[&_h2]:text-white [&_p]:text-white/60">
          <ResumePreview
            resume={resume}
            loading={loading}
            analysis={analysis}
            coverLetter={coverLetter}
            interviewPrep={interviewPrep}
            activeTab={activePreviewTab}
            onTabChange={setActivePreviewTab}
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>Pricing</div>
            <h2 className="text-4xl font-bold text-white tracking-tight">Simple, honest pricing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-2xl overflow-hidden border border-white/[0.08]">
            {[
              { name: "Free", price: "$0", sub: "Always free", features: ["3 resumes / month", "Job match score", "ATS keyword analysis", "Cover letter generator", "Interview prep (3 questions)", "All export formats"], cta: "Get started free", highlight: false },
              { name: "Pro", price: "$15", sub: "per month", features: ["Unlimited resumes & cover letters", "Full interview prep (8 questions)", "Salary range insight", "ATS score checker", "Job alerts by email", "Priority support"], cta: "Start free trial", highlight: true },
            ].map((plan) => (
              <div key={plan.name} className="p-8 reveal-3d" style={{ background: plan.highlight ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)' }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: plan.highlight ? '#6366f1' : 'rgba(255,255,255,0.3)' }}>{plan.name}</div>
                <div className="text-5xl font-bold text-white mb-0.5">{plan.price}</div>
                <div className="text-sm mb-6 text-white/40">{plan.sub}</div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="mt-0.5" style={{ color: plan.highlight ? '#22d3ee' : '#6366f1' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 font-semibold text-sm transition-all rounded-lg"
                  style={plan.highlight
                    ? { background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff' }
                    : { border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)', background: 'transparent' }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-white/30">
          <span className="font-bold text-white/60">ResumeVault</span>
          <span>© 2025 · AI-powered career toolkit</span>
        </div>
      </footer>
    </main>
  );
}
