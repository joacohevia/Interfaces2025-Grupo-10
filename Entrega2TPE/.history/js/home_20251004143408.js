'use strict';
document.addEventListener("DOMContentLoaded", function() {
    // Esperar hasta que la página se haya cargado completamente
    let porcentaje = 0;
    const porcentajeCarga = document.getElementById('porcentaje');

    // Simular el incremento del porcentaje
    const interval = setInterval(function() {
        if (porcentaje < 100) {
            porcentaje = porcentaje + 1;
            porcentajeCarga.innerText = porcentaje;
        } else {
            clearInterval(interval);
            setTimeout(function() {
                document.body.classList.add('loaded'); // Ocultar el loader
            }, 800); // momento antes de iniciar
        }
    }, 20); //tiempo del intervalo que incrementa el loader

    createCarousel('carousel1');
    createCarousel('carousel2');
    createCarousel('carousel3');
    createCarousel('carousel4');
    createCarousel('carousel5');
    createCarousel('carousel6');
    createCarousel('carousel7');

    /*__________________FBOTON CAMBIO DE ICONO__________________*/
    let buyButtons = document.querySelectorAll('.button-with-icon');
    
    if(buyButtons){

        buyButtons.forEach(buyButton => {
            buyButton.addEventListener('click', () => {
                cambiarImagenCart(buyButton);
            });
        });
    }
});


// Funcionalidad para la página principal
document.addEventListener('DOMContentLoaded', function() {
    loadGames();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Menú hamburguesa
    const burgerMenu = document.getElementById('burgerMenu');
    const burgerDropdown = document.getElementById('burgerDropdown');
    
    if (burgerMenu && burgerDropdown) {
        burgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBurgerMenu();
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!burgerMenu.contains(e.target) && !burgerDropdown.contains(e.target)) {
                closeBurgerMenu();
            }
        });
    }

    // Menú de usuario
    const userMenu = document.getElementById('userMenu');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenu && userDropdown) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleUserMenu();
        });
        
        // Cerrar menú de usuario al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!userMenu.contains(e.target) && !userDropdown.contains(e.target)) {
                closeUserMenu();
            }
        });
    }
    
    // Event listener para cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = './login.html';
        });
    }
}

// Cargar juegos desde el archivo JSON
async function loadGames() {
    try {
        // Mostrar estado de carga
        // showLoadingState(); // Función no definida, comentada temporalmente
        
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
        
        // Guardar datos globalmente para filtrado
        window.currentGamesData = games;
        
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
        }).slice(0, 4),
        
        suggestedGames: games.filter(game => 
            game.rating && game.rating >= 4.0
        ).sort((a, b) => b.rating - a.rating).slice(0, 4),
        
        classicGames: games.filter(game => {
            if (!game.released) return false;
            const year = new Date(game.released).getFullYear();
            return year >= 1990 && year <= 2010;
        }).slice(0, 4),
        
        strategyGames: games.filter(game => {
            if (!game.genres) return false;
            const name = game.name.toLowerCase();
            const description = (game.description || '').toLowerCase();
            return game.genres.some(genre => {
                const genreName = genre.name.toLowerCase();
                return genreName.includes('strategy') || 
                       genreName.includes('simulation') ||
                       genreName.includes('board');
            }) || name.includes('civilization') || 
                 name.includes('chess') || 
                 name.includes('tactics') ||
                 name.includes('strategy') ||
                 description.includes('strategy') ||
                 description.includes('tactical');
        }).slice(0, 4),
        
        multiplayerGames: games.filter(game => {
            const name = game.name.toLowerCase();
            const description = (game.description || '').toLowerCase();
            return name.includes('multiplayer') || 
                   name.includes('online') || 
                   name.includes('counter-strike') ||
                   name.includes('team') ||
                   name.includes('versus') ||
                   name.includes('pvp') ||
                   description.includes('multiplayer') ||
                   description.includes('online') ||
                   description.includes('cooperative') ||
                   description.includes('team');
        }).slice(0, 4)
    };

    // Si alguna categoría está vacía, llenarla con juegos aleatorios
    Object.keys(categories).forEach(categoryId => {
        if (categories[categoryId].length === 0) {
            console.log(`Categoría ${categoryId} vacía, llenando con juegos aleatorios`);
            const randomGames = games.sort(() => 0.5 - Math.random()).slice(0, 4);
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

    gameCard.innerHTML = `
        <div class="card-image-container">
            <img src="${game.background_image_low_res || game.background_image}" 
                 alt="${game.name}" 
                 loading="lazy"
                 onerror="this.src='../assets/gameZone.png'">
            ${game.esPremium ? '<img src="../assets/img/Premium.png" alt="Premium" class="premium-icon">' : ''}
            <div class="game-overlay">
                <button class="play-btn">
                    <img src="../assets/img/Play.png" alt="Play" width="20" height="20">
                </button>
            </div>
        </div>
        <div class="game-info">
            <div class="game-title">${game.name}</div>
        </div>
    `;

    // Agregar eventos de click según el tipo de juego
    if (game.name === 'Peg Solitaire') {
        // Peg Solitaire: redirige a juego.html
        gameCard.style.cursor = 'pointer';
        gameCard.addEventListener('click', function() {
            window.location.href = 'juego.html';
        });
    } else if (game.esPremium) {
        // Juegos premium: mostrar popup
        gameCard.style.cursor = 'pointer';
        gameCard.addEventListener('click', function() {
            showPremiumPopup();
        });
    }
    // Juegos gratuitos (esPremium: false): sin evento de click

    return gameCard;
}

// Función para mostrar popup premium
function showPremiumPopup() {
    // Crear el popup si no existe
    if (!document.getElementById('premiumPopup')) {
        const popup = document.createElement('div');
        popup.id = 'premiumPopup';
        popup.className = 'premium-popup-overlay';
        popup.innerHTML = `
            <div class="premium-popup">
                <button class="popup-close" onclick="closePremiumPopup()">&times;</button>
                    <button class="activate-btn" onclick="activatePremium(this)">Activar</button>
                    <p class="later" onclick="closePremiumPopup()">Más tarde</p>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
    }
    
    // Mostrar el popup
    document.getElementById('premiumPopup').style.display = 'flex';
}

// Función para cerrar popup premium
function closePremiumPopup() {
    document.getElementById('premiumPopup').style.display = 'none';
}

// Función para activar premium con animación
function activatePremium(button) {
    // Agregar clase de animación
    button.classList.add('purchasing');
    
    // Cambiar texto temporalmente
    const originalText = button.innerHTML;
    button.innerHTML = 'Procesando...';
    
    // Después de la animación, abrir segundo popup
    setTimeout(() => {
        // Cerrar primer popup
        closePremiumPopup();
        
        // Restaurar estado original del botón
        button.classList.remove('purchasing');
        button.innerHTML = originalText;
        
        // Abrir popup de activación exitosa
        showActivatedPopup();
    }, 1500);
}

// Función para crear ondas de éxito
function createSuccessWaves(button) {
    const buttonRect = button.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const wave = document.createElement('div');
            wave.className = 'success-wave';
            wave.style.left = centerX + 'px';
            wave.style.top = centerY + 'px';
            document.body.appendChild(wave);
            
            // Remover la onda después de la animación
            setTimeout(() => {
                if (wave.parentNode) {
                    wave.parentNode.removeChild(wave);
                }
            }, 1000);
        }, i * 200);
    }
}

// Función para mostrar popup de activación exitosa
function showActivatedPopup() {
    // Crear el popup de activación si no existe
    if (!document.getElementById('activatedPopup')) {
        const popup = document.createElement('div');
        popup.id = 'activatedPopup';
        popup.className = 'activated-popup-overlay';
        popup.innerHTML = `
            <div class="activated-popup">
                <button class="popup-close" onclick="closeActivatedPopup()">&times;</button>
            </div>
        `;
        document.body.appendChild(popup);
    }
    
    // Mostrar el popup
    document.getElementById('activatedPopup').style.display = 'flex';
}

// Función para cerrar popup de activación
function closeActivatedPopup() {
    document.getElementById('activatedPopup').style.display = 'none';
}

// Funciones del menú burger
function toggleBurgerMenu() {
    const burgerDropdown = document.getElementById('burgerDropdown');
    
    if (burgerDropdown.classList.contains('show')) {
        closeBurgerMenu();
    } else {
        openBurgerMenu();
    }
}

function openBurgerMenu() {
    const burgerDropdown = document.getElementById('burgerDropdown');
    burgerDropdown.classList.add('show');
}

function closeBurgerMenu() {
    const burgerDropdown = document.getElementById('burgerDropdown');
    burgerDropdown.classList.remove('show');
}

// Funciones del menú de usuario
function toggleUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    
    if (userDropdown.classList.contains('show')) {
        closeUserMenu();
    } else {
        openUserMenu();
    }
}

function openUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    userDropdown.classList.add('show');
}

function closeUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    userDropdown.classList.remove('show');
}

