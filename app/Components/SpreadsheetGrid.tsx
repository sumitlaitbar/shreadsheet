"use client";

import React, { useContext } from "react";
import style from "../Styles/SpreadsheetGrid.module.css";
import Grid from "./Grid";
import {
  SpreadsheetActionContext,
  SpreadsheetContext,
} from "../Context/SpreadsheetContext";
import EditingCell from "./EditingCell";
import CellSelection from "./CellSelection";
import PermissionPopup from "./PermissionPopup";
import PermissionPopupSavedata from "./PermissionPopupSavedata";
import PermissionPopupLeavesite from "./PermissionPopupLeavesite";

const SpreadsheetGrid = () => {
  const { rows, columns, cellData } = useContext(SpreadsheetContext)!;
  const { getCellData } = useContext(SpreadsheetActionContext)!;
  const { setEditingCell, setSelectedCell } = useContext(
    SpreadsheetActionContext,
  )!;
  return (
    <div
      className={style.SpreadsheetGrid}
      style={{
        display: "grid",
        gridTemplateColumns: `40px repeat(${columns},150px)`,
      }}
    >
      <Grid
        rows={rows}
        columns={columns}
        setEditingCell={setEditingCell}
        setSelectedCell={setSelectedCell}
        getCellData={getCellData}
      />
      <EditingCell cellData={cellData} />
      <CellSelection />
      <PermissionPopup />
      <PermissionPopupSavedata />
      <PermissionPopupLeavesite />
    </div>
  );
};
export default React.memo(SpreadsheetGrid);
