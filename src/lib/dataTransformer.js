/**
 * Transforms JSON Resume format to our component format
 * @param {Object} jsonResume - JSON Resume format data
 * @returns {Object} - Transformed data for our components
 */
export function transformResumeData(jsonResume) {
  const { basics, work, education, certificates, skills, projects, interests, publications } = jsonResume;
  
  return {
    personalInfo: {
      name: basics.name,
      title: basics.label,
      tagline: "Building exceptional digital experiences", // You can customize this
      email: basics.email,
      phone: basics.phone,
      location: `${basics.location.city}, ${basics.location.country}`,
      website: basics.url,
      profileImage: `/${basics.picture.replace('.png', '.svg')}`,
      backgroundImage: "/hero-bg.jpg", // Add if you have one
      summary: basics.summary,
      cvUrl: "/resume.pdf",
      social: {
        github: basics.profiles.find(p => p.network === "GitHub")?.url,
        linkedin: basics.profiles.find(p => p.network === "LinkedIn")?.url,
        dev: basics.profiles.find(p => p.network === "DEV Community")?.url,
      }
    },
    about: {
      bio: basics.summary,
      skills: skills?.map(skill => ({
        name: skill.name,
        icon: skill.x_icon,
        description: skill.x_description
      })) || [],
      skillNames: skills?.map(skill => skill.name) || [],
      interests: interests?.map(interest => interest.name) || []
    },
    education: education?.map(edu => ({
      degree: `${edu.studyType} in ${edu.area}`,
      institution: edu.institution,
      year: `${new Date(edu.startDate).getFullYear()}-${edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}`,
      description: edu.courses?.join(', ') || '',
      courses: edu.courses || []
    })) || [],
    certifications: certificates?.map(cert => ({
      name: cert.name,
      issuer: cert.issuer,
      date: new Date(cert.startDate).getFullYear().toString(),
      credentialId: cert.url ? 'View Certificate' : '',
      url: cert.url
    })) || [],
    experience: work?.map(job => ({
      title: job.position,
      company: job.company,
      duration: `${new Date(job.startDate).getFullYear()} - ${job.endDate ? new Date(job.endDate).getFullYear() : 'Present'}`,
      location: job.location,
      description: job.highlights?.[0] || '',
      technologies: [], // You can enhance this based on job descriptions
      achievements: job.highlights || []
    })) || [],
    projects: projects?.map(project => ({
      name: project.name,
      description: project.description,
      technologies: project.keywords || [],
      url: project.url,
      github: project.url, // Enhance this if you have separate GitHub URLs
      type: project.type || 'Web Application',
      startDate: project.startDate,
      highlights: project.highlights || []
    })) || [],
    publications: publications?.map(pub => ({
      name: pub.name,
      summary: pub.summary,
      type: pub.type || 'Article',
      publisher: pub.publisher,
      releaseDate: pub.releaseDate,
      url: pub.url,
      keywords: pub.keywords || [],
      highlights: pub.highlights || []
    })) || [],
    // Legacy support for existing components
    workExperience: work?.map(job => ({
      title: job.position,
      company: job.company,
      duration: `${new Date(job.startDate).getFullYear()} - ${job.endDate ? new Date(job.endDate).getFullYear() : 'Present'}`,
      startDate: job.startDate,
      endDate: job.endDate,
      location: job.location,
      description: job.summary || job.highlights?.[0] || '',
      responsibilities: job.highlights || [],
      logo: job.company ? `/images/${job.company.toLowerCase().replace(/\s+/g, '')}.svg` : null
    })) || [],
    // Additional data structures
    basics: {
      name: basics.name,
      label: basics.label,
      email: basics.email,
      phone: basics.phone,
      url: basics.url,
      summary: basics.summary,
      location: basics.location,
      profiles: basics.profiles || []
    },
    skills: {
      technical: skills?.filter(s => s.level && ['Expert', 'Advanced', 'Intermediate'].includes(s.level)) || [],
      tools: skills?.filter(s => !s.level || !['Expert', 'Advanced', 'Intermediate'].includes(s.level)) || [],
      soft: interests?.filter(i => i.keywords?.some(k => ['leadership', 'communication', 'teamwork', 'problem-solving'].includes(k.toLowerCase()))) || []
    },
    stats: {
      totalExperience: work?.length ? `${Math.max(...work.map(job => {
        const start = new Date(job.startDate).getFullYear();
        const end = job.endDate ? new Date(job.endDate).getFullYear() : new Date().getFullYear();
        return end - start;
      }))} years` : '0 years',
      totalProjects: projects?.length || 0,
      totalArticles: publications?.length || 0
    },
    blog: publications || [] // Legacy support
  };
}
