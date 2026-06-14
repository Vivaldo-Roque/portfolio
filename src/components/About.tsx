import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="mt-200">
      <div className="row row-m">
        <img id="about-img" src="/img/me/me1.jpg" height="400px" width="300px" alt="me" />

        <div id="about_content" style={{ height: '100%' }}>
          <h2 id="about_me_title">{t('about_me_title')}</h2>

          <p id="about_me_p1" className="lead">
            {t('about_me_p1')}
          </p>

          <p id="about_me_p2" style={{ whiteSpace: 'pre-line' }}>
            {t('about_me_p2')}
          </p>

          <p id="about_me_p3">{t('about_me_p3')}</p>

          <div id="about-buttons" className="row-s">
            <a id="btn_contact_me" href="#contact" className="button-rect-highlight" style={{ marginRight: '1.5rem' }}>
              {t('btn_contact_me')}
            </a>
            <a id="btn_see_portfolio" href="#works" className="button-rect-highlight">
              {t('btn_see_portfolio')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
