import React from "react";
import Login from "./LoginForm";
import Register from "./RegisterForm";
import logoDark from "../../Assets/logo_dark.png";
import { setHtmlTheme } from "../Layout/AppLayout";

const Auth: React.FC<{ path: string }> = ({ path }) => {
  setHtmlTheme("nord");

  return (
    <div className="flex flex-col items-center">
      <div className="my-5 flex justify-center">
        <img src={logoDark} alt="Logo" width="250" />
      </div>
      <div className="w-full">
        {path === "login" ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default Auth;
