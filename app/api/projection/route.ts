import { NextResponse } from "next/server";

export async function GET() {
  const { Datos: data }: { Datos: any } = await import("@/public/data.json");

  // 1. Recoger todas las fechas únicas
  const dates = Array.from(
    new Set(data.map((d) => d.VisibleForecastedDate))
  ).sort();

  // 2. Agrupar por Reference y construir las filas
  const rowMap: Record<string, any> = {};
  data.forEach((d) => {
    const key = d.Reference;
    rowMap[key] ??= {};
    rowMap[key].Reference = d.Reference;
    rowMap[key].CenterCode = d.CenterCode;
    rowMap[key][d.VisibleForecastedDate] = d;
  });

  // 3. Convertir a array de filas
  const rows = Object.values(rowMap);

  // 4. Devolver estructura lista para la tabla
  return NextResponse.json({ dates, rows });
}
