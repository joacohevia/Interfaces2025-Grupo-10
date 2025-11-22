export class estrellaModel {

    constructor(anchoJuego, altoJuego) {
        this.imgEstrella = this.cargarImagen();
        this.estrellas = [];                 // Lista de estrellas activas
        this.tamaño = 40;                    // Tamaño estándar de la estrella
        
        this.intervaloAparicion = 2500;      // Tiempo entre estrellas
        this.limiteAncho = anchoJuego;
        this.limiteAlto = altoJuego;
    }

    cargarImagen() {
        const img = new Image();
        img.src = "./assets/imgFlappy/estrella.png";
        return img;
    }

    crearEstrella() {
        // Evitar que se acumulen demasiado juntas
        if (this.estrellas.length > 0) {
            const ultima = this.estrellas[this.estrellas.length - 1];
            const distancia = this.limiteAncho - ultima.x;
            if (distancia < 350) return;
        }

        const posY = Math.floor(
            Math.random() * (this.limiteAlto - this.tamaño - 50)
        );

        const nuevaEstrella = {
            x: this.limiteAncho,
            y: posY,
            ancho: this.tamaño,
            alto: this.tamaño,
            img: this.imgEstrella,
            recogida: false
        };

        console.log("⭐ Estrella creada:", nuevaEstrella);

        this.estrellas.push(nuevaEstrella);
    }

    // ---- COLISION ----
    _colisiona(estrella, ax, ay, aw, ah) {
        return (
            ax < estrella.x + estrella.ancho &&
            ax + aw > estrella.x &&
            ay < estrella.y + estrella.alto &&
            ay + ah > estrella.y
        );
    }

    verificarColisionEstrella(astroX, astroY, astroAncho, astroAlto) {
        for (let estrella of this.estrellas) {
            if (estrella.recogida) continue;

            if (this._colisiona(estrella, astroX, astroY, astroAncho, astroAlto)) {
                estrella.recogida = true;
                console.log("⭐ ¡Estrella recogida!");
                return true;
            }
        }
        return false;
    }

    actualizarEstrellas() {
        // No se mueven, solo se eliminan cuando están recogidas
        this.estrellas = this.estrellas.filter(e => !e.recogida);
    }

    obtenerEstrellas() {
        return this.estrellas;
    }

    reiniciar() {
        this.estrellas = [];
        this.aparecen = false;
    }
}
