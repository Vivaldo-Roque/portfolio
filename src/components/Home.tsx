import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BirdAnimation } from './BirdAnimation';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  
  // Text changing animation state
  const [roleIndex, setRoleIndex] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);
  const textchangingRef = useRef<HTMLHeadingElement>(null);

  // Caption click interaction state
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [captionStyle, setCaptionStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transition: 'opacity 2s ease',
    position: 'absolute'
  });

  const roles = [
    t('text_changing1') || 'WEB DEVELOPER',
    t('text_changing2') || 'SOFTWARE ENGINEER',
    t('text_changing3') || 'TECHNOLOGY GEEK'
  ];

  // Refresh roles on language switch
  useEffect(() => {
    setRoleIndex(0);
  }, [t('text_changing1')]);

  // Interval for changing roles
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setTextOpacity(0);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        // Fade in
        setTextOpacity(1);
      }, 400); // half of transition time (roughly)
    }, 2000);

    return () => clearInterval(interval);
  }, [roles.length]);

  // Handle header click to position the caption
  const handleHeaderClick = (event: React.MouseEvent<HTMLHeadingElement>) => {
    if (!headerRef.current) return;

    const rect = headerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - 70;
    const y = event.clientY - rect.top - 40;

    let left: string | number = `${x}px`;
    let top: string | number = `${y}px`;
    let right: string | number = 'auto';
    let bottom: string | number = 'auto';

    const headerWidth = headerRef.current.offsetWidth;
    const headerHeight = headerRef.current.offsetHeight;
    const centerX = headerWidth / 2;
    const centerY = headerHeight / 2;

    // Check borders and adjust (similar to original isOutside logic)
    if (x > centerX && y < centerY) {
      // Right top
      if (x + 140 > headerWidth) {
        right = '0px';
        left = 'auto';
      }
      if (y < 0) {
        top = '0px';
      }
    } else if (x > centerX && y > centerY) {
      // Right bottom
      if (x + 140 > headerWidth) {
        right = '0px';
        left = 'auto';
      }
      if (y + 40 > headerHeight) {
        bottom = '0px';
        top = 'auto';
      }
    } else if (x < centerX && y < centerY) {
      // Left top
      if (x < 0) {
        left = '0px';
      }
      if (y < 0) {
        top = '0px';
      }
    } else if (x < centerX && y > centerY) {
      // Left bottom
      if (x < 0) {
        left = '0px';
      }
      if (y + 40 > headerHeight) {
        bottom = '0px';
        top = 'auto';
      }
    }

    setCaptionStyle({
      left,
      top,
      right,
      bottom,
      opacity: 0.8,
      position: 'absolute'
    });

    // Fade out caption after 2 seconds
    const timeout = setTimeout(() => {
      setCaptionStyle((prev) => ({ ...prev, opacity: 0 }));
    }, 2000);

    return () => clearTimeout(timeout);
  };

  return (
    <header id="home" ref={headerRef} onClick={handleHeaderClick} style={{ position: 'relative' }}>
      <BirdAnimation />

      <div id="header_caption" style={captionStyle}>
        <caption>Serra da Leba, Angola</caption>
      </div>

      <div className="col">
        <h2>VIVALDO ROQUE</h2>

        <h3
          id="textchanging"
          ref={textchangingRef}
          style={{
            opacity: textOpacity,
            transition: 'opacity 0.4s ease-in-out'
          }}
        >
          {roles[roleIndex]}
        </h3>

        <div className="row">
          <a
            className="fa-brands fa-x-twitter social-button-rect"
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/vivaldo_roque"
          ></a>
          <a
            className="fa-brands fa-github social-button-rect"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/Vivaldo-Roque/"
          ></a>
          <a
            className="fa-brands fa-linkedin social-button-rect"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/vivaldoroque/"
          ></a>
        </div>

        <a id="portfolio" className="button-rect" href="#works">
          PORTFOLIO
        </a>
      </div>
    </header>
  );
};
