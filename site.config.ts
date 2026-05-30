/**
 * site.config.ts — ResumeVault brand configuration
 * Used by components, SEO, and chatbot across the app.
 */

export const siteConfig = {
  name: 'ResumeVault',
  tagline: 'Your resume, rewritten for every job — ATS-optimized before you hit send.',
  description: 'Paste a job description and watch AI rewrite your bullets to match — no manual editing. ATS keyword matching, instant tailoring, free to start.',
  url: 'https://resumevault.app',
  primaryColor: '#0f172a',
  email: 'info.siva@gmail.com',

  stats: {
    resumesBuilt: '28,000+',
    interviewRate: '3.2×',
    templates: '25+',
  },

  chatbot: {
    openingMessage: 'Tell me the job title you\'re targeting and I\'ll tailor your resume to beat the ATS and get the interview.',
    apiEndpoint: '/api/chat',
  },

  seo: {
    title: 'ResumeVault — AI Resume Builder | ATS-Optimized for Every Job',
    description: 'AI resume builder that rewrites your resume for each job application. ATS keyword matching, instant tailoring, free to start.',
    keywords: [
      'resume builder',
      'AI resume',
      'CV generator',
      'job application',
      'free resume maker',
      'ATS resume',
      'ATS optimized resume',
      'resume template',
      'cover letter generator',
      'interview prep',
      'AI CV writer',
      'job search tools',
    ],
  },
}

export default siteConfig
