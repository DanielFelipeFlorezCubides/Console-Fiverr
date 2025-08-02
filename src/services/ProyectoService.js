import Proyecto from '../models/Proyecto.js';

class ProyectoService {
  constructor(proyectoRepo) {
    this.repo = proyectoRepo;
  }

  async crearDesdePropuesta(propuesta) {
    const proyecto = new Proyecto({
      propuestaId: propuesta._id.toString(),
      clienteId: propuesta.clienteId,
      nombre: `Proyecto: ${propuesta.descripcion.slice(0, 30)}...`,
      estado: 'activo',
      avances: []
    });

    return await this.repo.crear(proyecto);
  }

  async listarProyectos() {
    return await this.repo.listar();
  }

  async cambiarEstadoProyecto(id, nuevoEstado) {
    const estadosValidos = ['activo', 'pausado', 'finalizado', 'cancelado'];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`);
    }

    return await this.repo.actualizarEstado(id, nuevoEstado);
  }

  async buscarPorId(id) {
    return await this.repo.buscarPorId(id);
  }

  async agregarAvance(id, avanceTexto) {
    if (!avanceTexto || typeof avanceTexto !== 'string' || avanceTexto.trim().length === 0) {
      throw new Error('El avance debe ser un texto no vacío.');
    }

    return await this.repo.agregarAvance(id, avanceTexto.trim());
  }
}

export default ProyectoService;