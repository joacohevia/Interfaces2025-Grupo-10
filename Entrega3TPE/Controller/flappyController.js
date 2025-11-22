import { VistaLaser } from "../View/vistaLaser.js";
import {modeloLaser} from "../Model/modeloLaser.js";

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
            gameScreen.addEventListener("keydown", (e) => this.readKey(e));
        }
    }

  
    readKey(e) {
        let key = e.code;
        switch (key) {
            case "Space":
                e.preventDefault();
                this.jump(); 
                break;
        }
    }

    jump() {
        const astronauta = document.getElementById("astronauta");
        if (!astronauta) return; // Protección por si no existe

        astronauta.classList.add("astronauta-on-shift");
        astronauta.addEventListener("animationend", function handler() {
            astronauta.classList.remove("astronauta-on-shift");
            astronauta.removeEventListener("animationend", handler);
        });
    }

    iniciar() {
        if (this.juegoActivo) return;
        
        console.log("Juego iniciado");
        this.juegoActivo = true;
        
        // Ocultar botón
        this.vista.ocultarBoton();
        
        // Reiniciar modelo
        this.modelo.reiniciar();
        
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
         this.modelo.verificarPunto(astronautaData.x);

        //5. Verificar colision
        const colision = this.modelo.verificarColision(
            astronautaData.x,
            astronautaData.y,
            astronautaData.ancho,
            astronautaData.alto
        );

        if (colision) {
            this.perder(astronautaData);
            return;
        }

        // 4. Renderizar
        this.vista.renderizar(this.modelo.obtenerLasers());
        this.vista.mostrarPuntos(this.modelo.puntos);
        // 5. Siguiente frame
        requestAnimationFrame(this.loop);
    }
    }

    perder() {
        this.juegoActivo = false;
        clearInterval(this.intervaloCreacion);
        
        // this.vista.mostrarExplosion(this.astronauta.x, this.astronauta.y);
        
        console.log("¡Perdiste!");
        
        // Mostrar botón para reintentar
        setTimeout(() => {
            this.vista.mostrarBoton('REINTENTAR');
        }, 1000);
    }
}

//inicialización
window.onload = function() {
    const juego = new FlappyController();
    console.log("Juego cargado. Haz clic en JUGAR para comenzar.");
};

