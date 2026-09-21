"use client";

import React, { useCallback, useContext, useEffect, useRef } from "react";

import {
  SpreadsheetActionContext,
  SpreadsheetContext,
} from "../Context/SpreadsheetContext";
import styles from "../Styles/CellSelection.module.css";

const CellSelection = () => {
  const { selectionRef } = useContext(SpreadsheetActionContext)!;
  const { selection } = useContext(SpreadsheetContext)!;
  const selectionCellRef = useRef<HTMLDivElement>(null);
  // const firstCellRef = useRef<HTMLDivElement>(null);

  const updateCellSize = useCallback(() => {
    const { startRow, startColumn, endRow, endColumn } = selectionRef.current;

    // console.log("update Cell", selectionRef.current);

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minColumn = Math.min(startColumn, endColumn);
    const maxColumn = Math.max(startColumn, endColumn);

    const rowHeaderWidth = 40;
    const columnHeaderHeight = 35;
    const cellWidth = 150;
    const cellHeight = 35;

    const left = rowHeaderWidth + minColumn * cellWidth;
    const top = columnHeaderHeight + minRow * cellHeight;
    const width = (maxColumn - minColumn + 1) * cellWidth;
    const height = (maxRow - minRow + 1) * cellHeight;

    // const firstCellLeft = rowHeaderWidth + startColumn * cellWidth;
    // const firstCellTop = columnHeaderHeight + startRow * cellHeight;

    // const firstCellElement = firstCellRef.current;
    // if (!firstCellElement) return;
    // firstCellElement.style.left = `${firstCellLeft - left}px`;
    // firstCellElement.style.top = `${firstCellTop - top}px`;
    // firstCellElement.style.width = `${width}px`;
    // firstCellElement.style.height = `${height}px`;
    // firstCellElement.style.display = "block";

    const selectionElement = selectionCellRef.current;
    if (!selectionElement) return;
    selectionElement.style.left = `${left}px`;
    selectionElement.style.top = `${top}px`;
    selectionElement.style.width = `${width}px`;
    selectionElement.style.height = `${height}px`;
    selectionElement.style.display = "block";
  }, []);

  useEffect(() => {
    updateCellSize();
  }, [selection, updateCellSize]);

  return (
    <div
      ref={selectionCellRef}
      id="cellselection"
      className={styles.CellSelection}
      style={{
        position: "absolute",
        border: "2px solid green",
        background: "rgba(141, 204, 141, 0.17)",
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    />
  );
};

export default React.memo(CellSelection);
