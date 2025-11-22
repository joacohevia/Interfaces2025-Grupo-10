import { VistaLaser } from "../View/vistaLaser.js";
import { modeloLaser } from "../Model/modeloLaser.js";

class FlappyController {
    constructor() {
        // Instanciar Vista primero
        this.vista = new VistaLaser();

        // Instanciar Modelo con las dimensiones de la vista
        this.modelo = new modeloLaser(this.vista.ancho, this.vista.alto);

        this.juegoActivo = false;
        this.intervaloCreacion = null;

        // Bind del loop
        this.loop = this.loop.bind(this);

        // Event listener del botón
        if (this.vista.btn) {
            this.vista.btn.addEventListener('click', () => this.iniciar());
        }
    }

    iniciar() {
        if (this.juegoActivo) return;
        
        console.log("Juego iniciado");
        this.juegoActivo = true;
        
        // Ocultar botón
        this.vista.ocultarBoton();
        
        // Reiniciar modelo
        this.modelo.reiniciar();
        
        // Crear obstáculos
        this.crearGeneradorLasers();
        
        // Iniciar loop
        requestAnimationFrame(this.loop);
    }

    crearGeneradorLasers() {
        // Primer láser inmediato
        this.modelo.crearParLasers();

        // Crear láseres periódicamente
        this.intervaloCreacion = setInterval(() => {
            if (this.juegoActivo) {
                this.modelo.crearParLasers();
            }
        }, this.modelo.intervaloAparicion);
    }

    loop() {
        if (!this.juegoActivo) return;

        // 1. Limpiar
        this.vista.limpiar();

        // 2. Actualizar lógica
        this.modelo.actualizarLasers();

        /*// 3. Verificar colisión ------------------------HAY QUE HACERLO CUANDO TENGA EL ASTRONAUTA
        const colision = this.modelo.verificarColision(
            this.astronauta.x, 
            this.astronauta.y, 
            this.astronauta.ancho, 
            this.astronauta.alto
        );

        if (colision) {
            this.perder();
            return;
        }*/

        // 4. Renderizar
        this.vista.renderizar(this.modelo.obtenerLasers());

        // 5. Siguiente frame
        requestAnimationFrame(this.loop);
    }

    perder() {
        this.juegoActivo = false;
        clearInterval(this.intervaloCreacion);
        
        this.vista.mostrarExplosion(this.astronauta.x, this.astronauta.y);
        
        console.log("¡Perdiste!");
        
        // Mostrar botón para reintentar
        setTimeout(() => {
            this.vista.mostrarBoton('REINTENTAR');
        }, 1000);
    }
}

/* =========================================
   4. INICIALIZACIÓN
   ========================================= */
window.onload = function() {
    const juego = new FlappyController();
    console.log("✅ Juego cargado. Haz clic en JUGAR para comenzar.");
};

export { FlappyController };