class Proyecto {
    constructor({ propuestaId, clienteId, nombre, estado = 'activo' }) {
      if (!propuestaId || typeof propuestaId !== 'string') throw new Error("ID de propuesta inválido");
      if (!clienteId || typeof clienteId !== 'string') throw new Error("ID de cliente inválido");
      if (!nombre || typeof nombre !== 'string') throw new Error("Nombre de proyecto inválido");
      if (!['activo', 'pausado', 'finalizado', 'cancelado'].includes(estado)) throw new Error("Estado inválido");
  
      this.propuestaId = propuestaId;
      this.clienteId = clienteId;
      this.nombre = nombre;
      this.estado = estado;
      this.avances = [];
      this.creadoEn = new Date();
    }
  }
  
  export default Proyecto;  