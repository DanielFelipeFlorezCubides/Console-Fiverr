import { ObjectId } from 'mongodb';

class FinanzaRepository {
    constructor(db, client) {
        this.db = db;
        this.client = client;
        this.collection = db.collection('movimientos_financieros');
    }

    async registrarConTransaccion(movimiento) {
        const session = this.client.startSession();

        try {
            await session.withTransaction(async () => {
                const result = await this.collection.insertOne(movimiento, { session });

                if (!result.insertedId) {
                    throw new Error('No se pudo registrar el movimiento financiero.');
                }
            });

            return true;
        } catch (error) {
            console.error('❌ Error en transacción (finanzas):', error.message);
            return false;
        } finally {
            await session.endSession();
        }
    }

    async listarPorProyecto(proyectoId) {
        return await this.collection
            .find({ proyectoId })
            .sort({ fecha: -1 })
            .toArray();
    }

    async listarPorRango(fechaInicio, fechaFin) {
        return await this.collection
            .find({
                fecha: {
                    $gte: new Date(`${fechaInicio}T00:00:00`),
                    $lte: new Date(`${fechaFin}T23:59:59`)
                }
            })
            .sort({ fecha: -1 })
            .toArray();
    }

    async obtenerIngresosPorProyecto(proyectoId) {
        const result = await this.collection.aggregate([
            { $match: { proyectoId } },
            {
                $group: {
                    _id: '$tipo',
                    total: { $sum: '$monto' }
                }
            }
        ]).toArray();

        const ingreso = result.find(r => r._id === 'ingreso')?.total || 0;

        return ingreso;
    }

    async obtenerEgresosPorProyecto(proyectoId) {
        const result = await this.collection.aggregate([
            { $match: { proyectoId } },
            {
                $group: {
                    _id: '$tipo',
                    total: { $sum: '$monto' }
                }
            }
        ]).toArray();

        const egreso = result.find(r => r._id === 'egreso')?.total || 0;

        return egreso;
    }
    async obtenerBalancePorProyecto(proyectoId) {
        const result = await this.collection.aggregate([
            { $match: { proyectoId } },
            {
                $group: {
                    _id: '$tipo',
                    total: { $sum: '$monto' }
                }
            }
        ]).toArray();

        const ingreso = result.find(r => r._id === 'ingreso')?.total || 0;
        const egreso = result.find(r => r._id === 'egreso')?.total || 0;

        return ingreso - egreso;
    }
}

export default FinanzaRepository;