class PortfolioFilter {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentPage = 1;
        this.projectsPerPage = 3;
        this.currentFilter = 'all';
        this.currentSearch = '';
        
        this.init();
    }
    
    init() {
        this.collectProjects();
        this.bindEvents();
        this.updateDisplay();
    }
    
    collectProjects() {
        const projectElements = document.querySelectorAll('.project-item');
        this.projects = Array.from(projectElements).map((element, index) => ({
            element: element,
            id: index,
            category: element.dataset.category || '',
            tags: element.dataset.tags || '',
            title: element.querySelector('h2')?.textContent || '',
            description: element.querySelector('p[style*="font-weight: 500"]')?.textContent || ''
        }));
        
        this.filteredProjects = [...this.projects];
    }
    
    bindEvents() {
        // Search input
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
        
        // Category filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentFilter = e.target.dataset.category;
                this.applyFilters();
            });
        });
        
        // Pagination buttons
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.updateDisplay();
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.updateDisplay();
                }
            });
        }
    }
    
    applyFilters() {
        this.filteredProjects = this.projects.filter(project => {
            // Category filter
            const categoryMatch = this.currentFilter === 'all' || 
                                  project.category.includes(this.currentFilter);
            
            // Search filter
            const searchMatch = this.currentSearch === '' ||
                               project.title.toLowerCase().includes(this.currentSearch) ||
                               project.description.toLowerCase().includes(this.currentSearch) ||
                               project.tags.toLowerCase().includes(this.currentSearch);
            
            return categoryMatch && searchMatch;
        });
        
        // Reset to first page when filters change
        this.currentPage = 1;
        this.updateDisplay();
        this.updateResultsInfo();
    }
    
    updateDisplay() {
        // Hide all projects
        this.projects.forEach(project => {
            project.element.style.display = 'none';
        });
        
        // Calculate pagination
        const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
        const startIndex = (this.currentPage - 1) * this.projectsPerPage;
        const endIndex = Math.min(startIndex + this.projectsPerPage, this.filteredProjects.length);
        
        // Show current page projects
        for (let i = startIndex; i < endIndex; i++) {
            if (this.filteredProjects[i]) {
                this.filteredProjects[i].element.style.display = 'flex';
            }
        }
        
        this.updatePaginationControls(totalPages);
        this.updateResultsInfo();
        
        // Smooth scroll to projects section when page changes
        if (this.currentPage > 1) {
            document.getElementById('works').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
    
    updatePaginationControls(totalPages) {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');
        const pageNumbers = document.getElementById('page-numbers');
        const paginationInfo = document.getElementById('pagination-info-text');
        
        // Update prev/next buttons
        if (prevButton) {
            prevButton.disabled = this.currentPage <= 1;
            prevButton.style.opacity = this.currentPage <= 1 ? '0.5' : '1';
        }
        
        if (nextButton) {
            nextButton.disabled = this.currentPage >= totalPages;
            nextButton.style.opacity = this.currentPage >= totalPages ? '0.5' : '1';
        }
        
        // Update page numbers
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                pageBtn.className = 'page-number';
                pageBtn.style.cssText = `
                    padding: 8px 12px;
                    border: 2px solid var(--primary-color);
                    background: ${i === this.currentPage ? 'var(--primary-color)' : 'transparent'};
                    color: ${i === this.currentPage ? 'white' : 'var(--primary-color)'};
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;
                
                pageBtn.addEventListener('click', () => {
                    this.currentPage = i;
                    this.updateDisplay();
                });
                
                pageNumbers.appendChild(pageBtn);
            }
        }
        
        // Update pagination info
        if (paginationInfo) {
            const startItem = (this.currentPage - 1) * this.projectsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.projectsPerPage, this.filteredProjects.length);
            paginationInfo.textContent = 
                `Mostrando ${startItem}-${endItem} de ${this.filteredProjects.length} projetos`;
        }
    }
    
    updateResultsInfo() {
        const resultsInfo = document.getElementById('results-info');
        if (resultsInfo) {
            const totalProjects = this.filteredProjects.length;
            const totalAvailable = this.projects.length;
            
            if (this.currentSearch || this.currentFilter !== 'all') {
                resultsInfo.textContent = `${totalProjects} de ${totalAvailable} projetos encontrados`;
            } else {
                resultsInfo.textContent = `${totalAvailable} projetos disponíveis`;
            }
        }
    }
}

// Initialize the portfolio filter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new PortfolioFilter();
});

// Also export for potential external usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioFilter;
}