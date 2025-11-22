class modeloLaser {
        constructor(anchoJuego, altoJuego) {
        this.lasers = []; 
        this.velocidad = 3; 
        this.anchoLaser = 50; 
        this.hueco = 200;
        this.intervaloAparicion = 2000;
        
        this.limiteAncho = anchoJuego;
        this.limiteAlto = altoJuego;
    }

    crearParLasers() {
        const minAltura = 50;
        const maxAltura = this.limiteAlto - this.hueco - minAltura;
        const alturaArriba = Math.floor(Math.random() * (maxAltura - minAltura + 1)) + minAltura;

        const nuevoPar = {
            x: this.limiteAncho, 
            arriba: { y: 0, alto: alturaArriba },
            abajo: { y: alturaArriba + this.hueco, alto: this.limiteAlto - (alturaArriba + this.hueco) }
        };

        this.lasers.push(nuevoPar);
    }

    actualizarLasers() {
        this.lasers.forEach(laser => {
            laser.x -= this.velocidad;
        });

        if (this.lasers.length > 0 && this.lasers[0].x + this.anchoLaser < 0) {
            this.lasers.shift();
        }
    }

    obtenerLasers() {
        return {
            lasers: this.lasers,
            ancho: this.anchoLaser
        };
    }

    verificarColision(astroX, astroY, astroAncho, astroAlto) {
        const padding = 8; 

        for (let i = 0; i < this.lasers.length; i++) {
            let p = this.lasers[i];

            if (astroX + astroAncho - padding > p.x && 
                astroX + padding < p.x + this.anchoLaser) {
                
                if (astroY + padding < p.arriba.alto) return true;
                if (astroY + astroAlto - padding > p.abajo.y) return true;
            }
        }
        return false;
    }

    reiniciar() {
        this.lasers = [];
    }
}
export { modeloLaser };