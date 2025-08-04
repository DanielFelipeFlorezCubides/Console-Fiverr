import { ObjectId } from 'mongodb';

class ContratoRepository {
  constructor(db) {
    this.collection = db.collection('contratos');
  }

  async crear(contrato) {
    const result = await this.collection.insertOne(contrato);
    return result.insertedId;
  }

  async listar() {
    return await this.collection.find({}).toArray();
  }

  async buscarPorId(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async buscarPorProyectoId(proyectoId) {
    return await this.collection.findOne({ proyectoId });
  }
}

export default ContratoRepository;