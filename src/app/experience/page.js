import { loadResumeData } from '@/lib/resumeLoader';
import WorkExperienceTimeline from '@/components/WorkExperienceTimeline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata() {
  try {
    const resumeData = await loadResumeData();
    const { personalInfo } = resumeData;
    
    return {
      title: `Experience - ${personalInfo.name}`,
      description: `Professional work experience and career journey of ${personalInfo.name} - ${personalInfo.title}.`,
    };
  } catch (error) {
    return {
      title: "Experience - Developer Portfolio",
      description: "Professional work experience and career journey.",
    };
  }
}

export default async function ExperiencePage() {
  const transformedData = await loadResumeData();

  return (
    <div className="min-h-screen bg-base-100">
      <Header resumeData={transformedData} />
      
      {/* Hero Section */}
      <section className="hero min-h-[50vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-base-content mb-6">
              Professional
              <span className="text-primary ml-2">Experience</span>
            </h1>
            <p className="text-xl text-base-content/70 mb-8">
              A comprehensive overview of my professional journey, skills developed, and impact made across different organizations and projects.
            </p>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-value text-primary">{transformedData.workExperience?.length || 0}</div>
                <div className="stat-title">Positions</div>
              </div>
              <div className="stat">
                <div className="stat-value text-secondary">{transformedData.stats?.totalExperience || 'N/A'}</div>
                <div className="stat-title">Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <WorkExperienceTimeline experience={transformedData.experience} />
      
      <Footer resumeData={transformedData} />
    </div>
  );
}
