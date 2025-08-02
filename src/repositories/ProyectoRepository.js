import { ObjectId } from 'mongodb';

class ProyectoRepository {
  constructor(db) {
    this.collection = db.collection('proyectos');
  }

  async crear(proyecto) {
    const result = await this.collection.insertOne(proyecto);
    return result.insertedId;
  }

  async listar() {
    return await this.collection.find({}).toArray();
  }

  async buscarPorId(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async actualizarEstado(id, nuevoEstado) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { estado: nuevoEstado } }
    );
    return result.modifiedCount > 0;
  }

  async agregarAvance(id, avanceTexto) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { avances: avanceTexto } }
    );
    return result.modifiedCount > 0;
  }
}

export default ProyectoRepository;