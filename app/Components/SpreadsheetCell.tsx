"use client";

import React, { useContext } from "react";
import styles from "../Styles/SpreadsheetCell.module.css";
import {
  Cell,
  SelectedCell,
  SpreadsheetActionContext,
  SpreadsheetContext,
} from "../Context/SpreadsheetContext";

interface SpreadsheetCellProps {
  row: number;
  column: number;
  cell?: Cell;
  setSelectedCell: (Cell: SelectedCell | null) => void;
  setEditingCell: (Cell: SelectedCell | null) => void;
  getCellData: (row: number, column: number) => Cell;
}

const SpreadsheetCell = ({
  row,
  column,
  // cell,
  setSelectedCell,
  setEditingCell,
  getCellData,
}: SpreadsheetCellProps) => {
  const cell = getCellData(row, column);

  console.log("render cell", row, column);
  console.log("cell", cell?.value);

  const {
    startSelection,
    updateSelection,
    stopSelection,
    selectionRef,
    setSelection,
  } = useContext(SpreadsheetActionContext)!;

  const { startRow, startColumn } = selectionRef.current;
  const { selection } = useContext(SpreadsheetContext)!;

  const hanldePointerDown = () => {
    console.log("row-columns", row, column);

    startSelection(row, column);
    setSelection((selection) => selection + 1);
  };

  const hanldePointerMove = () => {
    if (!selectionRef.current.selecting) return;
    setSelection((selection) => selection + 1);

    document
      .querySelector(`.${styles.selectedCell}`)
      ?.classList.remove(styles.selectedCell);

    setEditingCell(null);
    updateSelection(row, column);
  };

  const hanldePointerUp = () => {
    stopSelection();
  };

  return (
    <div
      className={styles.SpreadsheetCell}
      id={`cell${row}-${column}`}
      // key={`cell${row}-${column}`}
      onDoubleClick={() => {
        setSelectedCell({ row, column });
        setEditingCell({ row, column });
      }}
      onClick={(e) => {
        document
          .querySelector(`.${styles.selectedCell}`)
          ?.classList.remove(styles.selectedCell);

        e.currentTarget.classList.add(styles.selectedCell);

        setSelectedCell({ row, column });
        setEditingCell(null);
      }}
      style={{
        fontWeight: cell?.style?.bold ? "bold" : "normal",
        backgroundColor: cell?.style?.backgroundColor || "white",
      }}
      onPointerDown={hanldePointerDown}
      onPointerMove={hanldePointerMove}
      onPointerUp={hanldePointerUp}
    >
      {cell?.value}
    </div>
  );
};

export default React.memo(SpreadsheetCell);
