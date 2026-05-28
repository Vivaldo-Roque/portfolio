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

    var sectionIds = ['home', 'about', 'skills', 'works', 'experience', 'contact'];
    var sectionsInfo = [];
    var currentlyActive = null;

    navFollow();

    function navFollow() {
        // Use CSS `position: sticky` for the navbar to avoid layout thrashing.
        // Keep a minimal class toggle for optional visual effects (shadow).
        if (window.pageYOffset > sticky) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    }

    // Compute sections' absolute centers after layout and on resize
    function computeSectionsInfo() {
        sectionsInfo = sectionIds.map(function (id) {
            var el = document.getElementById(id);
            var navEl = document.getElementById('nav' + id);
            if (!el) return null;
            var rect = el.getBoundingClientRect();
            var top = rect.top + window.scrollY;
            var bottom = rect.bottom + window.scrollY;
            var center = top + (bottom - top) / 2;
            return { id: id, el: el, top: top, bottom: bottom, center: center, nav: navEl };
        }).filter(Boolean);
    }

    // Choose the section whose center is closest to viewport center
    function updateActiveByViewportCenter() {
        if (!sectionsInfo.length) return;
        var viewportCenter = window.scrollY + window.innerHeight / 2;
        var best = null;
        var bestDist = Infinity;
        sectionsInfo.forEach(function (s) {
            var d = Math.abs(s.center - viewportCenter);
            if (d < bestDist) { bestDist = d; best = s; }
        });

        if (best) {
            var navEl = best.nav;
            if (currentlyActive && currentlyActive !== navEl) {
                currentlyActive.classList.remove('active');
            }
            if (navEl && !navEl.classList.contains('active')) {
                navEl.classList.add('active');
                currentlyActive = navEl;
            }
        }
    }

    // throttle scroll handling using requestAnimationFrame
    var ticking = false;
    window.addEventListener('scroll', function (e) {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                navFollow();
                updateActiveByViewportCenter();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // compute positions and initialize
    computeSectionsInfo();
    updateActiveByViewportCenter();

    // recompute on resize (debounced via rAF)
    var resizeTick = false;
    window.addEventListener('resize', function () {
        if (!resizeTick) {
            window.requestAnimationFrame(function () {
                computeSectionsInfo();
                updateActiveByViewportCenter();
                resizeTick = false;
            });
            resizeTick = true;
        }
    });

});
