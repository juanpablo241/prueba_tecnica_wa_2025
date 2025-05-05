// ProyeccionGrid.tsx
"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnVirtualizer,
} from "material-react-table";

import { getProyeccion } from "@/actions/projection/page";

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

interface ProyeccionGridProps {
  onDateSelect: (date: string, data: DataItem[]) => void;
}

const getCellColor = (
  netFlow: number,
  makeToOrder: number,
  redZone: number,
  yellowZone: number,
  greenZone: number
) => {
  const total = netFlow + makeToOrder;

  if (total === 0) return "black"; // Negro
  if (total >= 1 && total <= redZone) return "#C70036"; // Rojo
  if (total > redZone && total <= redZone + yellowZone) return "#F0B100"; // Amarillo
  if (total > redZone + yellowZone && total <= redZone + yellowZone + greenZone)
    return "#008236"; // Verde
  if (total > redZone + yellowZone + greenZone) return "#00A6F4"; // Azul

  return "transparent"; // Otro caso
};

const ProyeccionGrid: React.FC<ProyeccionGridProps> = ({ onDateSelect }) => {
  const [tableData, setTableData] = useState<
    Record<string, Record<string, DataItem[]>>
  >({});
  const [dates, setDates] = useState<string[]>([]);
  const columnVirtualizerInstanceRef = useRef<MRT_ColumnVirtualizer>(null);

  useEffect(() => {
    (async () => {
      try {
        const { dates, rows } = await getProyeccion();

        setTableData(rows);
        setDates(dates);
      } catch (error) {
        console.error("Error al cargar proyección:", error);
      }
    })();
  }, []);

  const handleDateSelect = (fecha: string) => {
    const items: DataItem[] = Object.values(tableData)
      .map((row) => {
        const data = row[fecha];

        return Array.isArray(data) ? undefined : (data as DataItem | undefined);
      })
      .filter((d): d is DataItem => Boolean(d));

    onDateSelect(fecha, items);
  };

  const columns = useMemo<MRT_ColumnDef<Record<string, unknown>>[]>(
    () => [
      {
        accessorKey: "CenterCode",
        header: "CenterCode",
        enableEditing: false,
      },
      {
        accessorKey: "Reference",
        header: "Referencia",
        enableEditing: false,
      },
      ...(dates?.map(
        (fecha): MRT_ColumnDef<Record<string, unknown>> => ({
          id: fecha,
          header: fecha.slice(0, 10),
          accessorFn: (row: Record<string, unknown>) => {
            const d = row[fecha] as DataItem | undefined;

            return d?.MakeToOrder ?? 0;
          },
          muiTableBodyCellProps: ({
            cell,
          }: {
            cell: {
              row: { original: Record<string, unknown> };
            };
          }) => {
            const d = cell.row.original[fecha] as DataItem | undefined;
            const color = d
              ? getCellColor(
                  d.NetFlow,
                  d.MakeToOrder,
                  d.RedZone,
                  d.YellowZone,
                  d.GreenZone
                )
              : undefined;

            return {
              sx: {
                backgroundColor: color,
                color: color === "black" ? "white" : undefined,
                textAlign: "center",
              },
              onClick: () => {
                if (d) handleDateSelect(fecha);
              },
            };
          },

          muiEditTextFieldProps: ({
            cell,
          }: {
            cell: {
              row: { original: Record<string, unknown> };
            };
          }) => {
            const d = cell.row.original[fecha] as DataItem | undefined;

            return {
              type: "number",
              value: d?.MakeToOrder ?? 0,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                if (!d) return;
                const nuevo = Number(e.target.value);

                setTableData((prev) => {
                  return prev.map((row) => {
                    if (row.Reference === d.Reference) {
                      return {
                        ...row,
                        [fecha]: {
                          ...row[fecha],
                          MakeToOrder: nuevo,
                        },
                      };
                    }

                    return row;
                  });
                });
              },
              sx: { textAlign: "center", width: "100%" },
            };
          },
        })
      ) || []),
    ],
    [dates, tableData]
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableEditing: true,
    editDisplayMode: "cell",
    getRowId: (row) => row.Reference as string,

    columnVirtualizerInstanceRef,
    columnVirtualizerOptions: { overscan: 4 },
    enableColumnPinning: true,
    enableColumnResizing: true,
    enableColumnVirtualization: true,
    enableRowNumbers: true,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
  });

  return <MaterialReactTable table={table} />;
};

export default ProyeccionGrid;
