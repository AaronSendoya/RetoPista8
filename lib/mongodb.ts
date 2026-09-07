import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Falta definir la variable de entorno MONGODB_URI');
}

const uri = process.env.MONGODB_URI;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Reutiliza la conexión entre hot-reloads para no agotar el pool.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export default clientPromise;
