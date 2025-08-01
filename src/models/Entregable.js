class Entregable {
    constructor({ proyectoId, descripcion, fechaLimite, estado = 'pendiente' }) {
      if (!proyectoId || typeof proyectoId !== 'string') throw new Error("ID de proyecto inválido");
      if (!descripcion || typeof descripcion !== 'string') throw new Error("Descripción inválida");
      if (!fechaLimite || isNaN(Date.parse(fechaLimite))) throw new Error("Fecha límite inválida");
      if (!['pendiente', 'entregado', 'aprobado', 'rechazado'].includes(estado)) throw new Error("Estado inválido");
  
      this.proyectoId = proyectoId;
      this.descripcion = descripcion;
      this.fechaLimite = new Date(fechaLimite);
      this.estado = estado;
      this.creadoEn = new Date();
    }
  }
  
  export default Entregable;  