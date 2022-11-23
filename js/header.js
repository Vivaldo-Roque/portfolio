window.addEventListener("DOMContentLoaded", () => {

    var header = document.getElementById("home");
    var caption = document.getElementById("header_caption");

    header.addEventListener('click', function (event) {
        var x = event.clientX - 70;
        var y = event.clientY - 40;
        caption.style.display = "block";
        caption.style.left = `${x}px`;
        caption.style.top = `${y}px`;
    })

    var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
});

