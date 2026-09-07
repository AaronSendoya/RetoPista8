import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

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
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'pista8_track_mujeres');

    const asistencia = await db
      .collection<IAsistencia>('asistencias')
      .findOne({ ci: Number(ci) }, { projection: { _id: 0 } });

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
