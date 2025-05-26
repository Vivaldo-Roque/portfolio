var clicked = false;
var delayInMilliseconds = 2000;
var centerX = 0;
var centerY = 0;
var myTimeout;

window.addEventListener("DOMContentLoaded", () => {

    var header = document.getElementById("home");
    var caption = document.getElementById("header_caption");

    centerX = header.offsetWidth / 2;
    centerY = header.offsetHeight / 2;

    header.addEventListener('click', (event) => {

        clearTimeout(myTimeout);

        var x = event.offsetX - 70;
        var y = event.offsetY - 40;

        caption.style.left = `${x}px`;
        caption.style.top = `${y}px`;

        var out = isOutside(header, caption);

        if ((centerX < x) && (y < centerY)) {
            //Direita cima
            console.log("Direita cima")
            if (out.right) {
                caption.style.right = `0px`
                caption.style.left = `auto`
            }

            if (out.top) {
                caption.style.top = `0px`
                caption.style.bottom = `auto`
            }
        } else if ((centerX < x) && (y > centerY)) {
            // Direita baixo
            console.log("Direita baixo")
            if (out.right) {
                caption.style.right = `0px`
                caption.style.left = `auto`
            }

            if (out.bottom) {
                caption.style.bottom = `0px`
                caption.style.top = `auto`
            }
        } else if ((x < centerX) && (y < centerY)) {
            // Esquerda cima
            console.log("Esquerda cima")
            if (out.left) {
                caption.style.left = `0px`
                caption.style.right = `auto`
            }

            if (out.top) {
                caption.style.top = `0px`
                caption.style.bottom = `auto`
            }
        } else if ((x < centerX) && (y > centerY)) {
            // Esquerda baixo
            console.log("Esquerda baixo")
            if (out.left) {
                caption.style.left = `0px`
                caption.style.right = `auto`
            }

            if (out.bottom) {
                caption.style.bottom = `0px`
                caption.style.top = `auto`
            }
        }

        caption.style.opacity = 0.8;
        myTimeOut = setTimeout(function () {
            caption.style.opacity = 0;
        }, delayInMilliseconds);

    });
});

function isOutside(parent, child) {
    var box1coords = parent.getBoundingClientRect();
    var box2coords = child.getBoundingClientRect();

    var outside = {
        top: false,
        bottom: false,
        left: false,
        right: false
    };

    if (box2coords.top < box1coords.top) {

        outside.top = true;
    }

    if (box2coords.right > box1coords.right) {
        outside.right = true;
    }

    if (box2coords.bottom > box1coords.bottom) {
        outside.bottom = true;
    }

    if (box2coords.left < box1coords.left) {
        outside.left = true;
    }

    return outside;

}