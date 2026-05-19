/**
 * site.config.ts — ResumeVault brand configuration
 * Used by components, SEO, and chatbot across the app.
 */

export const siteConfig = {
  name: 'ResumeVault',
  tagline: 'Build a Resume That Gets Interviews',
  description: 'AI-powered resume builder that tailors your resume to job descriptions. ATS-optimized, professional templates.',
  url: 'https://resumevault.app',
  primaryColor: '#0f172a',
  email: 'info.siva@gmail.com',

  stats: {
    resumesBuilt: '28,000+',
    interviewRate: '3.2×',
    templates: '25+',
  },

  chatbot: {
    openingMessage: 'Hi! I can help you build a winning resume. What job are you applying for?',
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
