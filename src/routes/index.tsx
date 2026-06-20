import { createFileRoute } from "@tanstack/react-router";
import FloatingNav from "@/components/portfolio/FloatingNav/FloatingNav";
import Hero from "@/components/portfolio/Hero/Hero";
import OriginStory from "@/components/portfolio/OriginStory/OriginStory";
import Skills from "@/components/portfolio/Skills/Skills";
import Projects from "@/components/portfolio/Projects/Projects";
import About from "@/components/portfolio/About/About";
import Contact from "@/components/portfolio/Contact/Contact";
import Footer from "@/components/portfolio/Footer/Footer";
import SectionDivider from "@/components/portfolio/SectionDivider/SectionDivider";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <FloatingNav />
      <Hero />
      <SectionDivider variant="leaf" />
      <About />
      <SectionDivider variant="circuit" />
      <OriginStory />
      <SectionDivider variant="leaf" />
      <Projects />
      <SectionDivider variant="circuit" />
      <Skills />
      <SectionDivider variant="leaf" />
      <Contact />
      <Footer />
    </main>
  );
}
