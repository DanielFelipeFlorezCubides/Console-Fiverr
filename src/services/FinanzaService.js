import MovimientoFinanciero from '../models/MovimientoFinanciero.js';

class FinanzaService {
    constructor(finanzaRepo, proyectoRepo) {
        this.repo = finanzaRepo;
        this.proyectoRepo = proyectoRepo;
    }

    async registrarMovimiento(data) {
        const proyecto = await this.proyectoRepo.buscarPorId(data.proyectoId);
        if (!proyecto) {
            throw new Error('El proyecto asociado no existe.');
        }

        const movimiento = new MovimientoFinanciero(data);
        return await this.repo.registrarConTransaccion(movimiento);
    }

    async listarPorProyecto(proyectoId) {
        return await this.repo.listarPorProyecto(proyectoId);
    }

    async listarPorRango(fechaInicio, fechaFin) {
        const inicio = new Date(`${fechaInicio}T00:00:00`);
        const fin = new Date(`${fechaFin}T23:59:59`);

        if (isNaN(inicio) || isNaN(fin)) {
            throw new Error('Una o ambas fechas son inválidas.');
        }

        return await this.repo.listarPorRango(fechaInicio, fechaFin);
    }

    async obtenerBalance(proyectoId) {
        const proyecto = await this.proyectoRepo.buscarPorId(proyectoId);
        if (!proyecto) {
            throw new Error('Proyecto no encontrado.');
        }

        return await this.repo.obtenerBalancePorProyecto(proyectoId);
    }
}

export default FinanzaService;