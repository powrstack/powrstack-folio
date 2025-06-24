import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";
import { loadResumeData } from '../lib/resumeLoader';

export async function generateMetadata() {
  const resumeData = await loadResumeData();
  
  const name = resumeData.basics?.name || 'Professional Portfolio';
  const title = resumeData.basics?.label || 'Software Developer';
  const summary = resumeData.basics?.summary || 'Experienced software developer passionate about creating innovative solutions.';
  const profileImage = resumeData.basics?.image || '/images/profile.jpg';
  const website = resumeData.basics?.url || 'https://mdaburaihan.pro';
  
  // Extract skill names from the nested skills structure
  const skillNames = [
    ...(resumeData.skills?.technical?.map(skill => skill.name) || []),
    ...(resumeData.skills?.tools?.map(skill => skill.name) || []),
    ...(resumeData.about?.skillNames || [])
  ];
  
  return {
    title: `${name} - ${title}`,
    description: summary,
    keywords: [
      'software developer',
      'portfolio',
      'web development',
      'full stack developer',
      name.toLowerCase().replace(/\s+/g, '-'),
      ...skillNames
    ].join(', '),
    authors: [{ name }],
    creator: name,
    publisher: name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: website,
      title: `${name} - ${title}`,
      description: summary,
      siteName: `${name}'s Portfolio`,
      images: [
        {
          url: profileImage,
          width: 1200,
          height: 630,
          alt: `${name} - ${title}`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} - ${title}`,
      description: summary,
      images: [profileImage],
      creator: resumeData.basics?.profiles?.find(p => p.network === 'Twitter')?.username || undefined,
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default async function Home() {
  const resumeData = await loadResumeData();

  return (
    <>
      <Hero resumeData={resumeData} />
      <ContactForm resumeData={resumeData} />
    </>
  );
}
