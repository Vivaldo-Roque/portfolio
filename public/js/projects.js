/**
 * Projects Management Module
 * Handles project loading, filtering, and rendering
 */

// Initialize project-related variables
window.selectedProjectType = window.selectedProjectType || 'all';

/**
 * Set the project type filter
 * @param {string} value - The project type to filter by
 */
function setProjectType(value) {
  window.selectedProjectType = value;
  window.currentPage = 1; // Reset to first page when filter changes
  populateProjects();
}

/**
 * Populate the projects container with filtered and paginated projects
 */
function populateProjects() {
  if (!window.projects) return;

  const container = document.getElementById('projects-container');
  const select = document.getElementById('projectTypeFilter');
  if (select) select.value = window.selectedProjectType || 'all';
  if (!container) return;

  container.innerHTML = '';

  const selectedType = window.selectedProjectType || 'all';

  // Filter projects first
  const filteredProjects = window.projects.filter(project => {
    return selectedType === 'all' || project.type === selectedType;
  });

  // Reverse order to show most recent first (descending order)
  filteredProjects.reverse();

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / window.projectsPerPage);
  const startIndex = (window.currentPage - 1) * window.projectsPerPage;
  const endIndex = startIndex + window.projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  // Render projects
  paginatedProjects.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'row row-m mb-100 card';
    if (index === 0) card.classList.add('mt-100');
    card.style.width = '80%';

    // Image
    const img = document.createElement('img');
    img.className = 'showcase';
    img.src = project.image;
    img.height = 500;
    img.width = 500;
    img.alt = 'demo_' + project.id;
    img.style.objectFit = 'contain';
    card.appendChild(img);

    // Content
    const content = document.createElement('div');
    content.style.height = '100%';

    // Row for title and links
    const row = document.createElement('div');
    row.className = 'row';

    const h2 = document.createElement('h2');
    const langKey = project.langKey || project.id;
    const titleKey = project.id + '_title';
    h2.textContent = getLanguage(titleKey) || project.id.replace(/_/g, ' ').toUpperCase();
    row.appendChild(h2);

    // Links
    project.links.forEach(link => {
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = link.url;
      a.style.marginLeft = '10px';
      a.style.marginRight = '10px';

      if (link.type === 'image') {
        const imgLink = document.createElement('img');
        imgLink.height = 60;
        imgLink.width = 150;
        imgLink.alt = link.alt;
        imgLink.src = link.src;
        a.appendChild(imgLink);
      } else if (link.type === 'link') {
        a.style.fontSize = '1.5rem';
        a.style.textDecoration = 'none';
        const i = document.createElement('i');
        i.className = link.icon;
        a.appendChild(i);
        const linkText = getLanguage(link.textKey) || link.textKey;
        a.appendChild(document.createTextNode(' ' + linkText));
      }

      row.appendChild(a);
    });

    content.appendChild(row);

    // Description
    const pDesc = document.createElement('p');
    pDesc.style.fontWeight = '500';
    const descKey = langKey + '_desc';
    pDesc.textContent = getLanguage(descKey) || '';
    content.appendChild(pDesc);

    // Features
    const pFeatures = document.createElement('p');
    pFeatures.style.fontWeight = 'bold';
    pFeatures.textContent = getLanguage('features') + ':';
    content.appendChild(pFeatures);

    const ulFeatures = document.createElement('ul');
    ulFeatures.className = 'list';

    let featureIndex = 1;
    let hasFeature = true;
    while (hasFeature) {
      const featureKey = langKey + '_features' + featureIndex;
      const featureText = getLanguage(featureKey);
      if (featureText) {
        const li = document.createElement('li');
        li.innerHTML = featureText + '<br><br>';
        ulFeatures.appendChild(li);
        featureIndex++;
      } else {
        hasFeature = false;
      }
    }

    content.appendChild(ulFeatures);

    // Tools
    const pTools = document.createElement('p');
    pTools.style.fontWeight = 'bold';
    pTools.textContent = getLanguage('tools') + ':';
    content.appendChild(pTools);

    const ulTools = document.createElement('ul');
    ulTools.className = 'list';

    let toolIndex = 1;
    let hasTool = true;
    while (hasTool) {
      const toolKey = langKey + '_tools' + toolIndex;
      const toolText = getLanguage(toolKey);
      if (toolText) {
        const li = document.createElement('li');
        li.innerHTML = toolText + '<br><br>';
        ulTools.appendChild(li);
        toolIndex++;
      } else {
        hasTool = false;
      }
    }

    content.appendChild(ulTools);

    card.appendChild(content);
    container.appendChild(card);
  });

  // Update pagination controls
  updatePaginationControls(filteredProjects.length, totalPages);
}

/**
 * Populate the filter dropdown options based on available project types
 */
function populateFilterOptions() {
  if (!window.projects) return;

  const select = document.getElementById('projectTypeFilter');
  if (!select) return;

  select.innerHTML = '';

  // Add "All" option
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.id = 'type_all';
  allOption.textContent = getLanguage('type_all') || 'All';
  select.appendChild(allOption);

  // Get unique types
  const types = new Set();
  window.projects.forEach(project => {
    if (project.type) {
      types.add(project.type);
    }
  });

  // Add options for each type
  types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.id = 'type_' + type;
    option.textContent = getLanguage('type_' + type) || (type.charAt(0).toUpperCase() + type.slice(1));
    select.appendChild(option);
  });

  // Restore selection
  select.value = window.selectedProjectType || 'all';
}

/**
 * Load projects from JSON file
 */
function loadProjects() {
  const root = `${window.location.origin}`;
  const projectsFileUrl = root + "/projects.json";
  
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.projects = JSON.parse(this.responseText);
      populateFilterOptions();
      populateProjects();
    }
  };
  xmlhttp.open("GET", projectsFileUrl, true);
  xmlhttp.send();
}
