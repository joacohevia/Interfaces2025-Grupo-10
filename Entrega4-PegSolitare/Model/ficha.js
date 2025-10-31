// Modelo: Ficha (lógica pura)
export class Ficha {
  constructor(id, x, y, { tipo = 'ficha', color = '#e91e63' } = {}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.tipo = tipo;
    this.color = color;
    this.img = null;
  }

  moverA(x, y) {
    this.x = x;
    this.y = y;
  }
   // Asignar una Image ya precargada (HTMLImageElement)
  setImage(img) {
    this.img = img;
  }

}