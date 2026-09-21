"use client";

import React, { useState } from "react";
import SpreadsheetCell from "./SpreadsheetCell";
import { Cell, SelectedCell } from "../Context/SpreadsheetContext";
import { CellSibling } from "./CellSibling";

interface CellControllerProps {
  row: number;
  column: number;
  setEditingCell: (cell: SelectedCell | null) => void;
  setSelectedCell: (cell: SelectedCell | null) => void;
  getCellData: (row: number, column: number) => Cell;
}

const CellController = ({
  row,
  column,
  setEditingCell,
  setSelectedCell,
  getCellData,
}: CellControllerProps) => {
  // const [cellValues, setCellValues] = useState("");

  const [cellValue, setCellValue] = useState<Cell>(getCellData(row, column));

  return (
    <>
      <SpreadsheetCell
        row={row}
        column={column}
        setEditingCell={setEditingCell}
        setSelectedCell={setSelectedCell}
        getCellData={getCellData}
        cellValue={cellValue}
        // cellValues={cellValues}
      />

      <CellSibling
        row={row}
        column={column}
        // setCell={setCell}
        setCellValue={setCellValue}
      />
    </>
  );
};

export default React.memo(CellController);
