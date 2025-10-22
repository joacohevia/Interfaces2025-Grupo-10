'use strict';
const lienzo = document.getElementById('gameCanvas');
const ctx = lienzo.getContext('2d');
const etiquetaNivel = document.getElementById('levelLabel');
const estadoEl = document.getElementById('status');
const btnControl = document.getElementById('btn-control'); // único botón de control
const btnSiguienteNivel = document.getElementById('nextLevel');
const recordEl = document.getElementById('record');
const temporizadorEl = document.getElementById('timer');
const btnVolverMenu = document.getElementById('backMenu');
const btnAyuda = document.getElementById('btn-ayuda');

// Niveles (ajusta rutas en carpeta images)
const NIVELES_ORIGINALES = [
  'assets/img/imgBlocka/ChatGPT Image 10 oct 2025, 09_46_21.png',
  'assets/img/imgBlocka/ChatGPT Image 10 oct 2025, 09_49_01.png',
  'assets/img/imgBlocka/level1.png',
  'assets/img/imgBlocka/level2.png',
  'assets/img/imgBlocka/level3.png',
  'assets/img/imgBlocka/level6.png',
];
console.log('[Blocka] Niveles originales:', NIVELES_ORIGINALES);
let NIVELES = [];
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Dimensiones del canvas
const ANCHO_CANVAS = 500;
const ALTO_CANVAS = 500;
lienzo.width = ANCHO_CANVAS;
lienzo.height = ALTO_CANVAS;

// Configuración de piezas (2x2)
const FILAS = 2;
const COLUMNAS = 2;
const ANCHO_PIEZA = ANCHO_CANVAS / COLUMNAS;
const ALTO_PIEZA = ALTO_CANVAS / FILAS;

// Estado del juego

let indiceNivelActual = null;
let imagenNivel = new Image();
let piezas = [];
let contadorCorrectas = 0;
let tiempoInicio = 0;
let intervaloTemporizador = null;
let recordsPorNivel = {};
let tiempoMaximo = null;
let intervaloTiempoMaximo = null;
let juegoEnCurso = false;

// Estados posibles: 'no_iniciado', 'jugando', 'ganado', 'perdido'
let estadoJuego = 'no_iniciado';

// Permitir usar click derecho en el canvas (evitar menú contextual)
lienzo.addEventListener('contextmenu', e => e.preventDefault());

// Temporizador
function iniciarTemporizador() {
  tiempoInicio = Date.now();
  juegoEnCurso = true;
  actualizarTemporizador();
  intervaloTemporizador = setInterval(actualizarTemporizador, 1000);

  // Temporizador máximo para niveles 4, 5 y 6
  if (indiceNivelActual >= 3) {
  // Nivel 4: 15s, Nivel 5: 12s, Nivel 6: 10s
  const tiempos = [15, 12, 10];
    tiempoMaximo = tiempos[indiceNivelActual - 3];
    if (intervaloTiempoMaximo) clearTimeout(intervaloTiempoMaximo);
    intervaloTiempoMaximo = setTimeout(() => {
      if (juegoEnCurso) {
        perderNivelPorTiempo();
      }
    }, tiempoMaximo * 1000);
  } else {
    tiempoMaximo = null;
    if (intervaloTiempoMaximo) clearTimeout(intervaloTiempoMaximo);
  }
}

function detenerTemporizador() {
  if (intervaloTemporizador) {
    clearInterval(intervaloTemporizador);
    intervaloTemporizador = null;
  }
  if (intervaloTiempoMaximo) {
    clearTimeout(intervaloTiempoMaximo);
    intervaloTiempoMaximo = null;
  }
  juegoEnCurso = false;
  return tiempoTranscurrido();
}

function actualizarTemporizador() {
  if (!juegoEnCurso) return;
  const texto = formatearTiempo(tiempoTranscurrido());
  if (tiempoMaximo) {
    const restante = Math.max(0, tiempoMaximo - tiempoTranscurrido());
    temporizadorEl.textContent = `Tiempo: ${texto} / Máx: ${formatearTiempo(tiempoMaximo)} (${formatearTiempo(restante)} restantes)`;
    // Solo perder si el temporizador máximo llega a 0
    if (restante === 0 && juegoEnCurso) {
      perderNivelPorTiempo();
    }
  } else {
    temporizadorEl.textContent = `Tiempo: ${texto}`;
  }
}

// Mostrar mensaje de derrota por tiempo
function perderNivelPorTiempo() {
  detenerTemporizador();
  juegoEnCurso = false;
  estadoJuego = 'perdido';
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, ALTO_CANVAS / 2 - 60, ANCHO_CANVAS, 120);
  ctx.fillStyle = '#ff4444';
  ctx.font = '28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('¡Tiempo agotado!', ANCHO_CANVAS / 2, ALTO_CANVAS / 2 - 10);
  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  ctx.fillText('No lograste resolver el puzzle a tiempo.', ANCHO_CANVAS / 2, ALTO_CANVAS / 2 + 20);
  if (btnGameControl) btnGameControl.disabled = false;
  if (btnSiguienteNivel) btnSiguienteNivel.classList.add('hidden');
  if (btnVolverMenu) btnVolverMenu.focus();
}

function tiempoTranscurrido() {
  return Math.floor((Date.now() - tiempoInicio) / 1000);
}

function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const secs = segundos % 60;
  return `${minutos.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function actualizarRecord(tiempoSegundos) {
  const nivel = indiceNivelActual;
  if (!recordsPorNivel[nivel] || tiempoSegundos < recordsPorNivel[nivel]) {
    recordsPorNivel[nivel] = tiempoSegundos;
    recordEl.textContent = `Récord: ${formatearTiempo(tiempoSegundos)}`;
  }
}


// Listener único para el botón de control
if (btnControl) {
  btnControl.addEventListener('click', () => {
    if (estadoJuego === 'no_iniciado') {
      iniciarJuego();
    } else if (estadoJuego === 'jugando' || estadoJuego === 'ganado' || estadoJuego === 'perdido') {
      reiniciarJuego();
    }
  });
}

// Listener para volver al menú
if (btnVolverMenu) {
  btnVolverMenu.addEventListener('click', () => {
    window.location.href = '../blocka.html';
  });
}

// CARGA Y PREPARACIÓN DE IMAGEN

// Cargar la imagen original, adaptar/cortar para que quede exactamente ANCHO_CANVAS x ALTO_CANVAS y luego crear piezas
function cargarNivel(src) {
  const orig = new Image();
  console.log('[Blocka] Intentando cargar imagen:', src);
  orig.src = src;
  orig.onload = () => {
    console.log('[Blocka] Imagen cargada correctamente:', src);
    const adaptada = prepararImagenParaCanvas(orig);
    adaptada.onload = function() {
      imagenNivel = adaptada;
      crearPiezas();
      mezclarPiezas();
      contadorCorrectas = 0;
      updateStatus();
      detenerTemporizador();
      if (btnControl) {
        btnControl.textContent = 'Comenzar';
        btnControl.disabled = false;
      }
      if (recordsPorNivel[indiceNivelActual]) {
        recordEl.textContent = `Récord nivel ${indiceNivelActual + 1}: ${formatearTiempo(recordsPorNivel[indiceNivelActual])}`;
      } else {
        recordEl.textContent = '';
      }
      render();
    };
  };
  orig.onerror = () => {
    console.error('[Blocka] Error cargando imagen:', src);
    ctx.clearRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);
    ctx.fillStyle = '#07102a';
    ctx.fillRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);
    ctx.fillStyle = '#ff4444';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Error cargando imagen', ANCHO_CANVAS / 2, ALTO_CANVAS / 2);
    ctx.fillText(src, ANCHO_CANVAS / 2, ALTO_CANVAS / 2 + 30);
    // Mensaje extra para depuración
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('¿La imagen existe en la carpeta?', ANCHO_CANVAS / 2, ALTO_CANVAS / 2 + 60);
    ctx.fillText('Ruta completa: ' + src, ANCHO_CANVAS / 2, ALTO_CANVAS / 2 + 80);
  };
}

// Prepara la imagen para que tenga exactamente ANCHO_CANVAS x ALTO_CANVAS (cover centrado)
// Devuelve una Image cuyo src es un dataURL
function prepararImagenParaCanvas(img) {
  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;
  const targetW = ANCHO_CANVAS;
  const targetH = ALTO_CANVAS;
  const scale = Math.max(targetW / imgW, targetH / imgH);
  const sw = Math.round(targetW / scale);
  const sh = Math.round(targetH / scale);
  const sx0 = Math.round((imgW - sw) / 2);
  const sy0 = Math.round((imgH - sh) / 2);

  const tmp = document.createElement('canvas');
  tmp.width = targetW;
  tmp.height = targetH;
  const tctx = tmp.getContext('2d');
  tctx.imageSmoothingEnabled = true;
  tctx.drawImage(img, sx0, sy0, sw, sh, 0, 0, targetW, targetH);

  const adaptada = new Image();
  adaptada.src = tmp.toDataURL('image/png');
  return adaptada;
}

// CREACIÓN Y MEZCLA DE PIEZAS

function crearPiezas() {
  piezas = [];
  const imgAdaptadaW = Math.round(imagenNivel.naturalWidth / COLUMNAS);
  const imgAdaptadaH = Math.round(imagenNivel.naturalHeight / FILAS);

  for (let r = 0; r < FILAS; r++) {
    for (let c = 0; c < COLUMNAS; c++) {
      const sx = c * imgAdaptadaW;
      const sy = r * imgAdaptadaH;
      piezas.push({
        id: r * COLUMNAS + c,
        tx: Math.round(c * ANCHO_PIEZA),
        ty: Math.round(r * ALTO_PIEZA),
        x: Math.round(c * ANCHO_PIEZA),
        y: Math.round(r * ALTO_PIEZA),
        rot: 0,
        sx,
        sy,
        sw: imgAdaptadaW,
        sh: imgAdaptadaH,
        _correct: false
      });
    }
  }
}

function mezclarPiezas() {
  for (let i = 0; i < piezas.length; i++) {
    piezas[i].x = piezas[i].tx;
    piezas[i].y = piezas[i].ty;
    const posiblesRot = [90, 180, 270];
    const idx = Math.floor(Math.random() * posiblesRot.length);
    piezas[i].rot = posiblesRot[idx];
    piezas[i]._correct = false;
  }

  contadorCorrectas = piezas.filter(p => (p.x === p.tx && p.y === p.ty && (p.rot % 360) === 0)).length;
  updateStatus();
}

// DETECCIÓN DE CLICS Y ROTACIONES

function obtenerPiezaEn(px, py) {
  px = Math.round(px);
  py = Math.round(py);
  for (let i = piezas.length - 1; i >= 0; i--) {
    const p = piezas[i];
    if (px >= p.x && px <= p.x + ANCHO_PIEZA && py >= p.y && py <= p.y + ALTO_PIEZA) {
      return p;
    }
  }
  return null;
}


lienzo.addEventListener('mousedown', (e) => {
  // Si el juego está ganado o perdido, no hacer nada (tablero bloqueado)
  if (estadoJuego === 'ganado' || estadoJuego === 'perdido') return;
  // Si el juego no ha iniciado
  if (estadoJuego === 'no_iniciado') {
    iniciarJuego();
    // Procesar el primer clic como movimiento
  }
  // Si el juego está en curso
  if (estadoJuego === 'jugando') {
    const rect = lienzo.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const p = obtenerPiezaEn(x, y);
    if (!p) return;
    // Si la pieza ya está correcta, no permitir rotarla
    if (p._correct) return;
    
    if (e.button === 0) {
      p.rot = (p.rot + 270) % 360;
    } else if (e.button === 2) {
      p.rot = (p.rot + 90) % 360;
    }
    comprobarPiezaCorrecta(p);
    render();
  }
});

// LÓGICA DE VERIFICACIÓN Y HUD


function comprobarPiezaCorrecta(p) {
  const posOk = p.x === p.tx && p.y === p.ty;
  const rotOk = (p.rot % 360) === 0;
  const wasCorrect = !!p._correct;
  const nowCorrect = posOk && rotOk;

  if (!wasCorrect && nowCorrect) {
    contadorCorrectas += 1;
    p._correct = true;
  } else if (wasCorrect && !nowCorrect) {
    contadorCorrectas -= 1;
    p._correct = false;
  }

  updateStatus();

  if (contadorCorrectas === piezas.length) {
    const tiempoFinal = detenerTemporizador();
    const nivel = indiceNivelActual;
    estadoJuego = 'ganado';
    if (!recordsPorNivel[nivel] || tiempoFinal < recordsPorNivel[nivel]) {
      recordsPorNivel[nivel] = tiempoFinal;
      recordEl.textContent = `Récord nivel ${nivel + 1}: ${formatearTiempo(tiempoFinal)}`;
    }
    setTimeout(() => {
      showWin();
      if (indiceNivelActual === NIVELES.length - 1) {
        mostrarAnimacionVictoria();
      } else {
        btnSiguienteNivel.classList.remove('hidden');
      }
      actualizarBotonControl();
    }, 180);
  }
}

  // Animación de victoria final
  // Animación de victoria final
  function mostrarAnimacionVictoria() {
    const winDiv = document.createElement('div');
    winDiv.id = 'victoria-final';
    winDiv.style.position = 'fixed';
    winDiv.style.top = '0';
    winDiv.style.left = '0';
    winDiv.style.width = '100vw';
    winDiv.style.height = '100vh';
    winDiv.style.background = 'rgba(0,0,0,0.7)';
    winDiv.style.display = 'flex';
    winDiv.style.flexDirection = 'column';
    winDiv.style.justifyContent = 'center';
    winDiv.style.alignItems = 'center';
    winDiv.style.zIndex = '9999';
    winDiv.innerHTML = `
      <h1 style="color: #fff; font-size: 3em; margin-bottom: 20px;">¡Ganaste Blocka!</h1>
      <div id="confetti" style="width:100vw;height:40vh;position:relative;z-index:1;"></div>
      <button id="volverMenuBtn" style="font-size:1.5em;padding:10px 30px;margin-top:30px;position:absolute;top:60%;left:50%;transform:translate(-50%,0);z-index:2;">Volver al menú</button>
    `;
    document.body.appendChild(winDiv);
    lanzarConfetti();
    const btnVolver = document.getElementById('volverMenuBtn');
    btnVolver.onclick = () => {
      window.location.href = '../blocka.html';
    };
    btnVolver.focus();
  }

  // Animación confetti simple
  function lanzarConfetti() {
    const confettiDiv = document.getElementById('confetti');
    for (let i = 0; i < 120; i++) {
      const c = document.createElement('div');
      c.style.position = 'absolute';
      c.style.width = '10px';
      c.style.height = '20px';
      c.style.background = `hsl(${Math.random()*360},100%,60%)`;
      c.style.left = Math.random()*window.innerWidth + 'px';
      c.style.top = Math.random()*window.innerHeight/2 + 'px';
      c.style.opacity = '0.8';
      c.style.borderRadius = '3px';
      c.style.transform = `rotate(${Math.random()*360}deg)`;
      confettiDiv.appendChild(c);
      setTimeout(() => {
        c.style.transition = 'top 2s';
        c.style.top = (window.innerHeight/2 + Math.random()*window.innerHeight/2) + 'px';
      }, 100);
    }
  }

btnSiguienteNivel.addEventListener('click', () => {
  indiceNivelActual++;
  if (indiceNivelActual < NIVELES.length) {
    etiquetaNivel.textContent = `Nivel: ${indiceNivelActual + 1}`;
    cargarNivel(NIVELES[indiceNivelActual]);
    btnSiguienteNivel.classList.add('hidden');
    reiniciarJuego();
    actualizarVisibilidadBotonAyuda();
  }
});

function getFilter(pieceIndex) {
  const nivel = indiceNivelActual + 1;
  const filtros = [
    '',
    'grayscale(1)',
    'sepia(1)',
    'hue-rotate(90deg)'
  ];

  if (nivel <= 2) {
    return filtros[nivel - 1];
  } else {
    return filtros[pieceIndex % filtros.length];
  }
}

function updateStatus() {
  estadoEl.textContent = `Piezas correctas: ${contadorCorrectas} / ${piezas.length}`;
}
// DIBUJADO (RENDER)

// Limpiar el canvas y dibujar todas las piezas en su posición actual con la rotación aplicada
function render() {
  // limpiar canvas
  ctx.clearRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);

  // fondo opcional
  ctx.fillStyle = '#07102a';
  ctx.fillRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);

  // suavizado de imágenes al escalar/rotar
  ctx.imageSmoothingEnabled = true;

  // canvas temporal para aplicar filtros por pieza
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = ANCHO_PIEZA;
  tmpCanvas.height = ALTO_PIEZA;
  const tmpCtx = tmpCanvas.getContext('2d');

  // dibujar cada pieza con transformaciones locales
  for (const p of piezas) {
    const cx = Math.round(p.x + ANCHO_PIEZA / 2);
    const cy = Math.round(p.y + ALTO_PIEZA / 2);

    const filtro = contadorCorrectas === piezas.length ? '' : getFilter(p.id);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((p.rot * Math.PI) / 180);

    if (filtro) {
      tmpCtx.clearRect(0, 0, ANCHO_PIEZA, ALTO_PIEZA);
      tmpCtx.filter = filtro;
      tmpCtx.drawImage(
        imagenNivel,
        p.sx, p.sy,
        p.sw, p.sh,
        0, 0,
        ANCHO_PIEZA, ALTO_PIEZA
      );
      ctx.drawImage(tmpCanvas, -ANCHO_PIEZA / 2, -ALTO_PIEZA / 2);
      tmpCtx.filter = 'none';
    } else {
      ctx.drawImage(
        imagenNivel,
        p.sx, p.sy,
        p.sw, p.sh,
        -ANCHO_PIEZA / 2,
        -ALTO_PIEZA / 2,
        ANCHO_PIEZA, ALTO_PIEZA
      );
    }

    ctx.restore();

    // trazo sutil para delimitar casillas
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.strokeRect(p.x + 0.5, p.y + 0.5, ANCHO_PIEZA - 1, ALTO_PIEZA - 1);
  }
}

// Limpiar canvas con fondo (usada al volver al menú)
function limpiarLienzo() {
  ctx.clearRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);
  ctx.fillStyle = '#07102a';
  ctx.fillRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);
}

// MENSAJE DE VICTORIA

// Mostrar overlay de victoria en el canvas
function showWin() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, ALTO_CANVAS / 2 - 40, ANCHO_CANVAS, 80);

  ctx.fillStyle = '#d4ffd9';
  ctx.font = '26px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('¡Completaste el nivel!', ANCHO_CANVAS / 2, ALTO_CANVAS / 2 - 6);

  ctx.fillStyle = '#ffffff';
  ctx.font = '14px Roboto';
  ctx.fillText('Presiona siguiente nivel o reiniciar', ANCHO_CANVAS / 2, ALTO_CANVAS / 2 + 20);
}


// Inicialización automática para blocka-juego.html
document.addEventListener('DOMContentLoaded', function() {
  if (lienzo && etiquetaNivel && estadoEl && temporizadorEl && recordEl) {
    NIVELES = shuffleArray(NIVELES_ORIGINALES.slice());
    indiceNivelActual = 0;
    etiquetaNivel.textContent = `Nivel: ${indiceNivelActual + 1}`;
    cargarNivel(NIVELES[indiceNivelActual]);
    limpiarLienzo();
    updateStatus();
    estadoJuego = 'no_iniciado';
    actualizarBotonControl();
    actualizarVisibilidadBotonAyuda();
  }
  // Lógica de redirección hamburguesa (igual a registro.js)
  const burgerItems = document.querySelectorAll('.dropdown-item');
  burgerItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const link = this.getAttribute('data-link');
      if (link) {
        window.location.href = link;
      }
    });
  });
});

// Función para actualizar el texto del botón de control
function actualizarBotonControl() {
  if (!btnControl) return;
  if (estadoJuego === 'no_iniciado') {
    btnControl.textContent = 'Comenzar';
  } else if (estadoJuego === 'jugando' || estadoJuego === 'ganado' || estadoJuego === 'perdido') {
    btnControl.textContent = 'Reiniciar';
  }
}

// Función para iniciar el juego
function iniciarJuego() {
  estadoJuego = 'jugando';
  actualizarBotonControl();
  detenerTemporizador();
  tiempoInicio = Date.now();
  iniciarTemporizador();
  // Asegura que las piezas sean clickeables
  // Si hay elementos bloqueados, desbloquear aquí
  if (btnSiguienteNivel) btnSiguienteNivel.classList.add('hidden');
}

// Función para reiniciar el juego
function reiniciarJuego() {
  // Desordenar imágenes
  mezclarPiezas();
  // Reiniciar contadores y temporizador
  contadorCorrectas = 0;
  detenerTemporizador();
  tiempoInicio = 0;
  temporizadorEl.textContent = 'Tiempo: 00:00';
  // Ocultar elementos de siguiente nivel
  if (btnSiguienteNivel) btnSiguienteNivel.classList.add('hidden');
  // Desbloquear tablero si estaba bloqueado
  // (No hay lógica de bloqueo explícita, pero si la hubiera, desbloquear aquí)
  // Cambiar texto del botón
  estadoJuego = 'no_iniciado';
  actualizarBotonControl();
  resetBtnHelp();
  updateStatus();
  render();
}

// LOGICA BTN AYUDA
btnAyuda.addEventListener('click', (e) => {
  e.preventDefault
  if (btnAyuda.disabled) return; // ya usada en este nivel
  console.log('¡Ayudita usada!');
  btnAyuda.disabled = true;//evita múltiples usos
  btnAyuda.classList.add('pulse');
  btnAyuda.classList.add('usada');

 //accion ayudita
 helpAction();
});

//Logica de la ayuda-------------------------------------------------------------------------------------
function helpAction() {
  // Buscamos piezas que NO estén correctas (posición y rotación)
  const misplaced = piezas.filter(p => !(p.x === p.tx && p.y === p.ty && (p.rot % 360) === 0));

  if (misplaced.length === 0) {
    // Ya está todo correcto
    updateStatus();
    return;
  }

  // Elegimos una pieza mal ubicada (aleatoria)
  const pieceToPlace = misplaced[Math.floor(Math.random() * misplaced.length)];

  // Coordenadas objetivo (posición correcta)
  const targetX = pieceToPlace.tx;
  const targetY = pieceToPlace.ty;

  // Encuentra la pieza que actualmente ocupa el target (si existe)
  const pieceAtTarget = piezas.find(p => p.x === targetX && p.y === targetY);

  // Guardamos origen
  const fromX = pieceToPlace.x;
  const fromY = pieceToPlace.y;

  // Si la pieza está en el slot correcto pero rotada --> solo corregimos rotación
  if (fromX === targetX && fromY === targetY) {
    pieceToPlace.rot = 0;
    comprobarPiezaCorrecta(pieceToPlace); // actualizar contador
    render();
    updateStatus();
    añadirSegundosTemporizador(5); // sumar 5s cuando se usa la ayudita
    return;
  }

  // Si hay otra pieza en el target, la movemos al origen (swap de posiciones)
  if (pieceAtTarget && pieceAtTarget !== pieceToPlace) {
    pieceAtTarget.x = fromX;
    pieceAtTarget.y = fromY;
    // opcional: mantener la rotación actual de la pieza movida al origen
    comprobarPiezaCorrecta(pieceAtTarget);
  }

  // Mover la pieza seleccionada a su posición correcta y corregir rotación
  pieceToPlace.x = targetX;
  pieceToPlace.y = targetY;
  pieceToPlace.rot = 0;

  // Comprobamos la(s) pieza(s) afectadas para actualizar contador
  comprobarPiezaCorrecta(pieceToPlace);
  // (pieceAtTarget ya fue comprobada más arriba si existía)

  // Re-render y HUD
  render();
  updateStatus();

  // Sumar 5 segundos al temporizador restante / visual
  añadirSegundosTemporizador(5);
}

// FUNCION AUXILIAR: añade segundos al temporizador en curso (y reajusta timeout de tiempoMaximo)
function añadirSegundosTemporizador(segundos) {
  if (!tiempoInicio) {
    // Si el temporizador no está iniciado, no hacemos nada
    return;
  }

  // Reducimos tiempoInicio para que tiempoTranscurrido() disminuya => suma de tiempo visible
  tiempoInicio -= segundos * 1000;

  // Si hay un límite máximo (tiempoMaximo) debemos extender el timeout que provocaría perder por tiempo.
  if (typeof tiempoMaximo === 'number' && tiempoMaximo > 0) {
    // calculamos el nuevo restante y reprogramamos el timeout
    if (intervaloTiempoMaximo) clearTimeout(intervaloTiempoMaximo);

    const restante = Math.max(0, tiempoMaximo - tiempoTranscurrido()); // ya considera el nuevo tiempoInicio
    intervaloTiempoMaximo = setTimeout(() => {
      if (juegoEnCurso) {
        perderNivelPorTiempo();
      }
    }, restante * 1000);
  }

  // Actualizar la UI del temporizador inmediatamente
  actualizarTemporizador();
}



function resetBtnHelp() {
  btnAyuda.disabled = false;
  btnAyuda.classList.remove('usada');
  btnAyuda.classList.remove('pulse');
}

// Función para controlar la visibilidad del botón de ayuda--------------------------------
function actualizarVisibilidadBotonAyuda() {
  if (btnAyuda) {
    // El botón aparece a partir del nivel 3 (indiceNivelActual >= 2)
    if (indiceNivelActual >= 2) {
      btnAyuda.style.display = 'flex';
    } else {
      btnAyuda.style.display = 'none';
    }
  }
}
