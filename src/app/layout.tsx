import Script from 'next/script'
import type { Metadata } from 'next'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import Footer from '../../components/Footer'
import DesignEffects from '@/components/DesignEffects'
import type { BrandConfig } from '@/components/SharedNavbar'
import CookieConsent from "../../components/CookieConsent";
import BackToTop from '@/components/BackToTop'
import StickyFooterCTA from "../../components/StickyFooterCTA";
import siteConfig from '../../site.config'
import AuthButton from '@/components/AuthButton'
import AffiliateStrip from '@/components/AffiliateStrip'
import ChatBot from '@/components/ChatBot'
import FeedbackWidget from '@/components/FeedbackWidget'
import { getSiteFlags } from '@/lib/flags'
import { loadSiteTheme, buildThemeStyleTag, isWidgetHidden } from '@/lib/theme-loader'

const brand: BrandConfig = {
  name: 'ResumeVault',
  tagline: siteConfig.tagline,
  icon: '📄',
  color: '#1e3a5f',
  url: siteConfig.url,
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Build Resume', href: '/#how' },
    { label: 'Templates', href: '/templates' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '/about' },
  ],
  cta: { label: 'Build free →', href: '/#how' },
}

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  metadataBase: new URL(siteConfig.url),
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    type: 'website',
    locale: 'en_US',
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [{ url: `${siteConfig.url}/opengraph-image`, width: 1200, height: 630, alt: `${siteConfig.name} — ${siteConfig.tagline}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [`${siteConfig.url}/opengraph-image`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [flags, theme] = await Promise.all([
    getSiteFlags('resumevault'),
    loadSiteTheme('resumevault'),
  ])

  const themeCSS = buildThemeStyleTag(theme, {
    background: '#080712',
    primary: '#1e3a8a',
    secondary: '#3b82f6',
  })

  return (
    <html lang="en">
      <head>
        <meta name="Impact-Site-Verification" content="de64bc17-b024-4bad-9e34-51e479420004" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              "name": siteConfig.name,
              "url": siteConfig.url,
              "description": siteConfig.description,
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            },
            { "@type": "WebSite", "name": siteConfig.name, "url": siteConfig.url },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is ResumeVault free?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Yes — ResumeVault has a free plan with 3 resumes per month, ATS keyword analysis, and cover letter generation. Pro unlocks unlimited resumes." }
                },
                {
                  "@type": "Question",
                  "name": "How does ResumeVault optimize for ATS?",
                  "acceptedAnswer": { "@type": "Answer", "text": "ResumeVault's AI scans the job description, extracts required and preferred keywords, and rewrites your resume bullets to naturally include them — improving your ATS match score." }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to create an account?",
                  "acceptedAnswer": { "@type": "Answer", "text": "No account required to get started. Paste your job description, add your experience, and download your resume — all for free." }
                }
              ]
            }
          ]
        })}} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --theme-primary: #1e3a8a;
            --theme-secondary: #3b82f6;
            --theme-base: #080712;
            --background: #080712;
            --surface-1: #0e0c22;
            --surface-2: #161430;
            --foreground: #f0eeff;
            --text-2: #a5b4fc;
            --border-default: rgba(99,102,241,0.14);
            --border-strong: rgba(99,102,241,0.25);
          }
          body { font-family: 'Inter', system-ui, sans-serif !important; color: #f0eeff !important; background: #080712 !important; }
          h1, h2, h3 { font-family: 'Playfair Display', serif !important; }
          .glass { background: rgba(255,255,255,0.03) !important; border-color: rgba(99,102,241,0.12) !important; backdrop-filter: blur(16px) saturate(140%) !important; }
          ${themeCSS}
        ` }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <div className="aurora aurora-primary" aria-hidden />
        <div className="aurora aurora-secondary" aria-hidden />
        <div className="aurora aurora-third" aria-hidden />
        <div className="grain" aria-hidden />
        <DesignEffects />
        <div id="layout-nav"><SharedNavbar brand={brand} /></div>
        <main className="flex-1 pt-16">{children}</main>
        <AffiliateStrip />
        <Footer siteName="ResumeVault" />
      {flags.chatbot && !isWidgetHidden(theme, 'chatbot') && <ChatBot />}
      {!isWidgetHidden(theme, 'backToTop') && <BackToTop accentColor="#1e3a8a" />}
      {!isWidgetHidden(theme, 'cookieConsent') && <CookieConsent />}
      {!isWidgetHidden(theme, 'stickyFooterCTA') && <StickyFooterCTA />}
      <Script defer data-domain="resumevault.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      <Script defer data-site="resumevault.app" src="http://31.97.56.148:3098/t.js" strategy="afterInteractive" />
      <FeedbackWidget siteName="ResumeVault" accentColor="#0ea5e9" position="left" />
      </body>
    </html>
  )
}
