class Contrato {
    constructor({ proyectoId, condiciones, fechaInicio, fechaFin, valorTotal }) {
      if (!proyectoId || typeof proyectoId !== 'string') throw new Error("ID de proyecto inválido");
      if (!condiciones || typeof condiciones !== 'string') throw new Error("Condiciones inválidas");
      if (!fechaInicio || isNaN(Date.parse(fechaInicio))) throw new Error("Fecha de inicio inválida");
      if (!fechaFin || isNaN(Date.parse(fechaFin))) throw new Error("Fecha de fin inválida");
      if (typeof valorTotal !== 'number' || valorTotal <= 0) throw new Error("Valor total inválido");
  
      this.proyectoId = proyectoId;
      this.condiciones = condiciones;
      this.fechaInicio = new Date(fechaInicio);
      this.fechaFin = new Date(fechaFin);
      this.valorTotal = valorTotal;
      this.creadoEn = new Date();
    }
  }
  
  export default Contrato;  