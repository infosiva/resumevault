'use client';

/**
 * Contextual affiliate component for ResumeVault.
 * Promotes tools that complement resume building — Grammarly, Canva, LinkedIn.
 * Replace AFFILIATE_LINKS with your actual tracking URLs.
 */

const AFFILIATE_LINKS = [
  {
    name: 'Grammarly',
    tagline: 'Polish your resume with AI writing assistance',
    cta: 'Try Grammarly Free →',
    url: 'https://grammarly.com/?affiliate=siva', // TODO: replace with real affiliate link
    color: '#15803d',
    icon: '✍️',
  },
  {
    name: 'Canva Pro',
    tagline: 'Design stunning resume layouts with 1000+ templates',
    cta: 'Get Canva Free →',
    url: 'https://canva.com/?affiliate=siva', // TODO: replace with real affiliate link
    color: '#7c3aed',
    icon: '🎨',
  },
  {
    name: 'LinkedIn Premium',
    tagline: 'See who viewed your profile + InMail credits',
    cta: 'Start Free Trial →',
    url: 'https://linkedin.com/premium?affiliate=siva', // TODO: replace with real affiliate link
    color: '#1e3a5f',
    icon: '💼',
  },
];

export default function ResumeVaultAffiliates() {
  return (
    <section className="my-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-gray-500">
        Recommended tools
      </h3>
      <p className="mb-5 text-xs text-gray-400">
        Pair your resume with these proven tools
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {AFFILIATE_LINKS.map((a) => (
          <a
            key={a.name}
            href={a.url}
            target="_blank"
            rel="noopener sponsored"
            className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm"
          >
            <div className="mb-2 text-xl">{a.icon}</div>
            <div className="mb-1 text-sm font-semibold text-gray-800 group-hover:text-gray-900">
              {a.name}
            </div>
            <div className="mb-3 text-xs text-gray-500">{a.tagline}</div>
            <div
              className="mt-auto inline-block rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: a.color }}
            >
              {a.cta}
            </div>
          </a>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] text-gray-400">
        Sponsored · We may earn a commission at no cost to you
      </p>
    </section>
  );
}
