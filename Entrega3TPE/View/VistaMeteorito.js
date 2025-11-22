class VistaMeteorito {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Cargar la imagen
        this.imagen = new Image();
        this.imagen.src = './assets/imgFlappy/meteorito.png'; 
    }

    renderizar(meteoritos) {
        // Si la imagen no cargó todavía, no hace nada para evitar errores
        if (!this.imagen.complete) return;

        meteoritos.forEach(m => {
            this.ctx.drawImage(this.imagen, m.x, m.y, m.width, m.height);
        });
    }
}

export { VistaMeteorito };

