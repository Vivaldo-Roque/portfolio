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
    navCurrentActive();

    function navFollow() {
        // Use CSS `position: sticky` for the navbar to avoid layout thrashing.
        // Keep a minimal class toggle for optional visual effects (shadow).
        if (window.pageYOffset > sticky) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    }

    function navCurrentActive() {
        positions.forEach(function (position) {

            scrolled = document.scrollingElement.scrollTop;

            // Adjusted for scroll-padding-top and navbar height
            if (scrolled + 200 <= position.offset.bottom && scrolled + 100 >= position.offset.top) {

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
