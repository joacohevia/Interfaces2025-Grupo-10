class ModeloMeteorito {
    constructor(anchoJuego, altoJuego) {
        this.anchoJuego = anchoJuego;
        this.altoJuego = altoJuego;
        this.meteoritos = [];
        this.velocidad = 5; // Más rápidos que los lásers
        this.ancho = 40;    // Tamaño del meteorito 
        this.alto = 40;
        
        this.aparecen = false; // Empiezan desactivados
    }

    activar() {
        this.aparecen = true;
    }

    crearMeteorito() {
        // Solo si ya están activados por dificultad
        if (!this.aparecen) return;

        // Posición Y aleatoria
        const maxY = this.altoJuego - this.alto;
        const yAleatorio = Math.floor(Math.random() * maxY);

        this.meteoritos.push({
            x: this.anchoJuego,
            y: yAleatorio,
            width: this.ancho,
            height: this.alto
        });
    }

    actualizar() {
        this.meteoritos.forEach(m => {
            m.x -= this.velocidad;
        });

        // Eliminar los que salieron de pantalla
        if (this.meteoritos.length > 0 && this.meteoritos[0].x + this.ancho < 0) {
            this.meteoritos.shift();
        }
    }

    verificarColision(astroX, astroY, astroAncho, astroAlto) {
        const padding = 5; 

        for (let m of this.meteoritos) {
            if (astroX + astroAncho - padding > m.x + padding && 
                astroX + padding < m.x + m.width - padding &&
                astroY + astroAlto - padding > m.y + padding &&
                astroY + padding < m.y + m.height - padding) {
                return true;
            }
        }
        return false;
    }

    reiniciar() {
        this.meteoritos = [];
        this.aparecen = false;
    }
}

export { ModeloMeteorito };

