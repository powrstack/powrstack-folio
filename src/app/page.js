import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";
import { loadResumeData } from '../lib/resumeLoader';

export default async function Home() {
  const resumeData = await loadResumeData();

  return (
    <>
      <Hero resumeData={resumeData} />
      <ContactForm resumeData={resumeData} />
    </>
  );
}
