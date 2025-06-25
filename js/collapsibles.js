window.addEventListener("load", () => {
    document.querySelectorAll('.collapsible-header').forEach(header => {
    const group = header.nextElementSibling;
    const arrow = header.querySelector('.arrow');
    header.addEventListener('click', () => {
      header.classList.toggle('open');
      group.classList.toggle('open');
    });
  });
});