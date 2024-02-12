import React from "react";
import Login from "./LoginForm";
import Register from "./RegisterForm";
import logo from "../../Assets/logo_dark.png";

const Auth: React.FC<{ path: string }> = ({ path }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="my-5 flex justify-center">
        <img src={logo} alt="Dark Logo" width="250" />
      </div>
      <div className="w-full">
        {path === "login" ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default Auth;
