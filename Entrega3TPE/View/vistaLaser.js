export class VistaLaser {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.btn = document.getElementById('btnIniciar');

        this.astronauta = document.getElementById("astronauta");
        console.log("Astronauta cargado:", this.astronauta);

        if (!this.canvas) {
            console.error("Error: No se encontró el canvas con id 'gameCanvas'");
            return;
        }

        if (!this.btn) {
            console.error("Error: No se encontró el botón con id 'btnIniciar'");
        }

        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        if (this.canvas.parentElement) {
            this.canvas.parentElement.style.overflow = 'hidden';
            this.canvas.parentElement.style.position = 'relative';
        }
        this.btnReiniciar = document.getElementById('btnReiniciarMini');

        this.astronauta = null;

        // Variables físicas
        // POSICIÓN INICIAL: centro vertical del canvas
        this.y = Math.round(this.canvas.height / 2);
        this.velocidad = 0;
        this.gravedad = 0.8;     // empuje hacia abajo
        this.impulso = -11;    // fuerza del salto
        this.enAire = false;

        // bandera: la gravedad solo se aplica cuando se activa
        this.gravedadActiva = false;

        this.iniciarLoop();

    }


    iniciarLoop() {
        const actualizar = () => {

            if (!this.astronauta) {
                this.astronauta = document.getElementById("astronauta");
            }

            if (this.gravedadActiva) {
                // GRAVEDAD solo cuando está activa
                this.velocidad += this.gravedad;
                this.y += this.velocidad;
            } else {
                // sin gravedad, mantener velocidad cero
                this.velocidad = 0;
            }

            // LÍMITE INFERIOR (suelo imaginario)
            let suelo = window.innerHeight - 300;
            if (this.y > suelo) {
                this.y = suelo;
                this.velocidad = 0;
            }

            // LÍMITE SUPERIOR
            if (this.y < 0) {
                this.y = 0;
                this.velocidad = 0;
            }

            // Aplicar la posición al astronauta (si existe)
            if (this.astronauta) {
                this.astronauta.style.top = this.y + "px";
            }

            requestAnimationFrame(actualizar);
        };

        requestAnimationFrame(actualizar);
    }




    get ancho() {
        return this.canvas.width;
    }

    get alto() {
        return this.canvas.height;
    }


    limpiar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderizar(datosLasers) {
        const { lasers, ancho } = datosLasers;

        lasers.forEach(par => {
            // LÁSER DE ARRIBA
            this.ctx.save();

            // Efecto neón rosa intenso
            this.ctx.shadowBlur = 25;
            this.ctx.shadowColor = '#b64605ff';
            this.ctx.fillStyle = '#b64605ff';

            this.ctx.fillRect(par.x, 0, ancho, par.arriba.alto);

            // Borde brillante
            this.ctx.strokeStyle = '#db621cff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(par.x, 0, ancho, par.arriba.alto);

            // Núcleo brillante central
            this.ctx.fillStyle = '#db621cff';
            this.ctx.fillRect(par.x + ancho / 3, 0, ancho / 3, par.arriba.alto);

            this.ctx.restore();

            // LÁSER DE ABAJO
            this.ctx.save();

            this.ctx.shadowBlur = 25;
            this.ctx.shadowColor = '#b64605ff';
            this.ctx.fillStyle = '#db621cff';

            this.ctx.fillRect(par.x, par.abajo.y, ancho, par.abajo.alto);

            this.ctx.strokeStyle = '#db621cff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(par.x, par.abajo.y, ancho, par.abajo.alto);

            this.ctx.fillStyle = '#db621cff';
            this.ctx.fillRect(par.x + ancho / 3, par.abajo.y, ancho / 3, par.abajo.alto);

            this.ctx.restore();
        });
    }

    limpiar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    mostrarExplosion(x, y) {
        this.ctx.fillStyle = 'orange';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 40, 0, Math.PI * 2);
        this.ctx.fill();
    }

    ocultarBoton() {
        if (this.btn) {
            this.btn.style.display = 'none';
        }
    }

    mostrarPuntos(puntos) {
        const divPuntos = document.getElementById('puntuacion');
        if (divPuntos) {
            divPuntos.innerText = `Puntos: ${puntos}`;
        }
    }

    mostrarBoton(texto = 'JUGAR') {
        if (this.btn) {
            this.btn.style.display = 'block';
            this.btn.innerText = texto;
        }
    }


    jump() {
        if (!this.astronauta) {
            this.astronauta = document.getElementById("astronauta");
        }

        // Aplicar impulso hacia arriba
        this.velocidad = this.impulso;

        // Cambiar animación al saltar
        this.astronauta.classList.add("astronauta-on-shift");
        this.astronauta.classList.remove("astronauta-quieto");

        // Volver a la animación quieta cuando termina la animación del sprite
        this.astronauta.addEventListener(
            "animationend",
            function handler() {
                this.astronauta.classList.remove("astronauta-on-shift");
                this.astronauta.classList.add("astronauta-quieto");
                this.astronauta.removeEventListener("animationend", handler);
            }.bind(this)
        );
    }



    animarColision() {
        console.log("Entró a animarColision()");
        if (!this.astronauta) {
            console.warn("Astronauta NO encontrado en animarColision()");
            return;
        }
        this.astronauta.classList.add("astronauta-on-hurt");
        this.astronauta.addEventListener("animationend", function handler() {
            this.astronauta.classList.remove("astronauta-on-hurt");
            this.astronauta.removeEventListener("animationend", handler);
        }.bind(this));
        //Porque dentro de un event listener, this pasa a ser el elemento del 
        // DOM que disparó el evento (astronauta), NO tu clase
    }

    // métodos nuevos/útiles
    activarFisica() {
        this.gravedadActiva = true;
    }

    desactivarFisica() {
        this.gravedadActiva = false;
        this.velocidad = 0;
    }

    reiniciarPosicion() {
        // centrar verticalmente y resetear velocidad/animaciones
        this.y = Math.round(this.canvas.height / 2);
        this.velocidad = 0;
        if (!this.astronauta) this.astronauta = document.getElementById("astronauta");
        if (this.astronauta) {
            this.astronauta.style.top = this.y + "px";
            this.astronauta.classList.remove("astronauta-on-shift", "astronauta-on-hurt");
            this.astronauta.classList.add("astronauta-quieto");
        }
    }
};

