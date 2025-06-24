import { Geist, Geist_Mono } from "next/font/google";
import { loadResumeData } from "../lib/resumeLoader";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PerformanceMonitor from "../components/PerformanceMonitor";
import "../lib/fontawesome";
import "./globals.css";
import config from '../masterConfig';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Improve font loading performance
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Improve font loading performance
  preload: true,
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
    console.error('Error loading metadata from resume:', error);
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

  // Theme selection logic
  let theme = config.defaultTheme;
  if (config.enableRandomTheme) {
    // List of daisyUI themes (should match ThemeSwitcher.js)
    const themes = [
      'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset', 'caramellatte', 'abyss', 'silk'
    ];
    theme = themes[Math.floor(Math.random() * themes.length)];
  }

  return (
    <html lang="en" data-theme={theme}>
      <head>
        {/* Critical resource hints for better LCP */}
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://raw.githubusercontent.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        
        {/* Preload critical background image */}
        <link 
          rel="preload" 
          href={config.landingBackground} 
          as="image" 
          type="image/jpeg"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PerformanceMonitor />
        <div className="min-h-screen bg-base-100">
          <Header resumeData={resumeData} />
          <main>
            {children}
          </main>
          <Footer resumeData={resumeData} />
        </div>
      </body>
    </html>
  );
}
