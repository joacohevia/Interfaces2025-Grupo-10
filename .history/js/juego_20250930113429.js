// Funcionalidad para la página individual de juego
document.addEventListener('DOMContentLoaded', function() {
    loadGameDetails();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Menú hamburguesa
    const burgerMenu = document.getElementById('burgerMenu');
    if (burgerMenu) {
        burgerMenu.addEventListener('click', function() {
            console.log('Menú hamburguesa clickeado');
        });
    }

    // Botón de jugar
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', handlePlayGame);
    }

    // Botón de favoritos
    const favoriteButton = document.querySelector('.favorite-button');
    if (favoriteButton) {
        favoriteButton.addEventListener('click', handleFavorite);
    }

    // Botón de compartir
    const shareButton = document.querySelector('.share-button');
    if (shareButton) {
        shareButton.addEventListener('click', handleShare);
    }
}

// Cargar detalles del juego
async function loadGameDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    
    if (!gameId) {
        showError('ID de juego no encontrado');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch('../assets/API.json');
        const games = await response.json();
        
        const game = games.find(g => g.id.toString() === gameId);
        
        if (!game) {
            showError('Juego no encontrado');
            return;
        }
        
        displayGameDetails(game);
        
    } catch (error) {
        console.error('Error cargando detalles del juego:', error);
        showError('Error al cargar los detalles del juego');
    } finally {
        showLoading(false);
    }
}

// Mostrar detalles del juego
function displayGameDetails(game) {
    // Título del juego
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) {
        gameTitle.textContent = game.name;
    }
    
    // Imagen del juego
    const gameImage = document.getElementById('gameImage');
    if (gameImage) {
        gameImage.src = game.background_image;
        gameImage.alt = game.name;
        gameImage.onerror = function() {
            this.src = '../assets/gameZone.png';
        };
    }
    
    // Rating
    const gameRating = document.getElementById('gameRating');
    const ratingNumber = document.getElementById('ratingNumber');
    if (gameRating && ratingNumber) {
        gameRating.innerHTML = generateStars(Math.round(game.rating));
        ratingNumber.textContent = game.rating.toFixed(1);
    }
    
    // Plataformas
    const gamePlatforms = document.getElementById('gamePlatforms');
    if (gamePlatforms) {
        gamePlatforms.innerHTML = game.platforms.map(platform => 
            `<span class="platform-tag">${platform.name}</span>`
        ).join('');
    }
    
    // Géneros
    const gameGenres = document.getElementById('gameGenres');
    if (gameGenres) {
        gameGenres.innerHTML = game.genres.map(genre => 
            `<span class="genre-tag">${genre.name}</span>`
        ).join('');
    }
    
    // Fecha de lanzamiento
    const gameReleaseDate = document.getElementById('gameReleaseDate');
    if (gameReleaseDate) {
        const date = new Date(game.released);
        gameReleaseDate.textContent = date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Descripción
    const gameDescription = document.getElementById('gameDescription');
    if (gameDescription) {
        // Limpiar HTML de la descripción
        const cleanDescription = game.description
            .replace(/<[^>]*>/g, '')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&');
            
        gameDescription.innerHTML = formatDescription(cleanDescription);
    }
    
    // Verificar si está en favoritos
    updateFavoriteButton(game.id);
}

// Formatear descripción larga
function formatDescription(description) {
    // Dividir por oraciones y crear párrafos
    const sentences = description.split('. ');
    let paragraphs = [];
    let currentParagraph = [];
    
    sentences.forEach((sentence, index) => {
        currentParagraph.push(sentence + (index < sentences.length - 1 ? '.' : ''));
        
        // Crear nuevo párrafo cada 3-4 oraciones
        if (currentParagraph.length >= 3 || index === sentences.length - 1) {
            paragraphs.push('<p>' + currentParagraph.join(' ') + '</p>');
            currentParagraph = [];
        }
    });
    
    return paragraphs.join('');
}

// Generar estrellas para el rating
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        const starClass = i <= rating ? 'star filled' : 'star empty';
        stars += `<span class="${starClass}">★</span>`;
    }
    return stars;
}

// Manejar botón de jugar
function handlePlayGame() {
    // Simular inicio del juego
    showMessage('Iniciando juego...', 'info');
    
    // Aquí iría la lógica para iniciar el juego
    setTimeout(() => {
        showMessage('¡Disfruta jugando!', 'success');
    }, 2000);
}

// Manejar botón de favoritos
function handleFavorite() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    
    if (!gameId) return;
    
    const favorites = getFavorites();
    const isFavorite = favorites.includes(gameId);
    
    if (isFavorite) {
        // Remover de favoritos
        const updatedFavorites = favorites.filter(id => id !== gameId);
        localStorage.setItem('gameFavorites', JSON.stringify(updatedFavorites));
        showMessage('Removido de favoritos', 'info');
    } else {
        // Añadir a favoritos
        favorites.push(gameId);
        localStorage.setItem('gameFavorites', JSON.stringify(favorites));
        showMessage('Añadido a favoritos', 'success');
    }
    
    updateFavoriteButton(gameId);
}

// Actualizar botón de favoritos
function updateFavoriteButton(gameId) {
    const favoriteButton = document.querySelector('.favorite-button');
    if (!favoriteButton) return;
    
    const favorites = getFavorites();
    const isFavorite = favorites.includes(gameId);
    
    if (isFavorite) {
        favoriteButton.style.background = 'rgba(255, 71, 87, 0.2)';
        favoriteButton.style.borderColor = '#ff4757';
        favoriteButton.style.color = '#ff4757';
        favoriteButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            En Favoritos
        `;
    } else {
        favoriteButton.style.background = 'rgba(255, 255, 255, 0.1)';
        favoriteButton.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        favoriteButton.style.color = '#ffffff';
        favoriteButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Agregar a Favoritos
        `;
    }
}

// Obtener favoritos del localStorage
function getFavorites() {
    const favorites = localStorage.getItem('gameFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

// Manejar botón de compartir
function handleShare() {
    if (navigator.share) {
        // Usar API nativa de compartir si está disponible
        navigator.share({
            title: document.getElementById('gameTitle').textContent,
            text: 'Mira este increíble juego en GameZone',
            url: window.location.href
        }).catch(err => console.log('Error compartiendo:', err));
    } else {
        // Fallback: copiar URL al portapapeles
        navigator.clipboard.writeText(window.location.href).then(() => {
            showMessage('URL copiada al portapapeles', 'success');
        }).catch(() => {
            showMessage('No se pudo copiar la URL', 'error');
        });
    }
}

// Mostrar estado de carga
function showLoading(isLoading) {
    const gameContent = document.querySelector('.game-content');
    
    if (isLoading) {
        gameContent.innerHTML = '<div class="loading">Cargando detalles del juego...</div>';
    }
}

// Mostrar error
function showError(message) {
    const gameContent = document.querySelector('.game-content');
    gameContent.innerHTML = `
        <div class="error">
            <h2>Error</h2>
            <p>${message}</p>
            <button onclick="window.location.href='index.html'" class="btn-primary">
                Volver al Inicio
            </button>
        </div>
    `;
}

// Mostrar mensaje
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const colors = {
        success: '#2ed573',
        error: '#ff4757',
        info: '#00d4ff'
    };
    
    Object.assign(messageDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        backgroundColor: colors[type] || '#00d4ff'
    });
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}