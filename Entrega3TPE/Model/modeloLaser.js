class modeloLaser {
        constructor(anchoJuego, altoJuego) {
        this.lasers = []; 
        this.velocidad = 3; 
        this.anchoLaser = 2; 
        this.hueco = 200;
         this.intervaloAparicion = 1800;
        this.intervaloMinimo = 600;
        this.reduccionIntervalo = 50;
        this.limiteAncho = anchoJuego;
        this.limiteAlto = altoJuego;
        this.puntos= 0;
    }

    crearParLasers() {
    // Hueco variable entre 150 y 250
    const huecoAleatorio = Math.floor(Math.random() * (250 - 150 + 1)) + 150;
    
    // Altura variable del láser superior
    const minAltura = 60;
    const maxAltura = this.limiteAlto - huecoAleatorio - minAltura - 60;
    const alturaArriba = Math.floor(Math.random() * (maxAltura - minAltura + 1)) + minAltura;

    const nuevoPar = {
        x: this.limiteAncho, 
        arriba: { y: 0, alto: alturaArriba },
        abajo: { y: alturaArriba + huecoAleatorio, alto: this.limiteAlto - (alturaArriba + huecoAleatorio) },
        pasado: false,
    };

    this.lasers.push(nuevoPar);
    }
    aumentarDificultad() {
    if (this.intervaloAparicion > this.intervaloMinimo) {
        this.intervaloAparicion -= this.reduccionIntervalo;
        console.log("Dificultad aumentada! Intervalo:", this.intervaloAparicion);
    }
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
    verificarPunto(astronautaX) {
    this.lasers.forEach(laser => {
        // Si el astronauta pasó el láser y aún no contamos el punto
        if (!laser.pasado && astronautaX > laser.x + this.anchoLaser) {
            laser.pasado = true;
            this.puntos++;
            console.log("¡Punto! Total:", this.puntos);
            return true;
        }
    });
    return false;
}
    reiniciar() {
        this.lasers = [];
         this.puntos = 0;
    }
}
export { modeloLaser };