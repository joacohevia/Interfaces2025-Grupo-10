

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
            this.ctx.shadowColor = '#b64605ff';
            this.ctx.fillStyle = '#b64605ff';
            
            this.ctx.fillRect(par.x, 0, ancho, par.arriba.alto);
            
            // Borde brillante
            this.ctx.strokeStyle = '#db621cff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(par.x, 0, ancho, par.arriba.alto);
            
            // Núcleo brillante central
            this.ctx.fillStyle = '#db621cff';
            this.ctx.fillRect(par.x + ancho/3, 0, ancho/3, par.arriba.alto);
            
            this.ctx.restore();

            // LÁSER DE ABAJO
            this.ctx.save();
            
            this.ctx.shadowBlur = 25;
            this.ctx.shadowColor = '#b64605ff';
            this.ctx.fillStyle = '#db621cff';
            
            this.ctx.fillRect(par.x, par.abajo.y, ancho, par.abajo.alto);
            
            this.ctx.strokeStyle = '#db621cff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(par.x, par.abajo.y, ancho, par.abajo.alto);
            
            this.ctx.fillStyle = '#db621cff';
            this.ctx.fillRect(par.x + ancho/3, 0, ancho/3, par.arriba.alto);
            
            this.ctx.restore();
        });
    }
    mostrarPuntos(puntos) {
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Puntos: ${puntos}`, this.canvas.width / 2, 50);
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