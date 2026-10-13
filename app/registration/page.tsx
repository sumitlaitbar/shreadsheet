"use client";

import style from "../Styles/Registration.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
const Registration = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password is mismatch");
      return;
    }

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        router.push("/login");
        return;
      }
    } catch (error) {
      console.log(error);
      alert("Somthing went wrong");
    }
  };
  console.log("registration page");
  return (
    <>
      <div className={style.registerpage}>
        <div className={style.mainsection}>
          <h1>Create Account</h1>

          <input
            type="email"
            value={email}
            placeholder="Email address"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />

          <div className={style.registerBtn}>
            <button onClick={handleRegister}>Register</button>
          </div>

          <div className={style.link}>
            <span>Already have an account?</span>

            <span>
              <a href="/login">Login</a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
