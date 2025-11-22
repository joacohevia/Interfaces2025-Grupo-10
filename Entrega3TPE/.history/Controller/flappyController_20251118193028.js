import {vistaLaser} from "../View/flappyView.js";
import { modeloLaser } from "../Model/modeloLaser.js";

//LÓGICA PARA LASER ---------------------------
this.modeloLaser = new modeloLaser();
this.vistaLaser = new vistaLaser(canvas, this.modeloLaser);

//Crear el laser y lo repite
function CrearLaser(){
    // Crea el primer láser después de un delay
        setTimeout(() => {
            if (this.juegoActivo) {
                this.modeloLaser.crearParLasers();
            }
        }, 1500);

        // Continúa creando láseres cada intervalo
        this.intervaloCreacion = setInterval(() => {
            if (this.juegoActivo) {
                this.modelo.crearParLasers();
            }
        }, this.modelo.intervaloAparicion);
}

//Actualiza 
 // Actualiza el estado de los láseres (llamar en cada frame)
    actualizarJuego(astronautaX, astronautaY, astronautaAncho, astronautaAlto) {
        if (!this.juegoActivo) return { colision: false, puntuacion: 0 };

        // Actualiza posiciones
        this.modelo.actualizarLasers();

        // Verifica colisiones
        const hayColision = this.modelo.verificarColision(
            astronautaX, 
            astronautaY, 
            astronautaAncho, 
            astronautaAlto
        );

        if (hayColision) {
            this.vista.mostrarEfectoColision(
                astronautaX + astronautaAncho / 2, 
                astronautaY + astronautaAlto / 2
            );
        }

        // Renderiza
        this.vista.renderizar(this.modelo.obtenerLasers());

        return {
            colision: hayColision,
            puntuacion: this.modelo.obtenerPuntuacion()
        };
    }

     // Detiene el juego
    function detener() {
        this.juegoActivo = false;
        if (this.intervaloCreacion) {
            clearInterval(this.intervaloCreacion);
            this.intervaloCreacion = null;
        }
    }



