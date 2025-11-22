export class vistaLaser {
    constructor(canvas, modelo) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.modelo = modelo;
    }

    renderizar(datos) {
        const { lasers, ancho } = datos;

        // Estilo del Laser (Efecto Neón)
        this.ctx.fillStyle = '#ff0055'; // Color principal (rojo/rosa neón)
        this.ctx.shadowBlur = 20;       // Resplandor
        this.ctx.shadowColor = '#ff0055';

        lasers.forEach(par => {
            // Dibujar Laser Arriba
            this.ctx.fillRect(par.x, 0, ancho, par.arriba.alto);

            // Dibujar Laser Abajo
            this.ctx.fillRect(par.x, par.abajo.y, ancho, par.abajo.alto);
            
            // Dibujar bordes (opcional, para dar detalle metálico)
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(par.x, 0, ancho, par.arriba.alto);
            this.ctx.strokeRect(par.x, par.abajo.y, ancho, par.abajo.alto);
        });

        // Restaurar sombras para no afectar otros dibujos
        this.ctx.shadowBlur = 0;
    }

    limpiar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    mostrarEfectoColision(x, y) {
        // Dibujar una explosión simple
        this.ctx.beginPath();
        this.ctx.arc(x, y, 30, 0, Math.PI * 2);
        this.ctx.fillStyle = 'orange';
        this.ctx.fill();
        this.ctx.closePath();
    }
}