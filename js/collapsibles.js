window.addEventListener("load", () => {
    document.querySelectorAll('.collapsible-header').forEach(header => {
    const group = header.nextElementSibling;
    header.addEventListener('click', () => {
      header.classList.toggle('open');
      group.classList.toggle('open');
    });
  });
});