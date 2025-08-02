class Proyecto {
  constructor({ clienteId, propuestaId, nombre, estado = 'activo', avances = [] }) {
    if (!clienteId || typeof clienteId !== 'string') {
      throw new Error('clienteId es obligatorio y debe ser un string.');
    }

    if (!propuestaId || typeof propuestaId !== 'string') {
      throw new Error('propuestaId es obligatorio y debe ser un string.');
    }

    if (!nombre || typeof nombre !== 'string') {
      throw new Error('El nombre del proyecto es obligatorio y debe ser texto.');
    }

    const estadosValidos = ['activo', 'pausado', 'finalizado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`);
    }

    if (!Array.isArray(avances)) {
      throw new Error('El campo avances debe ser un arreglo.');
    }

    this.clienteId = clienteId;
    this.propuestaId = propuestaId;
    this.nombre = nombre;
    this.estado = estado;
    this.avances = avances;
    this.creadoEn = new Date();
  }
}

export default Proyecto;