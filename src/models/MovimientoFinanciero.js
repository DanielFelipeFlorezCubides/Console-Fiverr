class MovimientoFinanciero {
    constructor({ proyectoId, tipo, monto, descripcion, fecha = new Date() }) {
      if (!proyectoId || typeof proyectoId !== 'string') throw new Error("ID de proyecto inválido");
      if (!['ingreso', 'egreso'].includes(tipo)) throw new Error("Tipo de movimiento inválido");
      if (typeof monto !== 'number' || monto <= 0) throw new Error("Monto inválido");
      if (!descripcion || typeof descripcion !== 'string') throw new Error("Descripción inválida");
      if (!fecha || isNaN(Date.parse(fecha))) throw new Error("Fecha inválida");
  
      this.proyectoId = proyectoId;
      this.tipo = tipo;
      this.monto = monto;
      this.descripcion = descripcion;
      this.fecha = new Date(fecha);
      this.creadoEn = new Date();
    }
  }
  
  export default MovimientoFinanciero;  