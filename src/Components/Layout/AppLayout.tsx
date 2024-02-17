import React from "react";
import Navbar from "./Navbar";
import Dashboard from "../Dashboard/Dashboard";
import Settings from "../Setting/Setting";

const AppLayout: React.FC<{ component: string }> = ({ component }) => {
  let Content;

  switch (component) {
    case "dashboard":
      Content = <Dashboard />;
      break;
    case "settings":
      Content = <Settings />;
  }

  return (
    <div>
      <Navbar />
      <div>{Content}</div>
    </div>
  );
};

export function setHtmlTheme(theme: string) {
  const html = document.querySelector("html");
  html!.setAttribute("data-theme", theme);
}

export default AppLayout;
