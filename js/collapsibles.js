window.initCollapsibles = function() {
  document.querySelectorAll('.collapsible-header').forEach(header => {
    const group = header.nextElementSibling;
    // Remove old listeners by cloning (to prevent duplicates)
    const newHeader = header.cloneNode(true);
    header.parentNode.replaceChild(newHeader, header);
    
    newHeader.addEventListener('click', () => {
      newHeader.classList.toggle('open');
      group.classList.toggle('open');
    });
  });
};

window.addEventListener("load", () => {
  window.initCollapsibles();
});