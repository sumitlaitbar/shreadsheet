"use client";

import React, { useContext } from "react";
import SpreadsheetCell from "./SpreadsheetCell";
import {
  Cell,
  SelectedCell,
  SpreadsheetActionContext,
} from "../Context/SpreadsheetContext";
import CellSelection from "./CellSelection";

interface GridProps {
  rows: number;
  columns: number;
  // cellData: Record<string, Cell>;
  setEditingCell: (cell: SelectedCell | null) => void;
  setSelectedCell: (cell: SelectedCell | null) => void;

  getCellData: (row: number, column: number) => Cell;
}

const Grid = ({
  rows,
  columns,
  // cellData,
  setEditingCell,
  setSelectedCell,
  getCellData,
}: GridProps) => {
  const getColumnName = (column: number) => {
    let name = "";
    while (column > 0) {
      const remainder = (column - 1) % 26;
      name = String.fromCharCode(65 + remainder) + name;
      column = Math.floor((column - 1) / 26);
    }

    return name;
  };

  return (
    <>
      <div
        key={`corner-${rows}-${columns}`}
        style={{
          width: "40px",
          border: "1px solid #a4a4a4",
          height: "35px",
          background: "#d7d7d7",

          position: "sticky",
          top: "0px",
          left: "0px",
          zIndex: "50",
        }}
      ></div>
      {Array.from({ length: columns }).map((_, c_i) => (
        <div
          key={`column-header-${c_i}`}
          style={{
            width: "150px",
            border: "1px solid #a4a4a4",
            height: "35px",
            gridColumn: c_i + 2,
            gridRow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",

            background: "#d7d7d7",

            position: "sticky",
            top: "0px",
            zIndex: "10",
          }}
        >
          {getColumnName(c_i + 1)}
        </div>
      ))}
      {Array.from({ length: rows }).map((_, r_i) => (
        <div
          key={`row-header-${r_i}`}
          style={{
            width: "40px",
            border: "1px solid #a4a4a4",
            height: "35px",
            gridColumn: 1,
            gridRow: r_i + 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            paddingLeft: "0px",
            background: "#d7d7d7",

            position: "sticky",
            left: "0px",
            zIndex: "20",
          }}
        >
          {r_i + 1}
        </div>
      ))}
      {Array.from({ length: rows }).map((_, r_i) => {
        return Array.from({ length: columns }).map((_, c_i) => {
          return (
            <SpreadsheetCell
              key={`${r_i}-${c_i}`}
              row={r_i}
              column={c_i}
              // cell={cellData[`${r_i}-${c_i}`]}
              setEditingCell={setEditingCell}
              setSelectedCell={setSelectedCell}
              getCellData={getCellData}
            />
          );
        });
      })}
    </>
  );
};
export default React.memo(Grid);
