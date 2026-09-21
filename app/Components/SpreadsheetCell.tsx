"use client";

import React, { useContext } from "react";
import styles from "../Styles/SpreadsheetCell.module.css";
import {
  Cell,
  SelectedCell,
  SpreadsheetActionContext,
} from "../Context/SpreadsheetContext";

interface SpreadsheetCellProps {
  row: number;
  column: number;
  setSelectedCell: (Cell: SelectedCell | null) => void;
  setEditingCell: (Cell: SelectedCell | null) => void;
  getCellData: (row: number, column: number) => Cell;
  cellValue: Cell;
  // cellValues: string;
}

const SpreadsheetCell = ({
  row,
  column,
  setSelectedCell,
  setEditingCell,
  getCellData,
  cellValue,
}: SpreadsheetCellProps) => {
  const cell = getCellData(row, column);

  const {
    startSelection,
    updateSelection,
    stopSelection,
    selectionRef,
    setSelection,
  } = useContext(SpreadsheetActionContext)!;

  console.log("cellvalue", cell);

  const hanldePointerDown = () => {
    startSelection(row, column);
    setSelection((selection) => selection + 1);

    const firstCell = document.getElementById(`cell${row}-${column}`);
    firstCell?.classList.remove(styles.CellSelection);
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
      onPointerDown={hanldePointerDown}
      onPointerMove={hanldePointerMove}
      onPointerUp={hanldePointerUp}
      style={{
        fontWeight: cell?.style?.bold ? "bold" : "normal",
        backgroundColor: cell?.style?.backgroundColor || "white",
      }}
    >
      {cellValue.value}
    </div>
  );
};

export default React.memo(SpreadsheetCell);
