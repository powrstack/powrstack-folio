import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Md. Abu Raihan Srabon - DevOps Engineer",
  description: "Experienced DevOps Engineer with over seven years in software engineering and team leadership. Specializing in DevOps transformations, system architecture, and automation.",
  keywords: "DevOps Engineer, Software Engineer, Java, Docker, Kubernetes, AWS, Jenkins, Python, Microservices",
  authors: [{ name: "Md. Abu Raihan Srabon" }],
  creator: "Md. Abu Raihan Srabon",
  openGraph: {
    title: "Md. Abu Raihan Srabon - DevOps Engineer",
    description: "Experienced DevOps Engineer specializing in DevOps transformations, system architecture, and automation.",
    url: "https://aburaihan-dev.github.io",
    siteName: "Abu Raihan Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Md. Abu Raihan Srabon - DevOps Engineer",
    description: "Experienced DevOps Engineer specializing in DevOps transformations, system architecture, and automation.",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
