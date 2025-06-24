import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";
import { loadResumeData } from '../lib/resumeLoader';
import config from '../masterConfig';
import { Suspense } from 'react';

// Loading component for better UX
function HeroSkeleton() {
  return (
    <div className="hero min-h-screen bg-base-200 animate-pulse">
      <div className="hero-content container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="text-center lg:text-left">
            <div className="h-16 bg-base-300 rounded mb-4"></div>
            <div className="h-8 bg-base-300 rounded mb-6"></div>
            <div className="h-12 bg-base-300 rounded"></div>
          </div>
          <div className="w-80 h-80 bg-base-300 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  const resumeData = await loadResumeData();
  
  const name = resumeData.basics?.name || 'Professional Portfolio';
  const title = resumeData.basics?.label || 'Software Developer';
  const summary = resumeData.basics?.summary || 'Experienced software developer passionate about creating innovative solutions.';
  const profileImage = resumeData.personalInfo?.profileImage || '/images/profile.jpg';
  const website = resumeData.basics?.url || 'https://mdaburaihan.pro';
  
  // Extract skill names from the nested skills structure
  const skillNames = [
    ...(resumeData.skills?.technical?.map(skill => skill.name) || []),
    ...(resumeData.skills?.tools?.map(skill => skill.name) || []),
    ...(resumeData.about?.skillNames || [])
  ];

  // Create optimized descriptions for different platforms
  const shortDescription = summary.length > 160 ? summary.substring(0, 157) + '...' : summary;
  const twitterDescription = summary.length > 200 ? summary.substring(0, 197) + '...' : summary;
  
  // Get social profiles
  const linkedinProfile = resumeData.basics?.profiles?.find(p => p.network === 'LinkedIn');
  const twitterProfile = resumeData.basics?.profiles?.find(p => p.network === 'Twitter' || p.network === 'X');
  const githubProfile = resumeData.basics?.profiles?.find(p => p.network === 'GitHub');
  
  return {
    title: `${name} - ${title}`,
    description: shortDescription,
    keywords: [
      'software developer',
      'portfolio',
      'web development',
      'full stack developer',
      'professional portfolio',
      name.toLowerCase().replace(/\s+/g, '-'),
      ...skillNames.slice(0, 10) // Limit keywords for better SEO
    ].join(', '),
    authors: [{ name, url: website }],
    creator: name,
    publisher: name,
    
    // Open Graph (Facebook, LinkedIn, and general)
    openGraph: {
      type: 'profile', // Changed to profile for personal portfolio
      locale: 'en_US',
      url: website,
      title: `${name} - ${title}`,
      description: shortDescription,
      siteName: `${name}'s Portfolio`,
      images: [
        {
          url: new URL(profileImage, website).toString(), // Ensure absolute URL
          width: 1200,
          height: 630,
          alt: `${name} - Professional ${title}`,
          type: 'image/jpeg',
        },
        {
          url: new URL(profileImage, website).toString(),
          width: 1200,
          height: 1200, // Square format for some platforms
          alt: `${name} - Professional ${title}`,
          type: 'image/jpeg',
        },
      ],
      // LinkedIn-specific Open Graph properties
      profile: {
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        username: linkedinProfile?.username,
      },
    },
    
    // Twitter/X Cards
    twitter: {
      card: 'summary_large_image',
      site: twitterProfile?.username ? `@${twitterProfile.username.replace('@', '')}` : undefined,
      creator: twitterProfile?.username ? `@${twitterProfile.username.replace('@', '')}` : undefined,
      title: `${name} - ${title}`,
      description: twitterDescription,
      images: {
        url: new URL(profileImage, website).toString(),
        alt: `${name} - Professional ${title}`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
      },
    },
    
    // Additional structured data for better platform support
    alternates: {
      canonical: website,
      languages: {
        'en-US': website,
      },
    },
    
    // Robots and indexing
    robots: {
      index: true,
      follow: true,
      nocache: false, // Allow caching for better performance
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Verification and additional meta
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      bing: process.env.BING_VERIFICATION,
    },
    
    // Additional metadata for rich snippets
    other: {
      // Mastodon-specific meta tags
      'fediverse:creator': resumeData.basics?.profiles?.find(p => p.network.toLowerCase().includes('mastodon'))?.username,
      
      // LinkedIn-specific optimization
      'linkedin:owner': linkedinProfile?.url,
      
      // Professional context
      'article:author': name,
      'article:section': 'Technology',
      'article:tag': skillNames.slice(0, 5).join(', '),
      
      // Schema.org structured data hints
      'schema:type': 'Person',
      'schema:name': name,
      'schema:jobTitle': title,
      'schema:url': website,
      'schema:image': new URL(profileImage, website).toString(),
      
      // Preload critical resources for better LCP
      'preload-background': `<${config.landingBackground}>; rel=preload; as=image`,
      'preload-profile': profileImage.startsWith('http') 
        ? `<${profileImage}>; rel=preload; as=image` 
        : `<${new URL(profileImage, website).toString()}>; rel=preload; as=image`,
      
      // DNS prefetch for external resources
      'dns-prefetch-github': '<https://raw.githubusercontent.com>; rel=dns-prefetch',
      'dns-prefetch-fonts': '<https://fonts.googleapis.com>; rel=dns-prefetch',
      
      // Resource hints for better performance
      'preconnect-github': '<https://raw.githubusercontent.com>; rel=preconnect',
      'preconnect-fonts': '<https://fonts.googleapis.com>; rel=preconnect; crossorigin',
    },
  };
}

export default async function Home() {
  // Start loading resume data immediately
  const resumeDataPromise = loadResumeData();
  
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroWithData resumeDataPromise={resumeDataPromise} />
      </Suspense>
      <Suspense fallback={<div className="min-h-96 bg-base-100 animate-pulse" />}>
        <ContactFormWithData resumeDataPromise={resumeDataPromise} />
      </Suspense>
    </>
  );
}

// Separate components to handle async data loading
async function HeroWithData({ resumeDataPromise }) {
  const resumeData = await resumeDataPromise;
  return <Hero resumeData={resumeData} priority={true} />;
}

async function ContactFormWithData({ resumeDataPromise }) {
  const resumeData = await resumeDataPromise;
  return <ContactForm resumeData={resumeData} />;
}
