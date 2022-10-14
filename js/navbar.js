// for scrolling
document.addEventListener("DOMContentLoaded", function (event) {
    var scrollpos = localStorage.getItem('scrollpos');
    window.scrollTo(0, scrollpos);
});

window.addEventListener("beforeunload", function (e) {
    this.localStorage.setItem('scrollpos', window.scrollY);
});

window.addEventListener("load", () => {

    var navbar = document.getElementById("nav");

    var sticky = navbar.offsetTop;

    var headerSize = document.getElementById("home").offsetHeight;

    var content = document.getElementsByClassName("content-wrap")[0];

    var contentPadding = content.style.paddingTop;

    var mobileMenu = document.getElementById("mobileMenu");

    mobileMenu.addEventListener('click', function () {

        var x = document.getElementById("navLinks");
        
      
        if (x.style.maxHeight) {
            x.style.maxHeight = null;
        } else {
            x.style.maxHeight = x.scrollHeight + "px";
        }
    });

    var positions = [
        { offset: offset(document.getElementById("home")), nav: document.getElementById("navhome") },
        { offset: offset(document.getElementById("about")), nav: document.getElementById("navabout") },
        { offset: offset(document.getElementById("skills")), nav: document.getElementById("navskills") },
        { offset: offset(document.getElementById("works")), nav: document.getElementById("navworks") },
        { offset: offset(document.getElementById("experience")), nav: document.getElementById("navexperience") },
        { offset: offset(document.getElementById("contact")), nav: document.getElementById("navcontact") }
    ];

    var scrolled;
    var saveLast;

    navFollow();
    navCurrentActive();

    function offset(el) {
        var rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft, bottom: rect.bottom + scrollTop }
    }

    function navFollow() {
        if (window.pageYOffset > sticky + headerSize) {
            navbar.classList.add("sticky");
            content.style.paddingTop = `${navbar.offsetHeight}px`;
        } else {
            navbar.classList.remove("sticky");
            content.style.paddingTop = contentPadding;
        }
    }

    function navCurrentActive() {
        positions.forEach(function (position) {

            scrolled = document.scrollingElement.scrollTop;

            if (scrolled + 140 <= position.offset.bottom && scrolled + 40 >= position.offset.top) {

                if (saveLast != undefined) {
                    saveLast.classList.remove(
                        'active');
                }

                position.nav.classList.add(
                    'active');

                saveLast = position.nav;
            }

        });
    }

    window.onscroll = function (e) {

        navFollow();
        navCurrentActive();

    }

});