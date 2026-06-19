import { createFileRoute } from "@tanstack/react-router";
import FloatingNav from "@/components/portfolio/FloatingNav";
import Hero from "@/components/portfolio/Hero";
import OriginStory from "@/components/portfolio/OriginStory";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import About from "@/components/portfolio/About";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import SectionDivider from "@/components/portfolio/SectionDivider";

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
