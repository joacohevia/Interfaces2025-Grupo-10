import { estrellaModel } from "../Model/estrellaModel.js";
import { modeloLaser } from "../Model/modeloLaser.js";
import { ModeloMeteorito } from "../Model/modeloMeteorito.js";
import { estrellaVista } from "../View/estrellaVista.js";
import { VistaLaser } from "../View/vistaLaser.js";
import { VistaMeteorito } from "../View/VistaMeteorito.js";

class FlappyController {

    constructor() {
        // Instanciar Vista primero
        this.vista = new VistaLaser();
        // Instanciar Modelo con las dimensiones de la vista
        this.modelo = new modeloLaser(this.vista.ancho, this.vista.alto);
        this.vistaMeteorito = new VistaMeteorito();
        this.modeloMeteorito = new ModeloMeteorito(this.vista.ancho, this.vista.alto);

        this.modeloEstrella = new estrellaModel(this.vista.ancho, this.vista.alto);
        this.vistaEstrella = new estrellaVista(this.vista.ctx);
        this.intervaloEstrellas = null;


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

        if (this.vista.btnGanar) {
            this.vista.btnGanar.addEventListener('click', (e) => {
                e.stopPropagation();
                this.modelo.puntos = 900;
                this.vista.mostrarPuntos(900);
                this.ganar();
            });
        }

        this.readKey = this.readKey.bind(this);

        // Configurar controles de teclado
        this.configurarControles();
        this.intervaloMeteoritos = null;

    }

    // Método para configurar el teclado
    configurarControles() {
        let gameScreen = document.querySelector(".grid-contenedor");
        if (gameScreen) {
            gameScreen.tabIndex = 0;
            gameScreen.focus();
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
        this.modeloMeteorito.reiniciar();

        // Reiniciar posición del astronauta al centro y activar la física
        if (this.vista.reiniciarPosicion) this.vista.reiniciarPosicion();
        if (this.vista.activarFisica) this.vista.activarFisica();

        this.vista.mostrarPuntos(0);

        // Crear obstáculos
        this.crearGeneradorLasers();
        this.crearGeneradorMeteoritos();

        //crea estrellas
        this.modeloEstrella.reiniciar();
        this.crearGeneradorEstrellas();


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

    crearGeneradorMeteoritos() {
        if (this.intervaloMeteoritos) clearInterval(this.intervaloMeteoritos);
        // Crea un meteorito cada 2.5 segundos
        this.intervaloMeteoritos = setInterval(() => {
            if (this.juegoActivo) {
                this.modeloMeteorito.crearMeteorito();
            }
        }, 2500);
    }

    loop() {
        if (!this.juegoActivo) return;

        // 1. Limpiar
        this.vista.limpiar();

        // 2. Actualizar lógica
        this.modelo.actualizarLasers();
        this.modeloMeteorito.actualizar();
        this.modeloEstrella.actualizarEstrellas();

        if (this.modelo.puntos >= 5 && !this.modeloMeteorito.aparecen) {
            console.log("Lluvia de meteoritos activada");
            this.modeloMeteorito.activar();
        }
        if (this.modelo.puntos >= 5 && !this.modeloEstrella.aparecen) {
            console.log("Estrellas activadas");
            this.modeloEstrella.activar();
        }


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
                if (this.modelo.puntos >= 900) {
                    this.ganar();
                    return;
                }
                // SOLO si sumó punto, actualiza la vista HTML
                this.vista.mostrarPuntos(this.modelo.puntos);
            }

            //5. Verificar colision
            const colision = this.modelo.verificarColision(astronautaData.x, astronautaData.y, astronautaData.ancho, astronautaData.alto);

            const colisionMeteorito = this.modeloMeteorito.verificarColision(astronautaData.x, astronautaData.y, astronautaData.ancho, astronautaData.alto);

            if (colision || colisionMeteorito) {
                this.vista.animarColision();
                this.perder();
                return;
            }

            const colisionEstrella = this.modeloEstrella.verificarColisionEstrella(astronautaData.x, astronautaData.y, astronautaData.ancho, astronautaData.alto);

            if (colision) {
                this.vista.animarColision();
                this.perder(astronautaData);
                return;
            }

            // 4. Renderizar
            this.vista.renderizar(this.modelo.obtenerLasers());
            // 5. Siguiente frame
            requestAnimationFrame(this.loop);


            if (colisionEstrella) {
                console.log("Sumaste una estrella! + 5 puntos");

                // 1. Sumar puntos al modelo
                this.modelo.puntos += 5;

                // 2. Actualizar la vista
                this.vista.mostrarPuntos(this.modelo.puntos);

                // 3. Verificar si ganó con estos puntos extra
                if (this.modelo.puntos >= 900) {
                    this.ganar();
                }
            }
        }

        // 4. Renderizar
        this.vista.renderizar(this.modelo.obtenerLasers());
        this.vistaMeteorito.renderizar(this.modeloMeteorito.meteoritos);
        this.vistaEstrella.renderizar(this.modeloEstrella.estrellas);

        // 5. Siguiente frame
        requestAnimationFrame(this.loop);
    }

    forzarReinicio() {
        console.log("Reiniciando partida...");

        // 1. Detener la generación de obstáculos actual
        if (this.intervaloCreacion) {
            clearInterval(this.intervaloCreacion);
            clearInterval(this.intervaloMeteoritos);
        }

        // 2. Resetear estado interno
        this.juegoActivo = false;

        // 3. Llamar a iniciar (que se encarga de limpiar modelo y vista)
        this.iniciar();
    }



    ganar() {
        console.log("Juego Ganado!");
        this.juegoActivo = false;
        // Detener generadores
        clearInterval(this.intervaloCreacion); // Láseres
        if (this.intervaloMeteoritos) clearInterval(this.intervaloMeteoritos); // Meteoritos
        // Mostrar animación
        this.vista.mostrarVictoria();
    }

    perder() {
        this.juegoActivo = false;
        clearInterval(this.intervaloCreacion);
        clearInterval(this.intervaloMeteoritos);
        clearInterval(this.intervaloEstrellas);

        if (this.vista.desactivarFisica) this.vista.desactivarFisica();

        // this.vista.mostrarExplosion(this.astronauta.x, this.astronauta.y);

        // Mostrar botón para reintentar
        setTimeout(() => {
            this.vista.mostrarBoton('REINTENTAR');
        }, 500);
    }

    //ESTRELLAS--------------------------------------
    crearGeneradorEstrellas() {
        if (this.intervaloEstrellas) clearInterval(this.intervaloEstrellas);

        // Generar cada 2.2s (ajustable)
        this.intervaloEstrellas = setInterval(() => {
            if (this.juegoActivo) {
                this.modeloEstrella.crearEstrella();
            }
        }, 2200);
    }


    //inicialización
    window.onload = function () {
        const juego = new FlappyController();
        console.log("Juego cargado. Hace clic en JUGAR para comenzar.");
    }
    
};




