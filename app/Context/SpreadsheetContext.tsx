"use client";

import * as XLSX from "xlsx-js-style";
import React, {
  createContext,
  SetStateAction,
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

export const useCellData = (cellData: Record<string, Cell>) => {
  const getCellData = useCallback(
    (row: number, column: number) => {
      const key = createKey(row, column);

      return cellData[key] || EmptyCell;
    },
    [cellData],
  );

  return getCellData;
};

function createKey(row: number, column: number) {
  return `${row}-${column}`;
}

function getCellNumber(
  cellData: Record<string, Cell>,
  row: number,
  column: number,
) {
  const key = createKey(row, column);

  return Number(cellData[key]?.value || 0);
}

function getRangeValues(
  cellData: Record<string, Cell>,
  startRow: number,
  endRow: number,
  column: number,
) {
  const values: number[] = [];

  for (let row = startRow; row <= endRow; row++) {
    values.push(getCellNumber(cellData, row, column));
  }

  return values;
}

function sum(values: number[]) {
  let total = 0;

  for (const value of values) {
    total += value;
  }

  return total;
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return sum(values) / values.length;
}

function calculateFormula(formula: string, cellData: Record<string, Cell>) {
  if (formula.startsWith("=SUM(") && formula.endsWith(")")) {
    const range = formula.slice(5, -1);
    const [start, end] = range.split(":");

    if (!start || !end) {
      return 0;
    }

    const startColumn = start.charCodeAt(0) - "A".charCodeAt(0);
    const startRow = Number(start.slice(1)) - 1;
    const endColumn = end.charCodeAt(0) - "A".charCodeAt(0);
    const endRow = Number(end.slice(1)) - 1;

    if (
      Number.isNaN(startRow) ||
      Number.isNaN(endRow) ||
      Number.isNaN(startColumn) ||
      Number.isNaN(endColumn)
    ) {
      return 0;
    }

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

    return sum(values);
  }

  if (formula.startsWith("=AVG(") && formula.endsWith(")")) {
    const range = formula.slice(5, -1);
    const [start, end] = range.split(":");

    if (!start || !end) {
      return 0;
    }

    const startColumn = start.charCodeAt(0) - "A".charCodeAt(0);
    const startRow = Number(start.slice(1)) - 1;
    const endColumn = end.charCodeAt(0) - "A".charCodeAt(0);
    const endRow = Number(end.slice(1)) - 1;

    if (
      Number.isNaN(startRow) ||
      Number.isNaN(endRow) ||
      Number.isNaN(startColumn) ||
      Number.isNaN(endColumn)
    ) {
      return 0;
    }

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

    return average(values);
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
}

export const SpreadsheetContext = createContext<SpreadsheetContextType | null>(
  null,
);

export const SpreadsheetActionContext =
  createContext<SpreadsheetActionContextType | null>(null);

interface SpreadsheetContextProviderProps {
  children: React.ReactNode;
}

const EmptyCell: Cell = {
  value: "",
};

export const SpreadsheetContextProvider = ({
  children,
}: SpreadsheetContextProviderProps) => {
  const [rows, setRows] = useState(15);
  const [columns, setColumns] = useState(10);
  const [selectedCell, setSelected] = useState<SelectedCell | null>(null);
  const [editingCell, setEditing] = useState<SelectedCell | null>(null);
  const [cellData, setCellData] = useState<Record<string, Cell>>({});
  const [copiedCells, setCopiedCells] = useState<Cell[][]>([]);
  const cellValueRef = useRef("");
  const [selection, setSelection] = useState(0);

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

    setSelection((prev) => prev + 1);
  }, []);

  const updateSelection = useCallback((row: number, column: number) => {
    if (!selectionRef.current.selecting) {
      return;
    }

    selectionRef.current.endRow = row;
    selectionRef.current.endColumn = column;

    setSelection((prev) => prev + 1);
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
        let updatedData;
        if (value.startsWith("=")) {
          const calculatedValue = calculateFormula(value, prev);

          const updatedCell = {
            ...prev[key],
            value: String(calculatedValue),
            formula: value,
          };

          updatedData = {
            ...prev,
            [key]: updatedCell,
          };
        } else {
          const updatedCell = {
            ...prev[key],
            value,
            formula: undefined,
          };

          updatedData = {
            ...prev,
            [key]: updatedCell,
          };
        }

        Object.entries(updatedData).forEach(([cellKey, cell]) => {
          if (cell.formula) {
            const calculatedValue = calculateFormula(cell.formula, updatedData);

            if (cell.value !== String(calculatedValue)) {
              updatedData[cellKey] = {
                ...cell,
                value: String(calculatedValue),
              };
            }
          }
        });

        return updatedData;
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
      const updatedData = {
        ...prev,
      };

      for (let row = minRow; row <= maxRow; row++) {
        for (let column = minColumn; column <= maxColumn; column++) {
          const key = createKey(row, column);

          const oldCell = updatedData[key];

          updatedData[key] = {
            ...oldCell,
            value: oldCell?.value || "",
            style: {
              ...oldCell?.style,
              bold: !oldCell?.style?.bold,
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
      const updatedData = {
        ...prev,
      };

      for (let row = minRow; row <= maxRow; row++) {
        for (let column = minColumn; column <= maxColumn; column++) {
          const key = createKey(row, column);

          const oldCell = updatedData[key];

          updatedData[key] = {
            ...oldCell,
            value: oldCell?.value || "",
            style: {
              ...oldCell?.style,
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

    for (let row = minRow; row <= maxRow; row++) {
      const rowData: Cell[] = [];

      for (let column = minColumn; column <= maxColumn; column++) {
        const key = createKey(row, column);

        const cell = cellData[key] || EmptyCell;

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

    setCopiedCells(copied);

    console.log("Copied range:", copied);
  }, [cellData]);

  const handlePaste = useCallback(() => {
    if (copiedCells.length === 0) {
      return;
    }

    const { startRow, startColumn } = selectionRef.current;

    setCellData((prev) => {
      const updatedData = {
        ...prev,
      };

      copiedCells.forEach((rowData, rowIndex) => {
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
  }, [copiedCells]);

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

    const excelData = createExcelData(cellData);

    const blob = new Blob([excelData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${filename}.xlsx`;
    link.click();

    URL.revokeObjectURL(url);
  }, [cellData, createExcelData]);

  const values = useMemo(
    () => ({
      rows,
      columns,
      cellData,
      selectedCell,
      editingCell,
      selection,
    }),
    [rows, columns, cellData, selectedCell, editingCell, selection],
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
