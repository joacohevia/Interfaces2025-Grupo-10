'use strict';

//LOADER
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
});


// Funcionalidad para la página principal
document.addEventListener('DOMContentLoaded', async function() {
    setupEventListeners();
    setupBurgerMenuNavigation();
    
    // Cargamos los juegos y esperamos a que terminen de cargarse
    try {
        await loadGames();
        // Inicializar los carruseles después de que los juegos se hayan cargado
        window.initializeCarousels();
    } catch (error) {
        console.error('Error al cargar los juegos:', error);
    }
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
            e.stopPropagation();//evita que se cierre si hago click dentro
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

// Configurar navegación del menú hamburguesa
function setupBurgerMenuNavigation() {
    const burgerItems = document.querySelectorAll('.dropdown-item');
    
    // Mapeo de categorías del menú a IDs de secciones
    const categoryMap = {
        'Acción': 'actionGames',
        'Aventura': 'adventureGames', 
        'Carreras': 'racingGames',
        'Clásicos': 'classicGames',
        'Cocina': 'cookingGames',
        'Deportes': 'sportsGames',
        'Escape': 'escapeGames',
        'Estrategia': 'logicGames', // Este apunta a logicGames que ahora se llama "Juegos de estrategia"
        'Guerra': 'warGames',
        'Habilidad': 'skillGames',
        'Infantiles': 'kidsGames',
        'Multijugador': 'multiplayerGames',
        'Plataformas': 'platformGames',
        'Puzzle': 'puzzleGames',
        'Terror': 'horrorGames'
    };

    burgerItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();// Evita el comportamiento por defecto del enlace
            
            const categoryText = this.querySelector('span').textContent.trim();
            // Obtiene el ID de la sección objetivo basado en el texto del ítem
            //trim elimina espacios en blanco al inicio y al final
            const targetId = categoryMap[categoryText];
            // Si se encontró una categoría válida, hacer scroll o redirigir
            
            if (targetId) {
                // Si estamos en otra página, ir al home primero
                if (window.location.pathname.includes('juego.html') || 
                    window.location.pathname.includes('login.html') || 
                    window.location.pathname.includes('registro.html')) {
                    
                    // Guardar el objetivo en sessionStorage para navegación entre páginas
                    sessionStorage.setItem('scrollTarget', targetId);
                    window.location.href = './index.html';
                    return;
                }
                
                // Si estamos en el home, hacer scroll directo
                scrollToCategory(targetId);
            }
            
            // Cerrar el menú
            closeBurgerMenu();
        });
    });
    
    // Verificar si hay un scroll pendiente al cargar la página
    checkPendingScroll();
}

// Función para hacer scroll a una categoría específica
function scrollToCategory(targetId) {
    const targetElement = document.getElementById(targetId);
    //Busca en el documento un elemento cuyo id sea igual a targetId.
    if (targetElement) {//Si lo encuentra, entra en el if, sino es null
        // Buscar el h1 padre que contiene el título de la categoría
        const categorySection = targetElement.closest('.category-section');
        //closest busca el padre más cercano que coincida con el selector dado.
        if (categorySection) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const offset = categorySection.offsetTop - headerHeight - 20; // 20px de margen extra
            
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    }
}

// Verificar scroll pendiente después de cargar la página
//recuerda a que parte del sitio queria ir el usuario antes de cambiar de pagina
function checkPendingScroll() {
    const pendingScroll = sessionStorage.getItem('scrollTarget');
    if (pendingScroll) {
        sessionStorage.removeItem('scrollTarget');
        // Esperar a que se carguen los juegos antes de hacer scroll
        setTimeout(() => {
            scrollToCategory(pendingScroll);
        }, 1500); // Esperar a que termine el loader
    }
}

// Cargar juegos desde API
async function loadGames() {
    try {
        console.log('Cargando juegos desde API externa...');
        
        // Consumir API externa
        const response = await fetch('https://vj.interfaces.jima.com.ar/api/v2');
        
        
        const gamesRaw = await response.json();
        console.log(`Juegos cargados desde API: ${gamesRaw.length}`);
        
        // Verificar que tenemos datos
        if (!gamesRaw || !Array.isArray(gamesRaw) || gamesRaw.length === 0) {
            throw new Error('No se encontraron juegos en la API');
        }
        
        // Agregar propiedad esPremium a los juegos de la API
        const games = gamesRaw.map((game, index) => ({
            ...game,
            esPremium: index % 2 === 0 // Alternar: 50% premium, 50% gratuitos
        }));
        
        console.log(`Cargados ${games.length} juegos exitosamente desde la API`);
        
        // Guardar datos globalmente para filtrado
        window.currentGamesData = games;
        
        // Distribuir juegos por categorías
        displayGames(games);
        setTimeout(() => {
        }, 100);
    } catch (error) {
        console.error('Error cargando juegos desde API:', error);
        console.log('Intentando cargar desde archivo local de fallback...');
        // Si todo falla, usar juegos hardcodeados
        console.log('Usando juegos de fallback hardcodeados...');
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
    
    // Agregar PegSolitaire y Blocka como juegos fijos de lógica
    const pegSolitaireGame = {
        id: 'peg-solitaire',
        name: 'Peg Solitaire',
        background_image: 'assets/img/portadaPeg.png',
        rating: 4.5,
        genres: [{ name: 'Puzzle' }],
        esPremium: false, // Juego gratuito
        released: '2024-01-01'
    };
    const blockaGame = {
        id: 'blocka',
        name: 'Blocka',
        background_image: 'assets/img/blocka.png',
        rating: 4.5,
        genres: [{ name: 'Puzzle' }],
        esPremium: false,
        released: '2024-01-01'
    };
    
    // Categorías de juegos basadas en géneros y características
    const categories = {
        logicGames: (() => {/*juegos de lógica */
            const logicGamesFromAPI = games.filter(game => {
                if (!game.genres) return false;
                return game.genres.some(genre => {
                    const genreName = genre.name.toLowerCase();
                    return genreName.includes('puzzle') || 
                           genreName.includes('strategy') ||
                           genreName.includes('board') ||
                           game.name.toLowerCase().includes('chess') ||
                           game.name.toLowerCase().includes('puzzle');
                });
            }).slice(0, 10);

            // Evita duplicados de Peg Solitaire
            const pegAlreadyExists = logicGamesFromAPI.some(game => game.name && game.name.toLowerCase() === 'peg solitaire');
            if (pegAlreadyExists) {
                return logicGamesFromAPI;
            } else {
                return [pegSolitaireGame, ...logicGamesFromAPI];
            }
        })(),
        /* Juegos sugeridos */
        suggestedGames: games.filter(game => 
            game.rating && game.rating >= 4.0
        ).sort((a, b) => b.rating - a.rating).slice(0, 10),
        
        classicGames: games.filter(game => {
            if (!game.released) return false;
            const year = new Date(game.released).getFullYear();
            return year >= 1990 && year <= 2010;
        }).slice(0, 10),
        
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
        }).slice(0, 10),
        
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
        }).slice(0, 10),

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

    // Nuevos registros para depuración
    console.log(`Renderizando categoría: ${categoryId}`);
    console.log(`Juegos en la categoría ${categoryId}:`, games);

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
                 onerror="this.src='assets/gameZone.png'">
            ${game.esPremium ? '<img src="assets/img/Premium.png" alt="Premium" class="premium-icon">' : ''}
            <div class="game-overlay">
                <button class="play-btn">
                    <img src="assets/img/Play.png" alt="Play" width="20" height="20">
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
    } else if (game.name === 'Blocka') {
        // Blocka: redirige a blocka.html
        gameCard.style.cursor = 'pointer';
        gameCard.addEventListener('click', function() {
            window.location.href = 'blocka.html';
        });
    } else if (game.esPremium) {
        // Juegos premium: mostrar popup
        gameCard.style.cursor = 'pointer';
        gameCard.addEventListener('click', function() {
            showPremiumPopup();
        });
    } else{
        // Juegos gratuitos (esPremium: false): redirige a peg a modo de ejemplo
        gameCard.style.cursor = 'pointer';
        gameCard.addEventListener('click', function() {
            window.location.href = 'juego.html';
        });
    }

    return gameCard;
}

// Función para mostrar popup premium
function showPremiumPopup() {
    console.log('Mostrando popup premium');
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
        `;
        document.body.appendChild(popup);
        //Agrega el elemento popup (con todo su contenido recién definido) al final del <body>
        console.log('Popup premium creado');
    }
    
    // Mostrar el popup
    document.getElementById('premiumPopup').style.display = 'flex';
    console.log('Popup premium mostrado');
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

//Carrusel de card pequeñas




/*
Al cargarse el DOM (DOMContentLoaded), el script captura los elementos principales
 del carrusel: el contenedor que se mueve (track), los slides individuales (items), 
 los indicadores (indicators), los botones de navegación (prevBtns y nextBtns) y el
  contenedor general (carouselContainer). También se inicializan variables clave: 
  currentIndex en 0 para el slide activo, totalItems con la cantidad de slides, 
  isPaused en falso para controlar la pausa del autoplay, isTransitioning en falso
   para evitar animaciones superpuestas y autoplayInterval vacío. Luego se llama 
   a updateCarousel(), que primero revisa si ya hay una transición en curso y, de
    no ser así, mueve el track usando translateX(-currentIndex * 100%), activa el
     indicador y el slide correspondiente y bloquea nuevas transiciones durante 500 ms
      usando isTransitioning. El autoplay se inicia con startAutoplay(), 
      que cada 5 segundos avanza al siguiente slide solo si isPaused es falso.
       Cuando el usuario interactúa, los botones Next o Prev pausarán temporalmente
        el autoplay, actualizarán currentIndex de forma circular, llamarán a 
        updateCarousel() y reanudarán el autoplay después de 5 segundos; de manera
         similar, al clickear un indicador se pausa el autoplay, se actualiza el 
         slide activo y se reanuda después de 5 segundos. Además, al pasar el 
         mouse sobre el carrusel (mouseenter) se pausa el autoplay y al salir 
         (mouseleave) se reanuda. Los flags isTransitioning y isPaused son 
         fundamentales para controlar la fluidez: el primero evita que varias a
         nimaciones se solapen y el segundo que el autoplay avance mientras el 
         usuario interactúa. En resumen, cada cambio de slide, ya sea por botones, 
         indicadores o autoplay, actualiza currentIndex, mueve el contenedor principal, 
         activa las clases correspondientes en slides e indicadores y respeta las pausas
          y transiciones definidas, creando un flujo suave y controlado del carrusel.

/*__________________CARRUSEL__________________*/
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById("carouselTrack");
    const prevBtns = document.querySelectorAll(".prev-btn");
    const nextBtns = document.querySelectorAll(".next-btn");
    const indicators = document.querySelectorAll(".indicator-new");
    const items = document.querySelectorAll(".carousel-item-new");
    const carouselContainer = document.querySelector(".carousel-container-new");

    let currentIndex = 0;
    const totalItems = items.length;
    let autoplayInterval;
    let isPaused = false;
    let isTransitioning = false;

    function updateCarousel() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        const newTransform = -currentIndex * 100 + '%';
        track.style.transform = `translateX(${newTransform})`;
        
        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });

        // Actualizar clases active
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });

        // Permitir la siguiente transición después de la animación
        setTimeout(() => {
            isTransitioning = false;
        }, 500); // Debe coincidir con la duración de la transición en CSS
    }

    function nextSlide(e) {
        if (e) e.stopPropagation();
        if (isTransitioning) return;
        
        isPaused = true;
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
        
        // Reanudar después de 5 segundos
        clearTimeout(window.resumeTimeout);
        window.resumeTimeout = setTimeout(() => {
            isPaused = false;
        }, 5000);
    }

    function prevSlide(e) {
        if (e) e.stopPropagation();
        if (isTransitioning) return;
        
        isPaused = true;
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
        
        // Reanudar después de 5 segundos
        clearTimeout(window.resumeTimeout);
        window.resumeTimeout = setTimeout(() => {
            isPaused = false;
        }, 5000);
    }

    // Event listeners para los botones
    prevBtns.forEach(btn => {
        btn.addEventListener("click", prevSlide);
    });

    nextBtns.forEach(btn => {
        btn.addEventListener("click", nextSlide);
    });

    // Event listeners para los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isTransitioning || currentIndex === index) return;
            
            isPaused = true;
            currentIndex = index;
            updateCarousel();
            
            // Reanudar después de 5 segundos
            clearTimeout(window.resumeTimeout);
            window.resumeTimeout = setTimeout(() => {
                isPaused = false;
            }, 5000);
        });
    });

    // Iniciar autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (!isPaused) {
                currentIndex = (currentIndex + 1) % totalItems;
                updateCarousel();
            }
        }, 5000);
    }

    // Detener autoplay
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Pausar auto-play al hacer hover
    carouselContainer.addEventListener("mouseenter", () => {
        isPaused = true;
        stopAutoplay();
    });

    carouselContainer.addEventListener("mouseleave", () => {
        isPaused = false;
        startAutoplay();
    });

    // Iniciar el carrusel
    updateCarousel();
    startAutoplay();
});

// Función para buscar juegos
function searchGames(query) {
    const allGames = document.querySelectorAll('.card-image-container'); 
    // Selecciona todas las tarjetas de juegos
    let firstMatch = null; 
    // Variable para almacenar el primer juego encontrado
    // Solo buscar si hay texto
    if (query.trim() === '') {
        allGames.forEach(gameContainer => {
            if (gameContainer.parentElement) {
                gameContainer.parentElement.style.display = 'block';
            }
        });
        return;
    }


    allGames.forEach(gameContainer => {
        const titleElement = gameContainer.nextElementSibling?.querySelector('.game-title');
        if (titleElement) {
            const title = titleElement.textContent.toLowerCase();
            if (title.includes(query.toLowerCase())) {
                gameContainer.parentElement.style.display = 'block';
                if (!firstMatch) {
                    firstMatch = gameContainer.parentElement;
                }
            } else {
                gameContainer.parentElement.style.display = 'none';
            }
        }
    });

    // Ocultar categorías que no tengan juegos visibles
    const categorySections = document.querySelectorAll('.category-section');
    categorySections.forEach(section => {
        const visibleGames = section.querySelectorAll('.card-image-container');
        let hasVisible = false;
        visibleGames.forEach(card => {
            if (card.parentElement.style.display !== 'none') {
                hasVisible = true;
            }
        });
        section.style.display = hasVisible ? 'block' : 'none';
    });

    // Deslizar hacia el primer juego encontrado solo si hay una búsqueda activa
    if (firstMatch && query.trim() !== '') {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Event listener para búsqueda con Enter
document.getElementById('searchInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        //cuando hago enter en el input capturo el valor y llamo a la fn
        const query = event.target.value;
        searchGames(query);
    }
});