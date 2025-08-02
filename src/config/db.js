import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27018/?replicaSet=rs0';

const client = new MongoClient(uri, {
  useUnifiedTopology: true
});

let db = null;

export async function connectDB() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME || 'console-fiverr');
    console.log('🟢 Conectado a MongoDB (replicaSet)');
    return db;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
}

export { client };