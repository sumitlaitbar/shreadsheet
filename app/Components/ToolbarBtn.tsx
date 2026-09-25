"use Client";

import React from "react";
import styles from "../Styles/ToolbarBtn.module.css";
interface props {
  children: React.ReactNode;
  onClick?: () => void;
  onChange?: () => void;
  className?: string;
}
const ToolbarBtn = ({ children, onClick, onChange, className }: props) => {
  return (
    <div>
      <button
        className={`${styles.ToolbarBtn} ${className ?? ""}`}
        onClick={onClick}
        onChange={onChange}
      >
        {children}
      </button>
    </div>
  );
};
export default React.memo(ToolbarBtn);
