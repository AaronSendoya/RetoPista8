import XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const MIN_ATTENDANCE_PERCENTAGE = 80;

const filePath = path.join(process.cwd(), 'Base_asistencia_Track_Mujeres_F.xlsx');
const outPath = path.join(process.cwd(), 'data', 'asistencias-local.json');

const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const rawData: Record<string, string | number | undefined>[] = XLSX.utils.sheet_to_json(
  workbook.Sheets[sheetName]
);

const registros = rawData.map((row) => {
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

  return { ci, modulos, porcentaje_asistencia: porcentaje, estado_certificacion: estado };
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(registros, null, 2));
console.log(`Exportados ${registros.length} registros a ${outPath}`);
