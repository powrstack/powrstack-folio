import Header from "../components/Header";
import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import { loadResumeData } from '../lib/resumeLoader';

export default async function Home() {
  const resumeData = await loadResumeData();

  return (
    <div className="min-h-screen bg-base-100">
      <Header resumeData={resumeData} />
      <Hero resumeData={resumeData} />
      <ContactForm resumeData={resumeData} />
      <Footer resumeData={resumeData} />
    </div>
  );
}
