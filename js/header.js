var clicked = false;
var delayInMilliseconds = 2000;
var centerX = 0;
var centerY = 0;

window.addEventListener("DOMContentLoaded", () => {

    var header = document.getElementById("home");
    var caption = document.getElementById("header_caption");

    header.addEventListener('mousemove', (event) => {
        centerX = header.offsetWidth / 2;
        centerY = header.offsetHeight / 2;
    });

    header.addEventListener('click', (event) => {

        var hBound = HorizontallyBound(header, caption);
        var vBound = VerticallyBound(header, caption);

        caption.classList.toggle("caption_hide");

        var x = event.clientX - 70;
        var y = event.clientY - 40;

        caption.style.left = `${x}px`;
        caption.style.top = `${y}px`;

        if((centerX < x) && (y < centerY)){
            // Direita cima
            // console.log("Direita cima")
            if(hBound){
                // caption.style.left = `0px`
            }

            if(vBound){
                caption.style.top = `0px`
            }
        } else if((centerX < x) && (y > centerY)){
            // Direita baixo
            // console.log("Direita baixo")
            if(hBound){
                // caption.style.left = `0px`
            }

            if(vBound){
                caption.style.bottom = `0px`
            }
        } else if((x < centerX) && (y < centerY)){
            // Esquerda cima
            // console.log("Esquerda cima")
            if(hBound){
                caption.style.left = `0px`
            }

            if(vBound){
                caption.style.top = `0px`
            }
        } else if((x < centerX) && (y > centerY)){
            // Esquerda baixo
            // console.log("Esquerda baixo")
            if(hBound){
                caption.style.left = `0px`
            }

            if(vBound){
                caption.style.bottom = `0px`
            }
        }    

        caption.style.opacity = 0.8;
        setTimeout(function () {
            caption.style.opacity = 0;
        }, delayInMilliseconds);

    });
});

function VerticallyBound(parentDiv, childDiv) {
    var parentRect = parentDiv.getBoundingClientRect();
    var childRect = childDiv.getBoundingClientRect();

    return parentRect.bottom <= childRect.bottom && parentRect.top >= childRect.top;
}

function HorizontallyBound(parentDiv, childDiv) {
    var parentRect = parentDiv.getBoundingClientRect();
    var childRect = childDiv.getBoundingClientRect();

    return parentRect.left <= childRect.left && parentRect.right >= childRect.right;
}