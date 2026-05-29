/**
 * site.config.ts — ResumeVault brand configuration
 * Used by components, SEO, and chatbot across the app.
 */

export const siteConfig = {
  name: 'ResumeVault',
  tagline: 'The resume that gets the interview.',
  description: 'AI tailors your CV to each job description — ATS-scored, interview-ready in 60 seconds.',
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
    title: 'ResumeVault — AI Resume Builder for Job Seekers',
    description: 'Build an ATS-optimized resume with AI. Tailored to job descriptions, ready in minutes.',
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
