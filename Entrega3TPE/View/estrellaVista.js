export class estrellaVista {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
    }

    renderizar(estrellas) {
        estrellas.forEach(e => {
            if (!e.recogida) {
                this.ctx.drawImage(e.img, e.x, e.y, e.ancho, e.alto);
            }
        });
    }
}
