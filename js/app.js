window.previousWidth
window.previousHeight

const enCvUrl = "./cv/vivaldo_roque_cv_en.pdf";
const ptCvUrl = "./cv/vivaldo_roque_cv_pt.pdf";

window.addEventListener("DOMContentLoaded", () => {

  var xmlhttp = new XMLHttpRequest();
  // var testRoot = "http://127.0.0.1:5500";
  var root = "https://Vivaldo-Roque.github.io/portfolio";
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