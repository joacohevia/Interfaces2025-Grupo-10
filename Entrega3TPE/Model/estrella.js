export class Estrella {
    constructor(x, y, ancho, alto,img) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;

        this.img = img;
        this.recogida = false; 
    }

  

    colisiona(ax, ay, aw, ah) {
        return (
            ax < this.x + this.ancho &&
            ax + aw > this.x &&
            ay < this.y + this.alto &&
            ay + ah > this.y
        );
    }
}
