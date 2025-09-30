// Funcionalidad para la página principal
document.addEventListener('DOMContentLoaded', function() {
    loadGames();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Menú hamburguesa
    const burgerMenu = document.getElementById('burgerMenu');
    if (burgerMenu) {
        burgerMenu.addEventListener('click', function() {
            // PONER ACA LOGICA MENU HAMBURGUESA, FALTA
            console.log('Menú hamburguesa clickeado');
        });
    }

    //FALTA PARA CORONA Y FALTA PARA USER
}

// Cargar juegos desde el archivo JSON
async function loadGames() {
    try {
        // Mostrar estado de carga
        showLoadingState();
        
        // Intentar múltiples rutas posibles
        let response;
        const possiblePaths = [
            '../assets/API.json',
            './assets/API.json', 
            'assets/API.json',
            '/assets/API.json'
        ];
        
        for (const path of possiblePaths) {
            try {
                response = await fetch(path);
                if (response.ok) {
                    console.log(`Archivo JSON encontrado en: ${path}`);
                    break;
                }
            } catch (e) {
                console.log(`No se pudo cargar desde: ${path}`);
                continue;
            }
        }
        
        if (!response || !response.ok) {
            throw new Error('No se pudo encontrar el archivo de juegos');
        }
        
        const games = await response.json();
        console.log(`Juegos cargados: ${games.length}`);
        
        // Verificar que tenemos datos
        if (!games || !Array.isArray(games) || games.length === 0) {
            throw new Error('No se encontraron juegos en el archivo');
        }
        
        console.log(`Cargados ${games.length} juegos exitosamente`);
        
        // Distribuir juegos por categorías
        displayGames(games);
    } catch (error) {
        console.error('Error cargando juegos:', error);
        console.log('Cargando juegos de fallback...');
        displayGames(getFallbackGames());
    }
}

// Juegos de fallback en caso de que no se pueda cargar el JSON
function getFallbackGames() {
    return [
        {
            "id": 3498,
            "name": "Grand Theft Auto V",
            "released": "2013-09-17",
            "background_image": "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
            "rating": 4.47,
            "platforms": [{"id": 1, "name": "PC"}, {"id": 2, "name": "PlayStation"}, {"id": 3, "name": "Xbox"}],
            "genres": [{"id": 4, "name": "Action"}],
            "background_image_low_res": "https://media.rawg.io/media/crop/600/400/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
            "description": "Rockstar Games went bigger, since their previous installment of the series."
        },
        {
            "id": 4200,
            "name": "Portal 2",
            "released": "2011-04-18", 
            "background_image": "https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg",
            "rating": 4.58,
            "platforms": [{"id": 1, "name": "PC"}, {"id": 2, "name": "PlayStation"}],
            "genres": [{"id": 7, "name": "Puzzle"}],
            "background_image_low_res": "https://media.rawg.io/media/crop/600/400/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg",
            "description": "Portal 2 is a first-person puzzle game developed by Valve Corporation."
        },
        {
            "id": 13536,
            "name": "Portal",
            "released": "2007-10-09",
            "background_image": "https://media.rawg.io/media/games/7fa/7fa0b586293c5861ee32490e953a4996.jpg", 
            "rating": 4.49,
            "platforms": [{"id": 1, "name": "PC"}, {"id": 2, "name": "PlayStation"}],
            "genres": [{"id": 7, "name": "Puzzle"}],
            "background_image_low_res": "https://media.rawg.io/media/crop/600/400/games/7fa/7fa0b586293c5861ee32490e953a4996.jpg",
            "description": "Every single time you click your mouse while holding a gun, you expect bullets to fly."
        },
        {
            "id": 3272,
            "name": "Rocket League",
            "released": "2015-07-07",
            "background_image": "https://media.rawg.io/media/games/8cc/8cce7c0e99dcc43d66c8efd42f9d03e3.jpg",
            "rating": 3.93,
            "platforms": [{"id": 1, "name": "PC"}, {"id": 2, "name": "PlayStation"}],
            "genres": [{"id": 15, "name": "Sports"}],
            "background_image_low_res": "https://media.rawg.io/media/crop/600/400/games/8cc/8cce7c0e99dcc43d66c8efd42f9d03e3.jpg",
            "description": "Highly competitive soccer game with rocket-cars."
        },
        {
            "id": 416,
            "name": "Grand Theft Auto: San Andreas", 
            "released": "2004-10-26",
            "background_image": "https://media.rawg.io/media/games/960/960b601d9541cec776c5fa42a00bf6c4.jpg",
            "rating": 4.5,
            "platforms": [{"id": 1, "name": "PC"}, {"id": 2, "name": "PlayStation"}],
            "genres": [{"id": 4, "name": "Action"}],
            "background_image_low_res": "https://media.rawg.io/media/crop/600/400/games/960/960b601d9541cec776c5fa42a00bf6c4.jpg",
            "description": "Grand Theft Auto - San Andreas is the seventh entry in the series."
        },
        {
            "id": 654,
            "name": "Stardew Valley",
            "released": "2016-02-25",
            "background_image": "https://media.rawg.io/media/games/713/713269608dc8f2f40f5a670a14b2de94.jpg",
            "rating": 4.4,
            "platforms": [{"id": 1, "name": "PC"}, {"id": 7, "name": "Nintendo"}],
            "genres": [{"id": 14, "name": "Simulation"}],
            "background_image_low_res": "https://media.rawg.io/media/crop/600/400/games/713/713269608dc8f2f40f5a670a14b2de94.jpg", 
            "description": "The hero - an office worker who inherited an abandoned farm."
        },
        {
            "id": 422,
            "name": "Terraria",
            "released": "2011-05-16",
            "background_image": "https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg",
            "rating": 4.07,
            "platforms": [{"id": 1, "name": "PC"}, {"id": 2, "name": "PlayStation"}],
            "genres": [{"id": 4, "name": "Action"}, {"id": 83, "name": "Platformer"}],
            "background_image_low_res": "https://media.rawg.io/media/crop/600/400/games/f46/f466571d536f2e3ea9e815ad17177501.jpg",
            "description": "Terraria is a 2D action adventure sandbox game."
        },
        {
            "id": 1030,
            "name": "Limbo",
            "released": "2010-07-21",
            "background_image": "https://media.rawg.io/media/games/942/9424d6bb763dc38d9378b488603c87fa.jpg",
            "rating": 4.14,
            "platforms": [{"id": 1, "name": "PC"}, {"id": 7, "name": "Nintendo"}],
            "genres": [{"id": 7, "name": "Puzzle"}, {"id": 83, "name": "Platformer"}],
            "background_image_low_res": "https://media.rawg.io/media/crop/600/400/games/942/9424d6bb763dc38d9378b488603c87fa.jpg",
            "description": "This popular 2D puzzle-platformer creates the atmosphere of isolation."
        }
    ];
}

// Mostrar juegos en las diferentes categorías
function displayGames(games) {
    console.log('Organizando juegos por categorías...');
    
    // Calcular cuántos juegos caben en una fila basado en el ancho de la pantalla
    const containerWidth = document.querySelector('.games-grid').offsetWidth;
    const cardWidth = 300; // Ancho mínimo de cada card
    const gap = 24; // gap de 1.5rem = 24px
    const gamesPerRow = Math.floor((containerWidth + gap) / (cardWidth + gap));
    
    // Categorías de juegos basadas en géneros y características
    const categories = {
        logicGames: games.filter(game => {
            if (!game.genres) return false;
            return game.genres.some(genre => {
                const genreName = genre.name.toLowerCase();
                return genreName.includes('puzzle') || 
                       genreName.includes('strategy') ||
                       genreName.includes('board') ||
                       game.name.toLowerCase().includes('chess') ||
                       game.name.toLowerCase().includes('puzzle');
            });
        }).slice(0, gamesPerRow),
        
        suggestedGames: games.filter(game => 
            game.rating && game.rating >= 4.0
        ).sort((a, b) => b.rating - a.rating).slice(0, gamesPerRow),
        
        classicGames: games.filter(game => {
            if (!game.released) return false;
            const year = new Date(game.released).getFullYear();
            return year >= 1990 && year <= 2010;
        }).slice(0, gamesPerRow),
        
        cookingGames: games.filter(game => {
            const name = game.name.toLowerCase();
            const description = (game.description || '').toLowerCase();
            return name.includes('cook') || 
                   name.includes('chef') || 
                   name.includes('kitchen') ||
                   name.includes('restaurant') ||
                   description.includes('cooking') ||
                   description.includes('recipe');
        }).slice(0, gamesPerRow),
        
        sportsGames: games.filter(game => {
            if (!game.genres) return false;
            const name = game.name.toLowerCase();
            return game.genres.some(genre => {
                const genreName = genre.name.toLowerCase();
                return genreName.includes('sports') || 
                       genreName.includes('racing') ||
                       genreName.includes('simulation');
            }) || name.includes('fifa') || 
                 name.includes('nba') || 
                 name.includes('football') ||
                 name.includes('soccer') ||
                 name.includes('racing') ||
                 name.includes('car') ||
                 name.includes('sport');
        }).slice(0, gamesPerRow)
    };

    // Si alguna categoría está vacía, llenarla con juegos aleatorios
    Object.keys(categories).forEach(categoryId => {
        if (categories[categoryId].length === 0) {
            console.log(`Categoría ${categoryId} vacía, llenando con juegos aleatorios`);
            const randomGames = games.sort(() => 0.5 - Math.random()).slice(0, 5);
            categories[categoryId] = randomGames;
        }
    });

    console.log('Categorías organizadas:', Object.keys(categories).map(key => 
        `${key}: ${categories[key].length} juegos`
    ));

    // Renderizar cada categoría
    Object.keys(categories).forEach(categoryId => {
        renderGameCategory(categoryId, categories[categoryId]);
    });
}

// Renderizar una categoría de juegos
function renderGameCategory(categoryId, games) {
    const container = document.getElementById(categoryId);
    if (!container) return;

    // Limpiar contenedor
    container.innerHTML = '';

    if (games.length === 0) {
        container.innerHTML = '<p class="no-games">No hay juegos disponibles en esta categoría</p>';
        return;
    }

    games.forEach(game => {
        const gameCard = createGameCard(game);
        container.appendChild(gameCard);
    });
}

// Crear una tarjeta de juego
function createGameCard(game) {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card-small';
    gameCard.addEventListener('click', () => {
        window.location.href = `juego.html?id=${game.id}`;
    });

    gameCard.innerHTML = `
        <img src="${game.background_image_low_res || game.background_image}" 
             alt="${game.name}" 
             loading="lazy"
             onerror="this.src='../assets/gameZone.png'">
        <div class="game-overlay">
            <button class="play-btn">
                <img src="../assets/img/Play.png" alt="Play" width="20" height="20">
            </button>
        </div>
        <div class="game-info">
            <div class="game-title">${game.name}</div>
        </div>
    `;

    return gameCard;
}