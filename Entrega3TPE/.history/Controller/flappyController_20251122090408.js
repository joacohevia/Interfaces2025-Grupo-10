import { vistaLaser } from "../View/vistaLaser.js";
import { modeloLaser } from "../Model/modeloLaser.js";

class FlappyController {
    constructor() {
        
        // Instanciar MVC
        this.modeloLaser = new modeloLaser();
        this.vistaLaser = new vistaLaser();

        // Estado del juego
        this.juegoActivo = false;
        this.intervaloCreacion = null;
        
        // ACA INSTANCIAR ASTRONAUTA

        // Iniciar juego
        if (this.vista.btn) {
            this.vista.btn.addEventListener('click', this.iniciar);
        }
    }

    iniciar() {
        if (this.juegoActivo) return;
        
        this.juegoActivo = true;
        
        // El controlador le ordena a la vista ocultar el botón
        this.vista.ocultarBoton();
        
        this.modelo.lasers = []; 
        this.crearObstaculos();
        this.loop();
    }

    crearGeneradorLasers() {
        // Crea el primer láser inmediatamente
        this.modeloLaser.crearParLasers();

        // Continúa creando láseres cada intervalo
        this.intervaloCreacion = setInterval(() => {
            if (this.juegoActivo) {
                this.modeloLaser.crearParLasers();
            }
        }, this.modeloLaser.intervaloAparicion);
    }

    loop() {
        if (!this.juegoActivo) return;

        // 1. Limpiar Canvas
        this.vistaLaser.limpiar();

        // 2. Actualizar Lógica
        this.modeloLaser.actualizarLasers();

        // 3. Verificar Colisiones (Usando el astronauta temporal)
        const colision = this.modeloLaser.verificarColision(
            this.dummyAstronauta.x,
            this.dummyAstronauta.y,
            this.dummyAstronauta.ancho,
            this.dummyAstronauta.alto
        );

        if (colision) {
            console.log("¡Colisión detectada!");
            this.vistaLaser.mostrarEfectoColision(this.dummyAstronauta.x, this.dummyAstronauta.y);
            this.detener(); // Detener el juego si choca
            return;
        }

        // 4. Renderizar
        this.vistaLaser.renderizar(this.modeloLaser.obtenerLasers());

        // 5. Siguiente Frame
        requestAnimationFrame(this.loop);
    }

    perder() {
        this.juegoActivo = false;
        clearInterval(this.intervaloCreacion); // Detener generación
        this.vista.mostrarExplosion(this.astronauta.x, this.astronauta.y);
        
        console.log("¡Perdiste!");
        
        // Mostrar botón de nuevo y cambiar texto
        this.btnIniciar.style.display = 'block';
        this.btnIniciar.innerText = "REINTENTAR";
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FlappyController();
});

