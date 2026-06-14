import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ProjectLink {
  type: 'image' | 'link';
  url: string;
  src?: string;
  alt?: string;
  icon?: string;
  textKey?: string;
}

interface Project {
  id: string;
  langKey: string;
  type: string;
  image: string;
  links: ProjectLink[];
}

export const Works: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

  useEffect(() => {
    fetch('/projects.json')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Failed to load projects:', err));
  }, []);

  // Reset to page 1 when filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter((project) => {
    return filter === 'all' || project.type === filter;
  });

  // Most recent first
  const reversedProjects = [...filteredProjects].reverse();

  // Pagination calculation
  const totalPages = Math.ceil(reversedProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const paginatedProjects = reversedProjects.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToWorks();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToWorks();
    }
  };

  const scrollToWorks = () => {
    const worksSection = document.getElementById('works');
    if (worksSection) {
      worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get project types for filtering dropdown dynamically
  const projectTypes = Array.from(new Set(projects.map((p) => p.type)));

  // Helper to extract list items (features or tools) from translations
  const getTranslist = (prefix: string) => {
    const list: string[] = [];
    let index = 1;
    while (true) {
      const key = `${prefix}${index}`;
      const text = t(key);
      if (text && text !== key) {
        list.push(text);
        index++;
      } else {
        break;
      }
    }
    return list;
  };

  return (
    <section id="works" className="mt-200">
      <h2 id="works_titles">{t('works_titles')}</h2>

      <div id="projects-filters" className="row mt-20">
        <label htmlFor="projectTypeFilter" id="projects_filter_label">
          {t('projects_filter_label')}
        </label>
        <select id="projectTypeFilter" value={filter} onChange={handleFilterChange}>
          <option value="all">{t('type_all')}</option>
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {t(`type_${type}`) || type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div id="projects-container">
        {paginatedProjects.map((project, index) => {
          const titleKey = `${project.id}_title`;
          const descKey = `${project.langKey}_desc`;
          const features = getTranslist(`${project.langKey}_features`);
          const tools = getTranslist(`${project.langKey}_tools`);

          return (
            <div
              key={project.id}
              className={`row row-m mb-100 card ${index === 0 ? 'mt-100' : ''}`}
              style={{ width: '80%' }}
            >
              <img
                className="showcase"
                src={project.image}
                height={500}
                width={500}
                alt={`demo_${project.id}`}
                style={{ objectFit: 'contain' }}
              />

              <div style={{ height: '100%' }}>
                <div className="row">
                  <h2>{t(titleKey) || project.id.replace(/_/g, ' ').toUpperCase()}</h2>
                  {project.links.map((link, idx) => (
                    <a
                      key={idx}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={link.url}
                      style={{ marginLeft: '10px', marginRight: '10px' }}
                    >
                      {link.type === 'image' && link.src ? (
                        <img height={60} width={150} alt={link.alt} src={link.src} />
                      ) : (
                        <span style={{ fontSize: '1.5rem', textDecoration: 'none' }}>
                          <i className={link.icon}></i> {link.textKey ? t(link.textKey) : ''}
                        </span>
                      )}
                    </a>
                  ))}
                </div>

                <p style={{ fontWeight: 500 }}>{t(descKey)}</p>

                {features.length > 0 && (
                  <>
                    <p style={{ fontWeight: 'bold' }}>{t('features')}:</p>
                    <ul className="list">
                      {features.map((feature, fIdx) => (
                        <li key={fIdx} dangerouslySetInnerHTML={{ __html: `${feature}<br><br>` }}></li>
                      ))}
                    </ul>
                  </>
                )}

                {tools.length > 0 && (
                  <>
                    <p style={{ fontWeight: 'bold' }}>{t('tools')}:</p>
                    <ul className="list">
                      {tools.map((tool, tIdx) => (
                        <li key={tIdx} dangerouslySetInnerHTML={{ __html: `${tool}<br><br>` }}></li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {reversedProjects.length > projectsPerPage && (
        <div id="pagination-controls" className="pagination-controls" style={{ display: 'flex' }}>
          <button id="prev-page" className="pagination-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
            <i className="fas fa-chevron-left"></i>
            <span id="prev_page_text">{t('prev_page_text')}</span>
          </button>

          <span id="page-info" className="page-info">
            {(t('page_of') || 'Page {current} of {total}')
              .replace('{current}', String(currentPage))
              .replace('{total}', String(totalPages))}
          </span>

          <button id="next-page" className="pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
            <span id="next_page_text">{t('next_page_text')}</span>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </section>
  );
};
