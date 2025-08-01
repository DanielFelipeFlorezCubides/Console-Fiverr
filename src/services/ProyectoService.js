class ProyectoService {
    constructor(proyectoRepo) {
      this.repo = proyectoRepo;
    }
  
    async crearDesdePropuesta(propuesta) {
      const proyecto = {
        propuestaId: propuesta._id.toString(),
        clienteId: propuesta.clienteId,
        nombre: `Proyecto de: ${propuesta.descripcion.slice(0, 20)}...`,
        estado: 'activo',
        avances: [],
        creadoEn: new Date()
      };
  
      return await this.repo.crear(proyecto);
    }
  }
  
  export default ProyectoService;  