import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ResumeVault — AI Resume Builder for Job Seekers",
  description: "ResumeVault is a free AI-powered resume builder that tailors your CV to any job description. ATS-optimized, no account required.",
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 leading-relaxed" style={{ color: '#111827' }}>

      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6"
          style={{ background: 'rgba(30,58,95,0.08)', color: '#1e3a5f', border: '1px solid rgba(30,58,95,0.15)' }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#f59e0b' }} />
          Free forever plan
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight" style={{ color: '#0f172a' }}>
          About ResumeVault
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: '#6b7280' }}>
          ResumeVault is an AI-powered resume builder that tailors your resume to every job description — boosting your ATS score and helping you land more interviews.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-10 p-6 rounded-2xl border" style={{ background: 'rgba(30,58,95,0.04)', borderColor: 'rgba(30,58,95,0.12)' }}>
        <h2 className="text-lg font-black mb-3" style={{ color: '#0f172a' }}>Our mission</h2>
        <p className="text-sm leading-7" style={{ color: '#6b7280' }}>
          Most resumes fail before a human ever reads them — rejected by ATS filters that scan for exact keywords. ResumeVault fixes this by reading the job description and intelligently rewriting your bullet points with the right terminology, action verbs, and metrics recruiters want to see.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-lg font-black mb-4" style={{ color: '#0f172a' }}>How it works</h2>
        <div className="space-y-4">
          {[
            { step: "01", title: "Paste the job description", desc: "Copy any job posting into ResumeVault. AI extracts required keywords, skills, and seniority signals automatically." },
            { step: "02", title: "Add your experience", desc: "Enter your work history, skills, and education. No fancy formatting needed — raw notes work perfectly." },
            { step: "03", title: "AI tailors your resume", desc: "Your resume is rewritten with ATS-optimized bullet points, matched keywords, and a professional summary in seconds. Download as PDF." },
          ].map(item => (
            <div key={item.step} className="flex gap-4">
              <span className="text-xs font-black w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#b45309', border: '1px solid rgba(245,158,11,0.25)' }}>
                {item.step}
              </span>
              <div>
                <div className="font-bold text-sm mb-0.5" style={{ color: '#111827' }}>{item.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Built with AI */}
      <section className="mb-10">
        <h2 className="text-lg font-black mb-3" style={{ color: '#0f172a' }}>Built with AI — transparently</h2>
        <p className="text-sm leading-7" style={{ color: '#6b7280' }}>
          We use state-of-the-art AI models (Groq, Gemini, and Anthropic Claude) to generate resume content. All AI-generated text is clearly marked. Our fallback chain ensures the platform stays fast even if one provider is slow — always free-first, paid-last.
        </p>
      </section>

      {/* Privacy */}
      <section className="mb-10">
        <h2 className="text-lg font-black mb-3" style={{ color: '#0f172a' }}>Privacy first</h2>
        <p className="text-sm leading-7" style={{ color: '#6b7280' }}>
          No account required. Your resume data is processed in memory and not stored on our servers. We collect only what&apos;s needed to run the service. See our{" "}
          <a href="/privacy" className="underline underline-offset-2" style={{ color: '#1e3a5f' }}>Privacy Policy</a> for full details.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-10">
        <h2 className="text-lg font-black mb-3" style={{ color: '#0f172a' }}>Get in touch</h2>
        <p className="text-sm leading-7" style={{ color: '#6b7280' }}>
          Feedback, feature requests, bug reports, or partnership enquiries are all welcome.{" "}
          Reach us at{" "}
          <a href="mailto:info.siva@gmail.com" className="underline underline-offset-2" style={{ color: '#1e3a5f' }}>info.siva@gmail.com</a>
          {" "}or use our{" "}
          <a href="/contact" className="underline underline-offset-2" style={{ color: '#1e3a5f' }}>contact page</a>.
        </p>
      </section>

      <p className="text-xs mt-10" style={{ color: '#d1d5db' }}>© 2026 ResumeVault. All rights reserved.</p>
    </main>
  );
}
