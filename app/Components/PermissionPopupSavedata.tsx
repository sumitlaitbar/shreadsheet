import { useContext, useEffect } from "react";
import { SpreadsheetContext } from "../Context/SpreadsheetContext";

function PermissionPopupSavedata() {
  const { isSavedPopup } = useContext(SpreadsheetContext)!;
  useEffect(() => {
    const handleBeforeload = (e: BeforeUnloadEvent) => {
      if (!isSavedPopup) return;
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeload);
    };
  }, [isSavedPopup]);

  return null;
}

export default PermissionPopupSavedata;
