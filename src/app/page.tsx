"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import KeywordBar from "@/components/KeywordBar";
import ResumeVaultAffiliates from "@/components/ResumeVaultAffiliates";
import GuidedTour, { type TourStep } from "@/components/GuidedTour";

const RESUME_TOUR: TourStep[] = [
  { target: '#hero-cta', title: 'Build your resume free', icon: '📄', body: 'Fill in your details — AI writes polished bullet points, action verbs, and summaries for you.', placement: 'bottom' },
  { target: '#proof', title: 'Real results', icon: '📈', body: 'AI writes polished bullet points and summaries that pass ATS filters — so your resume stands out.', placement: 'top' },
  { target: '#how', title: 'How it works', icon: '🔧', body: '3 simple steps: paste your info, AI rewrites it professionally, download as PDF.', placement: 'top' },
  { target: '#pricing', title: 'Unlock all templates', icon: '✨', body: 'Pro unlocks 20+ ATS-optimised templates and unlimited downloads.', placement: 'top' },
]

const SESSION_KEY = "resumevault-session";
const PRO_KEY = "resumevault-pro";

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

// ATS Score ring — animates on viewport entry
function ATSMeter() {
  const [score, setScore] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const target = 94;
          const step = () => {
            current += 2;
            if (current >= target) { setScore(target); return; }
            setScore(current);
            requestAnimationFrame(step);
          };
          setTimeout(() => requestAnimationFrame(step), 300);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="48" cy="48" r="40" fill="none"
            stroke="#f59e0b" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black" style={{ color: '#f59e0b' }}>{score}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-bold text-white">ATS Score</div>
        <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Top 5%</div>
      </div>
    </div>
  );
}

// Typewriter — cycles through sample bullet points
function TypingEffect({ lines }: { lines: string[] }) {
  const [displayed, setDisplayed] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (lineIndex >= lines.length) { setDone(true); return; }
    const currentLine = lines[lineIndex];
    if (charIndex < currentLine.length) {
      const t = setTimeout(() => {
        setDisplayed((prev) => prev + currentLine[charIndex]);
        setCharIndex((c) => c + 1);
      }, 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayed((prev) => prev + "\n");
        setLineIndex((l) => l + 1);
        setCharIndex(0);
      }, 380);
      return () => clearTimeout(t);
    }
  }, [charIndex, lineIndex, lines, done]);

  return (
    <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono" style={{ color: 'rgba(255,255,255,0.65)' }}>
      {displayed}
      {!done && <span className="inline-block w-0.5 h-3 ml-0.5 animate-pulse" style={{ background: '#f59e0b', verticalAlign: 'text-bottom' }} />}
    </pre>
  );
}

// Floating Chat — product-scoped career assistant
function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{role:"user"|"bot";text:string}[]>([
    { role:"bot", text:"Hi! I can help you build an ATS-optimised resume. What role are you applying for? 📄" }
  ]);
  const [input, setInput] = useState("");

  async function send() {
    if (!input.trim()) return;
    const userMsg = input;
    setMsgs(m => [...m, { role:"user", text: userMsg }]);
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role:"user", content: userMsg }], system: "You are ResumeVault assistant. Help users build ATS-optimised resumes. Give concise, actionable resume advice. Ask about their target role if not mentioned." })
      });
      const data = await res.json();
      setMsgs(m => [...m, { role:"bot", text: data.text || data.content || "Let me help with that..." }]);
    } catch {
      setMsgs(m => [...m, { role:"bot", text: "Having trouble connecting right now." }]);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close chat" : "Open resume assistant"}
        style={{ position:"fixed", bottom:24, right:24, width:52, height:52, borderRadius:"50%",
          background:"linear-gradient(135deg,#1e3a8a,#3b82f6)", border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 20px rgba(30,58,138,0.55)", zIndex:1000, fontSize:20 }}
      >
        {open ? "✕" : "💬"}
      </button>
      {open && (
        <div style={{ position:"fixed", bottom:88, right:24, width:320, height:400,
          background:"rgba(10,22,40,0.97)", border:"1px solid rgba(59,130,246,0.25)", borderRadius:16,
          display:"flex", flexDirection:"column", zIndex:1000, backdropFilter:"blur(20px)" }}>
          <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(59,130,246,0.15)", fontSize:13, fontWeight:700, color:"#f8fafc" }}>
            ResumeVault Assistant
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
            {msgs.map((m,i) => (
              <div key={i} style={{
                alignSelf:m.role==="user"?"flex-end":"flex-start",
                background:m.role==="user"?"rgba(30,58,138,0.35)":"rgba(255,255,255,0.06)",
                padding:"8px 12px", borderRadius:10, fontSize:12,
                color:"rgba(248,250,252,0.85)", maxWidth:"85%" }}>{m.text}</div>
            ))}
          </div>
          <div style={{ padding:"10px 12px", borderTop:"1px solid rgba(59,130,246,0.15)", display:"flex", gap:8 }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
              placeholder="Ask about your resume..."
              style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(59,130,246,0.2)",
                borderRadius:8, padding:"6px 10px", fontSize:12, color:"#f8fafc", outline:"none" }} />
            <button onClick={send}
              style={{ background:"#1e3a8a", border:"none", borderRadius:8, padding:"6px 12px",
                fontSize:12, color:"#fff", cursor:"pointer", fontWeight:600 }}>→</button>
          </div>
        </div>
      )}
    </>
  );
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
  const [isPro, setIsPro] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ id: string; text: string }[]>([]);
  const [jdKeywords, setJdKeywords] = useState<{ required: string[]; niceToHave: string[] }>({ required: [], niceToHave: [] });
  const [heroRole, setHeroRole] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setSavedSession(JSON.parse(raw));
      if (localStorage.getItem(PRO_KEY) === '1') setIsPro(true);
    } catch { /* ignore */ }

    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === '1') {
      localStorage.setItem(PRO_KEY, '1');
      setIsPro(true);
      window.history.replaceState({}, '', '/');
    }

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-3d').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleHeroStart = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('how');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const typingLines = [
    "• Led product roadmap for B2B SaaS,",
    "  driving $1.2M ARR growth in 6 months",
    "• Managed cross-functional team of 12",
    "  across Engineering, Design & Data",
    "• Implemented agile sprint framework,",
    "  improving velocity by 34%",
  ];

  // BG: deep navy, not pure black
  const BG = '#080f1a';
  const BG2 = '#0a1428';
  const NAVY = '#0f1e3a';

  return (
    <>
    <main className="min-h-screen relative z-10" style={{ background: BG, color: '#e5e7eb' }}>

      {/* Navy-tinted animated blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <motion.div
          style={{ position: 'absolute', top: '-10%', left: '-5%', width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,58,138,0.22) 0%, rgba(30,58,138,0.06) 50%, transparent 70%)',
            filter: 'blur(90px)' }}
          animate={{ x: [0, 30, 0], y: [0, -18, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.div
          style={{ position: 'absolute', bottom: '-10%', right: '-8%', width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(30,58,138,0.05) 50%, transparent 70%)',
            filter: 'blur(100px)' }}
          animate={{ x: [0, -22, 0], y: [0, 18, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity, delay: 2 }}
        />
        <motion.div
          style={{ position: 'absolute', top: '45%', right: '30%', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)',
            filter: 'blur(80px)' }}
          animate={{ x: [0, 15, 0], y: [0, -12, 0] }}
          transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(8,15,26,0.92)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <span className="font-black text-lg tracking-tight text-white">Resume<span style={{ color: '#3b82f6' }}>Vault</span></span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full hidden sm:inline-flex" style={{ background: 'rgba(30,58,138,0.18)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>
                ATS-Optimized
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#how" className="text-sm font-medium hidden sm:block" style={{ color: 'rgba(255,255,255,0.45)' }}>How it works</a>
              <a href="#pricing" className="text-sm font-medium hidden sm:block" style={{ color: 'rgba(255,255,255,0.45)' }}>Pricing</a>
              {isPro ? (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                  ✦ Pro
                </span>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                  className="text-sm px-5 py-2 font-semibold rounded-lg btn-press transition-all"
                  style={{ background: '#1e3a8a', color: '#fff', border: '1px solid rgba(59,130,246,0.3)' }}
                >
                  {checkoutLoading ? 'Loading…' : 'Go Pro — $9/mo'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────── */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center px-6 lg:px-12 py-14 lg:py-20">

          {/* Left: copy + role input */}
          <div className="flex flex-col gap-5 relative z-10">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 w-fit"
              style={{ background: 'rgba(30,58,138,0.18)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.25)' }}>
              <span style={{ color: '#f59e0b' }}>✦</span> AI Resume Builder · ATS-Optimized · Free
            </span>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight text-white reveal">
              Get interviews,<br />
              not <span style={{
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>rejections</span>
            </h1>

            <p className="text-base max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Paste a job description — AI tailors every bullet point for maximum ATS compatibility and recruiter impact in under 60 seconds.
            </p>

            {/* Role targeting input */}
            <form onSubmit={handleHeroStart} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>🎯</span>
                <input
                  value={heroRole}
                  onChange={e => setHeroRole(e.target.value)}
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
                type="submit"
                id="hero-cta"
                className="px-6 py-3 text-sm font-bold rounded-lg btn-press whitespace-nowrap"
                style={{ background: '#f59e0b', color: '#0d1425', boxShadow: '0 4px 20px rgba(245,158,11,0.3)', minHeight: 44 }}
              >
                Build Free →
              </button>
            </form>

            {/* Feature pills — no fake stats */}
            <div className="flex flex-wrap gap-2 pt-1">
              {['No account required','PDF download','ATS keyword scan','Cover letter AI','Interview prep'].map((pill) => (
                <span key={pill} className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Resume card mockup */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Stacked paper effect */}
            <div className="absolute" style={{ width: 290, height: 370, background: NAVY, borderRadius: 16,
              boxShadow: '0 8px 40px rgba(0,0,0,0.4)', transform: 'rotate(-2.5deg) translateX(-10px) translateY(10px)',
              zIndex: 0, border: '1px solid rgba(59,130,246,0.08)' }} />
            <div className="absolute" style={{ width: 290, height: 370, background: NAVY, borderRadius: 16,
              transform: 'rotate(1.2deg) translateX(8px) translateY(-5px)',
              zIndex: 1, border: '1px solid rgba(59,130,246,0.08)' }} />

            {/* Main resume card */}
            <div className="relative rounded-2xl p-6 w-full max-w-sm z-10" style={{
              background: BG2, border: '1px solid rgba(59,130,246,0.15)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.08)' }}>

              {/* ATS badge */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex flex-col items-center justify-center"
                style={{ background: BG, border: '2px solid rgba(245,158,11,0.5)', boxShadow: '0 4px 16px rgba(245,158,11,0.2)' }}>
                <span className="text-sm font-black" style={{ color: '#f59e0b' }}>94%</span>
                <span className="text-[8px] font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>ATS</span>
              </div>

              {/* Resume header */}
              <div className="mb-4 pb-4 border-b" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
                <div className="font-black text-lg leading-tight text-white">Alexandra Chen</div>
                <div className="text-sm font-semibold mb-2" style={{ color: '#93c5fd' }}>Senior Product Manager</div>
                <div className="flex flex-wrap gap-1.5">
                  {['San Francisco', 'a.chen@email.com', 'linkedin.com/in/achen'].map((pill) => (
                    <span key={pill} className="text-[9px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(59,130,246,0.08)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(59,130,246,0.12)' }}>{pill}</span>
                  ))}
                </div>
              </div>

              {/* AI writing section */}
              <div className="mb-3">
                <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#f59e0b' }} />
                  AI Writing experience…
                </div>
                <TypingEffect lines={typingLines} />
              </div>

              {/* Keywords */}
              <div className="pt-3 border-t" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
                <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>ATS Keywords Matched</div>
                <div className="flex flex-wrap gap-1">
                  {['Python','AWS','Agile','Product Strategy','SQL','Stakeholder Mgmt'].map((kw) => (
                    <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                      style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>{kw}</span>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-2 border-t flex items-center gap-1.5" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>AI-generated · tailored to job description</span>
              </div>
            </div>

            {/* ATS Meter — floats bottom-left of card */}
            <div className="absolute -bottom-4 -left-4 rounded-2xl p-4 z-20 hidden sm:block"
              style={{ background: BG2, border: '1px solid rgba(59,130,246,0.12)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
              <ATSMeter />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)', background: BG2 }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <span>ATS-optimised output</span>
          <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
          <span>No account required</span>
          <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
          <span>Free PDF download</span>
          <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
          <span>AI cover letter included</span>
        </div>
      </div>

      {/* Mobile demo strip — 4-card horizontal scroll */}
      <div className="lg:hidden overflow-x-auto py-6 px-4" style={{ background: BG }}>
        <div className="flex gap-3 w-max">
          {[
            { icon: '🎯', title: 'Target any role', desc: 'AI tailors your bullets to each job description' },
            { icon: '📊', title: 'ATS score 94%', desc: 'Beat automated filters before human review' },
            { icon: '⚡', title: '60-second resume', desc: 'Paste experience, AI writes the rest' },
            { icon: '📄', title: 'PDF in one click', desc: 'Recruiter-ready format, instant download' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl p-4 flex-shrink-0 w-52"
              style={{ background: BG2, border: '1px solid rgba(59,130,246,0.1)' }}>
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className="text-sm font-bold text-white mb-1">{card.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works — 3-step */}
      <section id="proof" className="border-b py-12" style={{ borderColor: 'rgba(255,255,255,0.05)', background: BG2 }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8 reveal">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#93c5fd' }}>How it works</div>
            <h2 className="text-2xl font-black tracking-tight text-white">Three steps to a recruiter-ready resume</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Paste job description', desc: 'Drop in the JD — AI extracts every required keyword and your match score instantly.' },
              { step: '02', title: 'Add your experience', desc: 'Enter your background in plain language. AI rewrites with impact metrics and action verbs.' },
              { step: '03', title: 'Download & apply', desc: 'Export a polished, ATS-optimised PDF that passes filters and impresses recruiters.' },
            ].map((s, i) => (
              <div key={s.step} className={`rounded-xl p-5 border reveal stagger-${i + 1}`}
                style={{ background: BG, borderColor: 'rgba(59,130,246,0.1)' }}>
                <div className="text-3xl font-black mb-3" style={{ color: 'rgba(30,58,138,0.6)', fontVariantNumeric: 'tabular-nums' }}>{s.step}</div>
                <div className="font-bold text-sm mb-1 text-white">{s.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)', background: BG }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8 reveal">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#93c5fd' }}>Before vs After</div>
            <h2 className="text-2xl font-black tracking-tight text-white">See the AI difference</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Before */}
            <div className="rounded-xl p-5 reveal" style={{ background: BG2, border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: '#ef4444' }}>✕</span>
                <span className="text-sm font-bold" style={{ color: '#ef4444' }}>Without ResumeVault</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(220,38,38,0.12)', color: '#ef4444' }}>ATS: 31%</span>
              </div>
              <div className="space-y-1.5 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <p>• Responsible for managing projects</p>
                <p>• Worked with team members on deliverables</p>
                <p>• Helped improve company processes</p>
                <p>• Did various tasks related to product</p>
              </div>
              <div className="mt-3 text-xs font-medium" style={{ color: '#ef4444' }}>✕ Generic · No metrics · Rejected by ATS</div>
            </div>
            {/* After */}
            <div className="rounded-xl p-5 reveal stagger-2" style={{ background: BG2, border: '1px solid rgba(34,197,94,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: '#22c55e' }}>✓</span>
                <span className="text-sm font-bold" style={{ color: '#22c55e' }}>With ResumeVault</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>ATS: 94%</span>
              </div>
              <div className="space-y-1.5 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <p>• <strong className="text-white">Led product roadmap</strong> for B2B SaaS, driving <strong className="text-white">$1.2M ARR</strong> growth in 6 months</p>
                <p>• Managed <strong className="text-white">cross-functional team of 12</strong> across Engineering, Design &amp; Data</p>
                <p>• Implemented <strong className="text-white">agile sprint framework</strong>, improving velocity by <strong className="text-white">34%</strong></p>
              </div>
              <div className="mt-3 text-xs font-medium" style={{ color: '#22c55e' }}>✓ Keyword-rich · Metrics · Passes every ATS filter</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN BUILDER ─────────────────────── */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12" style={{ background: BG }}>
        {/* Mobile: stacked */}
        <div className="lg:hidden space-y-6">
          <div className="space-y-4">
            <div className="rounded-2xl p-6 border" style={{ background: BG2, borderColor: 'rgba(59,130,246,0.1)' }}>
              <ResumeForm
                onGenerate={(r, s) => { setResume(r); setSuggestions(s ?? []); setActivePreviewTab('resume'); }}
                setLoading={setLoading}
                onAnalysis={setAnalysis}
                onCoverLetter={(cl) => { setCoverLetter(cl); setActivePreviewTab('cover'); }}
                onInterviewPrep={(p) => { setInterviewPrep(p); setActivePreviewTab('prep'); }}
                onKeywords={(req, nice) => setJdKeywords({ required: req, niceToHave: nice })}
                initialValues={savedSession}
              />
            </div>
            {(jdKeywords.required.length > 0 || jdKeywords.niceToHave.length > 0) && (
              <KeywordBar
                required={jdKeywords.required}
                niceToHave={jdKeywords.niceToHave}
                resumeText={resume ?? ''}
              />
            )}
          </div>
          <ResumePreview
            resume={resume}
            loading={loading}
            analysis={analysis}
            coverLetter={coverLetter}
            interviewPrep={interviewPrep}
            activeTab={activePreviewTab}
            onTabChange={setActivePreviewTab}
            suggestions={suggestions}
            onApproveSuggestion={(s) => {
              setResume(prev => prev ? `${prev}\n\n• ${s.text}` : `• ${s.text}`)
              setSuggestions(prev => prev.filter(x => x.id !== s.id))
            }}
            onSkipSuggestion={(id) => setSuggestions(prev => prev.filter(x => x.id !== id))}
          />
        </div>

        {/* Desktop: resizable split pane */}
        <div className="hidden lg:block" style={{ height: 'calc(100vh - 80px)' }}>
          <PanelGroup orientation="horizontal" className="h-full">
            <Panel defaultSize={45} minSize={30} maxSize={65}>
              <div className="h-full overflow-y-auto pr-2 space-y-4">
                <div className="rounded-2xl p-8 border" style={{ background: BG2, borderColor: 'rgba(59,130,246,0.1)' }}>
                  <ResumeForm
                    onGenerate={(r, s) => { setResume(r); setSuggestions(s ?? []); setActivePreviewTab('resume'); }}
                    setLoading={setLoading}
                    onAnalysis={setAnalysis}
                    onCoverLetter={(cl) => { setCoverLetter(cl); setActivePreviewTab('cover'); }}
                    onInterviewPrep={(p) => { setInterviewPrep(p); setActivePreviewTab('prep'); }}
                    onKeywords={(req, nice) => setJdKeywords({ required: req, niceToHave: nice })}
                    initialValues={savedSession}
                  />
                </div>
                {(jdKeywords.required.length > 0 || jdKeywords.niceToHave.length > 0) && (
                  <KeywordBar
                    required={jdKeywords.required}
                    niceToHave={jdKeywords.niceToHave}
                    resumeText={resume ?? ''}
                  />
                )}
              </div>
            </Panel>

            <PanelResizeHandle className="w-2 mx-1 flex items-center justify-center cursor-col-resize">
              <div className="w-1 h-16 rounded-full transition-colors" style={{ background: 'rgba(59,130,246,0.12)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.45)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.12)')}
              />
            </PanelResizeHandle>

            <Panel defaultSize={55} minSize={35}>
              <div className="h-full overflow-y-auto pl-2">
                <ResumePreview
                  resume={resume}
                  loading={loading}
                  analysis={analysis}
                  coverLetter={coverLetter}
                  interviewPrep={interviewPrep}
                  activeTab={activePreviewTab}
                  onTabChange={setActivePreviewTab}
                  suggestions={suggestions}
                  onApproveSuggestion={(s) => {
                    setResume(prev => prev ? `${prev}\n\n• ${s.text}` : `• ${s.text}`)
                    setSuggestions(prev => prev.filter(x => x.id !== s.id))
                  }}
                  onSkipSuggestion={(id) => setSuggestions(prev => prev.filter(x => x.id !== id))}
                />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-12 border-t border-b" style={{ borderColor: 'rgba(255,255,255,0.05)', background: BG2 }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8 reveal">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#93c5fd' }}>Why ResumeVault</div>
            <h2 className="text-2xl font-black tracking-tight text-white">Everything you need to land the role</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: '∞', title: 'Unlimited Resumes', desc: 'Create a tailored resume for every job application — no monthly limits on Pro.' },
              { icon: '🎯', title: 'ATS Optimisation', desc: 'AI scans job postings and injects exact keywords that pass applicant tracking filters.' },
              { icon: '✉', title: 'Cover Letters', desc: 'Personalised cover letters generated alongside every resume automatically.' },
              { icon: '🔗', title: 'LinkedIn Import', desc: 'Import your LinkedIn profile with one click — zero re-typing required.' },
              { icon: '⬇', title: 'PDF Export', desc: 'Download polished, recruiter-ready PDFs instantly for free.' },
              { icon: '💬', title: 'Interview Prep', desc: 'AI-generated interview questions tailored to the exact role you are targeting.' },
            ].map((feat, i) => (
              <div key={feat.title} className={`rounded-lg p-4 border card-hover reveal stagger-${(i % 6) + 1}`}
                style={{ background: BG, borderColor: 'rgba(59,130,246,0.1)' }}>
                <div className="text-xl mb-2">{feat.icon}</div>
                <div className="font-bold text-sm mb-1 text-white">{feat.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12" style={{ background: BG }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8 reveal">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#93c5fd' }}>Pricing</div>
            <h2 className="text-2xl font-black tracking-tight text-white">Simple, honest pricing</h2>
            <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>One plan. Everything included. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Free */}
            <div className="rounded-2xl p-7 border reveal" style={{ background: BG2, borderColor: 'rgba(59,130,246,0.1)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Free</div>
              <div className="text-5xl font-black mb-0.5 text-white">$0</div>
              <div className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.25)' }}>Always free</div>
              <ul className="space-y-2 mb-7">
                {[
                  "3 resumes per month",
                  "ATS keyword analysis",
                  "Job match score",
                  "Cover letter generator",
                  "Interview prep (3 questions)",
                  "All export formats",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="#how" className="block w-full py-3 text-center font-semibold text-sm rounded-lg border transition-all btn-press"
                style={{ borderColor: 'rgba(59,130,246,0.2)', color: 'rgba(255,255,255,0.55)' }}>
                Get started free
              </a>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-7 border reveal stagger-2 relative overflow-hidden" style={{
              background: 'linear-gradient(135deg, #0d1a35 0%, #0a1428 100%)',
              borderColor: 'rgba(59,130,246,0.4)',
              boxShadow: '0 0 0 1px rgba(59,130,246,0.12), 0 8px 40px rgba(30,58,138,0.2), inset 0 1px 0 rgba(59,130,246,0.1)',
            }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)' }} />
              <div className="absolute -top-3 right-5 text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#1e3a8a', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }}>Most Popular</div>

              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#93c5fd' }}>Pro</div>
              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="text-5xl font-black text-white">$9</span>
                <span className="text-lg" style={{ color: 'rgba(255,255,255,0.35)' }}>/mo</span>
              </div>
              <div className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>Cancel anytime · no contracts</div>
              <ul className="space-y-2 mb-7">
                {[
                  "Unlimited resumes & cover letters",
                  "Full ATS optimisation engine",
                  "LinkedIn import",
                  "PDF export (all templates)",
                  "Full interview prep (8 questions)",
                  "Salary range insights",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ color: '#f59e0b' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              {isPro ? (
                <div className="w-full py-3 text-center font-bold text-sm rounded-lg" style={{ background: 'rgba(30,58,138,0.2)', color: '#93c5fd' }}>
                  ✦ You&apos;re on Pro
                </div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                  className="w-full py-3 font-bold text-sm rounded-lg transition-all btn-press"
                  style={{ background: '#f59e0b', color: '#0d1425', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' }}
                >
                  {checkoutLoading ? 'Loading…' : 'Start Pro — $9/mo'}
                </button>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-7 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            <span>🔒 Secure Stripe checkout</span>
            <span>↩ Cancel anytime</span>
            <span>✓ No hidden fees</span>
            <span>✓ ATS-optimised templates</span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-4" style={{ background: BG }}>
        <ResumeVaultAffiliates />
      </div>

      {/* Competitor comparison */}
      <section style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'40px 24px', background: BG2 }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <p style={{ fontSize:10, color:'rgba(255,255,255,0.2)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:8 }}>How we compare</p>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#fff' }}>ResumeVault vs alternatives</h2>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, background: BG, borderRadius:12, overflow:'hidden', border:'1px solid rgba(59,130,246,0.08)' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(59,130,246,0.08)', background:'rgba(255,255,255,0.02)' }}>
                  {['Feature','ResumeVault','Resume.io','Zety','Canva'].map((h,i) => (
                    <th key={h} style={{ padding:'12px 14px', textAlign:i===0?'left':'center',
                      color: i===1 ? '#93c5fd' : 'rgba(255,255,255,0.25)', fontWeight:700, fontSize:11, letterSpacing:'0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI resume writer','✅ Claude AI','⚠️ Templates','⚠️ Templates','❌'],
                  ['ATS optimization','✅ Built-in','✅','✅','❌'],
                  ['No login required','✅','❌','❌','❌'],
                  ['LinkedIn import','✅','❌','❌','❌'],
                  ['Cover letter AI','✅','✅ Pro','✅ Pro','❌'],
                  ['PDF download free','✅','❌ Paid','❌ Paid','✅'],
                  ['Cost','Free / $9 mo','$9.95/mo','$8.25/mo','Free / $15 mo'],
                ].map(row => (
                  <tr key={row[0]} style={{ borderBottom:'1px solid rgba(59,130,246,0.05)' }}>
                    {row.map((cell,i) => (
                      <td key={i} style={{ padding:'10px 14px', textAlign:i===0?'left':'center',
                        color: i===1 ? '#93c5fd' : i===0 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)',
                        background: i===1 ? 'rgba(30,58,138,0.06)' : 'transparent', fontSize:11, fontWeight: i===1 ? 600 : 400 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'24px', background: BG }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:16 }}>
          <div>
            <span style={{ fontWeight:900, fontSize:15, color:'#fff' }}>Resume<span style={{ color:'#3b82f6' }}>Vault</span></span>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.2)', marginTop:4 }}>AI-powered resume builder — no login, no hidden fees.</p>
          </div>
          <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            {[['About','/about'],['Privacy','/privacy'],['Terms','/terms'],['Cookie Policy','/cookies']].map(([label,href]) => (
              <a key={label} href={href} style={{ fontSize:11, color:'rgba(255,255,255,0.25)', textDecoration:'none' }}
                onMouseOver={e=>(e.currentTarget.style.color='#93c5fd')} onMouseOut={e=>(e.currentTarget.style.color='rgba(255,255,255,0.25)')}>{label}</a>
            ))}
          </div>
          <p style={{ fontSize:10, color:'rgba(255,255,255,0.12)' }}>© 2026 ResumeVault</p>
        </div>
      </footer>
      <GuidedTour steps={RESUME_TOUR} storageKey="resumevault_tour_v1" accentColor="#f59e0b" />
      <FloatingChat />
    </main>
    <ResumeVaultCookieBanner />
    </>
  );
}

function ResumeVaultCookieBanner() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!localStorage.getItem('rv_cookies_ok')) setVisible(true)
  }, [])
  if (!visible) return null
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, padding:'12px 24px',
      background:'rgba(10,20,40,0.97)', borderTop:'1px solid rgba(59,130,246,0.12)',
      backdropFilter:'blur(16px)', boxShadow:'0 -4px 24px rgba(0,0,0,0.3)',
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
      <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)', maxWidth:600, lineHeight:1.5 }}>
        ResumeVault uses essential cookies to save your resume drafts locally. No tracking, no ads.{' '}
        <a href="/privacy" style={{ color:'#93c5fd', textDecoration:'underline', cursor:'pointer' }}>Privacy policy</a>
      </p>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={() => { localStorage.setItem('rv_cookies_ok','1'); setVisible(false) }}
          style={{ fontSize:12, fontWeight:700, padding:'7px 20px', borderRadius:8,
            background:'#1e3a8a', color:'#fff', border:'1px solid rgba(59,130,246,0.3)', cursor:'pointer' }}>
          Accept
        </button>
        <button onClick={() => setVisible(false)}
          style={{ fontSize:12, fontWeight:500, padding:'7px 14px', borderRadius:8,
            background:'transparent', color:'rgba(255,255,255,0.3)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer' }}>
          Decline
        </button>
      </div>
    </div>
  )
}
