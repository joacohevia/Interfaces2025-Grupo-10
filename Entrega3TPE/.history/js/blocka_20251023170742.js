'use strict';
// Iniciar el flujo de pantallas automáticamente al cargar la página
window.addEventListener('DOMContentLoaded', showStartButton);
// Inicia el nivel tras la selección
function initGameLevel() {
  //scroll hacia abajo para mostrar el canvas
  setTimeout(() => {
    window.scrollTo({top:210, behavior: 'smooth'});
  }, 200);
  // Limpiar el carrusel si existe y preparar el game board
  clearGameDisplay();
  ensureGameUI();
  // Re-obtener referencias globales si el canvas fue recreado
  lienzo = document.getElementById('gameCanvas');
  ctx = lienzo ? lienzo.getContext('2d') : null;
  // 1. Mostrar el lienzo (canvas)
  if (lienzo) lienzo.style.display = 'block';
  var gameDisplayContainer = document.getElementById('game-board-display');
  gameDisplayContainer.classList.add('canvas-active');
  gameDisplayContainer.classList.remove('bg-blocka');
  // Elimina cualquier límite de altura para que el canvas no se corte
  gameDisplayContainer.style.height = 'auto';
  gameDisplayContainer.style.maxHeight = 'none';
  gameDisplayContainer.style.overflow = 'visible';
  gameDisplayContainer.style.background = 'none';
  setSubdivisions(selectedSubdivisions);
  // 2. Mostrar el número de nivel actual
  if (etiquetaNivel) {
    etiquetaNivel.textContent = `Nivel: ${indiceNivelActual + 1}`;
  }
  // 3. Cargar el nuevo nivel
  if (lienzo && ctx) {
    cargarNivel(NIVELES[indiceNivelActual]);
  } else {
    console.error('No se pudo inicializar el canvas o el contexto.');
  }
  estadoJuego = 'no_iniciado';
  actualizarBotonControl();
  enableCanvasContextMenu();
}
// Muestra carrusel animado para seleccionar imagen de nivel
let selectedSubdivisions = 4; // valor por defecto
function startThumbnailSelection(subdivisions) {
  // Scroll al top para ver el carrusel
  window.scrollTo({ top: 0, behavior: 'smooth' });
  clearGameDisplay();
  const gameDisplayContainer = document.getElementById('game-board-display');
  gameDisplayContainer.classList.remove('canvas-active');
  gameDisplayContainer.classList.remove('bg-blocka');
  // Restaurar el background al valor por defecto
  gameDisplayContainer.style.background = '';
  selectedSubdivisions = subdivisions;

  // Carrusel contenedor
  const carousel = document.createElement('div');
  carousel.id = 'selection-carousel';
  carousel.style.display = 'flex';
  carousel.style.justifyContent = 'center';
  carousel.style.alignItems = 'center';
  carousel.style.gap = '1rem';

  // Miniaturas
  const thumbnails = [];
  // NIVELES y indiceNivelActual solo se reinician al presionar JUGAR
  NIVELES.forEach((url, idx) => {
    const img = document.createElement('img');
    img.src = url;
    img.className = 'thumbnail';
    img.style.width = '160px';
    img.style.height = '160px';
    img.style.objectFit = 'cover';
    img.dataset.idx = idx;
    carousel.appendChild(img);
    thumbnails.push(img);
  });
  gameDisplayContainer.appendChild(carousel);

  // Animación tipo slot: resalta secuencialmente cada miniatura
  const winnerIdx = indiceNivelActual;
  let currentIdx = 0;
  let rounds = 3; // cantidad de vueltas completas antes de detenerse
  let totalSteps = rounds * thumbnails.length + winnerIdx;
  let step = 0;
  let highlightClass = 'slot-highlight';

  function highlightNext() {
    thumbnails.forEach((img, idx) => {
      img.classList.toggle(highlightClass, idx === currentIdx);
    });
    step++;
    if (step <= totalSteps) {
      currentIdx = (currentIdx + 1) % thumbnails.length;
      // velocidad: más rápido al principio, más lento al final
      let base = 80;
      let extra = Math.min(180, Math.floor((step / totalSteps) * 300));
      setTimeout(highlightNext, base + extra);
    } else {
      // Termina en el "ganador" (el nivel actual)
      thumbnails.forEach((img, idx) => {
        img.classList.remove(highlightClass);
        img.classList.toggle('selected-winner', idx === winnerIdx);
      });
      setTimeout(() => {
        initGameLevel();
      }, 1000);
    }
  }
  highlightNext();
}
// Muestra selector de subdivisiones (4, 6, 8 piezas)
function showSubdivisionSelector() {
  clearGameDisplay();
  const gameDisplayContainer = document.getElementById('game-board-display');
  gameDisplayContainer.classList.remove('canvas-active');
  gameDisplayContainer.classList.add('bg-blocka');
  // Restaurar el background al valor por defecto
  gameDisplayContainer.style.background = '';

  const title = document.createElement('h2');
  title.textContent = 'Selecciona subdivisión de piezas:';
  title.style.textAlign = 'center';
  title.style.margin = '1.5rem 0';
  gameDisplayContainer.appendChild(title);

  const options = [4, 6, 8];
  const btnContainer = document.createElement('div');
  btnContainer.style.display = 'flex';
  btnContainer.style.justifyContent = 'center';
  btnContainer.style.gap = '2rem';

  options.forEach(subdiv => {
    const btn = document.createElement('button');
    btn.textContent = subdiv + ' piezas';
    btn.className = 'btn-subdivision';
    btn.style.fontSize = '1rem';
    btn.style.padding = '0.5rem 1rem';
    btn.onclick = () => startThumbnailSelection(subdiv);
    btnContainer.appendChild(btn);
  });
  gameDisplayContainer.appendChild(btnContainer);
}
// Limpia el contenedor principal del juego
function clearGameDisplay() {
  const gameDisplayContainer = document.getElementById('game-board-display');
  if (gameDisplayContainer) {
    gameDisplayContainer.innerHTML = '';
  }
}

// Muestra el botón de inicio "JUGAR"
function showStartButton() {
  clearGameDisplay();
  const gameDisplayContainer = document.getElementById('game-board-display');
  gameDisplayContainer.classList.remove('canvas-active');
  gameDisplayContainer.classList.add('bg-blocka');
  // Restaurar el background al valor por defecto
  gameDisplayContainer.style.background = '';

  // Crear contenedor de simulación de juego y botones overlay
  boardSim.className = 'board-simulation';
  boardSim.style.position = 'relative';
  boardSim.style.width = '420px';
  boardSim.style.height = '420px';

  // Overlay de botones
  const overlayBtns = document.createElement('div');
  overlayBtns.className = 'game-overlay-buttons';

  // Share button y dropdown
  const shareContainer = document.createElement('div');
  shareContainer.className = 'share-container';
  const shareBtn = document.createElement('button');
  shareBtn.className = 'overlay-btn share-btn';
  shareBtn.id = 'shareBtn';
  shareBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>`;
  shareContainer.appendChild(shareBtn);
  const shareDropdown = document.createElement('div');
  shareDropdown.className = 'share-dropdown';
  shareDropdown.id = 'shareDropdown';
  shareDropdown.innerHTML = `<div class="social-buttons">
    <button class="social-btn facebook-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button>
    <button class="social-btn twitter-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></button>
    <button class="social-btn instagram-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></button>
    <button class="social-btn gmail-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg></button>
    <button class="social-btn whatsapp-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/></svg></button>
  </div>`;
  shareContainer.appendChild(shareDropdown);
  overlayBtns.appendChild(shareContainer);

  // Expand button
  const expandBtn = document.createElement('button');
  expandBtn.className = 'overlay-btn expand-btn';
  expandBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
  overlayBtns.appendChild(expandBtn);

  boardSim.appendChild(overlayBtns);

  // Botón JUGAR
  const startBtn = document.createElement('button');
  startBtn.textContent = 'JUGAR';
  startBtn.className = 'btn-jugar';
  startBtn.style.fontSize = '1rem';
  startBtn.style.padding = '0.5rem 1rem';
  startBtn.style.margin = '3rem auto';
  startBtn.style.display = 'block';
  // Guardar referencias para ocultar luego
  window._blockaShareBtn = shareContainer;
  window._blockaExpandBtn = expandBtn;
  startBtn.onclick = () => {
    // Ocultar botones al iniciar el juego
    if (window._blockaShareBtn) window._blockaShareBtn.style.display = 'none';
    if (window._blockaExpandBtn) window._blockaExpandBtn.style.display = 'none';
    // Reiniciar contador de niveles y barajar niveles
    indiceNivelActual = 0;
    NIVELES = shuffleArray([...NIVELES_ORIGINALES]);
    showSubdivisionSelector();
  };
  boardSim.appendChild(startBtn);
  gameDisplayContainer.appendChild(boardSim);
  console.log('Botón JUGAR y botones overlay insertados en game-board-display');
}

function ensureGameUI() {
    // Si ya existen, no crear de nuevo
    if (document.getElementById('gameCanvas')) return;
    const gameDisplayContainer = document.getElementById('game-board-display');
    // Crear área de juego
    const gameArea = document.createElement('div');
    gameArea.className = 'game-area';
    gameArea.style.width = '500px';
    gameArea.style.height = '500px';
    // Canvas
    lienzo = document.createElement('canvas');
    lienzo.id = 'gameCanvas';
    lienzo.width = 500;
    lienzo.height = 500;
    lienzo.tabIndex = 0;
  gameArea.appendChild(lienzo);
  ctx = lienzo.getContext('2d');
  // Registrar eventos de mouse para rotar piezas
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
        // Click izquierdo: girar a la izquierda
        p.rot = (p.rot + 270) % 360;
      } else if (e.button === 2) {
        // Click derecho: girar a la derecha
        p.rot = (p.rot + 90) % 360;
      }
      comprobarPiezaCorrecta(p);
      render();
    }
  });
  // Permitir el uso de botón derecho en el canvas
  lienzo.addEventListener('contextmenu', e => e.preventDefault());
    // HUD
    const hud = document.createElement('div');
    hud.className = 'hud';
    etiquetaNivel = document.createElement('span');
    etiquetaNivel.id = 'levelLabel';
    etiquetaNivel.textContent = 'Nivel: —';
    hud.appendChild(etiquetaNivel);
    estadoEl = document.createElement('span');
    estadoEl.id = 'status';
    estadoEl.textContent = 'Piezas correctas: 0 / 4';
    hud.appendChild(estadoEl);
    temporizadorEl = document.createElement('span');
    temporizadorEl.id = 'timer';
    temporizadorEl.textContent = 'Tiempo: 00:00';
    hud.appendChild(temporizadorEl);
    btnControl = document.createElement('button');
    btnControl.id = 'btn-control';
    btnControl.textContent = 'Comenzar';
    hud.appendChild(btnControl);
    // Asignar event listener único para Comenzar/Reiniciar
    btnControl.onclick = () => {
      if (estadoJuego === 'no_iniciado') {
        iniciarJuego();
      } else if (estadoJuego === 'jugando' || estadoJuego === 'ganado' || estadoJuego === 'perdido') {
        reiniciarJuego();
      }
    };
    recordEl = document.createElement('span');
    recordEl.id = 'record';
    hud.appendChild(recordEl);
    // Si ya existe el botón, reutilizarlo y limpiar listeners previos
    let oldBtn = document.getElementById('nextLevel');
    if (oldBtn) {
      let newBtn = oldBtn.cloneNode(true);
      oldBtn.parentNode.replaceChild(newBtn, oldBtn);
      btnSiguienteNivel = newBtn;
    } else {
      btnSiguienteNivel = document.createElement('button');
      btnSiguienteNivel.id = 'nextLevel';
      btnSiguienteNivel.className = 'hidden';
      btnSiguienteNivel.textContent = 'Siguiente nivel';
      hud.appendChild(btnSiguienteNivel);
    }
    btnSiguienteNivel.addEventListener('click', () => {
      btnSiguienteNivel.classList.add('hidden');
      indiceNivelActual++;
      if (indiceNivelActual < NIVELES.length) {
        // 1. Ocultar el lienzo actual (canvas)
        if (lienzo) lienzo.style.display = 'none';
        // 2. Limpiar variables de tiempo/estado para el próximo juego
        reiniciarVariablesJuego();
        // 3. Iniciar la fase de selección de imagen (carrusel)
        startThumbnailSelection(selectedSubdivisions);
      } else {
        // Si no hay más niveles, mostrar animación de victoria o mensaje final
        mostrarAnimacionVictoria && mostrarAnimacionVictoria();
      }
    });
  // Botón Volver al menú
  btnVolverMenu = document.createElement('button');
  btnVolverMenu.id = 'btn-volver-menu';
  btnVolverMenu.className = 'btn-volver-menu';
  btnVolverMenu.textContent = 'Volver al menú';
  hud.appendChild(btnVolverMenu);
  // Listener para volver al menú
  btnVolverMenu.addEventListener('click', () => {
    window.location.href = '../blocka.html';
  });
  btnAyuda = document.createElement('button');
  btnAyuda.className = 'btn-ayuda';
  btnAyuda.id = 'btn-ayuda';
  btnAyuda.innerHTML = '<img src="../assets/img/help-btn-1.png">';
  hud.appendChild(btnAyuda);
  // Listener para ayuda (
  btnAyuda.addEventListener('click', (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (btnAyuda.disabled) return; // ya usada en este nivel
    console.log('¡Ayudita usada!');
    btnAyuda.disabled = true;//evita múltiples usos
    btnAyuda.classList.add('pulse');
    btnAyuda.classList.add('usada');
    //accion ayudita
    if (typeof helpAction === 'function') helpAction();
  });
  // Ocultar ayuda por defecto (se mostrará solo a partir de nivel 3)
  btnAyuda.style.display = 'none';
  // Mostrar u ocultar el botón de ayuda según el nivel
  if (btnAyuda) {
    if (indiceNivelActual >= 2) {
      btnAyuda.style.display = '';
      btnAyuda.disabled = false;
      btnAyuda.classList.remove('pulse', 'usada');
    } else {
      btnAyuda.style.display = 'none';
    }
  }
  gameDisplayContainer.appendChild(gameArea);
  gameDisplayContainer.appendChild(hud);
}

// Deshabilita el menú contextual (clic derecho) en el canvas del juego
function enableCanvasContextMenu() {
    if (lienzo) {
        lienzo.addEventListener('contextmenu', e => e.preventDefault());
    }
}

// Variables globales para elementos UI
let lienzo, ctx, etiquetaNivel, estadoEl, temporizadorEl, btnControl, recordEl, btnSiguienteNivel, btnAyuda, btnVolverMenu, btnGameControl;


// Niveles (ajusta rutas en carpeta images)
const NIVELES_ORIGINALES = [
  'assets/img/imgBlocka/blocka1.png',
  'assets/img/imgBlocka/blocka2.png',
  'assets/img/imgBlocka/blocka3.png',
  'assets/img/imgBlocka/blocka4.png',
  'assets/img/imgBlocka/blocka5.png',
  'assets/img/imgBlocka/blocka6.png',
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

// Configuración de piezas (por subdivisión)
let FILAS = 2;
let COLUMNAS = 2;
let ANCHO_PIEZA = ANCHO_CANVAS / COLUMNAS;
let ALTO_PIEZA = ALTO_CANVAS / FILAS;

// Ajusta la cantidad de filas y columnas según subdivisión elegida
function setSubdivisions(subdiv) {
  if (subdiv === 4) {
    FILAS = 2;
    COLUMNAS = 2;
  } else if (subdiv === 6) {
    FILAS = 2;
    COLUMNAS = 3;
  } else if (subdiv === 8) {
    FILAS = 2;
    COLUMNAS = 4;
  } else {
    FILAS = 2;
    COLUMNAS = 2;
  }
  ANCHO_PIEZA = ANCHO_CANVAS / COLUMNAS;
  ALTO_PIEZA = ALTO_CANVAS / FILAS;
}

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

// Temporizador
function iniciarTemporizador() {
  // Configuración de tiempo máximo por nivel
  let tiempos = [null, null, null, 15, 12, 10]; // Niveles 1-3 sin tiempo, 4-6 con tiempo
  tiempoMaximo = tiempos[indiceNivelActual];
  if (tiempoMaximo) {
    tiempoInicio = Date.now();
    tiempoFin = tiempoInicio + tiempoMaximo * 1000;
  } else {
    tiempoInicio = Date.now();
    tiempoFin = null;
  }
  juegoEnCurso = true;
  actualizarTemporizador();
  intervaloTemporizador = setInterval(actualizarTemporizador, 1000);
  if (intervaloTiempoMaximo) clearTimeout(intervaloTiempoMaximo);
  if (tiempoMaximo) {
    intervaloTiempoMaximo = setTimeout(() => {
      if (juegoEnCurso) {
        perderPorTemporizador();
      }
    }, tiempoMaximo * 1000);
  } else {
    intervaloTiempoMaximo = null;
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
  let transcurrido = tiempoTranscurrido();
  if (tiempoMaximo) {
    let restante = Math.max(0, tiempoMaximo - transcurrido);
    temporizadorEl.textContent = `Tiempo restante: ${formatearTiempo(restante)} / Máx: ${formatearTiempo(tiempoMaximo)}`;
    if (restante === 0 && juegoEnCurso) {
      perderPorTemporizador();
    }
  } else {
    temporizadorEl.textContent = `Tiempo: ${formatearTiempo(transcurrido)}`;
  }
}


// Devuelve el tiempo transcurrido en segundos desde el inicio del nivel
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

// Lógica de derrota por temporizador
function perderPorTemporizador() {
  estadoJuego = 'perdido';
  detenerTemporizador();
  // Ocultar botón de siguiente nivel si existe
  if (btnSiguienteNivel) btnSiguienteNivel.classList.add('hidden');
  // Mostrar cartel de derrota en el canvas
  if (ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, ALTO_CANVAS / 2 - 40, ANCHO_CANVAS, 80);
    ctx.fillStyle = '#ffd4d4';
    ctx.font = '26px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡Tiempo agotado!', ANCHO_CANVAS / 2, ALTO_CANVAS / 2 - 6);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Roboto';
    ctx.fillText('Presiona reiniciar o volver al menú', ANCHO_CANVAS / 2, ALTO_CANVAS / 2 + 20);
  }
  actualizarBotonControl();
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
    ctx.fillStyle = '#c4242cff';
  };
}

// Prepara la imagen para que tenga exactamente ANCHO_CANVAS x ALTO_CANVAS (cover centrado)
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

  // Animación confetti victoria
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


// Reinicia variables internas del juego sin cargar el lienzo ni la imagen
function reiniciarVariablesJuego() {
  estadoJuego = 'no_iniciado';
  contadorCorrectas = 0;
  piezas = [];
  if (typeof temporizadorEl !== 'undefined' && temporizadorEl) temporizadorEl.textContent = '';
}

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

    // Delimitar casillas
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.strokeRect(p.x + 0.5, p.y + 0.5, ANCHO_PIEZA - 1, ALTO_PIEZA - 1);
  }
}

// Limpiar canvas con fondo (se usa para volver al menú)
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
   // Lógica de redirección hamburguesa igual a juego.js
  const burgerItems = document.querySelectorAll('.dropdown-item');
  const categoryMap = {
    'Acción': 'section-accion',
    'Aventura': 'section-aventura',
    'Carreras': 'section-carreras',
    'Clásicos': 'section-classicGames',
    'Cocina': 'section-cocina',
    'Deportes': 'section-deportes',
    'Escape': 'section-escape',
    'Estrategia': 'section-strategyGames',
    'Guerra': 'section-guerra',
    'Habilidad': 'section-habilidad',
    'Infantiles': 'section-infantiles',
    'Multijugador': 'section-multiplayerGames',
    'Plataformas': 'section-plataformas',
    'Puzzle': 'section-puzzle',
    'Terror': 'section-terror'
  };
  burgerItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const categoryText = this.querySelector('span').textContent.trim();
      const targetId = categoryMap[categoryText];
      if (targetId) {
        // Si estamos en otra página, ir al home primero
        if (window.location.pathname.includes('blocka.html') || 
            window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('registro.html')) {
          sessionStorage.setItem('scrollTarget', targetId);
          window.location.href = './index.html';
          return;
        }
        // Si estamos en el home, hacer scroll directo
        scrollToCategory(targetId);
      }
      // Cerrar el menú (opcional, si tienes función)
      // closeBurgerMenu();
    });
  });
  // Verificar si hay un scroll pendiente al cargar la página
  checkPendingScroll();
});

function scrollToCategory(targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    const categorySection = targetElement.closest('.category-section');
    if (categorySection) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const offset = categorySection.offsetTop - headerHeight - 20;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  }
}

function checkPendingScroll() {
  const pendingScroll = sessionStorage.getItem('scrollTarget');
  if (pendingScroll) {
    sessionStorage.removeItem('scrollTarget');
    setTimeout(() => {
      scrollToCategory(pendingScroll);
    }, 1500);
  }
}

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
  // Cambiar texto del botón
  estadoJuego = 'no_iniciado';
  actualizarBotonControl();
  resetBtnHelp();
  updateStatus();
  render();
  // Limpia el contenedor principal del juego
  function clearGameDisplay() {
    const gameDisplayContainer = document.getElementById('game-board-display');
    if (gameDisplayContainer) {
      gameDisplayContainer.innerHTML = '';
    }
  }
}


//Logica de la ayuda
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

// corregir rotación
  if (fromX === targetX && fromY === targetY) {
    pieceToPlace.rot = 0;
    comprobarPiezaCorrecta(pieceToPlace); // actualizar contador
    render();
    updateStatus();
    añadirSegundosTemporizador(5); // sumar 5s cuando se usa la ayuda
    return;
  }
  pieceToPlace.rot = 0;

  //Pieza correcta para actualizar contador
  comprobarPiezaCorrecta(pieceToPlace);

  // Re-render y HUD
  render();
  updateStatus();

  // Sumar 5 segundos al temporizador restante / visual
  añadirSegundosTemporizador(5);
}

// AUXILIAR: añade segundos al temporizador en curso
function añadirSegundosTemporizador(segundos) {
  if (!tiempoInicio) {
    // Si el temporizador no está iniciado, no hacemos nada
    return;
  }

  // Reducimos tiempoInicio para que tiempoTranscurrido() disminuya => suma de tiempo visible
  tiempoInicio -= segundos * 1000;

  // Si hay un límite máximo (tiempoMaximo) extender el timeout que provocaría perder por tiempo.
  if (typeof tiempoMaximo === 'number' && tiempoMaximo > 0) {
    // calculamos el nuevo restante y reprogramamos el timeout
    if (intervaloTiempoMaximo) clearTimeout(intervaloTiempoMaximo);

    const restante = Math.max(0, tiempoMaximo - tiempoTranscurrido()); // ya considera el nuevo tiempoInicio
    intervaloTiempoMaximo = setTimeout(() => {
      if (juegoEnCurso) {
        perderPorTemporizador();
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

// Función para controlar la visibilidad del botón de ayuda
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
