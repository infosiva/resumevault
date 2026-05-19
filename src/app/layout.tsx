import Script from 'next/script'
import type { Metadata } from 'next'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import Footer from '../../components/Footer'
import DesignEffects from '@/components/DesignEffects'
import ChatBot from '@/components/ChatBot'
import type { BrandConfig } from '@/components/SharedNavbar'
import CookieConsent from "../../components/CookieConsent";
import StickyFooterCTA from "../../components/StickyFooterCTA";
import siteConfig from '../../site.config'
import AuthButton from '@/components/AuthButton'
import AffiliateStrip from '@/components/AffiliateStrip'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
            --theme-base: #f8fafc;
            --background: #f8fafc;
            --surface-1: #ffffff;
            --surface-2: #f1f5f9;
            --foreground: #0f172a;
            --text-2: #475569;
            --border-default: rgba(30,58,138,0.12);
            --border-strong: rgba(30,58,138,0.25);
          }
          body { font-family: 'Inter', system-ui, sans-serif !important; color: #0f172a !important; background: #f8fafc !important; }
          h1, h2, h3 { font-family: 'Playfair Display', serif !important; }
          .glass { background: rgba(248,250,252,0.85) !important; border-color: rgba(30,58,138,0.1) !important; color: #0f172a !important; }
        ` }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <DesignEffects />
        <SharedNavbar brand={brand} />
        <div style={{ position:"fixed", top:"10px", right:"16px", zIndex:60 }}><AuthButton /></div>
        <main className="flex-1 pt-16">{children}</main>
        <AffiliateStrip />
        <Footer siteName="ResumeVault" />
        <ChatBot />
        <script src="http://31.97.56.148:3098/t.js" data-site="resumevault.app" defer></script>
        <script dangerouslySetInnerHTML={{ __html: `fetch('http://31.97.56.148:3099/api/stats',{method:'POST',body:JSON.stringify({site:'resumevault.app',event:'pageview'}),headers:{'Content-Type':'application/json'}}).catch(function(){})` }} />
      <CookieConsent />
      <StickyFooterCTA />
            <Script async src="http://31.97.56.148:3100/script.js" data-website-id="0ffb8fac-4921-4827-a610-61f3b3c0c420" strategy="afterInteractive" />
      </body>
    </html>
  )
}
// design patch applied below via separate edit
