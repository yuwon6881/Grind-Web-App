import React from "react";
import Navbar from "./Navbar";
import Dashboard from "../Dashboard/Dashboard";
import Settings from "../Setting/Setting";
import Routines from "../Routine/Routines";
import RoutineDetails from "../Routine/RoutineDetails";

const AppLayout: React.FC<{ component: string }> = ({ component }) => {
  let Content;

  switch (component) {
    case "dashboard":
      Content = <Dashboard />;
      break;
    case "settings":
      Content = <Settings />;
      break;
    case "routines":
      Content = <Routines />;
      break;
    case "routine":
      Content = <RoutineDetails />;
      break;
  }

  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <div className="mt-4 flex flex-grow justify-center">
        <div className="container">{Content}</div>
      </div>
    </div>
  );
};

export function setHtmlTheme(theme: string) {
  const html = document.querySelector("html");
  html!.setAttribute("data-theme", theme);
}

export default AppLayout;
