window.addEventListener("load", () => {

    var navbar = document.getElementById("nav");

    var sticky = navbar.offsetTop;

    var headerSize = document.getElementById("home").offsetHeight;

    var content = document.getElementsByClassName("content-wrap")[0];

    var contentPadding = content.style.paddingTop;

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

    function offset(el) {
        var rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft, bottom: rect.bottom + scrollTop }
    }

    function headerFollow() {
        if (window.pageYOffset > sticky + headerSize) {
            navbar.classList.add("sticky");
            content.style.paddingTop = `${navbar.offsetHeight}px`;
        } else {
            navbar.classList.remove("sticky");
            content.style.paddingTop = contentPadding;
        }
    }

    window.onscroll = function (e) {

        headerFollow();

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

});