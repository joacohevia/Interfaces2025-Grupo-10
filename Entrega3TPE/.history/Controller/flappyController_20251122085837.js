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
        this.btnIniciar = document.getElementById('btnIniciar');
    }

    iniciar() {
        this.juegoActivo = true;
        this.crearGeneradorLasers();
        requestAnimationFrame(this.loop);
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

    detener() {
        this.juegoActivo = false;
        if (this.intervaloCreacion) {
            clearInterval(this.intervaloCreacion);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FlappyController();
});