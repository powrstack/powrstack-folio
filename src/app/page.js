import Header from "../components/Header";
import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";
import { loadResumeData } from '../lib/resumeLoader';

export default async function Home() {
  const resumeData = await loadResumeData();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header resumeData={resumeData} />
      <Hero resumeData={resumeData} />
      <ContactForm resumeData={resumeData} />
    </div>
  );
}
