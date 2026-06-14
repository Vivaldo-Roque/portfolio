/**
 * Main Application Module
 * Handles initialization and core app functionality
 */

window.previousWidth;
window.previousHeight;

window.addEventListener("DOMContentLoaded", () => {
  // Load languages and initialize app
  loadLanguages();

  // Add project type filter listener
  document.addEventListener('input', function (event) {
    // Only run on our project type select
    if (event.target.id !== 'projectTypeFilter') return;

    setProjectType(event.target.value);

  }, false);
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
