import { Geist, Geist_Mono } from "next/font/google";
import { loadResumeData } from "../lib/resumeLoader";
import { logger } from "../lib/logger";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PerformanceMonitor from "../components/PerformanceMonitor";
import PerformanceBudget from "../components/PerformanceBudget";
import ServiceWorkerRegistration from "../components/ServiceWorkerRegistration";
import "../lib/fontawesome";
import "./globals.css";
import config from '../masterConfig';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Improve font loading performance
  preload: true,
  adjustFontFallback: false, // Prevent preconnect warnings
  preconnect: true, // Explicit preconnect for Next.js optimization
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Improve font loading performance
  preload: true,
  adjustFontFallback: false, // Prevent preconnect warnings
  preconnect: true, // Explicit preconnect for Next.js optimization
});

export async function generateMetadata() {
  try {
    const resumeData = await loadResumeData();
    const { personalInfo } = resumeData;
    
    return {
      title: `${personalInfo.name} - ${personalInfo.title}`,
      description: personalInfo.summary,
      keywords: resumeData.about.skillNames?.join(", ") || "",
      authors: [{ name: personalInfo.name }],
      creator: personalInfo.name,
      openGraph: {
        title: `${personalInfo.name} - ${personalInfo.title}`,
        description: personalInfo.summary,
        url: personalInfo.website,
        siteName: `${personalInfo.name} Portfolio`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${personalInfo.name} - ${personalInfo.title}`,
        description: personalInfo.summary,
      },
      icons: {
        icon: [
          { url: '/images/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
          { url: '/images/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
          { url: '/images/favicon/favicon.ico', sizes: 'any' },
        ],
        apple: [
          { url: '/images/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        other: [
          { url: '/images/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { url: '/images/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      manifest: '/images/favicon/site.webmanifest',
    };
  } catch (error) {
    logger.error('Error loading metadata from resume:', error);
    // Fallback metadata if resume loading fails
    return {
      title: "Developer Portfolio",
      description: "Professional developer portfolio showcasing projects and experience.",
      icons: {
        icon: [
          { url: '/images/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
          { url: '/images/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
          { url: '/images/favicon/favicon.ico', sizes: 'any' },
        ],
        apple: [
          { url: '/images/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        other: [
          { url: '/images/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { url: '/images/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      manifest: '/images/favicon/site.webmanifest',
    };
  }
}

export default async function RootLayout({ children }) {
  // Load resume data at layout level
  const resumeData = await loadResumeData();

  // Theme selection logic - always use default theme for SSR to prevent hydration mismatches
  // Random theme selection is handled client-side in ThemeSwitcher component
  const theme = config.defaultTheme;

  return (
    <html lang="en" data-theme={theme}>
      <head>
        {/* Critical resource hints for sub-1.4s LCP */}
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        <link rel="preconnect" href="https://raw.githubusercontent.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical above-the-fold images with fetchpriority */}
        <link 
          rel="preload" 
          href={config.landingBackground} 
          as="image" 
          type="image/jpeg"
          fetchPriority="high"
        />
        
        <link 
          rel="preload" 
          href="/images/profile.jpg" 
          as="image" 
          type="image/jpeg"
          fetchPriority="high"
        />
        
        {/* Preload critical fonts with display swap */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/geist/v1/UcC73FwrK3iLTeHuS_fjRNFu2bJGDA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Early hints for resume data */}
        <link rel="preload" href="https://raw.githubusercontent.com/powrstack/powrstack-folio/refs/heads/main/public/resume.json" as="fetch" crossOrigin="anonymous" />
        
        {/* Resource hints for instant interactivity */}
        <link rel="modulepreload" href="/_next/static/chunks/main.js" />
        <link rel="modulepreload" href="/_next/static/chunks/pages/_app.js" />
        
        {/* Inline critical CSS for instant rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            * { box-sizing: border-box; }
            body { 
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              line-height: 1.6;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .hero { 
              position: relative; 
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 5rem 0;
            }
            .hero-content { 
              position: relative; 
              z-index: 10; 
              width: 100%;
              max-width: 1200px;
              padding: 1rem;
            }
            .avatar { 
              display: inline-block; 
              border-radius: 50%;
              overflow: hidden;
            }
            .btn { 
              display: inline-flex; 
              align-items: center; 
              justify-content: center;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              font-weight: 600;
              text-decoration: none;
              transition: all 0.2s;
            }
            /* Prevent layout shift */
            img { max-width: 100%; height: auto; }
            .grid { display: grid; gap: 1rem; }
            .lg\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
            /* Hide non-critical content initially */
            .fade-in { opacity: 0; animation: fadeIn 0.5s ease-in forwards; }
            @keyframes fadeIn { to { opacity: 1; } }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerRegistration />
        {config.performance?.enableMonitor && <PerformanceMonitor />}
        {config.performance?.enableBudget && <PerformanceBudget />}
        <div className="min-h-screen bg-base-100">
          <Header resumeData={resumeData} />
          <main className="pt-16">
            {children}
          </main>
          <Footer resumeData={resumeData} />
        </div>
      </body>
    </html>
  );
}
