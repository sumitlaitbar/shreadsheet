import React, { useContext } from "react";
import {
  SpreadsheetActionContext,
  SpreadsheetContext,
} from "../Context/SpreadsheetContext";

import style from "../Styles/PermissionPopup.module.css";

function PermissionPopup() {
  const { setClearDataPopUp, handleConfirmationDelete } = useContext(
    SpreadsheetActionContext,
  )!;
  const { clearDataPopUpp } = useContext(SpreadsheetContext)!;
  return (
    <div>
      {clearDataPopUpp && (
        <div className={style.popupoverlay}>
          <div className={style.popup}>
            <div className={style.popupcontent1}>
              <h2>Clear Spreadsheet?</h2>
              <div className={style.popupcontent2}>
                <p>
                  Are you sure want to <b>delete</b> All Spreadsheet Data.
                </p>
              </div>
              <div className={style.popupcontent2}>
                <p>
                  This will delete <b>Permission Popup Types.</b>
                </p>
              </div>
            </div>

            <div className={style.popupbuttons}>
              <button
                className={style.cancelbtn}
                type="button"
                onClick={() => setClearDataPopUp(false)}
              >
                Cancel
              </button>
              <button
                className={style.deletebtn}
                onClick={handleConfirmationDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PermissionPopup;
