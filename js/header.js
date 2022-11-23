var clicked = false;
var delayInMilliseconds = 2000;

window.addEventListener("DOMContentLoaded", () => {

    var header = document.getElementById("home");
    var caption = document.getElementById("header_caption");

    header.addEventListener('click', function (event) {

        caption.classList.toggle("caption_hide");

        var x = event.clientX - 70;
        var y = event.clientY - 40;
        caption.style.left = `${x}px`;
        caption.style.top = `${y}px`;
        caption.style.opacity = 0.8;
        setTimeout(function () {
            caption.style.opacity = 0;
        }, delayInMilliseconds);

    });
});



