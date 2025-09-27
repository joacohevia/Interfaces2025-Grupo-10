// Configuración de la API
const API_URL = 'https://github.com/jimartinezabadias/api-vj-interfaces';

// Función para obtener juegos desde la API
async function fetchGames(category) {
    try {
        const response = await fetch(`${API_URL}/games?category=${category}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching games:', error);
        return [];
    }
}

// Función para crear una tarjeta de juego
function createGameCard(game) {
    return `
        <div class="game-card">
            <img src="${game.image}" alt="${game.title}">
            <div class="game-card-content">
                <h3>${game.title}</h3>
            </div>
        </div>
    `;
}

// Función para cargar juegos por categoría
async function loadGamesForCategory(category, containerId) {
    const container = document.getElementById(containerId);
    const games = await fetchGames(category);
    
    if (container && games.length) {
        container.innerHTML = games.map(createGameCard).join('');
    }
}

// Función para cargar el juego destacado
async function loadFeaturedGame() {
    const games = await fetchGames('trending');
    const featuredContainer = document.querySelector('.featured-game');
    
    if (featuredContainer && games.length) {
        const featured = games[0];
        featuredContainer.style.backgroundImage = `url(${featured.image})`;
        featuredContainer.innerHTML = `
            <div class="featured-content">
                <h1>${featured.title}</h1>
            </div>
        `;
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedGame();
    loadGamesForCategory('logic', 'logic-games');
    loadGamesForCategory('suggested', 'suggested-games');
    loadGamesForCategory('classic', 'classic-games');
    loadGamesForCategory('cooking', 'cooking-games');
    loadGamesForCategory('sports', 'sports-games');

    // Manejar el toggle del menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-container');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
        });
    }
});

// Manejar la búsqueda
const searchForm = document.querySelector('.search-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchForm.querySelector('input').value;
        // Implementar la lógica de búsqueda
    });
}
