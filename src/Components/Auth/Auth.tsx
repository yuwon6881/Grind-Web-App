import React from "react";
import Login from "./LoginForm";
import Register from "./RegisterForm";
import logoDark from "../../Assets/logo_dark.png";
import logoLight from "../../Assets/logo_light.png";
import { useLocation } from "react-router-dom";
import { setHtmlTheme } from "../Layout/AppLayout";

const Auth: React.FC<{ path: string }> = ({ path }) => {
  const { state } = useLocation();

  if (state?.theme) setHtmlTheme(state?.theme);

  return (
    <div className="flex flex-col items-center">
      <div className="my-5 flex justify-center">
        <img
          src={state?.theme === "halloween" ? logoLight : logoDark}
          alt="Logo"
          width="250"
        />
      </div>
      <div className="w-full">
        {path === "login" ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default Auth;
