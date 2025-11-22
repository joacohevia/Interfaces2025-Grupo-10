class modeloLaser {
    constructor() {
        this.lasers = []; // Array que guarda los pares de lasers
        this.velocidad = 3; // Qué tan rápido se mueven a la izquierda
        this.anchoLaser = 50; // Grosor del laser
        this.hueco = 120; // Espacio entre laser de arriba y abajo
        this.intervaloAparicion = 2000; // Milisegundos
        this.puntuacion = 0;
        
        // Dimensiones del juego (asumimos canvas de 800x400)
        this.canvasAncho = 800;
        this.canvasAlto = 400;
    }

    crearParLasers() {
        // Altura aleatoria para el laser de arriba
        const minAltura = 50;
        const maxAltura = this.canvasAlto - this.hueco - minAltura;
        const alturaArriba = Math.floor(Math.random() * (maxAltura - minAltura + 1)) + minAltura;

        // Creamos el objeto par de lasers
        const nuevoPar = {
            x: this.canvasAncho, // Empieza fuera de la pantalla a la derecha
            arriba: {
                y: 0,
                alto: alturaArriba
            },
            abajo: {
                y: alturaArriba + this.hueco,
                alto: this.canvasAlto - (alturaArriba + this.hueco)
            },
            pasado: false // Para contar puntos
        };

        this.lasers.push(nuevoPar);
    }

    actualizarLasers() {
        // Mover cada laser hacia la izquierda
        this.lasers.forEach(laser => {
            laser.x -= this.velocidad;
        });

        // Eliminar lasers que ya salieron de la pantalla (para no llenar la memoria)
        if (this.lasers.length > 0 && this.lasers[0].x + this.anchoLaser < 0) {
            this.lasers.shift();
        }
    }

    // Obtener datos para la vista
    obtenerLasers() {
        return {
            lasers: this.lasers,
            ancho: this.anchoLaser
        };
    }

    // Verificar si el astronauta chocó
    verificarColision(astroX, astroY, astroAncho, astroAlto) {
        // Tolerancia para que la colisión no sea tan injusta (hitbox más pequeña)
        const padding = 5; 

        for (let i = 0; i < this.lasers.length; i++) {
            let p = this.lasers[i];

            // 1. Chequear si estamos en la misma coordenada X que el laser
            if (astroX + astroAncho - padding > p.x && 
                astroX + padding < p.x + this.anchoLaser) {
                
                // 2. Chequear colisión con laser de ARRIBA
                if (astroY + padding < p.arriba.alto) {
                    return true;
                }

                // 3. Chequear colisión con laser de ABAJO
                if (astroY + astroAlto - padding > p.abajo.y) {
                    return true;
                }
            }
        }
        return false;
    }

    reiniciar() {
        this.lasers = [];
        this.puntuacion = 0;
    }
}