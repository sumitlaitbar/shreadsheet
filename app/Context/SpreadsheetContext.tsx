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

export type TextAlign = "left" | "center" | "right";

export interface CellStyle {
  bold?: boolean;
  backgroundColor?: string;
  italic?: boolean;
  color?: string;
  Fontsize?: number;
  Fontfamily?: string;
  align?: TextAlign;
  Textunderline?: boolean;
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
  // cellDataRef: Record<string, Cell>;
  selection: number;
  clearDataPopUpp: boolean;
  isSavedPopup: boolean;
  isBack: boolean;
}

export interface SpreadsheetActionContextType {
  setSelectedCell: (cell: SelectedCell | null) => void;
  setEditingCell: (cell: SelectedCell | null) => void;
  updateCell: (row: number, column: number, value: string) => void;
  addRows: () => void;
  addColumns: () => void;

  removeRows: () => void;
  removeColumns: () => void;

  handleTextbold: () => void;
  handleItalic: () => void;
  handleBgcolor: (color: string) => void;
  handleTextColor: (color: string) => void;
  handleCleardata: () => void;
  handleFontsize: (Fontsize: number) => void;
  handleFontfamily: (Fontfamily: string) => void;
  handleTextalign: (align: TextAlign) => void;
  handleTextunderline: () => void;
  handleCopy: () => void;
  handlePaste: () => void;

  getValue: () => string;

  handleSave: () => void;
  handleLoad: (file: File) => Promise<void>;

  setCellValue: (value: string) => void;

  selectionRef: React.RefObject<SelectionRef>;

  startSelection: (row: number, column: number) => void;
  updateSelection: (row: number, column: number) => void;
  stopSelection: () => void;

  setSelection: React.Dispatch<SetStateAction<number>>;

  getCellData: (row: number, column: number) => Cell;
  setRows: React.Dispatch<SetStateAction<number>>;
  setColumns: React.Dispatch<SetStateAction<number>>;
  setClearDataPopUp: React.Dispatch<SetStateAction<boolean>>;
  setIsSavedPopup: React.Dispatch<SetStateAction<boolean>>;
  setIsBack: React.Dispatch<SetStateAction<boolean>>;
  handleConfirmationDelete: () => void;
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
  const [isStorageloaded, setIsStorageloaded] = useState(false);
  const [clearDataPopUpp, setClearDataPopUp] = useState(false);
  const [isSavedPopup, setIsSavedPopup] = useState(false);
  const [isBack, setIsBack] = useState(false);

  useEffect(() => {
    cellDataRef.current = cellData;
  }, [cellData]);

  // this effect load the data means locol storage to react
  useEffect(() => {
    setTimeout(() => {
      try {
        const savedata = localStorage.getItem("spreadsheet-data");
        if (savedata) {
          setCellData(JSON.parse(savedata));
        }
      } catch (error) {
        console.log("SpreadsheetData is not loaded :", error);
      } finally {
        setIsStorageloaded(true);
      }
    }, 10);
  }, []);

  // this effect saves the key and value in locol storege
  useEffect(() => {
    setTimeout(() => {
      try {
        if (!isStorageloaded) return;
        localStorage.setItem("spreadsheet-data", JSON.stringify(cellData));
      } catch (error) {
        console.log("SpreadsheetData is not saved :", error);
      }
    }, 10);
  }, [cellData, isStorageloaded]);

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

  useEffect(() => {
    if (!editingCell) return;
    const key = createKey(editingCell?.row, editingCell?.column);
    cellValueRef.current = cellDataRef.current[key]?.value || "";
  }, [editingCell]);

  const setCellValue = useCallback((value: string) => {
    cellValueRef.current = value;
  }, []);

  const getValue = useCallback(() => {
    return cellValueRef.current;
  }, []);

  const addRows = useCallback(() => {
    setRows((prev) => prev + 1);
  }, []);

  const removeRows = useCallback(() => {
    setRows((prev) => prev - 1);
  }, []);

  const addColumns = useCallback(() => {
    setColumns((prev) => prev + 1);
  }, []);
  const removeColumns = useCallback(() => {
    setColumns((prev) => prev - 1);
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

  // const updateCell = useCallback(
  //   (row: number, column: number, value: string) => {
  //     const key = createKey(row, column);

  //     setCellData((prev) => {
  //       if (value.startsWith("=")) {
  //         const calculatedValue = calculateFormula(value, prev);

  //         const updatedCell = {
  //           ...prev[key],
  //           value: String(calculatedValue),
  //           formula: value,
  //         };

  //         prev[key] = updatedCell;
  //       } else {
  //         const updatedCell = {
  //           ...prev[key],
  //           value,
  //           formula: undefined,
  //         };

  //         prev[key] = updatedCell;
  //       }

  //       Object.entries(prev).forEach(([cellKey, cell]) => {
  //         if (!cell.formula) return;

  //         const calculatedValue = calculateFormula(cell.formula, prev);

  //         const newValue = String(calculatedValue);

  //         if (cell.value !== newValue) {
  //           prev[cellKey] = {
  //             ...cell,
  //             value: newValue,
  //           };
  //         }
  //       });

  //       return prev;
  //     });
  //   },
  //   [],
  // );

  const updateCell = useCallback(
    (row: number, column: number, value: string) => {
      const key = createKey(row, column);

      setCellData((prev) => {
        const updatedData = { ...prev };

        if (value.startsWith("=")) {
          const calculatedValue = calculateFormula(value, prev);

          updatedData[key] = {
            ...prev[key],
            value: String(calculatedValue),
            formula: value,
          };
        } else {
          updatedData[key] = {
            ...prev[key],
            value,
            formula: undefined,
          };
        }
        Object.entries(updatedData).forEach(([cellKey, cell]) => {
          if (!cell.formula) return;

          const calculatedValue = calculateFormula(cell.formula, updatedData);

          const newValue = String(calculatedValue);

          if (cell.value !== newValue) {
            updatedData[cellKey] = {
              ...cell,
              value: newValue,
            };
          }
        });

        return updatedData;
      });

      setIsSavedPopup(true);
      console.log("update cell popup", isSavedPopup);
    },
    [],
  );

  const handleTextunderline = useCallback(() => {
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
              Textunderline: !prev[key]?.style?.Textunderline,
            },
          };
        }
      }
      return updatedData;
    });
  }, []);

  const handleTextalign = useCallback((align: TextAlign) => {
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
              align,
            },
          };
        }
      }
      return updatedData;
    });
  }, []);

  const handleFontfamily = useCallback((Fontfamily: string) => {
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
              Fontfamily,
            },
          };
        }
      }
      return updatedData;
    });
  }, []);

  const handleFontsize = useCallback((Fontsize: number) => {
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
              Fontsize,
            },
          };
        }
      }
      return updatedData;
    });
  }, []);

  const handleTextColor = useCallback((color: string) => {
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
              color: color,
            },
          };
        }
      }
      return updatedData;
    });
  }, []);
  const handleItalic = useCallback(() => {
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
              italic: !prev[key]?.style?.italic,
            },
          };
        }
      }
      return updatedData;
    });
  }, []);
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

      worksheet[cellAddress].s = {
        font: {},
      };

      if (cell.style?.bold) {
        worksheet[cellAddress].s.font.bold = true;
      }
      if (cell?.style?.italic) {
        worksheet[cellAddress].s.font.italic = true;
      }

      if (cell.style?.color) {
        worksheet[cellAddress].s.font.color = {
          rgb: cell.style.color.replace("#", "").toUpperCase(),
        };
      }
      if (cell?.style?.Fontsize) {
        worksheet[cellAddress].s.font.sz = cell?.style?.Fontsize;
      }
      if (cell?.style?.Fontfamily) {
        worksheet[cellAddress].s.font.name = cell?.style?.Fontfamily;
      }
      if (cell?.style?.Textunderline) {
        worksheet[cellAddress].s.font.underline = true;
      }
      if (cell?.style?.align) {
        worksheet[cellAddress].s.alignment = {
          horizontal: cell?.style?.align,
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

    const styleData = Object.entries(data).map(([key, cell]) => [
      key,
      JSON.stringify(cell.style ?? null),
    ]);

    const styleWorksheet = XLSX.utils.aoa_to_sheet([
      ["key", "style"],
      ...styleData,
    ]);

    XLSX.utils.book_append_sheet(workbook, styleWorksheet, "_Styles");

    return XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  }, []);

  const handleSave = useCallback(() => {
    try {
      setTimeout(() => {
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
      }, 10);

      setIsSavedPopup(false);
      setIsBack(false);
    } catch (error) {
      alert(error);
    }
  }, [createExcelData]);

  const handleLoad = useCallback(async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
        cellStyles: true,
      });

      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        return;
      }

      const worksheet = workbook.Sheets[sheetName];

      const styleWorksheet = workbook.Sheets["_Styles"];

      const styleMap = new Map<string, CellStyle>();

      if (styleWorksheet) {
        const styleRows = XLSX.utils.sheet_to_json(styleWorksheet, {
          header: 1,
          defval: "",
        }) as unknown[][];

        styleRows.slice(1).forEach((row) => {
          const key = String(row[0] ?? "");
          const styleText = String(row[1] ?? "");

          if (!key || !styleText || styleText === "null") {
            return;
          }

          try {
            const style = JSON.parse(styleText) as CellStyle;
            styleMap.set(key, style);
          } catch (error) {
            console.log("Style parse error:", key, error);
          }
        });
      }

      const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      }) as unknown[][];

      const loadedData: Record<string, Cell> = {};

      rows.forEach((row, rowIndex) => {
        row.forEach((value, columnIndex) => {
          const key = createKey(rowIndex, columnIndex);
          const style = styleMap.get(key);

          loadedData[key] = {
            value: String(value ?? ""),
            ...(style ? { style } : {}),
          };
        });
      });

      setCellData(loadedData);
      setRows(Math.max(10, rows.length));

      const maxColumns = rows.reduce(
        (max, row) => Math.max(max, row.length),
        0,
      );
      setColumns(Math.max(10, maxColumns));

      // alert(`${file.name} loaded Successfully....`);
      console.log("File loaded Successfully....");
    } catch (error) {
      console.log(
        "Failed to load file.Please select valid Excel file. ",
        error,
      );
      alert("Failed to load file");
    }
  }, []);
  const handleCleardata = useCallback(() => {
    setClearDataPopUp(true);
    setIsBack(false);
  }, []);
  const handleConfirmationDelete = useCallback(() => {
    setCellData({});
    localStorage.removeItem("spreadsheet-data");
    setClearDataPopUp(false);
  }, []);

  const values = useMemo(
    () => ({
      rows,
      columns,
      selectedCell,
      editingCell,
      selection,
      cellData,
      clearDataPopUpp,
      isSavedPopup,
      isBack,
    }),
    [
      rows,
      columns,
      selectedCell,
      editingCell,
      selection,
      cellData,
      clearDataPopUpp,
      isSavedPopup,
      isBack,
    ],
  );

  const action = useMemo(
    () => ({
      setSelectedCell,
      setEditingCell,
      setClearDataPopUp,
      updateCell,
      addRows,
      addColumns,
      handleTextbold,
      handleItalic,
      handleBgcolor,
      handleTextColor,

      handleFontsize,
      handleFontfamily,
      handleTextalign,
      handleTextunderline,
      handleCopy,
      handlePaste,
      getValue,
      setCellValue,
      handleSave,
      handleLoad,
      selectionRef,
      startSelection,
      updateSelection,
      stopSelection,
      setSelection,
      getCellData,
      setRows,
      setColumns,
      removeRows,
      removeColumns,
      handleCleardata,
      handleConfirmationDelete,
      setIsSavedPopup,
      setIsBack,
    }),
    [
      setSelectedCell,
      setEditingCell,
      setClearDataPopUp,
      updateCell,
      addRows,
      addColumns,
      handleTextbold,
      handleItalic,
      handleBgcolor,
      handleTextalign,
      handleTextunderline,
      handleTextColor,
      handleFontsize,
      handleFontfamily,
      handleCopy,
      handlePaste,
      getValue,
      setCellValue,
      handleSave,
      handleLoad,
      selectionRef,
      startSelection,
      updateSelection,
      stopSelection,
      setSelection,
      getCellData,

      setRows,
      setColumns,

      removeRows,
      removeColumns,
      handleCleardata,
      handleConfirmationDelete,
      setIsSavedPopup,
      setIsBack,
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
