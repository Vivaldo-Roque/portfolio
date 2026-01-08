window.previousWidth
window.previousHeight

const enCvUrl = "./cv/vivaldo_roque_cv_en.pdf";
const ptCvUrl = "./cv/vivaldo_roque_cv_pt.pdf";

window.addEventListener("DOMContentLoaded", () => {

  var xmlhttp = new XMLHttpRequest();
  // var testRoot = "http://127.0.0.1:5500";
  var root = `${window.location.origin}`;
  var languageFileUrl = root + "/languages.json";

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.languages = JSON.parse(this.responseText);

      window.selectedLanguage = localStorage.getItem("lang") ?? navigator.languages.lastChild;

      setLanguage(window.selectedLanguage);
      initList();
      //refreshLabels();

      var downloadButton = document.getElementById("navcv");

      if (window.selectedLanguage == "en") {
        downloadButton.href = enCvUrl;
      } else if (window.selectedLanguage == "pt") {
        downloadButton.href = ptCvUrl;
      }

      // Load projects.json
      var xmlhttp2 = new XMLHttpRequest();
      var projectsFileUrl = root + "/projects.json";
      xmlhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          window.projects = JSON.parse(this.responseText);
          populateProjects();
        }
      };
      xmlhttp2.open("GET", projectsFileUrl, true);
      xmlhttp2.send();
    }
  };

  xmlhttp.open("GET", languageFileUrl, true);
  xmlhttp.send();

});

// document.addEventListener("contextmenu", (e) => {
//   e.preventDefault();
// }, false);

// document.addEventListener("keydown", (e) => {
//   // USE THIS TO DISABLE CONTROL AND ALL FUNCTION KEYS
//   // if (e.ctrlKey || (e.keyCode>=112 && e.keyCode<=123)) {
//   // THIS WILL ONLY DISABLE CONTROL AND F12
//   if (e.ctrlKey || e.keyCode==123) {
//     e.stopPropagation();
//     e.preventDefault();
//   }
// });

function setLanguage(langcode) {

  // check if language code <langcode> does not exist in available translations in json file
  // For example, available translated texts in json are 'en' and 'fr', but client language is 'es'
  if (!languages.hasOwnProperty(langcode)) {
    // doesn't exist so default to the first available language, i.e. the top-most language in json file

    // NOTE: the order of properties in a JSON object are not *guaranteed* to be the same as loading time,
    // however in practice all browsers do return them in order
    for (var key in languages) {
      if (languages.hasOwnProperty(key)) {
        langcode = key; // take the first language code
        break;
      };
    };
  };

  // set as selected language code
  window.selectedLanguage = langcode;
  localStorage.setItem("lang", window.selectedLanguage);
};

window.getLanguage = function (key) {
  // get key phrase
  var str;

  // check if any languages were loaded
  if (window.languages[window.selectedLanguage]) str = window.languages[window.selectedLanguage][key];

  // if key does not exist, return the literal key
  str = (str || null);

  return str;
}

function langSelectChange(value) {
  // switch to selected language code
  setLanguage(value);

  // refresh labels
  refreshLabels();

  var downloadButton = document.getElementById("navcv");

  if (window.selectedLanguage == "en") {
    downloadButton.href = enCvUrl;
  } else if (window.selectedLanguage == "pt") {
    downloadButton.href = ptCvUrl;
  }

  // Refresh projects with new language
  populateProjects();
}

function initList() {
  // get language list element
  var list = document.getElementById("listLanguages");
  // clear all options
  list.options.length = 0;

  // add all available languages
  for (var key in window.languages) {
    // create new language option
    var lang = document.createElement("option");
    lang.value = key;
    lang.innerHTML = window.languages[key]['langdesc'];

    // append to select element
    list.appendChild(lang);
  }

  list.value = window.selectedLanguage;

  document.addEventListener('input', function (event) {

    // Only run on our select menu
    if (event.target.id !== 'listLanguages') return;

    langSelectChange(event.target.value);
    console.log(event.target.value);

  }, false);

  refreshLabels();
}

function refreshLabels() {

  // Basically do the following for all document elements:
  //document.getElementById("Options").textContent = multilang.get("Options");

  // loop through all document elements
  var allnodes = document.body.querySelectorAll('*[id]')

  for (var i = 0, max = allnodes.length; i < max; i++) {
    // get id current elements
    var idname = allnodes[i].id;

    // if id exists, set get id current elements
    if (idname != '' && getLanguage(idname) != null) {
      allnodes[i].textContent = getLanguage(idname);
    };
  };

  //Extra
  window.textChangingTexts = [
    window.getLanguage("text_changing1"),
    window.getLanguage("text_changing2"),
    window.getLanguage("text_changing3")
  ];

}

window.addEventListener('resize', function () {

  // Get the current window size
  var currentWidth = window.innerWidth;
  var currentHeight = window.innerHeight;

  // Check if the window size has changed
  if (currentWidth !== window.previousWidth || currentHeight !== window.previousHeight) {
    // Do something when the window size changes
    // Reload the page
    if (deviceType() == 'desktop') {
      location.reload();
    }
  }

  // Save the current window size
  window.previousWidth = currentWidth;
  window.previousHeight = currentHeight;
});

window.onorientationchange = function () {
  var orientation = window.orientation;
  switch (orientation) {
    case 0:
    case 90:
    case -90: window.location.reload();
      break;
  }
};

function populateProjects() {
  if (!window.projects) return;
  
  const container = document.getElementById('projects-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  window.projects.forEach((project, index) => {
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
}

const deviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
};