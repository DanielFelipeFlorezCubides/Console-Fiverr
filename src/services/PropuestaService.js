import Propuesta from '../models/Propuesta.js';

class PropuestaService {
    constructor(propuestaRepo) {
        this.repo = propuestaRepo;
    }

    async crearPropuesta(data) {
        const propuesta = new Propuesta(data); // validación
        return await this.repo.crear(propuesta);
    }

    async listarPropuestas() {
        return await this.repo.listar();
    }

    // ... otros métodos en el futuro: actualizar, eliminar, etc.
}

export default PropuestaService;