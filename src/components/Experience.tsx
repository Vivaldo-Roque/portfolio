import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Experience: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="experience" className="mt-100 pt-50 pb-50">
      <h2 id="experience_title">{t('experience_title')}</h2>

      <div className="row-s row-m" style={{ width: '80%' }}>
        <div className="timeline">
          <div className="timeline-container">
            <div className="timeline-date">
              <p>0-0</p>
            </div>
            <div className="timeline-icon">
              <i className="time-icon fa-solid fa-briefcase"></i>
            </div>
            <div className="timeline-body">
              <h3>No experience</h3>
              <h4>No job</h4>
              <ul>
                <li>No experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h2 id="education_title">{t('education_title')}</h2>

      <div className="row-s row-m mb" style={{ width: '80%' }}>
        <div className="timeline">
          <div className="timeline-container">
            <div className="timeline-date">
              <p>2025-2027</p>
            </div>
            <div className="timeline-icon">
              <i className="time-icon fa-solid fa-graduation-cap"></i>
            </div>
            <div className="timeline-body">
              <h3 id="edu1_name">{t('edu1_name')}</h3>
              <h4 id="edu1_degree">{t('edu1_degree')}</h4>
              <p id="edu1_period">{t('edu1_period')}</p>
            </div>
          </div>
          <div className="timeline-container">
            <div className="timeline-date">
              <p>2019-2023</p>
            </div>
            <div className="timeline-icon">
              <i className="time-icon fa-solid fa-graduation-cap"></i>
            </div>
            <div className="timeline-body">
              <h3 id="edu2_name">{t('edu2_name')}</h3>
              <h4 id="edu2_degree">{t('edu2_degree')}</h4>
              <p id="edu2_period">{t('edu2_period')}</p>
              <p id="edu2_note">{t('edu2_note')}</p>
            </div>
          </div>
          <div className="timeline-container">
            <div className="timeline-date">
              <p>2016-2018</p>
            </div>
            <div className="timeline-icon">
              <i className="time-icon fa-solid fa-school"></i>
            </div>
            <div className="timeline-body">
              <h3 id="edu3_name">{t('edu3_name')}</h3>
              <h4 id="edu3_degree">{t('edu3_degree')}</h4>
              <p id="edu3_period">{t('edu3_period')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
