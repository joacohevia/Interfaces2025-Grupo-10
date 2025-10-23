'use strict';

//carrousel home
function initializeCarousel(wrapper) {
    console.log('Inicializando carrusel para wrapper:', wrapper);

    if (!wrapper.classList.contains('carousel-wrapper')) {
        console.error('El wrapper no tiene la clase carousel-wrapper');
        return;
    }
    const gamesGrid = wrapper.querySelector('.games-grid');
    const carousel = wrapper.querySelector('.carousel');

    let prevBtn = wrapper.querySelector('button.carousel-btn.left');
    let nextBtn = wrapper.querySelector('button.carousel-btn.right');

    if (!gamesGrid) {
        console.error('No se encontró el grid de juegos');
        return;
    }

    if (gamesGrid.scrollWidth <= gamesGrid.offsetWidth) {
        //si el ancho del contenido es menor o igual al ancho visible del contenedor
      console.warn('El contenido no es desplazable. Verifica que haya suficientes elementos en el grid.');
    }

    const scrollAmount = Math.max(gamesGrid.offsetWidth * 0.3, 100);
    //obtiene el ancho y calcula el 30% de este, si es menor a 100, toma 100 como valor 

    // Clonar elementos para crear el efecto de bucle, excepto Blocka y Peg Solitaire
    const items = Array.from(gamesGrid.children).filter(item => {
        const title = item.querySelector('.game-title')?.textContent;
        return title !== 'Blocka' && title !== 'Peg Solitaire';
    });

    // Copiar listeners de click del original al clon
    function copyClickListeners(original, clone) {
        // Solo copia el click principal de la card
        clone.addEventListener('click', function(e) {
            // Busca el tipo de juego por el contenido
            const premiumIcon = clone.querySelector('.premium-icon');
            const title = clone.querySelector('.game-title')?.textContent;
            if (premiumIcon) {
                showPremiumPopup();
            } else if (!premiumIcon) {
                window.location.href = 'juego.html';
            }
        });
    }

    items.forEach((item) => {
        const cloneStart = item.cloneNode(true);
        const cloneEnd = item.cloneNode(true);
        copyClickListeners(item, cloneStart);
        copyClickListeners(item, cloneEnd);
        gamesGrid.appendChild(cloneEnd);
        gamesGrid.insertBefore(cloneStart, gamesGrid.firstChild);
    });

    // Ajustar el scroll inicial para que esté en el centro de los elementos clonados
    gamesGrid.scrollLeft = gamesGrid.scrollWidth / 3;//el ancho total de los elem



    // Event listeners para los botones
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Botón previo clickeado');
        if (gamesGrid.scrollLeft <= 0) {//si el scroll es 0(osea inicio)
          //salta el scroll hacia la derecha.Sumando 1/3 del ancho total
            gamesGrid.scrollLeft += gamesGrid.scrollWidth / 3; // Saltar al final
        }
        gamesGrid.scrollBy({//desplza el contenido
            left: -scrollAmount,//si left es - va a la izq
            behavior: 'smooth'//movimiento animado
        });
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Botón siguiente clickeado');
        if (gamesGrid.scrollLeft + gamesGrid.offsetWidth >= gamesGrid.scrollWidth) {
          //scrollLesft= cantidad de px desplazados a la izq
          //la suma representa el extremo derecho 
          //si el extremo derecho es mayor al final del contenido, estoy en el final
            gamesGrid.scrollLeft -= gamesGrid.scrollWidth / 3; //salto de nuevo al principio
        }
        gamesGrid.scrollBy({
            left: scrollAmount,//mueve a la der
            behavior: 'smooth'
        });
    });

    //cada vez que hace scrool llama a  
    gamesGrid.addEventListener('scroll', () => {
        requestAnimationFrame(updateButtonVisibility);
    });


    // Actualiza la visivilidad si cambia el tamaño del contenido
    const observer = new ResizeObserver(() => {
        requestAnimationFrame(updateButtonVisibility);
    });
    observer.observe(gamesGrid);
}

// Función para inicializar todos los carruseles
    function initializeCarousels() {
        if (window.screen.width > 768 && window.screen.height > 695) {    
            console.log('Buscando carruseles para inicializar...');
            const carouselWrappers = document.querySelectorAll('.carousel-wrapper');
            console.log(`Encontrados ${carouselWrappers.length} carruseles`);
            //${carouselWrappers.length} crea un NodeLists ya que hay varios elementos con esa clase
            carouselWrappers.forEach((wrapper, index) => {
            //wrapper pos actual, index numero de iteracion
                console.log(`Inicializando carrusel #${index + 1}`);
                // si no tiene id le asigna uno unico
                if (!wrapper.id) {
                    wrapper.id = `carousel-${index + 1}`;
                }
                initializeCarousel(wrapper);
            });
        }
}

// Exportar la función para uso global
window.initializeCarousels = initializeCarousels;

// Asegurarnos de que los carruseles se inicialicen después de que el contenido esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un momento para que los juegos se carguen
    setTimeout(() => {
        console.log('Iniciando inicialización de carruseles...');
        initializeCarousels();
    }, 1000);
});

