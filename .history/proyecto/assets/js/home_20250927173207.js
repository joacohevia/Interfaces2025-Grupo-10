// Configuración de la API
const API_URL = 'https://vj.interfaces.jima.com.ar/api/v2';

// Función para obtener juegos desde la API
async function fetchGames() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching games:', error);
        return [];
    }
}

// Función para filtrar juegos por género
function filterGamesByGenre(games, genre) {
    return games.filter(game => 
        game.genres.some(g => g.name.toLowerCase() === genre.toLowerCase())
    );
}

// Función para crear una tarjeta de juego
function createGameCard(game) {
    return `
        <div class="game-card">
            <img src="${game.background_image_low_res || game.background_image}" alt="${game.name}">
            <div class="game-card-content">
                <h3>${game.name}</h3>
                <div class="game-info">
                    <span class="rating">★ ${game.rating}</span>
                    <span class="platforms">${game.platforms.map(p => p.name).join(', ')}</span>
                </div>
            </div>
        </div>
    `;
}

// Función para cargar juegos por categoría
async function loadGamesForCategory(genre, container) {
    const games = await fetchGames();
    const filteredGames = genre ? filterGamesByGenre(games, genre) : games;
    
    if (container && filteredGames.length) {
        const gamesHTML = filteredGames.slice(0, 5).map(createGameCard).join('');
        container.querySelector('.games-grid').innerHTML = gamesHTML;
    }
}

// Función para cargar el juego destacado
async function loadFeaturedGame() {
    const games = await fetchGames();
    const featuredContainer = document.querySelector('.featured-game');
    
    if (featuredContainer && games.length) {
        // Seleccionar un juego con buena calificación como destacado
        const featured = games.find(game => game.rating >= 4.5) || games[0];
        featuredContainer.style.backgroundImage = `url(${featured.background_image})`;
        featuredContainer.innerHTML = `
            <div class="featured-content">
                <h1>${featured.name}</h1>
                <p class="rating">★ ${featured.rating}</p>
                <p class="description">${featured.description.slice(0, 200)}...</p>
            </div>
        `;
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar juego destacado
    await loadFeaturedGame();

    // Obtener las secciones
    const sections = {
        logic: document.querySelector('.logic-games'),
        action: document.querySelector('.suggested-games'),
        rpg: document.querySelector('.classic-games'),
        simulation: document.querySelector('.cooking-games'),
        sports: document.querySelector('.sports-games')
    };

    // Cargar juegos para cada sección
    Object.entries(sections).forEach(([genre, container]) => {
        if (container) {
            loadGamesForCategory(genre, container);
        }
    });

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
