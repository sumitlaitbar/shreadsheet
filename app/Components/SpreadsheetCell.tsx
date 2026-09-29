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
  // getCellData: (row: number, column: number) => Cell;
  cellValue: Cell;
}

const SpreadsheetCell = ({
  row,
  column,
  setSelectedCell,
  setEditingCell,
  cellValue,
}: SpreadsheetCellProps) => {
  const cell = cellValue;

  const {
    startSelection,
    updateSelection,
    stopSelection,
    selectionRef,
    setSelection,
  } = useContext(SpreadsheetActionContext)!;

  const hanldePointerDown = () => {
    startSelection(row, column);
    setSelection((selection) => selection + 1);
  };

  const hanldePointerMove = () => {
    if (!selectionRef.current.selecting) return;
    setSelection((selection) => selection + 1);

    document
      .querySelector(`.${styles.selectedCell}`)
      ?.classList.remove(styles.selectedCell);

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
        fontStyle: cell?.style?.italic ? "italic" : "normal",
        color: cell?.style?.color ?? "black",
        fontSize: cell?.style?.Fontsize ?? "14px",
        fontFamily: cell?.style?.Fontfamily ?? "Arial, Helvetica, sans-serif",
        textAlign: cell?.style?.align ?? "left",
        textDecorationLine: cell?.style?.Textunderline ? "underline" : "none",
        justifyContent:
          cell?.style?.align === "center"
            ? "center"
            : cell?.style?.align === "right"
              ? "flex-end"
              : "flex-start",
      }}
    >
      {cell?.value}
    </div>
  );
};

export default React.memo(SpreadsheetCell);
