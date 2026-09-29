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
  const { updateCell, setCellValue, setEditingCell } = useContext(
    SpreadsheetActionContext,
  )!;

  const {
    startSelection,
    updateSelection,
    stopSelection,
    selectionRef,
    setSelection,
  } = useContext(SpreadsheetActionContext)!;

  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<DOMRect>();

  const key = editingCell ? `${editingCell.row}-${editingCell.column}` : "";

  useEffect(() => {
    if (!selectedCell) return;
    const cell = document.getElementById(
      `cell${selectedCell.row}-${selectedCell.column}`,
    );
    if (cell) {
      const timer = setTimeout(() => {
        const cellBoundary = cell.getBoundingClientRect();
        setPosition(cellBoundary);
      }, 10);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [editingCell, selectedCell]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     const editingCell = document.getElementById("editingCell");
  //     if (editingCell && position) {
  //       editingCell.style.left = `${position.x}px`;
  //       editingCell.style.top = `${position.y}px`;
  //       editingCell.style.height = `${position.bottom - position.y}px`;
  //       editingCell.style.maxHeight = `${position.bottom - position.y}px`;
  //       editingCell.style.width = `${position.right - position.x}px`;
  //       editingCell.style.maxWidth = `${position.right - position.x}px`;
  //       editingCell.style.display = "flex";
  //       editingCell.focus();
  //     }
  //   }, 10);
  // }, [editingCell, position]);

  useEffect(() => {
    if (!editingCell || !position) return;
    const timer = setTimeout(() => {
      const input = inputRef.current;
      if (!input) return;
      input.style.left = `${position.left}px`;
      input.style.top = `${position.top}px`;
      input.style.height = `${position.height}px`;
      input.style.maxHeight = `${position.height}px`;
      input.style.width = `${position.width}px`;
      input.style.maxWidth = `${position.width}px`;
      input.style.display = "flex";
      input.focus();
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [editingCell, position]);

  useEffect(() => {
    if (!editingCell) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [editingCell]);

  const isSavingRef = useRef(false);

  const SaveEditingCell = () => {
    if (isSavingRef.current) return;
    if (!editingCell || !inputRef.current) return;
    isSavingRef.current = true;
    updateCell(
      editingCell.row,
      editingCell.column,
      inputRef.current.value ?? "",
    );
  };

  useEffect(() => {
    if (editingCell) {
      isSavingRef.current = false;
    }
  }, [editingCell]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCellValue(e.target.value);
  }
  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!editingCell) return;

    if (e.key === "Enter") {
      e.preventDefault();
      SaveEditingCell();
      setEditingCell(null);
    }
  };

  const hanldePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
    if (!editingCell) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startSelection(editingCell.row, editingCell.column);
    setSelection((selection) => selection + 1);
  };

  const hanldePointerMove = (e: React.PointerEvent<HTMLInputElement>) => {
    if (!selectionRef.current.selecting) return;

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) return;
    const cell = element?.closest("[id^='cell']");
    if (!cell) return;
    const match = cell.id.match(/^cell(\d+)-(\d+)$/);
    if (!match) return;
    const row = Number(match[1]);
    const column = Number(match[2]);
    updateSelection(row, column);
    setSelection((selection) => selection + 1);
  };

  const hanldePointerUp = () => {
    stopSelection();
  };

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
        display: "flex",
        outline: "none",
        border: " 1px solid #d3d2d2",
        boxSizing: "border-box",
        padding: "0 4px",
        textOverflow: "clip",
        alignItems: "center",
        // justifyContent: "flex-start",

        cursor: "cell",
        userSelect: "none",

        fontWeight: cellData[key]?.style?.bold ? "bold" : "normal",
        backgroundColor: cellData[key]?.style?.backgroundColor || "white",
        fontStyle: cellData[key]?.style?.italic ? "italic" : "normal",
        color: cellData[key]?.style?.color ?? "black",
        fontSize: `${cellData[key]?.style?.Fontsize ?? 14}px`,
        fontFamily:
          cellData[key]?.style?.Fontfamily ?? "Arial, Helvetica, sans-serif",
        textAlign: cellData[key]?.style?.align ?? "left",
        textDecorationLine: cellData[key]?.style?.Textunderline
          ? "underline"
          : "none",
        justifyContent:
          cellData[key]?.style?.align === "center"
            ? "center"
            : cellData[key]?.style?.align === "right"
              ? "flex-end"
              : "flex-start",
      }}
      onKeyDown={handleKeydown}
      onPointerDown={hanldePointerDown}
      onPointerMove={hanldePointerMove}
      onPointerUp={hanldePointerUp}
    />
  ) : null;
};

export default React.memo(EditingCell);
