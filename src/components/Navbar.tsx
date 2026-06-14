import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Navbar: React.FC = () => {
  const { language, t } = useLanguage();
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLUListElement>(null);

  const sections = ['home', 'works', 'skills', 'about', 'experience', 'contact'];

  useEffect(() => {
    const handleScroll = () => {
      // Sticky logic
      const homeSection = document.getElementById('home');
      if (homeSection) {
        const stickyThreshold = homeSection.offsetHeight;
        if (window.scrollY > stickyThreshold) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }

      // Active section tracking logic
      const scrollPosition = window.scrollY + 250; // offset for navbar height/margins
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const bottom = top + element.offsetHeight;
          if (scrollPosition >= top && scrollPosition <= bottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getCvUrl = () => {
    return language === 'en' ? '/cv/vivaldo_roque_cv_en.pdf' : '/cv/vivaldo_roque_cv_pt.pdf';
  };

  return (
    <nav
      id="nav"
      ref={navRef}
      className={isSticky ? 'sticky' : ''}
      style={
        mobileMenuOpen && navLinksRef.current
          ? { height: `${navLinksRef.current.scrollHeight + 40}px` }
          : undefined
      }
    >
      <div className="col">
        <div className="row" style={{ alignItems: 'flex-end', justifyContent: 'end', width: '100%' }}>
          <button id="mobileMenu" className="icon" onClick={toggleMobileMenu}>
            <i className="fa fa-bars"></i>
          </button>
        </div>
        <div id="wrapper" className="row">
          <ul id="navLinks" ref={navLinksRef} style={mobileMenuOpen ? { maxHeight: 'none' } : undefined}>
            <li>
              <a
                id="navhome"
                href="#home"
                className={activeSection === 'home' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('navhome')}
              </a>
            </li>
            <li>
              <a
                id="navworks"
                href="#works"
                className={activeSection === 'works' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('portfolio')}
              </a>
            </li>
            <li>
              <a
                id="navskills"
                href="#skills"
                className={activeSection === 'skills' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('navskills')}
              </a>
            </li>
            <li>
              <a
                id="navabout"
                href="#about"
                className={activeSection === 'about' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('navabout')}
              </a>
            </li>
            <li>
              <a
                id="navexperience"
                href="#experience"
                className={activeSection === 'experience' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('navexperience')}
              </a>
            </li>
            <li>
              <a
                id="navcontact"
                href="#contact"
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('navcontact')}
              </a>
            </li>
            <li id="fleft">
              <a id="navcv" href={getCvUrl()} download="vivaldo_roque_cv.pdf">
                DOWNLOAD CV
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
