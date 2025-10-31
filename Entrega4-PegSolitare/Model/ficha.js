// Modelo: Ficha (lógica pura)
export class Ficha {
  constructor(id, x, y, { tipo = 'ficha', color = '#e91e63' } = {}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.tipo = tipo;
    this.color = color;
    //this.img = null;
    //if (src) this.loadImage(src);
  }

  moverA(x, y) {
    this.x = x;
    this.y = y;
  }
}