// Controlador: instancia modelo y vista, conecta eventos y coordina actualizaciones.
import { Ficha } from '../Model/ficha.js';
//dentro de import debe llamarse igual que la clase
import { Tablero } from '../Model/tablero.js';
import { VistaTableroCanvas } from '../View/tableroView.js';


//POPUP SELECCIÓN DE FICHA--------------------------------------------
const popupElegirFicha = document.querySelector('.cntr-elegir-ficha');
let juegoIniciado = false;

// Mostrar popup al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  mostrarPopupFicha();
});

function mostrarPopupFicha() {
  popupElegirFicha.classList.remove('oculto');
  popupElegirFicha.classList.add('active');
}

function ocultarPopupFicha() {
  popupElegirFicha.classList.remove('active');
  popupElegirFicha.classList.add('oculto');
}

//CARGA DE IMAGEN EN LA FICHA--------------------------------------------
let sharedImg = new Image();

let btnOpc1 = document.getElementById('opc1');
let btnOpc2 = document.getElementById('opc2');
let btnOpc3 = document.getElementById('opc3');

btnOpc1.addEventListener('click', () => seleccionarOpcion(1));
btnOpc2.addEventListener('click', () => seleccionarOpcion(2));
btnOpc3.addEventListener('click', () => seleccionarOpcion(3));

function seleccionarOpcion(opcion) {
    switch (opcion) {
        case 1:
            sharedImg.src = 'assets/img/test6.jpg';
            break;
        case 2:
            sharedImg.src = 'assets/img/test7.jpg';
            break;
        case 3:
            sharedImg.src = 'assets/img/test8.jpg';
            break;
    };
    
    sharedImg.onload = () => {
      ocultarPopupFicha(); // Ocultar primero
      llenarTablero(); // Llenar tablero después
      vista.ajustarYRender();
    };
}

const canvas = document.getElementById('tablero-canvas');
if (!canvas) {
  throw new Error('No se encontró el canvas con id "tablero-canvas" en el HTML.');
}
//VARIABLES Y CONSTANTES------------------------------------------------
//LOGICA CRONOMETRO Y DERROTA POR TIEMPO
let timerInterval = null;
let timerStart = null;
let timerRunning = false;
const timerDisplay = document.getElementById('timer');
const TIEMPO_LIMITE_MS = 150000; // 2:30 en ms
let tableroBloqueado = false;
let primerMovimiento = true;

// crear vista usando el canvas existente tableroView.js
const vista = new VistaTableroCanvas(canvas);
// crear modelo
const tablero = new Tablero(7, 7);
let seleccionado = null;


// llenar todas las casillas válidas con ficha excepto el centro
function llenarTablero(){
  ocultarPopupFicha();
  let id = 0;
  for (let y = 0; y < tablero.filas; y++) {
    for (let x = 0; x < tablero.columnas; x++) {
      if (tablero.esCasillaValida(x, y)) {
        if (x === tablero.centroX && y === tablero.centroY) continue; // centro vacío
        const ficha = new Ficha(`p${id++}`, x, y, {tipo: 'ficha', color: '#1e88e5' });
         //aca hay q modificar para q la ficha tenga una img
        ficha.setImage(sharedImg) // asignar la imagen cargada
        tablero.agregarFicha(ficha);
      }
    }
  }
}
llenarTablero();


//MOVER FICHAS CON CLICK Y DRAG&DROP----------------------------
// inicializar estado y dibujar
vista.setEstado(tablero.obtenerEstado());
vista.render();

// Click simple
vista.onCeldaClic = manejarClickEnCelda;

// Drag and drop de fichas
vista.onDragStart = (ficha) => {
  if (tableroBloqueado) return;
  // Opcional: resaltar ficha, mostrar posibles movimientos, etc.
  const posibles = tablero.movimientosPosiblesDesde(ficha.x, ficha.y);
  actualizarVistaConSeleccion({ x: ficha.x, y: ficha.y, id: ficha.id }, posibles);
};

vista.onDragMove = (clientX, clientY, targetCell) => {
  if (tableroBloqueado) return;
};


vista.onDragEnd = (ficha, targetCell) => {
  if (tableroBloqueado) return;
  if (!targetCell) {
    // Soltó fuera del tablero, cancelar selección
    vista.limpiarDestacados();
    actualizarVistaConSeleccion(null, []);
    return;
  }
  // Intenta mover la ficha usando el modelo
  const moved = tablero.moverConFicha(ficha.id, targetCell.x, targetCell.y);
  if (moved) {
    // Iniciar cronómetro en el PRIMER movimiento exitoso
    if (primerMovimiento) {
      iniciarCronometro();
      primerMovimiento = false;
      console.log('Cronómetro iniciado');
    }
    perderPorFaltaDeMovimientos(); //para perder por falta de movs
    verificarDerrotaPorFichas(); //para perder por tiempo
    verificarVictoria(); //para ganar
    vista.limpiarDestacados(); //limpio destacados
    actualizarVistaConSeleccion(null, []);
  } else {
    // Movimiento inválido, mantener selección
    const posibles = tablero.movimientosPosiblesDesde(ficha.x, ficha.y);
    actualizarVistaConSeleccion({ x: ficha.x, y: ficha.y, id: ficha.id }, posibles);
  }
};

function manejarClickEnCelda(x, y) {
   if (tableroBloqueado) return;
  // si no hay selección, intenta seleccionar ficha con movimientos
  if (!seleccionado) {
    const ficha = tablero.getFichaEn(x, y);
    if (!ficha) 
      return;
    const posibles = tablero.movimientosPosiblesDesde(x, y);
    if (!posibles.length) 
      return;
    console.log('ficha con movimientos'+ posibles);
    seleccionado = { x, y, id: ficha.id };
    actualizarVistaConSeleccion(seleccionado, posibles);
    return;
  }
  // si clickeaste otra ficha y esa tiene movimientos => cambiar selección
  const otraFicha = tablero.getFichaEn(x, y);
  if (otraFicha) {
    const posibles2 = tablero.movimientosPosiblesDesde(x, y);
    if (!posibles2.length) 
      return; // la otra no tiene movimientos
    console.log('ficha con movimientos2'+ posibles2);
    seleccionado = { x, y, id: otraFicha.id };
    actualizarVistaConSeleccion(seleccionado, posibles2);
    return;
  }
  // si hay selección, intentar mover
  const moved = tablero.moverConFicha(seleccionado.id, x, y);
  if (moved) {
    // Iniciar cronómetro en el PRIMER movimiento exitoso
    if (primerMovimiento) {
      iniciarCronometro();
      primerMovimiento = false;
      console.log('Cronómetro iniciado');
    }
    seleccionado = null;
    actualizarVistaConSeleccion(null, []);
    verificarDerrotaPorFichas(); //para perder por tiempo
    perderPorFaltaDeMovimientos(); // para perder por falta de movs
    verificarVictoria(); //para ganar
    return; 
  }  
  // si no válido, deseleccionar
  seleccionado = null;
  vista.limpiarDestacados();
  actualizarVistaConSeleccion(null, []);
}
//ESTADO: es el estado del juego un object que tiene las filas,columnas,ect
//SELECCIONADO es la celda que clickqueamos 
function actualizarVistaConSeleccion(seleccionado = null, posibles = []) {
  const estado = tablero.obtenerEstado();
  //console.log(estado);
  if (seleccionado) //si pasaron un seleccionado entonces actualizo el estado
    estado.selected = { x: seleccionado.x, y: seleccionado.y };
    //console.log(seleccionado);
   if (posibles && posibles.length) {
    estado.celdasDestacadas = posibles.map(p => ({ fila: p.y, columna: p.x }));
    } else {
    estado.celdasDestacadas = [];
    }
  vista.setEstado(estado);
  vista.render();
}

/*FUNCION DE REINICIAR------------------------------------------------------------------ */
let btnReinicio = document.getElementById('btn-reiniciar');
btnReinicio.addEventListener('click', reiniciar);

function reiniciar() {
  detenerCronometro();
  vista.reiniciarJuego();
  vista.limpiarDestacados();
  primerMovimiento = true;
  tableroBloqueado = false;
  llenarTablero();
  vista.setEstado(tablero.obtenerEstado());
  vista.render();
  mostrarPopupFicha();
}

// CRONOMETRO-------------------------------------------------------------- 
function iniciarCronometro() {
  if (timerRunning) return;
  timerRunning = true;
  timerStart = Date.now();
  timerInterval = setInterval(actualizarCronometro, 250);
}

function detenerCronometro() {
  timerRunning = false;
  clearInterval(timerInterval);
}

function actualizarCronometro() {
  if (!timerRunning) return;
  const transcurrido = Date.now() - timerStart;
  const minutos = Math.floor(transcurrido / 60000);
  const segundos = Math.floor((transcurrido % 60000) / 1000);
  timerDisplay.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  if (transcurrido >= TIEMPO_LIMITE_MS) {
    perderPorTiempo();
  }
}


//PERDIDA POR TIEMPO--------------------------------------------------------
function perderPorTiempo() {
  detenerCronometro();
  tableroBloqueado = true;
  vista.bloquear();
  vista.mostrarMensaje('¡Perdiste! Se acabó el tiempo.');
}

function verificarDerrotaPorFichas() {
  if (!timerRunning) return;
  if (tablero.tieneFichasRestantes()) {
    const transcurrido = Date.now() - timerStart;
    if (transcurrido >= TIEMPO_LIMITE_MS) {
      perderPorTiempo();
    }
  }
}

//PERDIDA POR FALTA DE MOVIMIENTOS--------------------------------------------------------
function perderPorFaltaDeMovimientos() {
  if(!tablero.hayMovimientosPosibles()) {
    detenerCronometro();
    tableroBloqueado = true;
    vista.bloquear();
    vista.mostrarMensaje('¡Perdiste! No quedan movimientos posibles.');
  }
}

//VERIFICAR VICTORIA--------------------------------------------------------
function verificarVictoria() {
  if (tablero.getFichas().length === 1) {
    detenerCronometro();
    tableroBloqueado = true;
    vista.bloquear();
    vista.mostrarMensaje('¡Ganaste! Solo queda una ficha.');
  }
}
