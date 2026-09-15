"use Client";

import React from "react";
import styles from "../Styles/ToolbarBtn.module.css";
interface props {
  children: React.ReactNode;
  onClick?: () => void;
  onChange?: () => void;
}
const ToolbarBtn = ({ children, onClick, onChange }: props) => {
  return (
    <div>
      <button
        className={styles.ToolbarBtn}
        onClick={onClick}
        onChange={onChange}
      >
        {children}
      </button>
    </div>
  );
};
export default React.memo(ToolbarBtn);
