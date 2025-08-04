class Propuesta {
  constructor({ clienteId, descripcion, precio, plazoDias, estado = 'pendiente' }) {
    if (!clienteId || typeof clienteId !== 'string') {
      throw new Error('El ID del cliente es obligatorio y debe ser un string.');
    }

    if (!descripcion || typeof descripcion !== 'string') {
      throw new Error('La descripción es obligatoria y debe ser un string.');
    }

    if (typeof precio !== 'number' || precio <= 0) {
      throw new Error('El precio debe ser un número positivo.');
    }

    if (typeof plazoDias !== 'number' || plazoDias <= 0) {
      throw new Error('El plazo debe ser un número positivo.');
    }

    const estadosValidos = ['pendiente', 'aceptada', 'rechazada'];
    if (!estadosValidos.includes(estado)) {
      throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
    }

    this.clienteId = clienteId;
    this.descripcion = descripcion;
    this.precio = precio;
    this.plazoDias = plazoDias;
    this.estado = estado;
    this.creadoEn = new Date();
  }
}

export default Propuesta;