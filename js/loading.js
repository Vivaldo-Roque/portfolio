//paste this code under the head tag or in a separate js file.
// Wait for window load

var body;

window.addEventListener('DOMContentLoaded', (event) => {
  body = document.getElementsByTagName("body")[0];
  body.style.overflow = "hidden";
});

window.addEventListener("load", function() { 
    // Animate loader off screen
    setTimeout(function (){
      fadeOut(document.getElementsByClassName("se-pre-con")[0]);
    }, 2500);
});

function fadeOut(el){
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();

  body.style.overflow = "visible";
};