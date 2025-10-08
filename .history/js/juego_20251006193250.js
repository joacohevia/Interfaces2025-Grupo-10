'use strict';
// Funcionalidad básica para la página del juego
document.addEventListener('DOMContentLoaded', () => {
    // Manejadores para la interacción con las previsualizaciones
    setupPreviewInteractions();
    
    // Manejadores para el formulario de comentarios
    setupCommentForm();
    
    // Manejadores para el modal de imágenes
    setupImageModal();
    
    // Manejadores para el menú burger
    setupBurgerMenu();
    
    // Manejadores para el menú de usuario
    setupUserMenu();
    
    // Configurar carousel de screenshots
    setupScreenshotCarousel();
});

function setupPreviewInteractions() {
    const previews = document.querySelectorAll('.preview-item');
    
    previews.forEach(preview => {
        preview.addEventListener('mouseenter', () => {
            preview.style.transform = 'scale(1.05)';
            preview.style.transition = 'transform 0.3s ease';
        });
        
        preview.addEventListener('mouseleave', () => {
            preview.style.transform = 'scale(1)';
        });
    });
}

function setupCommentForm() {
    const form = document.querySelector('.comment-form');
    const textarea = form.querySelector('textarea');
    const cancelBtn = form.querySelector('.cancel-btn');
    const publishBtn = form.querySelector('.publish-btn');

    // Formulario mockeado - solo funcionalidad visual
    cancelBtn.addEventListener('click', () => {
        textarea.value = '';
    });

    publishBtn.addEventListener('click', () => {
        // Agregar clase loading para activar la animación
        publishBtn.classList.add('loading');
        
        // Después de 1.5 segundos, quitar la clase y limpiar el textarea
        setTimeout(() => {
            publishBtn.classList.remove('loading');
            textarea.value = '';
            console.log('Comentario mockeado - formulario no funcional');
        }, 1500);
    });
}

function setupImageModal() {
    const screenshots = document.querySelectorAll('.screenshot img');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.getElementById('modalClose');

    screenshots.forEach(img => {
        img.addEventListener('click', function() {
            modalImage.src = this.src;
            modalImage.alt = this.alt;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
        });
    });

    // Cerrar modal con botón X
    closeBtn.addEventListener('click', closeModal);

    // Cerrar modal haciendo clic fuera de la imagen
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restaurar scroll
    }
}

// btn share
document.addEventListener('DOMContentLoaded', function() {
    initializeShareFunctionality();
});

function initializeShareFunctionality() {
    // Share button functionality
    const shareBtn = document.querySelector('.share-btn');
    const shareDropdown = document.querySelector('.share-dropdown');
    
    if (shareBtn && shareDropdown) {
        shareBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Agregar animación de clic
            shareBtn.classList.add('clicked');
            
            // Quitar la clase después de la animación
            setTimeout(() => {
                shareBtn.classList.remove('clicked');
            }, 800);
            
            shareDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!shareBtn.contains(e.target) && !shareDropdown.contains(e.target)) {
                shareDropdown.classList.remove('show');
            }
        });
    }
    /*
    
    // Social media sharing functionality
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const platform = this.dataset.platform;
            shareToSocialMedia(platform);
        });
    });
    
    // Expand button functionality (placeholder)
    const expandBtn = document.querySelector('.expand-btn');
    if (expandBtn) {
        expandBtn.addEventListener('click', function() {
            console.log('Expandir juego');
            // Here you can add functionality to expand the game
        });
    }
}*/

function shareToSocialMedia(platform) {
    const gameUrl = window.location.href;
    const gameTitle = 'Peg Solitaire - GameZone';
    const gameDescription = 'Ven a jugar Peg Solitaire en GameZone! Un juego clásico de estrategia.';
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(gameUrl)}&text=${encodeURIComponent(gameTitle + ' - ' + gameDescription)}`;
            break;
        case 'instagram':
            // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
            navigator.clipboard.writeText(`${gameTitle} - ${gameDescription} ${gameUrl}`).then(() => {
                alert('¡Enlace copiado al portapapeles! Pégalo en tu historia de Instagram.');
            }).catch(() => {
                prompt('Copia este enlace para Instagram:', `${gameTitle} - ${gameDescription} ${gameUrl}`);
            });
            return;
        case 'gmail':
            shareUrl = `mailto:?subject=${encodeURIComponent(gameTitle)}&body=${encodeURIComponent(gameDescription + ' ' + gameUrl)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(gameTitle + ' - ' + gameDescription + ' ' + gameUrl)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Configurar menú burger
function setupBurgerMenu() {
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

// Configurar menú de usuario
function setupUserMenu() {
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

// Funcionalidad del carousel de screenshots
function setupScreenshotCarousel() {
    const screenshots = document.querySelectorAll('.screenshot');
    const totalScreenshots = screenshots.length;
    
    console.log('TOTAL SCREENSHOTS ENCONTRADAS:', totalScreenshots);
    
    if (totalScreenshots === 0) {
        console.log('NO SE ENCONTRARON SCREENSHOTS');
        return;
    }
    
    let currentIndex = Math.floor(totalScreenshots / 2); // Empezar en el medio
    
    function updateCarousel() {
        screenshots.forEach((screenshot, index) => {
            screenshot.classList.remove('active', 'prev', 'next');
            
            if (index === currentIndex) {
                screenshot.classList.add('active');
            } else if (index === currentIndex - 1 || (currentIndex === 0 && index === totalScreenshots - 1)) {
                screenshot.classList.add('prev');
            } else if (index === currentIndex + 1 || (currentIndex === totalScreenshots - 1 && index === 0)) {
                screenshot.classList.add('next');
            }
        });


    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalScreenshots;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalScreenshots) % totalScreenshots;
        updateCarousel();
    }
    
    let hoverTimeout = null;
    
    // AGREGAR EVENTOS A TODAS LAS IMÁGENES
    screenshots.forEach((screenshot, index) => {
        console.log('AGREGANDO EVENTOS A IMAGEN', index);
        
        // CLICK DIRECTO
        screenshot.addEventListener('click', function() {
            console.log('CLICK EN IMAGEN', index);
            currentIndex = index;
            updateCarousel();
        });
        
        // HOVER SIMPLE
        /*screenshot.addEventListener('mouseenter', function() {
            console.log('MOUSE ENTER EN IMAGEN', index);
            setTimeout(() => {
                console.log('EJECUTANDO CAMBIO A IMAGEN', index);
                currentIndex = index;
                updateCarousel();
            }, 2000);
        });*/
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Controles de navegación
    const prevNavBtn = document.getElementById('prevNav');
    const nextNavBtn = document.getElementById('nextNav');
    
    if (prevNavBtn) {
        prevNavBtn.addEventListener('click', prevSlide);
    }
    
    if (nextNavBtn) {
        nextNavBtn.addEventListener('click', nextSlide);
    }
    
    // Auto-play opcional (comentado por defecto)
    // setInterval(nextSlide, 5000);
    
    // Inicializar carousel
    updateCarousel();

    
}

// Agregar setup del carousel al DOMContentLoaded
