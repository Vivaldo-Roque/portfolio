import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Skill {
  name: string;
  imgUrl: string;
}

interface SkillCategory {
  titleKey: string;
  skills: Skill[];
}

export const Skills: React.FC = () => {
  const { t } = useLanguage();

  // Collapsible state for each index
  const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({
    0: true, // First category is open by default
  });

  const toggleCategory = (index: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const categories: SkillCategory[] = [
    {
      titleKey: 'skills_levels_subtitle1',
      skills: [
        { name: 'CSS3', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
        { name: 'HTML5', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'Javascript', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      ],
    },
    {
      titleKey: 'skills_levels_subtitle2',
      skills: [
        { name: 'C', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
        { name: 'C++', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
        { name: 'C#', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
        { name: 'Dart', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
        { name: 'Java', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'Python', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      ],
    },
    {
      titleKey: 'skills_levels_subtitle3',
      skills: [
        { name: 'Mysql', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'Sqlite', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
      ],
    },
    {
      titleKey: 'skills_levels_subtitle4',
      skills: [
        { name: 'Unity3D', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg' },
      ],
    },
    {
      titleKey: 'skills_levels_subtitle5',
      skills: [
        { name: 'Flutter', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
      ],
    },
    {
      titleKey: 'skills_levels_subtitle6',
      skills: [
        { name: 'Android SDK', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
        { name: 'Windows SDK', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg' },
        { name: 'Linux Toolchain', imgUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
      ],
    },
  ];

  return (
    <section id="skills" className="mt-200">
      <h2 id="skills_levels_title">{t('skills_levels_title')}</h2>

      <div className="col col-m">
        {categories.map((category, index) => {
          const isOpen = !!openStates[index];
          return (
            <React.Fragment key={index}>
              <h3
                className={`mt-50 collapsible-header ${isOpen ? 'open' : ''}`}
                onClick={() => toggleCategory(index)}
              >
                <div>{t(category.titleKey)}</div>
                <span className="arrow">⬇️</span>
              </h3>

              <div className={`collapsible-group ${isOpen ? 'open' : ''}`}>
                <div className="row col-m">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="col m-l-r glass-card">
                      <div className="skills">
                        <img alt={skill.name} src={skill.imgUrl} />
                      </div>
                      <strong>{skill.name}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
