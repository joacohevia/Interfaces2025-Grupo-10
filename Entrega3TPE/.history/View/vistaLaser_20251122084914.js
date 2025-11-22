/* =========================================
   1. VISTA (Se encarga del Canvas y el dibujo)
   ========================================= */
class VistaLaser {
    constructor() {
        // CORRECCIÓN: La Vista busca su propio elemento, el Controlador no lo toca.
        this.canvas = document.getElementById('gameCanvas');
        
        if (!this.canvas) {
            console.error("Error: No se encontró el canvas con id 'gameCanvas'");
            return;
        }

        this.ctx = this.canvas.getContext('2d');
    }

    // Métodos para que el controlador sepa el tamaño sin tocar el DOM
    get ancho() { return this.canvas.width; }
    get alto() { return this.canvas.height; }

    limpiar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // La vista recibe DATOS puros (posiciones), no el objeto Modelo entero
    renderizar(lasers, anchoLaser) {
        // Efecto Neón
        this.ctx.fillStyle = '#ff0055'; 
        this.ctx.shadowBlur = 15;       
        this.ctx.shadowColor = '#ff0055';

        lasers.forEach(par => {
            // Arriba
            this.ctx.fillRect(par.x, 0, anchoLaser, par.arriba.alto);
            // Abajo
            this.ctx.fillRect(par.x, par.abajo.y, anchoLaser, par.abajo.alto);
            
            // Borde estético
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(par.x, 0, anchoLaser, par.arriba.alto);
            this.ctx.strokeRect(par.x, par.abajo.y, anchoLaser, par.abajo.alto);
        });

        this.ctx.shadowBlur = 0;
    }

    mostrarExplosion(x, y) {
        this.ctx.fillStyle = 'orange';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 40, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

/* =========================================
   2. MODELO (Lógica matemática pura)
   ========================================= */
class ModeloLaser {
    constructor(anchoJuego, altoJuego) {
        this.lasers = []; 
        this.velocidad = 3; 
        this.anchoLaser = 50; 
        this.hueco = 120;
        this.intervaloAparicion = 2000;
        
        // El modelo conoce los límites, pero no sabe qué es un "canvas"
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
}

/* =========================================
   3. CONTROLADOR (Orquestador)
   ========================================= */
class JuegoController {
    constructor() {
        // 1. Instanciamos la VISTA primero
        this.vista = new VistaLaser(); // Ya no pasamos argumentos

        // 2. Instanciamos el MODELO usando las dimensiones que nos da la vista
        // Así el controlador hace de puente
        this.modelo = new ModeloLaser(this.vista.ancho, this.vista.alto);

        this.juegoActivo = false;
        this.intervaloCreacion = null;

        // Dummy Astronauta
        this.astronauta = { x: 100, y: 200, ancho: 40, alto: 40 };

        this.loop = this.loop.bind(this);
    }

    iniciar() {
        if(this.juegoActivo) return;
        this.juegoActivo = true;
        this.modelo.lasers = []; 

        this.crearObstaculos();
        requestAnimationFrame(this.loop);
    }

    crearObstaculos() {
        this.modelo.crearParLasers();
        this.intervaloCreacion = setInterval(() => {
            if (this.juegoActivo) {
                this.modelo.crearParLasers();
            }
        }, this.modelo.intervaloAparicion);
    }

    loop() {
        if (!this.juegoActivo) return;

        // Limpiar
        this.vista.limpiar();

        // Actualizar lógica
        this.modelo.actualizarLasers();

        // Verificar colisión
        const huboChoque = this.modelo.verificarColision(
            this.astronauta.x, 
            this.astronauta.y, 
            this.astronauta.ancho, 
            this.astronauta.alto
        );

        if (huboChoque) {
            this.perder();
            return;
        }

        // Renderizar: El controlador pasa los datos del modelo a la vista
        this.vista.renderizar(this.modelo.lasers, this.modelo.anchoLaser);

        requestAnimationFrame(this.loop);
    }

    perder() {
        this.juegoActivo = false;
        clearInterval(this.intervaloCreacion);
        this.vista.mostrarExplosion(this.astronauta.x, this.astronauta.y);
        console.log("¡Perdiste!");
    }
}

// Inicializar
window.onload = function() {
    // Asegurarse de que el HTML ya cargó el canvas
    const juego = new JuegoController();
    juego.iniciar();
};