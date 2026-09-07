import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Falta definir la variable de entorno MONGODB_URI');
}

const uri = process.env.MONGODB_URI;

const options = {
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
  retryWrites: true,
  retryReads: true,
};

declare global {
  var _mongoClient: MongoClient | undefined;
}

// Se reutiliza la misma instancia del cliente entre requests (y entre
// hot-reloads en desarrollo). A propósito NO se cachea la promesa de
// connect(): si un intento de conexión falla (ej. un reset de TLS
// transitorio de Atlas), el siguiente request debe poder reintentar en
// lugar de heredar para siempre una promesa ya rechazada.
const client = global._mongoClient ?? new MongoClient(uri, options);

if (process.env.NODE_ENV !== 'production') {
  global._mongoClient = client;
}

export default client;
