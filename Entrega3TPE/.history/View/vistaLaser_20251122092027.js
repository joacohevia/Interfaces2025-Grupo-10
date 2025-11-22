export class VistaLaser {
   constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.btn = document.getElementById('btnIniciar');
        
        if (!this.canvas) {
            console.error("Error: No se encontró el canvas con id 'gameCanvas'");
            return;
        }

        if (!this.btn) {
            console.error("Error: No se encontró el botón con id 'btnIniciar'");
        }

        this.ctx = this.canvas.getContext('2d');
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

        // Efecto Neón
        this.ctx.fillStyle = '#ff0055'; 
        this.ctx.shadowBlur = 15;       
        this.ctx.shadowColor = '#ff0055';

        lasers.forEach(par => {
            // Arriba
            this.ctx.fillRect(par.x, 0, ancho, par.arriba.alto);
            // Abajo
            this.ctx.fillRect(par.x, par.abajo.y, ancho, par.abajo.alto);
            
            // Borde estético
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(par.x, 0, ancho, par.arriba.alto);
            this.ctx.strokeRect(par.x, par.abajo.y, ancho, par.abajo.alto);
        });

        this.ctx.shadowBlur = 0;
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

    mostrarBoton(texto = 'JUGAR') {
        if (this.btn) {
            this.btn.style.display = 'block';
            this.btn.innerText = texto;
        }
    }
};