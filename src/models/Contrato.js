class Contrato {
  constructor({ proyectoId, condiciones, fechaInicio, fechaFin, valorTotal }) {
    if (!proyectoId || typeof proyectoId !== 'string') {
      throw new Error('El ID del proyecto es obligatorio y debe ser un string.');
    }

    if (!condiciones || typeof condiciones !== 'string') {
      throw new Error('Las condiciones deben ser texto no vacío.');
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio)) {
      throw new Error('La fecha de inicio es inválida.');
    }

    if (isNaN(fin)) {
      throw new Error('La fecha de fin es inválida.');
    }

    if (inicio > fin) {
      throw new Error('La fecha de fin debe ser posterior o igual a la fecha de inicio.');
    }

    if (typeof valorTotal !== 'number' || valorTotal <= 0) {
      throw new Error('El valor total debe ser un número positivo.');
    }

    this.proyectoId = proyectoId;
    this.condiciones = condiciones;
    this.fechaInicio = inicio;
    this.fechaFin = fin;
    this.valorTotal = valorTotal;
    this.creadoEn = new Date();
  }
}

export default Contrato;