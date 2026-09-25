"use client";

import ToolbarBtn from "./ToolbarBtn";
import styles from "../Styles/SpreadsheetToolbar.module.css";
import React, { useContext, useEffect, useRef } from "react";
import {
  Cell,
  createKey,
  SelectedCell,
  SpreadsheetActionContext,
  SpreadsheetContext,
  TextAlign,
} from "../Context/SpreadsheetContext";

const SpreadsheetToolbar = () => {
  const {
    addRows,
    addColumns,
    handleTextbold,
    handleTextColor,
    handleTextunderline,
    handleItalic,
    handleBgcolor,
    handleFontsize,
    handleCopy,
    handlePaste,
    handleSave,
    removeRows,
    removeColumns,
    handleFontfamily,
    handleTextalign,
    handleCleardata,
    handleLoad,
  } = useContext(SpreadsheetActionContext)!;
  const { cellData, selectedCell } = useContext(SpreadsheetContext)!;
  const textInputRef = useRef<HTMLInputElement>(null);
  const bgColorInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const key = selectedCell
    ? createKey(selectedCell?.row, selectedCell?.column)
    : "";

  const currentAlign: TextAlign = selectedCell
    ? (cellData[key]?.style?.align ?? "left")
    : "left";

  return (
    <div className={styles.SpreadsheetToolbar}>
      <ToolbarBtn onClick={addRows}>+ Row </ToolbarBtn>
      <ToolbarBtn onClick={removeRows}>- Row </ToolbarBtn>
      <ToolbarBtn onClick={addColumns}>+ Column</ToolbarBtn>
      <ToolbarBtn onClick={removeColumns}>- Column</ToolbarBtn>|
      <label title="Font Name " htmlFor="Fontfamily">
        <ToolbarBtn className={styles.textcolorToolbarbtn}>
          <select
            name="FontFamily"
            id="FontFamily"
            defaultValue="Arial, Helvetica, sans-serif"
            onChange={(e) => {
              handleFontfamily(e.target.value);
            }}
          >
            <option value="Arial, Helvetica, sans-serif">
              Arial, Helvetica, sans-serif
            </option>
            <option value="Arial Black">Arial Black</option>
            <option value="Arial Narrow">Arial Narrow</option>
            <option value="Aptos">Aptos</option>
            <option value="Calibri">Calibri</option>
            <option value="Cambria">Cambria</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Roboto">Roboto</option>
            <option value="Segoe UI">Segoe UI</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Verdana">Verdana</option>
            <option value="monospace">Monospace</option>
            <option value="serif">Serif</option>
            <option value="sans-serif">Sans Serif</option>
          </select>
        </ToolbarBtn>
      </label>
      <label htmlFor="Font Size" title="Font Size">
        <ToolbarBtn className={styles.textcolorToolbarbtn}>
          <select
            name="Font Size"
            id="Font Size"
            defaultValue="14"
            onChange={(e) => handleFontsize(Number(e.target.value))}
          >
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="1">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
            <option value="31">31</option>
            <option value="32">32</option>
          </select>
        </ToolbarBtn>
      </label>
      <ToolbarBtn className={styles.textcolorToolbarbtn}>
        <label htmlFor="Textalign" title="Text Alignment">
          <select
            name="Textalign"
            id="Textalign"
            value={currentAlign}
            onChange={(e) => handleTextalign(e.target.value as TextAlign)}
          >
            <option value="left">left</option>
            <option value="center">center</option>
            <option value="right">right</option>
          </select>
        </label>
      </ToolbarBtn>
      |
      <label title="Text Underline">
        <ToolbarBtn className={styles.boldbtn} onClick={handleTextunderline}>
          <span style={{ textDecorationLine: "underline" }}>U</span>
        </ToolbarBtn>
      </label>
      <label title="Bold">
        <ToolbarBtn className={styles.boldbtn} onClick={handleTextbold}>
          <b>B</b>
        </ToolbarBtn>
      </label>
      <label title="Italic">
        <ToolbarBtn className={styles.italicbtn} onClick={handleItalic}>
          <i>I</i>
        </ToolbarBtn>
      </label>
      |
      <label title=" BackgroundColor">
        <ToolbarBtn
          className={styles.textcolorToolbarbtn}
          onClick={() => {
            bgColorInputRef.current?.click();
          }}
        >
          <span style={{ color: "red" }}>🖌️colors🔻</span>
          <div className={styles.input}>
            <input
              ref={bgColorInputRef}
              type="color"
              onChange={(e) => handleBgcolor(e.target.value)}
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                opacity: 0,
              }}
            />
          </div>
        </ToolbarBtn>
      </label>
      <label title="Font Color">
        <ToolbarBtn
          className={styles.textcolorToolbarbtn}
          onClick={() => {
            textInputRef.current?.click();
          }}
        >
          <span className={styles.textcolorButton}>A🔻</span>
          <div className={styles.input}>
            <input
              ref={textInputRef}
              type="color"
              onChange={(e) => handleTextColor(e.target.value)}
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                opacity: 0,
              }}
            />
          </div>
        </ToolbarBtn>
      </label>
      |<ToolbarBtn onClick={handleCopy}>Copy</ToolbarBtn>
      <ToolbarBtn onClick={handlePaste}>Paste</ToolbarBtn>|
      <label title="clear data" htmlFor="clear data">
        <ToolbarBtn onClick={handleCleardata}>Clr (Ctr+d)</ToolbarBtn>
      </label>
      <label title="Save File">
        <ToolbarBtn onClick={handleSave} className={styles.savebtn}>
          Save
        </ToolbarBtn>
      </label>
      <label title="Load File">
        <ToolbarBtn
          onClick={() => fileInputRef.current?.click()}
          className={styles.loadbtn}
        >
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              hidden
              onChange={async (e) => {
                const file = fileInputRef.current?.files?.[0];
                if (!file) return;
                await handleLoad(file);
                e.target.value = "";
              }}
            />
          </div>
          Load
        </ToolbarBtn>
      </label>
    </div>
  );
};

export default React.memo(SpreadsheetToolbar);
