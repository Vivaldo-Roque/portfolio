window.addEventListener("load", () => {

    var me = document.getElementById("about-img");

    me.addEventListener("mouseover", () => {
        me.style.transition = "opacity 0s";
        me.style.opacity = 0;
        me.src = "../portfolio/img/me/me3.jpg";
      
        setTimeout(function(){
            me.style.transition = "opacity 2s";
            me.style.opacity = 1;
        }, 500);
        
    })

    me.addEventListener("mouseleave", () => {
        me.style.transition = "opacity 0s";
        me.style.opacity = 0;
        me.src = "../portfolio/img/me/me2.jpg";
       
        setTimeout(function(){
            me.style.transition = "opacity 2s";
            me.style.opacity = 1;
        }, 500);
    })

})