import { useEffect, useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_SortingState,
  type MRT_RowVirtualizer,
  type MRT_ColumnDef,
  type MRT_RowData,
} from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  MRT_EditActionButtons,
  // createRow,
  type MRT_Row,
  type MRT_TableOptions,
} from "material-react-table";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Button } from "@heroui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import SelectAutocomplete from "@/components/SelectAutocomplete";
interface CustomTableProps<T extends MRT_RowData> {
  columns: MRT_ColumnDef<T>[];
  data: T[];
  initialState?: any;
  localization?: any;
  filters?: FilterConfig[];
  // Funciones de CRUD
  onCreatingRowSave?: (params: { values: T; table: any }) => Promise<void>;
  onEditingRowSave?: (params: { values: T; table: any }) => Promise<void>;
  onDeletingRow?: (row: MRT_Row<T>) => Promise<void>;
  enableGrouping?: boolean;
  grouping?: any;
  [key: string]: any;
}

interface FilterConfig {
  type: "selectAutocomplete";
  options: { value: string; label: string }[];
  multiple: boolean;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  label: string;
}

// Definición del tema estilo Tailwind
const tailwindTheme = createTheme({
  palette: {
    primary: {
      main: "#38bdf8", // azul de Tailwind
    },
    background: {
      default: "#f9fafb", // fondo similar a Tailwind (gray-50)
    },
    text: {
      primary: "#1f2937", // gris oscuro (gray-800)
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "1rem", // rounded-lg
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // shadow-md
          backgroundColor: "#f9fafb",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem", // rounded-lg
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // shadow-md
          backgroundColor: "#f9fafb",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#38bdf8", // blue-400
          fontWeight: "bold",
          fontFamily: "Inter, sans-serif",
        },
        body: {
          color: "#1f2937", // gray-800
          fontFamily: "Inter, sans-serif",
        },
      },
    },
  },
});

const CustomTable = <T extends MRT_RowData>({
  columns,
  data,
  initialState,
  localization,
  filters,
  onCreatingRowSave,
  onEditingRowSave,
  onDeletingRow,
  enableGrouping = false,
  groupedColumnMode = "order",
  grouping,
  columnVisibility,
  createDisplayMode = "modal",
  editDisplayMode = "modal",
  filterDependencies,

  ...rest
}: CustomTableProps<T>) => {
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [filtersState, setFiltersState] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<T[]>(data);

  const defaultInitialState = {
    density: "compact",
    showColumnFilters: true,
    showGlobalFilter: true,
    ...grouping,
    columnVisibility: { ...columnVisibility, _id: false },
  };
  const defaultLocalization = {};

  useEffect(() => {
    if (filtersState.length === 0) {
      setFilteredData(data);
    }
  }, [data, filtersState]);

  const tableOptions: MRT_TableOptions<T> = {
    columns,
    data: filteredData,
    initialState: { ...defaultInitialState, ...initialState },
    localization: { ...defaultLocalization, ...localization },
    enableEditing: Boolean(onEditingRowSave),

    enableGrouping: enableGrouping,
    groupedColumnMode: groupedColumnMode,
    // Modo de visualización de los modales (puedes ajustarlo a row, modal o custom)
    createDisplayMode: createDisplayMode,
    editDisplayMode: editDisplayMode,
    // Acción para crear una nueva fila
    // ...existing options...
    onCreatingRowSave: onCreatingRowSave
      ? async (params) => {
          await onCreatingRowSave(params);
        }
      : undefined,
    onEditingRowSave: onEditingRowSave
      ? async (params) => {
          await onEditingRowSave(params);
        }
      : undefined,
    // Opcional: cancelar edición/creación para limpiar errores o estados
    onCreatingRowCancel: () => {
      /* Limpieza de estados o errores si es necesario */
    },
    onEditingRowCancel: () => {
      /* Limpieza de estados o errores si es necesario */
    },
    // Personalización del modal (opcional)
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h6">Crear Nuevo Registro</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons row={row} table={table} variant="text" />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h6">Editar Registro</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons row={row} table={table} variant="text" />
        </DialogActions>
      </>
    ),
    // Botones de acciones en cada fila para editar y eliminar
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Editar">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        {onDeletingRow && (
          <Tooltip title="Eliminar">
            <IconButton
              color="error"
              onClick={async () => await onDeletingRow(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    ),
    // Botón en la barra de herramientas para crear nuevo registro
    renderTopToolbarCustomActions: ({ table }) => (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {filters &&
          filters.length > 0 &&
          filters.map((filter, index) => {
            if (filter.type === "selectAutocomplete") {
              return (
                <SelectAutocomplete
                  key={index}
                  label={filter.label}
                  labelSeleccionado={false}
                  multiple={filter.multiple}
                  options={filter.options}
                  placeholder={filter.placeholder}
                  value={filter.value}
                  onChange={filter.onChange}
                />
              );
            }

            return null;
          })}
        {onCreatingRowSave && (
          <Button
            color="primary"
            variant="flat"
            onPress={() => table.setCreatingRow(true)}
          >
            Crear Nuevo Registro
          </Button>
        )}
      </div>
    ),
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    enableFullScreenToggle: false,
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 5 },
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    enableFacetedValues: true, // Habilitar valores facetados
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",

    ...rest,
  };

  if (filterDependencies) {
    tableOptions.onColumnFiltersChange = (updaterOrValue) => {
      const filtersArray =
        typeof updaterOrValue === "function"
          ? updaterOrValue(filtersState)
          : updaterOrValue;

      setFiltersState(filtersArray);

      const newFilteredData = data.filter((row) => {
        return filtersArray.every((filter) => {
          const columnValue = row[filter.id];

          if (Array.isArray(filter.value)) {
            return filter.value.some((val) =>
              columnValue.toString().toLowerCase().includes(val.toLowerCase()),
            );
          }

          return columnValue
            .toString()
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        });
      });

      setFilteredData(newFilteredData);

      filterDependencies.forEach((dep: any) => {
        dep.fetch(filtersArray);
      });
    };
  }
  const table = useMaterialReactTable(tableOptions);

  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  return (
    <ThemeProvider theme={tailwindTheme}>
      <MaterialReactTable table={table} />
    </ThemeProvider>
  );
};

export default CustomTable;
