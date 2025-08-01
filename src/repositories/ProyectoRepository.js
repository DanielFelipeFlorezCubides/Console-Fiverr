import { ObjectId } from 'mongodb';

class ProyectoRepository {
  constructor(db) {
    this.collection = db.collection('proyectos');
  }

  async crear(proyecto) {
    const result = await this.collection.insertOne(proyecto);
    return result.insertedId;
  }
}

export default ProyectoRepository;