import { loadResumeData } from '../../lib/resumeLoader';
import ServerWorkExperienceTimeline from '../../components/ui/ServerWorkExperienceTimeline';
import Link from 'next/link';

export async function generateMetadata() {
  try {
    const resumeData = await loadResumeData();
    const name = resumeData?.basics?.name || 'Professional';
    const workCount = resumeData?.work?.length || 0;
    
    return {
      title: `Work Experience - ${name}`,
      description: `Professional work experience timeline showcasing ${workCount}+ positions and career progression in software development and DevOps engineering.`,
      keywords: 'work experience, career timeline, professional history, software engineer, devops, career progression',
      openGraph: {
        title: `Work Experience - ${name}`,
        description: `Professional work experience timeline showcasing ${workCount}+ positions and career progression.`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Work Experience - ${name}`,
        description: `Professional work experience timeline showcasing ${workCount}+ positions and career progression.`,
      },
    };
  } catch (error) {
    return {
      title: 'Work Experience',
      description: 'Professional work experience timeline and career progression.',
    };
  }
}

export default async function ExperiencePage() {
  const resumeData = await loadResumeData();
  
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/" className="btn btn-ghost btn-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Work Experience
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            A chronological timeline of my professional journey, highlighting key roles, 
            achievements, and the technologies I've worked with throughout my career.
          </p>
        </div>
        <ServerWorkExperienceTimeline resumeData={resumeData} />
      </div>
    </div>
  );
}