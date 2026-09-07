import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import client from '@/lib/mongodb';

interface IAsistencia {
  ci: number;
  modulos: {
    numero: number;
    nombre: string;
    asistio: boolean;
  }[];
  porcentaje_asistencia: number;
  estado_certificacion: 'Aprobado' | 'Reprobado';
}

const LOCAL_DATA_PATH = path.join(process.cwd(), 'data', 'asistencias-local.json');
let datosLocales: IAsistencia[] | null = null;
if (fs.existsSync(LOCAL_DATA_PATH)) {
  datosLocales = JSON.parse(fs.readFileSync(LOCAL_DATA_PATH, 'utf-8'));
}

const MAX_INTENTOS = 3;
async function buscarAsistencia(ci: number) {
  let ultimoError: unknown;

  for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB || 'pista8_track_mujeres');
      return await db
        .collection<IAsistencia>('asistencias')
        .findOne({ ci }, { projection: { _id: 0 } });
    } catch (error) {
      ultimoError = error;
      if (intento < MAX_INTENTOS) {
        await new Promise((resolve) => setTimeout(resolve, 400 * intento));
      }
    }
  }

  throw ultimoError;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ci: string }> }
) {
  const { ci } = await params;

  // Solo se acepta un C.I. numérico, sin signos ni decimales.
  if (!/^\d+$/.test(ci)) {
    return NextResponse.json({ error: 'C.I. inválido' }, { status: 400 });
  }

  try {
    const asistencia = datosLocales
      ? datosLocales.find((registro) => registro.ci === Number(ci)) ?? null
      : await buscarAsistencia(Number(ci));

    if (!asistencia) {
      return NextResponse.json(
        { error: 'C.I. no encontrado en el registro' },
        { status: 404 }
      );
    }

    return NextResponse.json(asistencia, { status: 200 });
  } catch (error) {
    console.error('Error al consultar asistencia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
