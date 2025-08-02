import Entregable from '../models/Entregable.js';

class EntregableService {
  constructor(entregableRepo, proyectoRepo) {
    this.repo = entregableRepo;
    this.proyectoRepo = proyectoRepo;
  }

  async crearEntregable(data) {
    // Validación: proyecto debe existir
    const proyecto = await this.proyectoRepo.buscarPorId(data.proyectoId);
    if (!proyecto) {
      throw new Error('El proyecto asociado no existe.');
    }

    const entregable = new Entregable(data);
    return await this.repo.crear(entregable);
  }

  async listarPorProyecto(proyectoId) {
    return await this.repo.listarPorProyecto(proyectoId);
  }

  async cambiarEstado(id, nuevoEstado) {
    const estadosValidos = ['pendiente', 'entregado', 'aprobado', 'rechazado'];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido. Usa uno de: ${estadosValidos.join(', ')}`);
    }

    const entregable = await this.repo.buscarPorId(id);
    if (!entregable) {
      throw new Error('El entregable no existe.');
    }

    return await this.repo.cambiarEstadoConTransaccion(id, nuevoEstado);
  }

  async eliminarEntregable(id) {
    const entregable = await this.repo.buscarPorId(id);
    if (!entregable) {
      throw new Error('El entregable no existe.');
    }

    return await this.repo.eliminarConTransaccion(id);
  }
}

export default EntregableService;