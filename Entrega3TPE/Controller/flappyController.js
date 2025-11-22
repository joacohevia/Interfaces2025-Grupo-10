import { modeloLaser } from "../Model/modeloLaser.js";
import { VistaLaser } from "../View/vistaLaser.js";

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

        if (this.vista.btnReiniciar) {
            this.vista.btnReiniciar.addEventListener('click', (e) => {
                // Evita que el click se propague y haga saltar al astronauta
                e.stopPropagation();
                this.forzarReinicio();
            });
        }

        this.readKey = this.readKey.bind(this);

        // Configurar controles de teclado
        this.configurarControles();

    }

    // Método para configurar el teclado
    configurarControles() {
        let gameScreen = document.querySelector(".grid-contenedor");
        if (gameScreen) {
            gameScreen.tabIndex = 0;
            gameScreen.focus();

            // Bind correcto para mantener 'this'
            gameScreen.addEventListener("keydown", this.readKey);
        }
    }


    readKey(e) {
        let key = e.code;
        switch (key) {
            case "Space":
                e.preventDefault();
                this.vista.jump();
                break;
        }
    }



    iniciar() {
        if (this.juegoActivo) return;

        this.configurarControles();  

        console.log("Juego iniciado");
        this.juegoActivo = true;

        // Ocultar botón
        this.vista.ocultarBoton();

        // Reiniciar modelo
        this.modelo.reiniciar();

        // Reiniciar posición del astronauta al centro y activar la física
        if (this.vista.reiniciarPosicion) this.vista.reiniciarPosicion();
        if (this.vista.activarFisica) this.vista.activarFisica();

        this.vista.mostrarPuntos(0);

        // Crear obstáculos
        this.crearGeneradorLasers();

        // Iniciar loop
        requestAnimationFrame(this.loop);
    }

    crearGeneradorLasers() {
        // Primer láser inmediato
        this.modelo.crearParLasers();

        // Función para recrear el intervalo con nueva velocidad
        const crearIntervalo = () => {
            if (this.intervaloCreacion) {
                clearInterval(this.intervaloCreacion);
            }

            this.intervaloCreacion = setInterval(() => {
                if (this.juegoActivo) {
                    this.modelo.crearParLasers();
                    this.modelo.aumentarDificultad();
                    crearIntervalo();
                }
            }, this.modelo.intervaloAparicion);
        };

        crearIntervalo();
    }

    loop() {
        if (!this.juegoActivo) return;

        // 1. Limpiar
        this.vista.limpiar();

        // 2. Actualizar lógica
        this.modelo.actualizarLasers();

        //3. Obtener posicion del astronauta
        const astronauta = document.getElementById("astronauta");
        if (astronauta) {
            const rect = astronauta.getBoundingClientRect();
            const canvasRect = this.vista.canvas.getBoundingClientRect(); 

            const astronautaData = {
                x: rect.left - canvasRect.left,
                y: rect.top - canvasRect.top,
                ancho: rect.width,
                alto: rect.height
            };


            //4. Verificar puntos
            const sumoPunto = this.modelo.verificarPunto(astronautaData.x);
            if (sumoPunto) {
                // SOLO si sumó punto, actualiza la vista HTML
                this.vista.mostrarPuntos(this.modelo.puntos);
            }

            //5. Verificar colision
            const colision = this.modelo.verificarColision(
                astronautaData.x,
                astronautaData.y,
                astronautaData.ancho,
                astronautaData.alto
            );

            if (colision) {
                this.vista.animarColision();
                this.perder(astronautaData);
                return;
            }

            // 4. Renderizar
            this.vista.renderizar(this.modelo.obtenerLasers());
            // 5. Siguiente frame
            requestAnimationFrame(this.loop);
        }
    }

    forzarReinicio() {
        console.log("Reiniciando partida...");

        // 1. Detener la generación de obstáculos actual
        if (this.intervaloCreacion) {
            clearInterval(this.intervaloCreacion);
        }

        // 2. Resetear estado interno
        this.juegoActivo = false;

        // 3. Llamar a iniciar (que se encarga de limpiar modelo y vista)
        this.iniciar();
    }

    perder() {
        this.juegoActivo = false;
        clearInterval(this.intervaloCreacion);

        // desactivar física al perder para que deje de moverse
        if (this.vista.desactivarFisica) this.vista.desactivarFisica();

        console.log("¡Perdiste!");

        // Mostrar botón para reintentar
        setTimeout(() => {
            this.vista.mostrarBoton('REINTENTAR');
        }, 1000);
    }
}

//inicialización
window.onload = function () {
    const juego = new FlappyController();
    console.log("Juego cargado. Haz clic en JUGAR para comenzar.");
};

