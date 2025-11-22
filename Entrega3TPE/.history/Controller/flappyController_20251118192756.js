import {vistaLaser} from "../View/flappyView.js";
import { modeloLaser } from "../Model/modeloLaser.js";

//LÓGICA PARA LASER ---------------------------
this.modeloLaser = new modeloLaser();
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