import { loadResumeData } from '@/lib/resumeLoader';
import ProjectCard from '@/components/ProjectCard';
import ProjectFilters from '@/components/ProjectFilters';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata() {
  try {
    const resumeData = await loadResumeData();
    const { personalInfo } = resumeData;
    
    return {
      title: `Projects - ${personalInfo.name}`,
      description: `Explore the portfolio of projects by ${personalInfo.name} - ${personalInfo.title} showcasing web applications, mobile apps, and technical solutions.`,
    };
  } catch (error) {
    return {
      title: "Projects - Developer Portfolio",
      description: "Explore the portfolio of projects showcasing web applications, mobile apps, and technical solutions.",
    };
  }
}

export default async function ProjectsPage() {
  const transformedData = await loadResumeData();

  return (
    <div className="min-h-screen bg-base-100">
      <Header resumeData={transformedData} />
      
      {/* Hero Section */}
      <section className="hero min-h-[50vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-base-content mb-6">
              Featured
              <span className="text-primary ml-2">Projects</span>
            </h1>
            <p className="text-xl text-base-content/70 mb-8">
              A showcase of my technical projects, from web applications to mobile solutions. Each project represents a unique challenge solved with modern technologies.
            </p>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-value text-primary">{transformedData.projects?.length || 0}</div>
                <div className="stat-title">Projects</div>
              </div>
              <div className="stat">
                <div className="stat-value text-secondary">Multiple</div>
                <div className="stat-title">Technologies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <ProjectFilters />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {transformedData.projects?.map((project, index) => (
              <ProjectCard key={index} project={project} />
            )) || (
              <div className="col-span-full text-center">
                <p className="text-base-content/70">No projects to display.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer resumeData={transformedData} />
    </div>
  );
}
