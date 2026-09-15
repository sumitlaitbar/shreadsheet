"use client";

import React, { memo, useContext } from "react";

import Image from "next/image";
import styles from "./Styles/Spreadsheet.module.css";
import SpreadsheetToolbar from "./Components/SpreadsheetToolbar";
import SpreadsheetGrid from "./Components/SpreadsheetGrid";

import {
  SpreadsheetActionContext,
  SpreadsheetContext,
  SpreadsheetContextProvider,
} from "./Context/SpreadsheetContext";

const Spreadsheet = memo(function Spreadsheet() {
  return (
    <div className={styles.spreadsheetHeader}>
      <Image src="/logo.webp" alt="Excel" width={50} height={50} />
      <h1>Excel</h1>
    </div>
  );
});

const SpreadsheetContent = memo(function SpreadsheetContent() {
  console.log("spreadsheet content render");

  const { updateCell, setEditingCell, getValue } = useContext(
    SpreadsheetActionContext,
  )!;

  const { selectedCell, editingCell } = useContext(SpreadsheetContext)!;

  const handleScroll = () => {
    if (!selectedCell || !editingCell) return;
    updateCell(selectedCell?.row, selectedCell?.column, getValue());
    console.log("getvlaue", getValue());
    setEditingCell(null);
  };

  return (
    <div className={styles.page}>
      <header>
        <Spreadsheet />
        <SpreadsheetToolbar />
      </header>
      <main className={styles.gridContainer} onScroll={handleScroll}>
        <SpreadsheetGrid />
      </main>
    </div>
  );
});

const Page = () => {
  return (
    <SpreadsheetContextProvider>
      <SpreadsheetContent />
    </SpreadsheetContextProvider>
  );
};

export default Page;
