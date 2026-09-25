import React, { useContext, useEffect, useRef } from "react";
import {
  SpreadsheetActionContext,
  SpreadsheetContext,
} from "../Context/SpreadsheetContext";
import style from "../Styles/PermissionPopupLeavesite.module.css";

function PermissionPopupLeavesite() {
  const { isBack, isSavedPopup } = useContext(SpreadsheetContext)!;
  const { setIsBack, setIsSavedPopup } = useContext(SpreadsheetActionContext)!;

  const leaveBtnRef = useRef(false);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBackbtn = () => {
      if (leaveBtnRef.current) {
        leaveBtnRef.current = false;
        return;
      }

      if (!isSavedPopup) {
        window.history.back();
        return;
      }
      setIsBack(true);
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBackbtn);

    return () => {
      window.removeEventListener("popstate", handleBackbtn);
    };
  }, [setIsBack, isSavedPopup]);

  return (
    <div>
      {isBack && (
        <div className={style.popupoverlay}>
          <div className={style.popup}>
            <div className={style.popupcontent1}>
              <h2>Leave site?</h2>

              <div className={style.popupcontent2}>
                <p>Are you sure want to leave site?</p>
              </div>

              <div className={style.popupcontent2}>
                <p>Changes you made may not be saved.</p>
              </div>
            </div>

            <div className={style.popupbuttons}>
              <button
                className={style.cancelbtn}
                type="button"
                onClick={() => setIsBack(false)}
              >
                Cancel
              </button>

              <button
                className={style.deletebtn}
                type="button"
                onClick={() => {
                  leaveBtnRef.current = true;
                  setIsBack(false);
                  setIsSavedPopup(false);
                  window.history.back();
                }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PermissionPopupLeavesite;
