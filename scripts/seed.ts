import { MongoClient } from 'mongodb';
import XLSX from 'xlsx';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Forzar la carga de .env.local desde el directorio actual
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'pista8_track_mujeres_web';
const MIN_ATTENDANCE_PERCENTAGE = 80;

if (!MONGODB_URI) {
  console.error('ERROR CRÍTICO: No se encontró MONGODB_URI en .env.local');
  process.exit(1);
}

async function runSeed() {
  const client = new MongoClient(MONGODB_URI as string);

  try {
    const filePath = path.join(process.cwd(), 'Base_asistencia_Track_Mujeres_F.xlsx');
    
    if (!fs.existsSync(filePath)) {
      console.error(`ERROR CRÍTICO: No se encontró el Excel en la ruta: ${filePath}`);
      console.error('Mueve el archivo Base_asistencia_Track_Mujeres_F.xlsx dentro de la carpeta prototipo_web.');
      process.exit(1);
    }

    console.log('1. Conectando a MongoDB Atlas...');
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('asistencias');

    await collection.createIndex({ ci: 1 }, { unique: true });

    console.log('2. Leyendo archivo Excel...');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rawData: Record<string, any>[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!rawData.length) {
      throw new Error('La hoja de Excel está vacía.');
    }

    console.log(`3. Procesando ${rawData.length} registros...`);
    const operations = rawData.map((row) => {
      const ci = Number(row['CI']);
      const modulos = [];
      let totalAsistencias = 0;

      for (let i = 1; i <= 15; i++) {
        const key = `Módulo ${i}`;
        const asistio = String(row[key] || '').trim().toLowerCase() === 'asistió';
        if (asistio) totalAsistencias++;

        modulos.push({ numero: i, nombre: key, asistio });
      }

      const porcentaje = Number(((totalAsistencias / 15) * 100).toFixed(1));
      const estado = porcentaje >= MIN_ATTENDANCE_PERCENTAGE ? 'Aprobado' : 'Reprobado';

      return {
        updateOne: {
          filter: { ci },
          update: { 
            $set: { ci, modulos, porcentaje_asistencia: porcentaje, estado_certificacion: estado } 
          },
          upsert: true,
        },
      };
    });

    const result = await collection.bulkWrite(operations);
    console.log(`ÉXITO: Migración completada.`);
    console.log(`-> Insertados: ${result.upsertedCount}`);
    console.log(`-> Actualizados: ${result.modifiedCount}`);

  } catch (error) {
    console.error('FALLO EN LA MIGRACIÓN:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Conexión cerrada.');
  }
}

runSeed();