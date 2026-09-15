"use client";

import ToolbarBtn from "./ToolbarBtn";
import styles from "../Styles/SpreadsheetToolbar.module.css";
import React, { useContext } from "react";
import { SpreadsheetActionContext } from "../Context/SpreadsheetContext";
const SpreadsheetToolbar = () => {
  const {
    addRows,
    addColumns,
    handleTextbold,
    handleBgcolor,
    handleCopy,
    handlePaste,
    handleSave,
    // handleLoad,
  } = useContext(SpreadsheetActionContext)!;
  return (
    <div className={styles.SpreadsheetToolbar}>
      <ToolbarBtn onClick={addRows}>+ Row </ToolbarBtn>
      <ToolbarBtn onClick={addColumns}>+ Column</ToolbarBtn>
      <ToolbarBtn onClick={handleTextbold}>Bold</ToolbarBtn>
      <ToolbarBtn>
        <div className={styles.input}>
          <input type="color" onChange={(e) => handleBgcolor(e.target.value)} />
        </div>
      </ToolbarBtn>
      <ToolbarBtn onClick={handleCopy}>Copy</ToolbarBtn>
      <ToolbarBtn onClick={handlePaste}>Paste</ToolbarBtn>

      <ToolbarBtn onClick={handleSave}>Save</ToolbarBtn>
    </div>
  );
};

export default React.memo(SpreadsheetToolbar);
