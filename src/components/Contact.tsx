import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contact">
      <div id="banner">
        <div className="parallax">
          <div className="col">
            <h2 id="banner_text">{t('banner_text')}</h2>
            <a
              target="_blank"
              rel="noopener noreferrer"
              id="banner_btn_text"
              href="https://github.com/Vivaldo-Roque/"
              className="button-rect"
            >
              {t('banner_btn_text')}
            </a>
          </div>
        </div>
      </div>

      <h2 id="banner_contact">{t('banner_contact')}</h2>

      <div className="col-l" style={{ justifyContent: 'space-between', height: '12rem' }}>
        <div className="row-l">
          <i className="fa-solid fa-map-marker"></i>
          <p>Angola, Ícolo e Bengo, Sequele, Centralidade do Sequele</p>
        </div>
        <div className="row-l">
          <a
            className="fa-solid fa-envelope"
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:2001vivaldo@gmail.com"
          ></a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:2001vivaldo@gmail.com"
            style={{ textDecoration: 'none' }}
          >
            2001vivaldo@gmail.com
          </a>
        </div>
        <div className="row-l">
          <a
            className="fa-brands fa-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            href="https://wa.me/244928994233"
          ></a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://wa.me/244928994233"
            style={{ textDecoration: 'none' }}
          >
            (+244) 928 994 233
          </a>
        </div>
      </div>
    </section>
  );
};
