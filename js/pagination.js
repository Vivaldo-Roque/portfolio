/**
 * Pagination Module
 * Handles pagination controls and navigation
 */

// Initialize pagination variables
window.currentPage = 1;
window.projectsPerPage = 3;

/**
 * Update pagination controls visibility and state
 * @param {number} totalProjects - Total number of filtered projects
 * @param {number} totalPages - Total number of pages
 */
function updatePaginationControls(totalProjects, totalPages) {
  const paginationControls = document.getElementById('pagination-controls');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');

  if (!paginationControls || !prevBtn || !nextBtn || !pageInfo) return;

  // Show/hide pagination based on number of projects
  if (totalProjects <= window.projectsPerPage) {
    paginationControls.style.display = 'none';
    return;
  }

  paginationControls.style.display = 'flex';

  // Update page info
  const pageOfText = getLanguage('page_of') || 'Page {current} of {total}';
  pageInfo.textContent = pageOfText.replace('{current}', window.currentPage).replace('{total}', totalPages);

  // Update button states
  prevBtn.disabled = window.currentPage === 1;
  nextBtn.disabled = window.currentPage === totalPages;

  // Remove old event listeners by cloning
  const newPrevBtn = prevBtn.cloneNode(true);
  const newNextBtn = nextBtn.cloneNode(true);
  prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
  nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

  // Add new event listeners
  document.getElementById('prev-page').addEventListener('click', () => {
    if (window.currentPage > 1) {
      window.currentPage--;
      populateProjects();
      scrollToProjects();
    }
  });

  document.getElementById('next-page').addEventListener('click', () => {
    if (window.currentPage < totalPages) {
      window.currentPage++;
      populateProjects();
      scrollToProjects();
    }
  });
}

/**
 * Scroll to the projects section smoothly
 */
function scrollToProjects() {
  const worksSection = document.getElementById('works');
  if (worksSection) {
    worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
