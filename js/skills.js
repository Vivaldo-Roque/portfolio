/**
 * Skills Module
 * Loads and renders skills dynamically from skills.json
 * Includes fallback data for offline/demo purposes
 */

console.log('📍 skills.js file loaded');

let skillsData = [];

// Fallback skills data (embedded, no network needed)
const FALLBACK_SKILLS = [
  {"id":"flutter","name":"Flutter","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg","level":"proficient"},
  {"id":"dart","name":"Dart","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg","level":"proficient"},
  {"id":"python","name":"Python","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg","level":"proficient"},
  {"id":"javascript","name":"JavaScript","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg","level":"proficient"},
  {"id":"django","name":"Django","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg","level":"intermediate"},
  {"id":"java","name":"Java","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg","level":"intermediate"},
  {"id":"firebase","name":"Firebase","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg","level":"intermediate"},
  {"id":"html5","name":"HTML5","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg","level":"intermediate"},
  {"id":"css3","name":"CSS3","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg","level":"intermediate"},
  {"id":"sqlite","name":"SQLite","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg","level":"familiar"},
  {"id":"android","name":"Android","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg","level":"familiar"},
  {"id":"getx","name":"GetX","icon":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg","level":"familiar"}
];

async function loadSkills() {
  try {
    console.log('🔄 Loading skills from skills.json...');
    const response = await fetch('./skills.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    skillsData = await response.json();
    console.log('✅ Skills loaded from skills.json:', skillsData.length, 'items');
  } catch (error) {
    console.warn('⚠️ Could not load skills.json, using fallback data:', error.message);
    skillsData = FALLBACK_SKILLS;
    console.log('✅ Using fallback skills:', skillsData.length, 'items');
  }
  
  renderSkills();
}

function renderSkills() {
  const container = document.getElementById('skills-container');
  console.log('🎨 Rendering skills... Container found:', !!container);
  
  if (!container) {
    console.error('❌ Container #skills-container not found!');
    return;
  }

  if (!skillsData || skillsData.length === 0) {
    console.error('❌ No skills data available!');
    return;
  }

  // Group skills by level
  const proficient = skillsData.filter(s => s.level === 'proficient');
  const intermediate = skillsData.filter(s => s.level === 'intermediate');
  const familiar = skillsData.filter(s => s.level === 'familiar');

  console.log('📊 Proficient:', proficient.length, 'Intermediate:', intermediate.length, 'Familiar:', familiar.length);

  container.innerHTML = '';

  if (proficient.length > 0) {
    container.appendChild(createSkillsGroup('proficient', proficient));
  }
  if (intermediate.length > 0) {
    container.appendChild(createSkillsGroup('intermediate', intermediate));
  }
  if (familiar.length > 0) {
    container.appendChild(createSkillsGroup('familiar', familiar));
  }

  // Initialize collapsibles for new elements
  if (window.initCollapsibles) {
    console.log('🔗 Initializing collapsibles');
    window.initCollapsibles();
  } else {
    console.warn('⚠️ initCollapsibles not available yet');
  }
}

function createSkillsGroup(level, skills) {
  const group = document.createElement('div');
  
  const header = document.createElement('h3');
  header.className = 'mt-50 collapsible-header open';
  
  const headerText = document.createElement('div');
  headerText.id = `skills_${level}`;
  headerText.textContent = getLocalizedLevelName(level);
  
  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  arrow.textContent = '⬇️';
  
  header.appendChild(headerText);
  header.appendChild(arrow);
  
  const collapsibleDiv = document.createElement('div');
  collapsibleDiv.className = 'collapsible-group open';
  
  const row = document.createElement('div');
  row.className = 'row col-m';
  
  skills.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'col m-l-r glass-card';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'skills';
    
    const img = document.createElement('img');
    img.alt = skill.name;
    img.src = skill.icon;
    
    iconDiv.appendChild(img);
    
    const name = document.createElement('strong');
    name.textContent = skill.name;
    
    const levelBadge = document.createElement('p');
    levelBadge.style.fontSize = '0.85em';
    levelBadge.style.marginTop = '0.5rem';
    levelBadge.style.color = 'var(--text-secondary, #888)';
    
    const levelLabel = document.createElement('span');
    levelLabel.id = `level_${skill.id}`;
    levelLabel.textContent = getLocalizedLevelName(level);
    
    levelBadge.appendChild(levelLabel);
    
    card.appendChild(iconDiv);
    card.appendChild(name);
    card.appendChild(levelBadge);
    
    row.appendChild(card);
  });
  
  collapsibleDiv.appendChild(row);
  
  group.appendChild(header);
  group.appendChild(collapsibleDiv);
  
  return group;
}

function getLocalizedLevelName(level) {
  // Check if we have language data loaded
  if (window.languages && window.selectedLanguage) {
    const langData = window.languages[window.selectedLanguage];
    const key = `skills_${level}`;
    if (langData && langData[key]) {
      return langData[key];
    }
  }
  
  // Fallback to English names
  const levelNames = {
    'proficient': 'Proficient',
    'intermediate': 'Intermediate',
    'familiar': 'Familiar'
  };
  return levelNames[level] || level;
}

function updateSkillsLanguage() {
  // This function is called when language changes
  // Re-render to get new localized names
  renderSkills();
}

// Load skills when DOM is ready
console.log('📍 Waiting for DOMContentLoaded...');
document.addEventListener('DOMContentLoaded', () => {
  console.log('✨ DOMContentLoaded fired, loading skills');
  loadSkills();
});

// Hook into language change - listen for the same input event that language.js uses
document.addEventListener('input', (event) => {
  if (event.target.id === 'listLanguages') {
    console.log('🌐 Language changed, updating skills');
    // Delay slightly to let language.js update first
    setTimeout(() => {
      updateSkillsLanguage();
    }, 50);
  }
});
