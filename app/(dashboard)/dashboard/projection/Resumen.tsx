/* Resumen.tsx */
"use client";
import React, { useMemo } from "react";
import type { CardProps, Selection } from "@heroui/react";

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
  makeToOrder: number,
  redZone: number,
  yellowZone: number,
  greenZone: number
) => {
  const total = netFlow + makeToOrder;
  if (total === 0) return "Negro";
  if (total >= 1 && total <= redZone) return "Rojo";
  if (total > redZone && total <= yellowZone) return "Amarillo";
  if (total > yellowZone && total <= greenZone) return "Verde";
  if (total > greenZone) return "Azul";
  return "Sin color";
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
        d.MakeToOrder,
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
        variant="flat"
        color="primary"
        title="Selecciona una fecha en el grid para ver el resumen."
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
                  <TableRow key={color}>
                    <TableCell>{color}</TableCell>
                    <TableCell>{summary.counts[color]}</TableCell>
                    <TableCell>{summary.percentages[color]}</TableCell>
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
