import { ObjectId } from 'mongodb';

class EntregableRepository {
    constructor(db, client) {
        this.db = db;
        this.client = client;
        this.collection = db.collection('entregables');
    }

    async crear(entregable) {
        const result = await this.collection.insertOne(entregable);
        return result.insertedId;
    }

    async listarPorProyecto(proyectoId) {
        return await this.collection.find({ proyectoId }).toArray();
    }

    async buscarPorId(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async cambiarEstadoConTransaccion(id, nuevoEstado) {
        const session = this.client.startSession();

        try {
            const result = await session.withTransaction(async () => {
                const entregable = await this.collection.findOne(
                    { _id: new ObjectId(id) },
                    { session }
                );

                if (!entregable) {
                    throw new Error('El entregable no existe.');
                }

                const update = await this.collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { estado: nuevoEstado } },
                    { session }
                );

                if (update.modifiedCount !== 1) {
                    throw new Error('No se pudo actualizar el estado del entregable.');
                }
            });

            return true;
        } catch (error) {
            console.error('❌ Error en transacción (cambiar estado):', error.message);
            return false;
        } finally {
            await session.endSession();
        }
    }

    async eliminarConTransaccion(id) {
        const session = this.client.startSession();

        try {
            await session.withTransaction(async () => {
                const result = await this.collection.deleteOne(
                    { _id: new ObjectId(id) },
                    { session }
                );

                if (result.deletedCount !== 1) {
                    throw new Error('No se pudo eliminar el entregable.');
                }
            });

            return true;
        } catch (error) {
            console.error('❌ Error en transacción (eliminar):', error.message);
            return false;
        } finally {
            await session.endSession();
        }
    }
}

export default EntregableRepository;
