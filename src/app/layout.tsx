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
  color: '#7c3aed',
  url: siteConfig.url,
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Build Resume', href: '/#how' },
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
    background: '#0c0f1a',
    primary: '#7c3aed',
    secondary: '#a78bfa',
  })

  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
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
            --theme-primary: #7c3aed;
            --theme-secondary: #a78bfa;
            --theme-base: #0c0f1a;
            --background: #0c0f1a;
            --surface-1: rgba(255,255,255,0.04);
            --surface-2: rgba(255,255,255,0.08);
            --foreground: #f1f5f9;
            --text-2: #a78bfa;
            --text-3: #6b7280;
            --accent: #7c3aed;
            --accent-2: #6d28d9;
            --border-default: rgba(124,58,237,0.25);
            --border-subtle: rgba(255,255,255,0.08);
            --border-strong: rgba(124,58,237,0.4);
          }
          body { font-family: 'Inter', system-ui, sans-serif !important; color: var(--foreground, #f1f5f9) !important; background: var(--background, #0c0f1a) !important; }
          h1, h2, h3 { font-family: 'Playfair Display', serif !important; }
          .glass { background: rgba(12,15,26,0.85) !important; border-color: rgba(124,58,237,0.2) !important; backdrop-filter: blur(20px) saturate(140%) !important; }
          ${themeCSS}
        ` }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <DesignEffects />
        <div id="layout-nav"><SharedNavbar brand={brand} /></div>
        <main className="flex-1 pt-16">{children}</main>
        <AffiliateStrip />
        <Footer siteName="ResumeVault" />
      {flags.chatbot && !isWidgetHidden(theme, 'chatbot') && <ChatBot />}
      {!isWidgetHidden(theme, 'backToTop') && <BackToTop accentColor="#7c3aed" />}
      {!isWidgetHidden(theme, 'cookieConsent') && <CookieConsent />}
      {!isWidgetHidden(theme, 'stickyFooterCTA') && <StickyFooterCTA />}
      <Script defer data-domain="resumevault.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      <FeedbackWidget siteName="ResumeVault" accentColor="#0ea5e9" position="left" />
      </body>
    </html>
  )
}
