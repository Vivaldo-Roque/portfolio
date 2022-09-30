window.addEventListener("load", () => {

    var interval;
    var animation = true;
    var texts = [
        "WEB DEVELOPER",
        "SOFTWARE ENGINEER",
        "TECHNOLOGY GEEK"
    ];

    var count = 0;

    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    
        );
    }

    var txt = document.getElementById("textchanging");

    animation = false;
    interval = setInterval(intervalFunction, 2500);

    document.addEventListener('scroll', function () {
        
        if(isInViewport(txt) && animation === true){
            animation = false;
            interval = setInterval(intervalFunction, 2500);
        } else{
            animation = true;
            clearInterval(interval);
        }
    
    }, {
        passive: true
    });


    function intervalFunction() {
        if(txt.style.opacity === '0'){

            txt.innerText = texts[count];

            count++;

            if(count === texts.length){
                count = 0;
            }

            txt.style.opacity = '1';
        } else{
            txt.style.opacity = '0';
        }
    };
});