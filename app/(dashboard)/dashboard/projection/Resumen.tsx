/* Resumen.tsx */
"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Alert,
  Spacer,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

export type DataItem = {
  CenterCode: string;
  Reference: string;
  VisibleForecastedDate: string;
  NetFlow: number;
  GreenZone: number;
  YellowZone: number;
  RedZone: number;
  MakeToOrder: number;
};

interface ResumenProps {
  data: DataItem[];
  selectedDate: string | null;
}

const getCellColor = (
  netFlow: number,
  redZone: number,
  yellowZone: number,
  greenZone: number
) => {
  const total = netFlow;

  if (total === 0) return "Negro"; // Negro
  if (total >= 1 && total <= redZone) return "Rojo"; // Rojo
  if (total > redZone && total <= redZone + yellowZone) return "Amarillo"; // Amarillo
  if (total > redZone + yellowZone && total <= redZone + yellowZone + greenZone)
    return "Verde"; // Verde
  if (total > redZone + yellowZone + greenZone) return "Azul"; // Azul

  return "Sin color"; // Otro caso
};

const colorMap: Record<string, string> = {
  Rojo: "danger",
  Amarillo: "warning",
  Verde: "success",
  Negro: "dark",
  Azul: "primary",
};

const Resumen: React.FC<ResumenProps> = ({ data, selectedDate }) => {
  const summary = useMemo(() => {
    if (!selectedDate) return null;
    const filtered = data.filter(
      (d) => d.VisibleForecastedDate === selectedDate
    );
    const counts: Record<string, number> = {
      Rojo: 0,
      Amarillo: 0,
      Verde: 0,
      Negro: 0,
      Azul: 0,
    };

    filtered.forEach((d) => {
      const color = getCellColor(
        d.NetFlow,
        d.RedZone,
        d.YellowZone,
        d.GreenZone
      );

      counts[color] = (counts[color] || 0) + 1;
    });

    const total = filtered.length;

    const percentages: Record<string, string> = {};

    Object.entries(counts).forEach(([color, count]) => {
      percentages[color] =
        total > 0 ? ((count / total) * 100).toFixed(1) + "%" : "0%";
    });

    return { counts, percentages, total };
  }, [data, selectedDate]);

  if (!selectedDate || !summary) {
    return (
      <Alert
        color="primary"
        title="Selecciona una fecha en el grid para ver el resumen."
        variant="flat"
      />
    );
  }

  return (
    <div>
      <Card className="w-full max-w-[400px]">
        <CardHeader className="justify-center px-6 pb-0 pt-6">
          <div className="flex flex-col items-center">
            <h4 className="text-large">Resumen</h4>
            <p className="text-center text-small text-default-500">
              {selectedDate.slice(0, 10)}
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-end gap-2">
            <Table aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>COLOR</TableColumn>
                <TableColumn>CANTIDAD</TableColumn>
                <TableColumn>PORCENATJE</TableColumn>
              </TableHeader>
              <TableBody>
                {Object.keys(summary.counts).map((color) => (
                  <TableRow
                    style={{ borderRadius: "0.5rem" }}
                    className={`bg-${colorMap[color] || "gray"} `}
                    key={color}>
                    <TableCell className="rounded-l-xl">{color}</TableCell>
                    <TableCell>{summary.counts[color]}</TableCell>
                    <TableCell className="rounded-r-xl">
                      {summary.percentages[color]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Spacer y={4} />
        </CardBody>
      </Card>
    </div>
  );
};

export default Resumen;
