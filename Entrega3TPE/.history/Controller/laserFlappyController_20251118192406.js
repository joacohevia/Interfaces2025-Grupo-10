
//Crear el  y lo repite
function CrearLaser(){
    // Crea el primer láser después de un delay
        setTimeout(() => {
            if (this.juegoActivo) {
                this.modelo.crearParLasers();
            }
        }, 1500);

        // Continúa creando láseres cada intervalo
        this.intervaloCreacion = setInterval(() => {
            if (this.juegoActivo) {
                this.modelo.crearParLasers();
            }
        }, this.modelo.intervaloAparicion);
}

CrearLaser();