var sticky;

function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft, bottom: rect.bottom + scrollTop }
}

document.addEventListener("onresize", function(){
    sticky = offset(document.getElementById("nav")).top;
    document.getElementById("nav").classList.remove("sticky");
});


// for scrolling
document.addEventListener("DOMContentLoaded", function (event) {

    var scrollpos = localStorage.getItem('scrollpos');

    if(scrollpos != null){
        window.scrollTo(0, scrollpos);
    }

    sticky = offset(document.getElementById("nav")).top;
    document.getElementById("listLanguages").style.top = `${document.getElementById("home").scrollHeight + document.getElementById("nav").offsetHeight}px`;

});

window.addEventListener("beforeunload", function (e) {
    this.localStorage.setItem('scrollpos', window.scrollY);
    localStorage.removeItem('navpos');
    document.getElementById("nav").classList.remove("sticky");
});

window.addEventListener("load", () => {

    var navbar = document.getElementById("nav");

    var content = document.getElementsByClassName("content-wrap")[0];


    var mobileMenu = document.getElementById("mobileMenu");

    mobileMenu.addEventListener('click', function () {

        var x = document.getElementById("navLinks");

        if (x.style.maxHeight) {
            x.style.maxHeight = null;
            document.getElementById("nav").style.height = `${0}px`;
        } else {
            document.getElementById("nav").style.height = x.style.maxHeight = x.scrollHeight + 40 + "px";
        }

        navFollow();

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
    // Section active detection handled by IntersectionObserver below

    function navFollow() {
        // Use CSS `position: sticky` for the navbar to avoid layout thrashing.
        // Keep a minimal class toggle for optional visual effects (shadow).
        if (window.pageYOffset > sticky) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    }

    // Use IntersectionObserver to reliably detect which section is visible
    function initSectionObserver() {
        var sectionIds = ['home', 'about', 'skills', 'works', 'experience', 'contact'];

        // Map section id -> nav element id (nav + section)
        function navForSection(id) { return document.getElementById('nav' + id); }

        var currentlyActive = null;

        var observer = new IntersectionObserver(function (entries) {
            // Find the entry with greatest intersectionRatio that is intersecting
            var best = null;
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
                }
            });

            if (best) {
                var id = best.target.id;
                var navEl = navForSection(id);

                if (currentlyActive && currentlyActive !== navEl) {
                    currentlyActive.classList.remove('active');
                }

                if (navEl && !navEl.classList.contains('active')) {
                    navEl.classList.add('active');
                    currentlyActive = navEl;
                }
            }
        }, {
            root: null,
            threshold: [0.25, 0.5, 0.75]
        });

        sectionIds.forEach(function (id) {
            var section = document.getElementById(id);
            if (section) observer.observe(section);
        });
    }

    window.onscroll = function (e) {
        navFollow();
    }

    // initialize observer after load
    initSectionObserver();

});
