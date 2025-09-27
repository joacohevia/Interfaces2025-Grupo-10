// JavaScript para la página principal (index.html)

class GameZoneHome {
    constructor() {
        this.apiBaseUrl = 'https://github.com/jimartinezabadias/api-vj-interfaces';
        this.currentUser = null;
        this.games = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGames();
        this.checkUserSession();
    }

    setupEventListeners() {
        // Toggle del menú móvil
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Búsqueda de juegos
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', this.performSearch.bind(this));
        }

        // Dropdown del usuario
        const user
