"use client";

import React, { useState } from "react";
import style from "../Styles/LoginPage.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useEffect(() => {
  //   const username = localStorage.getItem("username");
  //   const password = localStorage.getItem("password");
  //   if (username && password) {
  //     router.replace("/spreadsheet");
  //   }
  // }, [router]);

  // const handleLogin = () => {
  //   if (!email || !password) return;
  //   localStorage.setItem("username", email);
  //   localStorage.setItem("password", password);
  //   router.replace("/spreadsheet");
  // };

  // const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEmail(e.target.value);
  // };
  // const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPassword(e.target.value);
  // };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("please enter valid email and password");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }
      alert(data.message);

      router.push("/spreadsheet");
      
    } catch (error) {
      console.log(error);
      alert("Something Went Wrong");
    }
  };

  return (
    <div className={style.loginpage}>
      <div className={style.leftsection}>
        <div className={style.leftcontent}>
          <div className={style.excelbadge}>
            <span>▦</span>
            <p>Smart Spreadsheet</p>
          </div>

          <h1>Organize. Analyze. Achieve.</h1>

          <p className={style.tagline}>Your data, simplified.</p>

          <span className={style.description}>
            Manage your spreadsheets, organize your data, and turn information
            into insights.
          </span>

          <div className={style.datacard}>
            <div className={style.cardheader}>
              <span>Spreadsheet</span>
              <span className={style.live}>● Live</span>
            </div>

            <div className={style.gridpreview}>
              <div className={style.gridrow}>
                <span>A</span>
                <span>B</span>
                <span>C</span>
                <span>D</span>
              </div>

              <div className={style.gridrow}>
                <span>120</span>
                <span>250</span>
                <span>180</span>
                <span>320</span>
              </div>

              <div className={style.gridrow}>
                <span>450</span>
                <span>320</span>
                <span>520</span>
                <span>410</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={style.rightsection}>
        <div className={style.logincontent}>
          <Image
            src="/Excel-logo.png"
            alt="Excel Logo"
            width={50}
            height={50}
          />

          <h1>Welcome Back</h1>

          <p>Sign in to your Excel account</p>
        </div>

        <div className={style.logininputs}>
          <input
            className={style.logininput}
            type="email"
            placeholder="Email address"
            value={email}
            // onChange={handleEmail}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <input
            className={style.logininput}
            type="password"
            placeholder="Password"
            value={password}
            // onChange={handlePassword}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <div className={style.loginbtns}>
          <button className={style.loginbtn} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);
