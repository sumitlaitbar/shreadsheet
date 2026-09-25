"use client";

import React, { memo, useContext, useRef } from "react";

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
  const {
    updateCell,
    setEditingCell,
    getValue,
    addRows,
    addColumns,
    handleCopy,
    handlePaste,
    handleTextbold,
    handleItalic,
    handleSave,
    handleCleardata,
  } = useContext(SpreadsheetActionContext)!;

  const { editingCell } = useContext(SpreadsheetContext)!;

  const gridRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const gridelement = gridRef.current;
    if (!gridelement) return;
    if (
      gridelement.scrollTop + gridelement.clientHeight >=
      gridelement.scrollHeight - 100
    ) {
      addRows();
    }

    if (
      gridelement.scrollLeft + gridelement.clientWidth >=
      gridelement.scrollWidth - 100
    ) {
      addColumns();
    }

    if (editingCell) {
      const value = getValue();
      updateCell(editingCell?.row, editingCell?.column, value);
      setEditingCell(null);
    }
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      handleCopy();
    }
    if (e.ctrlKey && e.key.toLowerCase() === "v") {
      e.preventDefault();
      handlePaste();
    }
    if (e.ctrlKey && e.key.toLowerCase() === "b") {
      e.preventDefault();
      handleTextbold();
    }
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      handleSave();
    }
    if (e.ctrlKey && e.key.toLowerCase() === "i") {
      e.preventDefault();
      handleItalic();
    }
    if (e.ctrlKey && e.key.toLowerCase() === "d") {
      e.preventDefault();
      handleCleardata();
    }
  };

  return (
    <div className={styles.page}>
      <header>
        <Spreadsheet />
        <SpreadsheetToolbar />
      </header>
      <main
        className={styles.gridContainer}
        ref={gridRef}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeydown}
      >
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
