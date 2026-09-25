import React, { useContext, useEffect } from "react";

import {
  Cell,
  createKey,
  SpreadsheetContext,
} from "../Context/SpreadsheetContext";

interface CellSiblingProps {
  row: number;
  column: number;
  setCellValue: React.Dispatch<React.SetStateAction<Cell>>;
}
const EmptyCell: Cell = { value: "" };

export const CellSibling = React.memo(
  ({ row, column, setCellValue }: CellSiblingProps) => {
    const { cellData } = useContext(SpreadsheetContext)!;
    const cell = cellData[createKey(row, column)] || EmptyCell;

    useEffect(() => {
      setCellValue(cell);
    }, [cell, setCellValue]);

    return null;
  },
);

CellSibling.displayName = "CellSibling";
