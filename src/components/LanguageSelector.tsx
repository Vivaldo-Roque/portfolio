import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, languagesData } = useLanguage();

  if (!languagesData) return null;

  return (
    <select
      id="listLanguages"
      value={language}
      onChange={(e) => setLanguage(e.target.value as 'en' | 'pt')}
    >
      {Object.keys(languagesData).map((key) => (
        <option key={key} value={key}>
          {languagesData[key].langdesc}
        </option>
      ))}
    </select>
  );
};
