"use client";
import { useState, useCallback } from "react";

// Common tech/role skills to extract as keyword pills
const SKILL_PATTERNS = [
  "React","Vue","Angular","Next.js","TypeScript","JavaScript","Python","Java","Go","Rust","Ruby","PHP","Swift","Kotlin",
  "Node.js","Express","Django","FastAPI","Rails","Spring","Laravel",
  "AWS","GCP","Azure","Docker","Kubernetes","Terraform","CI/CD","DevOps",
  "SQL","PostgreSQL","MySQL","MongoDB","Redis","Elasticsearch","GraphQL","REST","API",
  "Machine Learning","AI","LLM","NLP","Data Science","TensorFlow","PyTorch","Pandas","Spark",
  "Agile","Scrum","Kanban","Jira","Figma","Product","Roadmap","OKRs","Stakeholder",
  "Leadership","Management","Cross-functional","Strategy","Analytics","Metrics","KPI","A/B",
  "SEO","SEM","Marketing","Salesforce","HubSpot","CRM","Excel","Tableau","Power BI",
  "Communication","Problem-solving","Collaboration","Presentation","Negotiation",
];

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  return SKILL_PATTERNS.filter((skill) =>
    lower.includes(skill.toLowerCase())
  ).slice(0, 18);
}

interface Props {
  onTailor: (prompt: string) => void;
}

export default function JobMatcher({ onTailor }: Props) {
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState("");
  const keywords = jd.trim() ? extractKeywords(jd) : [];

  const handleTailor = useCallback(() => {
    if (!jd.trim()) return;
    const preview = jd.slice(0, 200).trim();
    onTailor(`Rewrite my resume bullets to match this job: ${preview}`);
  }, [jd, onTailor]);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(59,130,246,0.15)", background: "rgba(10,20,40,0.6)" }}
    >
      {/* Toggle header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <span style={{ color: "#f59e0b" }}>🎯</span>
          <span className="text-sm font-semibold text-white">Tailor for a role</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            ATS match
          </span>
        </div>
        <svg
          className="w-4 h-4 transition-transform duration-200"
          style={{
            color: "rgba(255,255,255,0.3)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Collapsible body */}
      {open && (
        <div
          className="px-5 pb-5 space-y-4 border-t"
          style={{ borderColor: "rgba(59,130,246,0.1)" }}
        >
          <p className="text-xs pt-4" style={{ color: "rgba(255,255,255,0.4)" }}>
            Paste the job description — AI extracts keywords and rewrites your bullets to match.
          </p>

          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={4}
            placeholder="Paste job description here…"
            className="w-full rounded-lg px-3 py-2.5 text-sm resize-none outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "#e5e7eb",
              lineHeight: 1.6,
            }}
          />

          {/* Keyword pills */}
          {keywords.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                Detected keywords
              </p>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: "rgba(30,58,138,0.2)",
                      border: "1px solid rgba(59,130,246,0.25)",
                      color: "#93c5fd",
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleTailor}
            disabled={!jd.trim()}
            className="w-full py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{
              background: jd.trim() ? "#f59e0b" : "rgba(245,158,11,0.15)",
              color: jd.trim() ? "#0d1425" : "rgba(245,158,11,0.4)",
              cursor: jd.trim() ? "pointer" : "not-allowed",
              boxShadow: jd.trim() ? "0 4px 16px rgba(245,158,11,0.25)" : "none",
            }}
          >
            Tailor my resume →
          </button>
        </div>
      )}
    </div>
  );
}
