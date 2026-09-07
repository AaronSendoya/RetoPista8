import dns from 'node:dns';
import { MongoClient } from 'mongodb';


dns.setDefaultResultOrder('ipv4first');

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


const client = global._mongoClient ?? new MongoClient(uri, options);

if (process.env.NODE_ENV !== 'production') {
  global._mongoClient = client;
}

export default client;
