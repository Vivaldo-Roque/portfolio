window.addEventListener("load", () => {

    var navbar = document.getElementById("nav");

    var sticky = navbar.offsetTop;
    
    var headerSize = document.getElementById("home").offsetHeight;

    var content = document.getElementsByClassName("content-wrap")[0];

    var contentPadding = content.style.paddingTop;

    function headerFollow() {
        if (window.pageYOffset > sticky + headerSize) {
            navbar.classList.add("sticky");
            content.style.paddingTop = `${navbar.offsetHeight}px`;
        } else {
            navbar.classList.remove("sticky");
            content.style.paddingTop = contentPadding;
        }
    }

    window.addEventListener("scroll", () => {
        headerFollow();
    });

});