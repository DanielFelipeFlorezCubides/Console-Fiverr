class Entregable {
  constructor({ proyectoId, descripcion, fechaLimite, estado = 'pendiente' }) {
    if (!proyectoId || typeof proyectoId !== 'string') {
      throw new Error('El proyectoId es obligatorio y debe ser un string válido.');
    }

    if (!descripcion || typeof descripcion !== 'string') {
      throw new Error('La descripción del entregable es obligatoria y debe ser texto.');
    }

    const fecha = new Date(`${fechaLimite}T12:00:00`); // para evitar timezone issues
    if (isNaN(fecha)) {
      throw new Error('La fecha límite es inválida.');
    }

    const estadosValidos = ['pendiente', 'entregado', 'aprobado', 'rechazado'];
    if (!estadosValidos.includes(estado)) {
      throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
    }

    this.proyectoId = proyectoId;
    this.descripcion = descripcion;
    this.fechaLimite = fecha;
    this.estado = estado;
    this.creadoEn = new Date();
  }
}

export default Entregable;