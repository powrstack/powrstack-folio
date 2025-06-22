import { loadResumeData } from '../../lib/resumeLoader';
import Header from '../../components/Header';
import AboutHero from '../../components/AboutHero';
import EducationTimeline from '../../components/EducationTimeline';
import WorkExperienceTimeline from '../../components/WorkExperienceTimeline';
import SkillsSection from '../../components/SkillsSection';
import CertificationsSection from '../../components/CertificationsSection';

export async function generateMetadata() {
  try {
    const resumeData = await loadResumeData();
    const { personalInfo } = resumeData;
    
    return {
      title: `About - ${personalInfo.name}`,
      description: `Learn more about ${personalInfo.name}'s background, education, work experience, and technical skills as a ${personalInfo.title}.`,
    };
  } catch (error) {
    return {
      title: "About - Developer Portfolio",
      description: "Learn more about background, education, work experience, and technical skills.",
    };
  }
}

export default async function AboutPage() {
  const resumeData = await loadResumeData();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header resumeData={resumeData} />
      <AboutHero resumeData={resumeData} />
      <EducationTimeline education={resumeData.education} />
      <WorkExperienceTimeline experience={resumeData.experience} />
      <SkillsSection about={resumeData.about} skills={resumeData.about?.skillNames || []} />
      <CertificationsSection certifications={resumeData.certifications} />
    </div>
  );
}
