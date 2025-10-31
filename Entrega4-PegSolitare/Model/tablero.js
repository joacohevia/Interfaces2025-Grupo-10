// Modelo: Tablero (lógica pura, sin DOM)
// Expone estado y operaciones (añadir ficha, mover ficha, consultas).
export class Tablero {
  constructor(filas = 7, columnas = 7) {
    this.filas = filas;
    this.columnas = columnas;
    this.centroX = Math.floor(this.columnas/2);
    this.centroY = Math.floor(this.filas/2);
    //calcula el centro del tablero
    this.fichas = new Map(); // id -> Ficha
  }

  esDentro(x, y) {
    return x >= 0 && x < this.columnas && y >= 0 && y < this.filas;
  }
// Devuelve true si la celda (x,y) forma parte de la cruz central
//si la col es 0 su fila debe estar entre 2 y 4
  esCasillaValida(x, y) {
    if (!this.esDentro(x, y)) return false;
    return (x >= 2 && x <=4) || (y >= 2 && y<=4);
  }

  agregarFicha(ficha) {
    if (!this.esDentro(ficha.x, ficha.y)) {
      throw new Error('Ficha fuera de rango');
    }
    if (!this.esCasillaValida(ficha.x, ficha.y)) {
      throw new Error('Ficha en casilla inválida para Peg Solitaire');
    }
    this.fichas.set(ficha.id, ficha);
  }

  moverFicha(id, x, y) {
    if (!this.esDentro(x, y)|| !this.esCasillaEnCruz(x,y)) return false;
    const f = this.fichas.get(id);
    if (!f) return false;
    // Aquí podrías validar reglas antes de mover
    f.moverA(x, y);
    return true;
  }

  getFicha(id) {
    return this.fichas.get(id) ?? null;
  }

  getFichas() {
    return Array.from(this.fichas.values());
  }

  getFichaEn(x, y) {
    for (const f of this.fichas.values()) {
      if (f.x === x && f.y === y) return f;
    }
    return null;
  }

   // Construye y devuelve la matriz con -1/0/1 y el resto del estado para la vista
  obtenerEstado() {
    // crear matriz inicial
    const matriz = new Array(this.filas);
    for (let y = 0; y < this.filas; y++) {
      matriz[y] = new Array(this.columnas);
      for (let x = 0; x < this.columnas; x++) {
        if (!this.esCasillaValida(x, y)) 
          matriz[y][x] = -1; // fuera del tablero
        else 
          matriz[y][x] = 0; // válida y vacía por defecto
      }
    }

    // marcar ocupadas según fichas
    for (const f of this.getFichas()) {
      if (this.esDentro(f.x, f.y) && this.esCasillaValida(f.x, f.y)) {
        matriz[f.y][f.x] = 1;
      }
    }

    return {
      filas: this.filas,
      columnas: this.columnas,
      centroX: this.centroX,
      centroY: this.centroY,
      matriz, // matriz con -1/0/1
      fichas: this.getFichas().map(f => ({ 
        id: f.id, 
        x: f.x, 
        y: f.y, 
        color: f.color, 
        tipo: f.tipo, 
        img: f.img//img
      }))
    };
  }

  moverConFicha(id, dx, dy) {
  const ficha = this.getFicha(id);
  if (!ficha) return false;
  const cordX = ficha.x;
  const cordY = ficha.y;
  let f = this.fichas.get(id);

  if (!this.esMovimientoValido(cordX, cordY, dx, dy)) return false;

  const midX = Math.floor((cordX + dx) / 2);
  const midY = Math.floor((cordY + dy) / 2);

  // eliminar la ficha intermedia
  const eliminado = this.quitarFichaEn(midX, midY);
  if (!eliminado) return false; // seguridad extra

  // mover la ficha (mutar el objeto existente)
  f.moverA(dx, dy);

  return true;
  }
  quitarFichaEn(x, y) {
  for (const [id, f] of this.fichas.entries()) {
    if (f.x === x && f.y === y) {
      this.fichas.delete(id);
      return true;
    }
  }
  return false;
    }
  esMovimientoValido(sx, sy, dx, dy) {
  if (!this.esDentro(sx, sy) || !this.esDentro(dx, dy)) return false;
  if (!this.esCasillaValida(sx, sy) || !this.esCasillaValida(dx, dy)) return false;
  if (sx === dx && sy === dy) return false;

  const dxAbs = Math.abs(dx - sx);
  const dyAbs = Math.abs(dy - sy);

  // debe ser ortogonal y exactamente 2 celdas
  const esSaltoValido = (dxAbs === 2 && dyAbs === 0) || (dyAbs === 2 && dxAbs === 0);
  if (!esSaltoValido) return false;

  // origen debe tener ficha
  const origen = this.getFichaEn(sx, sy);
  if (!origen) return false;

  // destino debe estar vacío
  const destino = this.getFichaEn(dx, dy);
  if (destino) return false;

  // la casilla intermedia debe tener ficha (para capturar)
  const midX = Math.floor((sx + dx) / 2);
  const midY = Math.floor((sy + dy) / 2);
  const medio = this.getFichaEn(midX, midY);
  if (!medio) return false;

  return true;
  }

  movimientosPosiblesDesde(sx, sy) {
  const posibles = [];
  const origen = this.getFichaEn(sx, sy);
  if (!origen) return posibles;
  const deltas = [
    { dx: 2, dy: 0 },
    { dx: -2, dy: 0 },
    { dx: 0, dy: 2 },
    { dx: 0, dy: -2 }
  ];
  for (const d of deltas) {
    const nx = sx + d.dx;
    const ny = sy + d.dy;
    if (this.esMovimientoValido(sx, sy, nx, ny)) {
      posibles.push({ x: nx, y: ny });
    }
  }
  return posibles;
  }
  tieneFichasRestantes() {
    return this.getFichas().length > 1;
  }

  hayMovimientosPosibles() {
    for (const ficha of this.getFichas()) {
      if (this.movimientosPosiblesDesde(ficha.x, ficha.y).length > 0) {
        return true;
      }
    }
    return false;
  }

}
