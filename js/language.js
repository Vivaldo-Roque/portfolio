/**
 * Language Management Module
 * Handles language loading, switching, and translation
 */

const enCvUrl = "./cv/vivaldo_roque_cv_en.pdf";
const ptCvUrl = "./cv/vivaldo_roque_cv_pt.pdf";

/**
 * Set the active language
 * @param {string} langcode - The language code to set
 */
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
}

/**
 * Get translated text for a key
 * @param {string} key - The translation key
 * @returns {string|null} The translated text or null if not found
 */
window.getLanguage = function (key) {
  // get key phrase
  var str;

  // check if any languages were loaded
  if (window.languages[window.selectedLanguage]) str = window.languages[window.selectedLanguage][key];

  // if key does not exist, return the literal key
  str = (str || null);

  return str;
}

/**
 * Handle language selection change
 * @param {string} value - The new language code
 */
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

/**
 * Initialize the language selector dropdown
 */
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

/**
 * Refresh all translatable labels in the document
 */
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

/**
 * Load languages from JSON file
 */
function loadLanguages() {
  var xmlhttp = new XMLHttpRequest();
  var root = `${window.location.origin}`;
  var languageFileUrl = root + "/languages.json";

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.languages = JSON.parse(this.responseText);

      window.selectedLanguage = localStorage.getItem("lang") ?? navigator.languages.lastChild;

      setLanguage(window.selectedLanguage);
      initList();

      var downloadButton = document.getElementById("navcv");

      if (window.selectedLanguage == "en") {
        downloadButton.href = enCvUrl;
      } else if (window.selectedLanguage == "pt") {
        downloadButton.href = ptCvUrl;
      }

      // Load projects after languages are ready
      loadProjects();
    }
  };

  xmlhttp.open("GET", languageFileUrl, true);
  xmlhttp.send();
}
