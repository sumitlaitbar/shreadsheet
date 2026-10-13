"use client";

import { Cell } from "../Context/SpreadsheetContext";

 export const saveSpreadsheetToDB = async (
    cellData:Record<string,Cell>,
    name:string,
  ) => {
    try {
      const response = await fetch("/api/spreadsheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: cellData,
          name,
        }),
      });

    const result = await response.json();
     console.log("saved data to database:",result);    
    console.log("Response from server:", result);
      if (!response.ok) {
        throw new Error(result.message);
      }

       
      console.log("Spreadsheet saved:", result);
      return result;

    } catch (error) {
      console.error("Save failed:", error);
    }
  };