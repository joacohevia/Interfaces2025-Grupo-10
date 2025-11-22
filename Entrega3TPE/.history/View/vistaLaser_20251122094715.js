class VistaLaser {
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
            this.ctx.shadowColor = '#ff0055';
            this.ctx.fillStyle = '#ff0055';
            
            this.ctx.fillRect(par.x, 0, ancho, par.arriba.alto);
            
            // Borde brillante
            this.ctx.strokeStyle = '#ff66aa';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(par.x, 0, ancho, par.arriba.alto);
            
            // Núcleo brillante central
            this.ctx.fillStyle = '#ff3377';
            this.ctx.fillRect(par.x + ancho/4, 0, ancho/2, par.arriba.alto);
            
            this.ctx.restore();

            // LÁSER DE ABAJO
            this.ctx.save();
            
            this.ctx.shadowBlur = 25;
            this.ctx.shadowColor = '#ff0055';
            this.ctx.fillStyle = '#ff0055';
            
            this.ctx.fillRect(par.x, par.abajo.y, ancho, par.abajo.alto);
            
            this.ctx.strokeStyle = '#ff66aa';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(par.x, par.abajo.y, ancho, par.abajo.alto);
            
            this.ctx.fillStyle = '#ff3377';
            this.ctx.fillRect(par.x + ancho/4, par.abajo.y, ancho/2, par.abajo.alto);
            
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

    mostrarBoton(texto = 'JUGAR') {
        if (this.btn) {
            this.btn.style.display = 'block';
            this.btn.innerText = texto;
        }
    }
};
export { VistaLaser };