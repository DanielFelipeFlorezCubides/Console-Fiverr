import Contrato from '../models/Contrato.js';

class ContratoService {
  constructor(contratoRepo, proyectoRepo) {
    this.repo = contratoRepo;
    this.proyectoRepo = proyectoRepo;
  }

  async crearContrato(data) {
    const proyecto = await this.proyectoRepo.buscarPorId(data.proyectoId);

    if (!proyecto) {
      throw new Error('No se encontró el proyecto asociado.');
    }

    const contratoExistente = await this.repo.buscarPorProyectoId(data.proyectoId);
    if (contratoExistente) {
      throw new Error('Este proyecto ya tiene un contrato asociado.');
    }

    const contrato = new Contrato(data);
    return await this.repo.crear(contrato);
  }

  async listarContratos() {
    return await this.repo.listar();
  }

  async buscarPorId(id) {
    return await this.repo.buscarPorId(id);
  }
}

export default ContratoService;