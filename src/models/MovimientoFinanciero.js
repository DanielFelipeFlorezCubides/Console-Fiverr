class MovimientoFinanciero {
  constructor({ proyectoId, tipo, monto, descripcion, fecha }) {
    if (!proyectoId || typeof proyectoId !== 'string') {
      throw new Error('El ID del proyecto es obligatorio y debe ser un string.');
    }

    const tiposValidos = ['ingreso', 'egreso'];
    if (!tiposValidos.includes(tipo)) {
      throw new Error(`El tipo debe ser 'ingreso' o 'egreso'.`);
    }

    if (typeof monto !== 'number' || monto <= 0) {
      throw new Error('El monto debe ser un número positivo.');
    }

    if (!descripcion || typeof descripcion !== 'string') {
      throw new Error('La descripción es obligatoria y debe ser texto.');
    }

    const fechaObj = new Date(`${fecha}T12:00:00`);
    if (isNaN(fechaObj)) {
      throw new Error('La fecha es inválida.');
    }

    this.proyectoId = proyectoId;
    this.tipo = tipo;
    this.monto = monto;
    this.descripcion = descripcion;
    this.fecha = fechaObj;
    this.creadoEn = new Date();
  }
}

export default MovimientoFinanciero;