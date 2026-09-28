import { useRouter } from "next/navigation";
import React from "react";
import style from "../Styles/LogoutBtn.module.css";

const LogoutBtn = () => {
  const router = useRouter();

  const HandleLogout = () => {
    router.replace("/login");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
  };
  return (
    <div className={style.logoutbtn}>
      <button onClick={HandleLogout}>Logout</button>
    </div>
  );
};

export default LogoutBtn;
