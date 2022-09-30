window.addEventListener("load", () => {
    //Pega o botão
    var mybutton = document.getElementById("myTopBtn");

    // Quando o usuário rola para baixo 20px da parte superior do documento, mostra o botão
    window.addEventListener("scroll", () => {
        scrollFunction();
    });

    function scrollFunction() {
        if (document.body.scrollTop > 120 || document.documentElement.scrollTop > 120) {
            mybutton.style.display = "flex";
        } else {
            mybutton.style.display = "none";
        }
    }

    // Quando o usuário clicar no botão, role até o topo do documento
    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    mybutton.addEventListener("click", () => {
        topFunction();
    });
});