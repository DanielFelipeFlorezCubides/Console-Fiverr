import { ObjectId } from 'mongodb';

class ClienteRepository {
    constructor(db) {
        this.collection = db.collection('clientes');
    }

    async crear(cliente) {
        const result = await this.collection.insertOne(cliente);
        return result.insertedId;
    }

    async listar() {
        return await this.collection.find({}).toArray();
    }

    async buscarPorId(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async actualizar(id, nuevosDatos) {
        const result = await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: nuevosDatos }
        );
        return result.modifiedCount > 0;
    }

    async eliminar(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

export default ClienteRepository;