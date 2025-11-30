import { Suspense } from 'react';
import { loadResumeData } from '@/lib/resumeLoader';
import ServerEducationCertificationTimeline from '@/components/ui/ServerEducationCertificationTimeline';
import Link from 'next/link';

export const metadata = {
  title: 'Education & Training | Portfolio',
  description: 'My educational background and academic journey',
  openGraph: {
    title: 'Education & Training',
    description: 'Educational background and academic qualifications',
    type: 'website',
  },
};

async function EducationPage() {
  const resumeData = await loadResumeData();

  return (
    <main className="min-h-screen bg-base-100 pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Link 
            href="/" 
            className="btn btn-ghost btn-sm mb-6 text-base-content/60 hover:text-base-content"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            Education & Training
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            My academic journey and educational qualifications that have shaped my expertise
          </p>
        </div>

        {/* Timeline Section */}
        <Suspense 
          fallback={
            <div className="flex justify-center items-center py-20">
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          }
        >
          <ServerEducationCertificationTimeline resumeData={resumeData} />
        </Suspense>
      </div>
    </main>
  );
}

export default EducationPage;