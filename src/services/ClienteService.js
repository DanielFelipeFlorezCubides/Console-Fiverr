import Cliente from '../models/Cliente.js';

class ClienteService {
    constructor(clienteRepository) {
        this.repo = clienteRepository;
    }

    async crearCliente(data) {
        const cliente = new Cliente(data); // valida campos
        return await this.repo.crear(cliente);
    }

    async listarClientes() {
        return await this.repo.listar();
    }

    async actualizarCliente(id, data) {
        return await this.repo.actualizar(id, data);
    }

    async eliminarCliente(id) {
        return await this.repo.eliminar(id);
    }

    async buscarPorId(id) {
        return await this.repo.buscarPorId(id);
    }
}

export default ClienteService;