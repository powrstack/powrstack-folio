import { Geist, Geist_Mono } from "next/font/google";
import { loadResumeData } from "../lib/resumeLoader";
import "../lib/fontawesome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="portfolio">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
