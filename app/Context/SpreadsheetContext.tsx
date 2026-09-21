"use client";

import * as XLSX from "xlsx-js-style";
import React, {
  createContext,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCallback } from "react";
export interface CellStyle {
  bold?: boolean;
  backgroundColor?: string;
}

export interface Cell {
  value: string;
  formula?: string;
  style?: CellStyle;
}

export interface SelectedCell {
  row: number;
  column: number;
}

export interface SelectionRef {
  selecting: boolean;
  startRow: number;
  startColumn: number;
  endRow: number;
  endColumn: number;
}

export function createKey(row: number, column: number) {
  return `${row}-${column}`;
}

// export const useCellData = (cellData: Record<string, Cell>) => {
//   const getCellData = useCallback(
//     (row: number, column: number) =>
//       cellData[createKey(row, column)] || EmptyCell,
//     [cellData],
//   );
//   return getCellData;
// };

function getRangeValues(
  cellData: Record<string, Cell>,
  startRow: number,
  endRow: number,
  startColumn: number,
  endColumn: number,
) {
  const values: number[] = [];

  for (let row = startRow; row <= endRow; row++) {
    for (let column = startColumn; column <= endColumn; column++) {
      const key = createKey(row, column);
      const value = Number(cellData[key]?.value);

      if (!Number.isNaN(value)) {
        values.push(value);
      }
    }
  }

  return values;
}

function calculateFormula(formula: string, cellData: Record<string, Cell>) {
  if (!formula.startsWith("=")) return 0;

  const type = formula.startsWith("=SUM(")
    ? "SUM"
    : formula.startsWith("=AVG(")
      ? "AVG"
      : "";

  if (!type) return 0;

  const range = formula.slice(5, -1);

  const [start, end] = range.split(":");

  if (!start || !end) return 0;

  const startColumn = start.charCodeAt(0) - "A".charCodeAt(0);

  const endColumn = end.charCodeAt(0) - "A".charCodeAt(0);

  const startRow = Number(start.slice(1)) - 1;
  const endRow = Number(end.slice(1)) - 1;

  const values = getRangeValues(
    cellData,
    Math.min(startRow, endRow),
    Math.max(startRow, endRow),
    Math.min(startColumn, endColumn),
    Math.max(startColumn, endColumn),
  );

  if (type === "SUM") {
    return values.reduce((total, value) => total + value, 0);
  }

  if (type === "AVG") {
    return values.length
      ? values.reduce((total, value) => total + value, 0) / values.length
      : 0;
  }

  return 0;
}

interface SpreadsheetContextType {
  rows: number;
  columns: number;
  selectedCell: SelectedCell | null;
  editingCell: SelectedCell | null;
  cellData: Record<string, Cell>;
  selection: number;
}

interface SpreadsheetActionContextType {
  setSelectedCell: (cell: SelectedCell | null) => void;
  setEditingCell: (cell: SelectedCell | null) => void;
  updateCell: (row: number, column: number, value: string) => void;
  addRows: () => void;
  addColumns: () => void;

  handleTextbold: () => void;
  handleBgcolor: (color: string) => void;
  handleCopy: () => void;
  handlePaste: () => void;

  getValue: () => string;

  handleSave: () => void;

  setCellValue: (value: string) => void;

  selectionRef: React.RefObject<SelectionRef>;

  startSelection: (row: number, column: number) => void;
  updateSelection: (row: number, column: number) => void;
  stopSelection: () => void;

  setSelection: React.Dispatch<SetStateAction<number>>;

  getCellData: (row: number, column: number) => Cell;
}

export const SpreadsheetContext = createContext<SpreadsheetContextType | null>(
  null,
);

export const SpreadsheetActionContext =
  createContext<SpreadsheetActionContextType | null>(null);

interface SpreadsheetContextProviderProps {
  children: React.ReactNode;
}

const EmptyCell: Cell = { value: "" };

export const SpreadsheetContextProvider = ({
  children,
}: SpreadsheetContextProviderProps) => {
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(10);
  const [selectedCell, setSelected] = useState<SelectedCell | null>(null);
  const [editingCell, setEditing] = useState<SelectedCell | null>(null);

  const [cellData, setCellData] = useState<Record<string, Cell>>({});
  const [copiedCells, setCopiedCells] = useState<Cell[][]>([]);

  const cellDataRef = useRef<Record<string, Cell>>({});
  const copiedCellsRef = useRef<Cell[][]>([]);

  const cellValueRef = useRef("");
  const [selection, setSelection] = useState(0);

  useEffect(() => {
    cellDataRef.current = cellData;
  }, [cellData]);

  const getCellData = useCallback((row: number, column: number) => {
    return cellDataRef.current[createKey(row, column)] || EmptyCell;
  }, []);

  const selectionRef = useRef<SelectionRef>({
    selecting: false,
    startRow: 0,
    startColumn: 0,
    endRow: 0,
    endColumn: 0,
  });

  const startSelection = useCallback((row: number, column: number) => {
    selectionRef.current.selecting = true;
    selectionRef.current.startRow = row;
    selectionRef.current.startColumn = column;
    selectionRef.current.endRow = row;
    selectionRef.current.endColumn = column;
  }, []);

  const updateSelection = useCallback((row: number, column: number) => {
    if (!selectionRef.current.selecting) {
      return;
    }

    selectionRef.current.endRow = row;
    selectionRef.current.endColumn = column;
  }, []);

  const stopSelection = useCallback(() => {
    selectionRef.current.selecting = false;
  }, []);

  const setCellValue = useCallback((value: string) => {
    cellValueRef.current = value;
  }, []);

  const getValue = useCallback(() => {
    return cellValueRef.current;
  }, []);

  const addRows = useCallback(() => {
    setRows((prev) => prev + 1);
  }, []);

  const addColumns = useCallback(() => {
    setColumns((prev) => prev + 1);
  }, []);

  const setEditingCell = useCallback((cell: SelectedCell | null) => {
    if (cell) {
      setEditing((prev) => {
        if (!prev || prev.row !== cell.row || prev.column !== cell.column) {
          return cell;
        }

        return prev;
      });
    } else {
      setEditing(null);
    }
  }, []);

  const setSelectedCell = useCallback((cell: SelectedCell | null) => {
    setSelected((prev) => {
      if (!prev || prev.row !== cell?.row || prev.column !== cell?.column) {
        return cell;
      }

      return prev;
    });
  }, []);

  const updateCell = useCallback(
    (row: number, column: number, value: string) => {
      const key = createKey(row, column);

      setCellData((prev) => {
        if (value.startsWith("=")) {
          const calculatedValue = calculateFormula(value, prev);

          const updatedCell = {
            ...prev[key],
            value: String(calculatedValue),
            formula: value,
          };

          prev[key] = updatedCell;
        } else {
          const updatedCell = {
            ...prev[key],
            value,
            formula: undefined,
          };

          prev[key] = updatedCell;
        }

        Object.entries(prev).forEach(([cellKey, cell]) => {
          if (!cell.formula) return;

          const calculatedValue = calculateFormula(cell.formula, prev);

          const newValue = String(calculatedValue);

          if (cell.value !== newValue) {
            prev[cellKey] = {
              ...cell,
              value: newValue,
            };
          }
        });

        return prev;
      });
    },
    [],
  );

  const handleTextbold = useCallback(() => {
    const { startRow, startColumn, endRow, endColumn } = selectionRef.current;
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minColumn = Math.min(startColumn, endColumn);
    const maxColumn = Math.max(startColumn, endColumn);

    setCellData((prev) => {
      const updatedData = { ...prev };
      for (let row = minRow; row <= maxRow; row++) {
        for (let column = minColumn; column <= maxColumn; column++) {
          const key = createKey(row, column);
          updatedData[key] = {
            ...prev[key],
            value: prev[key]?.value || "",
            style: {
              ...prev[key]?.style,
              bold: !prev[key]?.style?.bold,
            },
          };
        }
      }
      return updatedData;
    });
  }, []);
  const handleBgcolor = useCallback((color: string) => {
    const { startRow, startColumn, endRow, endColumn } = selectionRef.current;
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minColumn = Math.min(startColumn, endColumn);
    const maxColumn = Math.max(startColumn, endColumn);

    setCellData((prev) => {
      const updatedData = { ...prev };
      for (let row = minRow; row <= maxRow; row++) {
        for (let column = minColumn; column <= maxColumn; column++) {
          const key = createKey(row, column);

          updatedData[key] = {
            ...prev[key],
            value: prev[key]?.value || "",
            style: {
              ...prev[key]?.style,
              backgroundColor: color,
            },
          };
        }
      }
      return updatedData;
    });
  }, []);

  const handleCopy = useCallback(() => {
    const { startRow, startColumn, endRow, endColumn } = selectionRef.current;

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minColumn = Math.min(startColumn, endColumn);
    const maxColumn = Math.max(startColumn, endColumn);

    const copied: Cell[][] = [];
    const currentCellData = cellDataRef.current;

    for (let row = minRow; row <= maxRow; row++) {
      const rowData: Cell[] = [];
      for (let column = minColumn; column <= maxColumn; column++) {
        const key = createKey(row, column);
        const cell = currentCellData[key] || EmptyCell;
        rowData.push({
          ...cell,
          style: cell.style
            ? {
                ...cell.style,
              }
            : undefined,
        });
      }

      copied.push(rowData);
    }
    copiedCellsRef.current = copied;
    setCopiedCells(copied);
  }, []);

  const handlePaste = useCallback(() => {
    const currentCopiedCells = copiedCellsRef.current;
    if (currentCopiedCells.length === 0) {
      return;
    }

    const { startRow, startColumn } = selectionRef.current;

    setCellData((prev) => {
      const updatedData = { ...prev };

      currentCopiedCells.forEach((rowData, rowIndex) => {
        rowData.forEach((cell, columnIndex) => {
          const targetRow = startRow + rowIndex;
          const targetColumn = startColumn + columnIndex;
          const key = createKey(targetRow, targetColumn);

          updatedData[key] = {
            ...cell,
            style: cell.style
              ? {
                  ...cell.style,
                }
              : undefined,
          };
        });
      });

      return updatedData;
    });
  }, []);

  const createExcelData = useCallback((data: Record<string, Cell>) => {
    const excelData: string[][] = [];

    Object.entries(data).forEach(([key, cell]) => {
      const [row, column] = key.split("-").map(Number);

      if (!excelData[row]) {
        excelData[row] = [];
      }

      excelData[row][column] = cell.value;
    });

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    Object.entries(data).forEach(([key, cell]) => {
      const [row, column] = key.split("-").map(Number);

      const cellAddress = XLSX.utils.encode_cell({
        r: row,
        c: column,
      });

      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = {
          t: "s",
          v: cell.value,
        };
      }

      worksheet[cellAddress].s = {};

      if (cell.style?.bold) {
        worksheet[cellAddress].s.font = {
          bold: true,
        };
      }

      if (cell.style?.backgroundColor) {
        worksheet[cellAddress].s.fill = {
          patternType: "solid",
          fgColor: {
            rgb: cell.style.backgroundColor.replace("#", "").toUpperCase(),
          },
        };
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    return XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  }, []);

  const handleSave = useCallback(() => {
    const filename = "sheet";

    const currentCellData = cellDataRef.current;

    const excelData = createExcelData(currentCellData);

    const blob = new Blob([excelData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${filename}.xlsx`;
    link.click();

    URL.revokeObjectURL(url);
  }, [createExcelData]);

  const values = useMemo(
    () => ({
      rows,
      columns,
      selectedCell,
      editingCell,
      selection,
      cellData,
    }),
    [rows, columns, selectedCell, editingCell, selection, cellData],
  );

  const action = useMemo(
    () => ({
      setSelectedCell,
      setEditingCell,
      updateCell,
      addRows,
      addColumns,
      handleTextbold,
      handleBgcolor,
      handleCopy,
      handlePaste,
      getValue,
      setCellValue,
      handleSave,
      selectionRef,
      startSelection,
      updateSelection,
      stopSelection,
      setSelection,
      getCellData,
    }),
    [
      setSelectedCell,
      setEditingCell,
      updateCell,
      addRows,
      addColumns,
      handleTextbold,
      handleBgcolor,
      handleCopy,
      handlePaste,
      getValue,
      setCellValue,
      handleSave,
      selectionRef,
      startSelection,
      updateSelection,
      stopSelection,
      setSelection,
      getCellData,
    ],
  );

  return (
    <SpreadsheetActionContext.Provider value={action}>
      <SpreadsheetContext.Provider value={values}>
        {children}
      </SpreadsheetContext.Provider>
    </SpreadsheetActionContext.Provider>
  );
};
