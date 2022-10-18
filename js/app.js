var selectedLanguage;

var languages;

window.addEventListener("DOMContentLoaded", () => {

  var xmlhttp = new XMLHttpRequest();
  var url = "https://Vivaldo-Roque.github.io/Portfolio/languages.json";

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      languages = JSON.parse(this.responseText);

      selectedLanguage = localStorage.getItem("lang") ?? navigator.languages.lastChild;

      setLanguage(selectedLanguage);
      initList();
      //refreshLabels();
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();

});

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
    selectedLanguage = langcode;
    localStorage.setItem("lang", selectedLanguage);
  };
  
  function getLanguage(key) {
    // get key phrase
    var str;
  
    // check if any languages were loaded
    if (languages[selectedLanguage]) str = languages[selectedLanguage][key];
  
    // if key does not exist, return the literal key
    str = (str || null);
  
    return str;
  };
  
  function langSelectChange(value) {
    // switch to selected language code
    setLanguage(value);
  
    // refresh labels
    refreshLabels();
  }

  function initList() {
    // get language list element
    var list = document.getElementById("listLanguages");
    // clear all options
    list.options.length = 0;
  
    // add all available languages
    for (var key in languages) {
      // create new language option
      var lang = document.createElement("option");
      lang.value = key;
      lang.innerHTML = languages[key]['langdesc'];
  
      // append to select element
      list.appendChild(lang);
    }
  
    list.value = selectedLanguage;
  
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
  }