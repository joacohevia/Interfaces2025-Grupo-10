// Vista: VistaTableroCanvas (usa canvas que ya está en el HTML).
// Recibe el elemento canvas en el constructor; no crea elementos DOM por su cuenta.
// Expone onCeldaClic(callback) y métodos setEstado() y render().

export class VistaTableroCanvas {
  constructor(canvasElement) {
    if (!(canvasElement instanceof HTMLCanvasElement)) {
      throw new Error('Se requiere un elemento <canvas>');
    }
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    //cuando el user hace click
    this.onCeldaClic = null;
    this.estado = null;//es un obj con la info de la vista
    // (usa los atributos width/height del canvas)
    this._ajustarBufferSegunDPR();
    // crear el handler como arrow function para mantener el contexto
    this._clickHandler = (ev) => this._manejarClick(ev);
    // registramos el evento click
    this.canvas.addEventListener('click', this._clickHandler);
    //console.log('constructor tableroView inicializado');

  // DRAG & DROP: handlers
  this._pointerDownHandler = (ev) => this._inicioArrastre(ev);
  this._pointerMoveHandler = (ev) => this._moverArrastre(ev);
  this._pointerUpHandler = (ev) => this._terminarArrastre(ev);
  this.canvas.addEventListener('pointerdown', this._pointerDownHandler);
  }

  // llama a las coordenadas y si hay celda es porque esta definido
  _manejarClick(ev) {
    if (this._suppressClick) return;
    const celda = this._coordenadasACelda(ev.clientX, ev.clientY);
    if (!celda) return;
    if (typeof this.onCeldaClic === 'function') {
      this.onCeldaClic(celda.x, celda.y);
    }
  }

  // --- DRAG & DROP ---
 _inicioArrastre(ev) {
    const celda = this._coordenadasACelda(ev.clientX, ev.clientY);
    if (!celda) return;
    // Buscar ficha en esa celda
    const ficha = this.estado.fichas.find(f => f.x === celda.x && f.y === celda.y);
    if (!ficha) return;
    this._drag = {
      ficha,
      pointerId: ev.pointerId,
      startX: ev.clientX, 
      startY: ev.clientY,
      actualX: ev.clientX,
      actualY: ev.clientY,
      active: false
    };
    window.addEventListener('pointermove', this._pointerMoveHandler);
    window.addEventListener('pointerup', this._pointerUpHandler);
  }

  _moverArrastre(ev) {
    if (!this._drag) return;
    // Solo ase activa si se movió suficiente
    if (!this._drag.active) {
      const dx = Math.abs(ev.clientX - this._drag.startX);
      const dy = Math.abs(ev.clientY - this._drag.startY);
      if (dx > 5 || dy > 5) {
        this._drag.active = true;
        if (typeof this.onDragStart === 'function') {
          this.onDragStart(this._drag.ficha);
        }
      }
    }
    this._drag.actualX = ev.clientX;
    this._drag.actualY = ev.clientY;
    const targetCell = this._coordenadasACelda(ev.clientX, ev.clientY);
    if (this._drag.active && typeof this.onDragMove === 'function') {
      this.onDragMove(ev.clientX, ev.clientY, targetCell);
    }
    this.render();
  }

  _terminarArrastre(ev) {
    if (!this._drag) 
      return;
    try { 
      this.canvas.releasePointerCapture(this._drag.pointerId); 
    } catch(e){
      console.log('fallo linea 88');
    }
    window.removeEventListener('pointermove', this._pointerMoveHandler);
    window.removeEventListener('pointerup', this._pointerUpHandler);
    const targetCell = this._coordenadasACelda(ev.clientX, ev.clientY);
    if (this._drag.active && typeof this.onDragEnd === 'function') {
      this.onDragEnd(this._drag.ficha, targetCell);
    }
    this._drag = null;
    this.render();
    // Suprimir click si hubo drag
    this._suppressClick = true;
    setTimeout(() => { this._suppressClick = false; }, 0);
  }
  // --- FIN DRAG & DROP ---

   // Convierte coordenadas del click del usuario 
  //  a celda del tablero (x=col, y=row)
  _coordenadasACelda(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();//devuelve pos del canvas
    const xRel = clientX - rect.left;//calculo la pos relativa al canvas
    const yRel = clientY - rect.top;
    if (!this.estado) return null;
    const cols = this.estado.columnas;
    const filas = this.estado.filas;
    const celdaAncho = rect.width / cols;
    const celdaAlto = rect.height / filas;
    const col = Math.floor(xRel / celdaAncho);
    const row = Math.floor(yRel / celdaAlto);
    return { x: col, y: row };
  }

  //dimensiones visuales definidas en los atributos width/height.
  _ajustarBufferSegunDPR() {
    const dpr = window.devicePixelRatio || 1;

    // atributos width/height en el HTML indican tamaño CSS en px (por convención)
    const cssWidth = parseInt(this.canvas.getAttribute('width'), 10) || this.canvas.clientWidth;
    const cssHeight = parseInt(this.canvas.getAttribute('height'), 10) || this.canvas.clientHeight;

    // ajustar tamaño físico
    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;

    // backing buffer
    this.canvas.width = Math.floor(cssWidth * dpr);
    this.canvas.height = Math.floor(cssHeight * dpr);

    // escalar contexto para dibujar en coordenadas CSS
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // El controlador llama setEstado antes de render
  setEstado(estado) {
    this.estado = estado;
  }


  // Dibuja tablero y fichas según this.estado
  render() {
    if (!this.estado) return;
    const ctx = this.ctx;

    // obtengo el tamaño del canvas EN LA pantalla en pixeles css
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;//ancho y alto del canvas
    // Limpiar (usar el tamaño CSS del backing store escalado por DPR ya aplicado)
    ctx.clearRect(0, 0, w, h);

    const cols = this.estado.columnas;
    const filas = this.estado.filas;
    const celdaW = w / cols;
    const celdaH = h / filas;
    //me traigo la cant de filas y colum y calcula las celdas
    const matriz = this.estado.matriz;
    if(!matriz)
      console.warn('estado matriz no definido')
    // fondo
    this.fondoImg = new Image();
    this.fondoImg.src = 'assets/img/fondo_tablero_2.png';
    ctx.drawImage(this.fondoImg, 0, 0, w, h);

    // dibujar cada celda según matriz (-1/0/1)
    const dibujarCelda = Math.min(celdaW, celdaH) * 0.28;
     // dibujar celdas de la cruz y grilla parcial
    for (let y = 0; y < filas; y++) {
      for (let x = 0; x < cols; x++) {
        //pide la pos y depende el valor verifica si es valido
        const valido = matriz?.[y]?.[x] ?? -1;//si es null le asigna -1
        const centroCx = x * celdaW + celdaW/2;
        const centroCy = y * celdaH + celdaH /2;
        //calculo el centro de la celda

        if (valido === -1) {//fuera
            ctx.fillStyle = 'rgba(143, 53, 53, 0.06)';
            ctx.fillRect(x * celdaW, y * celdaH, celdaW, celdaH);
        } else {
          //fondo "cruz"
          ctx.save();
          ctx.globalAlpha = 0.35; // Ajusta la opacidad
          ctx.fillStyle = '#a3a1a1ff';
          ctx.fillRect(x * celdaW, y * celdaH, celdaW, celdaH);
          ctx.restore();
          // celda válida: dibujar "agujero" base
          // sombra del hoyo
          ctx.beginPath();
          ctx.fillStyle = 'rgba(172, 12, 12, 0.08)';
          ctx.arc(centroCx, centroCy +dibujarCelda * 0.15,dibujarCelda * 1.05, 0, Math.PI * 2);
          ctx.fill();

          // agujero (color tablero)
          ctx.beginPath();
          ctx.fillStyle = '#efe8d6';
          ctx.arc(centroCx, centroCy,dibujarCelda, 0, Math.PI * 2);
          ctx.fill();

          // borde del hoyo
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#cfc7b0';
          ctx.stroke();
        }
      }
    }

    //DESTACADOS MOVIMIENTOS POSUBLES (hint)
  if (this.estado.celdasDestacadas && this.estado.celdasDestacadas.length > 0) {
  // Usar timestamp para animación fluida
  const time = Date.now() / 1000;
  
  for (const celda of this.estado.celdasDestacadas) {
    const x = celda.columna;
    const y = celda.fila;
    
    if (matriz?.[y]?.[x] === 0) { // solo si está vacía
      const cx = x * celdaW + celdaW / 2;
      const cy = y * celdaH + celdaH / 2;
      
      ctx.save();
      
      // Animación de pulsación (escala entre 0.9 y 1.1)
      const pulseScale = 1 + Math.sin(time * 3) * 0.1;
      const baseRadius = dibujarCelda * 0.65;
      const radius = baseRadius * pulseScale;
      
      // Animación de opacidad para el resplandor
      const glowOpacity = 0.6 + Math.sin(time * 2.5) * 0.3;
      
      // Onda expansiva externa (se expande y desvanece)
      const waveProgress = (time * 2) % 1;
      const waveRadius = baseRadius + (baseRadius * waveProgress * 0.8);
      const waveOpacity = (1 - waveProgress) * 0.4;
      
      ctx.beginPath();
      ctx.strokeStyle = `rgba(34, 197, 94, ${waveOpacity})`;
      ctx.lineWidth = 3;
      ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Resplandor principal animado
      ctx.shadowColor = `rgba(34, 197, 94, ${glowOpacity})`;
      ctx.shadowBlur = 30;
      
      // Círculo principal con gradiente
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, 'rgba(134, 239, 172, 0.4)');
      gradient.addColorStop(0.6, 'rgba(34, 197, 94, 0.25)');
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Anillo brillante exterior
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3;
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Punto central brillante
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(134, 239, 172, 0.9)';
      ctx.beginPath();
      ctx.fillStyle = '#86efac';
      ctx.arc(cx, cy, 4 * pulseScale, 0, Math.PI * 2);
      ctx.fill();
      
      // Partículas orbitando (opcional, 4 puntos)
      ctx.shadowBlur = 10;
      for (let i = 0; i < 4; i++) {
        const angle = (time * 2 + (i * Math.PI / 2)) % (Math.PI * 2);
        const orbitRadius = radius * 0.7;
        const px = cx + Math.cos(angle) * orbitRadius;
        const py = cy + Math.sin(angle) * orbitRadius;
        
        ctx.beginPath();
        ctx.fillStyle = '#86efac';
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
  }
}
    // dibuja las fichas(si coincide con mat[1])
    for (const f of this.estado.fichas) {
      // si por alguna razón matriz dice inválida, saltar
      if (matriz?.[f.y]?.[f.x] !== 1) continue;
      const cx = f.x * celdaW + celdaW / 2;
      const cy = f.y * celdaH + celdaH / 2;
      const radio = Math.min(celdaW, celdaH) * 0.35;

      // sombra
      ctx.beginPath();
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.arc(cx, cy + 2, radio * 1.05, 0, Math.PI * 2);
      ctx.fill();
      /*
      // cuerpo de la ficha
      ctx.beginPath();
      ctx.fillStyle = f.color || '#d32f2f';
      ctx.arc(cx, cy, radio, 0, Math.PI * 2);
      ctx.fill();
      */
      //IMG EN LA FICHA--------------------------------
      if (f.img && f.img.complete && f.img.naturalWidth) {
        // recortar a círculo y dibujar la imagen (cover)
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radio, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        
        const iw = f.img.naturalWidth;
        const ih = f.img.naturalHeight;
        let sx = 0, sy = 0, sw = iw, sh = ih;
        const aspectImg = iw / ih;
        
        // crop centrado para "cover" en un cuadrado (circle)
        if (aspectImg > 1) {
          // imagen más ancha: recortar lados
          sw = Math.round(ih * 1);
          sx = Math.round((iw - sw) / 2);
        } else if (aspectImg < 1) {
          // imagen más alta: recortar arriba/abajo
          sh = Math.round(iw / 1);
          sy = Math.round((ih - sh) / 2);
        }

        ctx.drawImage(f.img, sx, sy, sw, sh, cx - radio, cy - radio, radio * 2, radio * 2);
        ctx.restore();
      
      }
      // borde
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.stroke();
    }
    
    // Dibuja ficha fantasma si arrastrando
    if (this._drag && this._drag.active) {
      const ctx = this.ctx;
      const rect = this.canvas.getBoundingClientRect();
      const cols = this.estado.columnas;
      const filas = this.estado.filas;
      const celdaW = rect.width / cols;
      const celdaH = rect.height / filas;
      const radio = Math.min(celdaW, celdaH) * 0.35;
      // Convertir clientX/clientY a coords canvas
      const x = this._drag.actualX - rect.left;
      const y = this._drag.actualY - rect.top;
      // Sombra
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.arc(x, y + 2, radio * 1.05, 0, Math.PI * 2);
      ctx.fill();
      // Ficha con img
      if (this._drag.ficha.img && this._drag.ficha.img.complete && this._drag.ficha.img.naturalWidth) {
        // Recortar a círculo y dibujar la imagen
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, radio, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        const iw = this._drag.ficha.img.naturalWidth;
        const ih = this._drag.ficha.img.naturalHeight;
        let sx = 0, sy = 0, sw = iw, sh = ih;
        const aspectImg = iw / ih;
        
        // Crop centrado para "cover" en un cuadrado
        if (aspectImg > 1) {
          sw = Math.round(ih * 1);
          sx = Math.round((iw - sw) / 2);
        } else if (aspectImg < 1) {
          sh = Math.round(iw / 1);
          sy = Math.round((ih - sh) / 2);
        }
        
        ctx.drawImage(this._drag.ficha.img, sx, sy, sw, sh, x - radio, y - radio, radio * 2, radio * 2);
      } else {
        // Fallback: color sólido
        ctx.beginPath();
        ctx.fillStyle = this._drag.ficha.color || '#d32f2f';
        ctx.arc(x, y, radio, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Borde
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath();
      ctx.arc(x, y, radio, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    }
  } 
 
  //UTIL PARA RENDERIZAR LA IMG EN LA FICHA----------------------------
  ajustarYRender() {
  // se asegura que el canvas tenga el tamaño del backing store correcto
  // y despues llamar al render para dibujar con la escala y dimencion correcta
    if (typeof this._ajustarBufferSegunDPR === 'function') {
      //el typeof asegura que exista ese met/fun, y q sea una function
      this._ajustarBufferSegunDPR();
      this.render();
    }
  }

  //BLOQUEAR----------------------------------------------------------
  bloquear() {
  let overlay = document.getElementById('bloqueo-tablero');
  document.body.appendChild(overlay);  
  }

  desbloquear() {
  const overlay = document.getElementById('bloqueo-tablero');
  if (overlay) overlay.style.display = 'none';
  }

  //MENSAJE DERROTA------------------------------------------------------

  mostrarMensaje(msg) {
  const mensaje = document.getElementById('mensaje-derrota');
    if (mensaje) {
      mensaje.textContent = msg;
      mensaje.style.display = 'block';
    }
  }

  ocultarMensaje() {
  const mensaje = document.getElementById('mensaje-derrota');
  if (mensaje) mensaje.style.display = 'none';
  }


    
  //REINICIAR JUEGO------------------------------------------------------
  reiniciarJuego(){
  let timer = document.getElementById('timer');
  this.desbloquear();
  this.ocultarMensaje();
  timer.innerHTML = '00:00';
  }

  //RESALTAR MOVIMIENTOS POSIBLES---------------------------------------------
  destacarCeldas(celdas) {
    if (!this.estado) return;
    this.estado.celdasDestacadas = celdas || [];
    this.render();
}

  limpiarDestacados() {
    if (!this.estado) return;
    this.estado.celdasDestacadas = [];
    this.render();
}
}

