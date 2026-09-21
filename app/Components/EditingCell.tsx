"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Cell,
  SpreadsheetActionContext,
  SpreadsheetContext,
} from "../Context/SpreadsheetContext";

interface EditingCellProps {
  cellData: Record<string, Cell>;
}

const EditingCell = ({ cellData }: EditingCellProps) => {
  const { editingCell, selectedCell } = useContext(SpreadsheetContext)!;
  const { updateCell, setCellValue } = useContext(SpreadsheetActionContext)!;

  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<DOMRect>();

  const key = editingCell ? `${editingCell.row}-${editingCell.column}` : "";

  useEffect(() => {
    if (!selectedCell) return;
    const cell = document.getElementById(
      `cell${selectedCell.row}-${selectedCell.column}`,
    );
    if (cell) {
      setTimeout(() => {
        const cellBoundary = cell.getBoundingClientRect();
        setPosition(cellBoundary);
      }, 10);
    }
  }, [selectedCell]);

  useEffect(() => {
    setTimeout(() => {
      const editingCell = document.getElementById("editingCell");
      if (editingCell && position) {
        editingCell.style.left = `${position.x}px`;
        editingCell.style.top = `${position.y}px`;
        editingCell.style.height = `${position.bottom - position.y}px`;
        editingCell.style.maxHeight = `${position.bottom - position.y}px`;
        editingCell.style.width = `${position.right - position.x}px`;
        editingCell.style.maxWidth = `${position.right - position.x}px`;
        editingCell.style.display = "flex";
        editingCell.focus();
      }
    }, 10);
  }, [editingCell, position]);

  const SaveEditingCell = () => {
    if (!editingCell || !inputRef.current) return;
    updateCell(editingCell.row, editingCell.column, inputRef.current.value);
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCellValue(e.target.value);

    // console.log("DOM  input Value", inputRef.current?.value);
  }

  return editingCell ? (
    <input
      id="editingCell"
      ref={inputRef}
      autoFocus
      defaultValue={cellData[key]?.value || ""}
      onChange={handleChange}
      onBlur={SaveEditingCell}
      style={{
        position: "fixed",
        boxSizing: "border-box",
        padding: "0 4px",
        outline: "none",
        border: "2px solid green",
        fontFamily: "sans-serif",
        fontSize: "14px",
        textOverflow: "clip",
        display: "flex",
        justifyContent: "flex-start",
        userSelect: "none",

        fontWeight: cellData[key]?.style?.bold ? "bold" : "normal",
        backgroundColor: cellData[key]?.style?.backgroundColor || "white",
      }}
    />
  ) : (
    ""
  );
};

export default React.memo(EditingCell);
