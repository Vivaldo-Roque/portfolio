import React, { useEffect, useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { TopScrollButton } from './components/TopScrollButton';
import { LanguageSelector } from './components/LanguageSelector';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Works } from './components/Works';
import { Skills } from './components/Skills';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { MusicPlayer } from './components/MusicPlayer';

const MainContent: React.FC = () => {
  const { languagesData } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [fadeout, setFadeout] = useState(false);

  useEffect(() => {
    if (languagesData) {
      // Simulate/trigger fade out once languages data is loaded
      setFadeout(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800); // match standard fadeOut time
      return () => clearTimeout(timer);
    }
  }, [languagesData]);

  return (
    <>
      {/* Loader screen */}
      {loading && (
        <div
          className="se-pre-con"
          style={{
            opacity: fadeout ? 0 : 1,
            transition: 'opacity 0.8s ease',
            pointerEvents: 'none'
          }}
        />
      )}

      <TopScrollButton />

      {/* Hero section */}
      <Home />

      {/* Language Selector */}
      <LanguageSelector />

      <div className="container">
        {/* Sticky navbar */}
        <Navbar />

        <div className="content-wrap">
          <main>
            {/* Works Section */}
            <Works />

            {/* Skills Section */}
            <Skills />

            {/* About Section */}
            <About />

            {/* Experience Section */}
            <Experience />

            {/* Contact Section */}
            <Contact />
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Music Player */}
      <MusicPlayer />
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}

export default App;
