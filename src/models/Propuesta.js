class Propuesta {
    constructor({ clienteId, descripcion, precio, plazoDias, estado = 'pendiente' }) {
      if (!clienteId || typeof clienteId !== 'string') throw new Error("ID de cliente inválido");
      if (!descripcion || typeof descripcion !== 'string') throw new Error("Descripción inválida");
      if (typeof precio !== 'number' || precio <= 0) throw new Error("Precio inválido");
      if (typeof plazoDias !== 'number' || plazoDias <= 0) throw new Error("Plazo inválido");
      if (!['pendiente', 'aceptada', 'rechazada'].includes(estado)) throw new Error("Estado inválido");
  
      this.clienteId = clienteId;
      this.descripcion = descripcion;
      this.precio = precio;
      this.plazoDias = plazoDias;
      this.estado = estado;
      this.creadoEn = new Date();
    }
  }
  
  export default Propuesta;  