import React, { useContext } from "react";
import config from "../../config";
import { Link, useNavigate } from "react-router-dom";
import logoDark from "../../Assets/logo_dark.png";
import logoLight from "../../Assets/logo_light.png";
import { ThemeContext, UserContext } from "../../services/Contexts";

const Navbar: React.FC = () => {
  //Sign out function
  const navigate = useNavigate();
  const { globalTheme } = useContext(ThemeContext);
  const { globalUser } = useContext(UserContext);
  const signOut = async () => {
    try {
      const response = await fetch(config.API_URL + "/api/userSignOut", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok || response.status === 401) {
        navigate("/login");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };
  return (
    <div className="h-28 shadow-sm shadow-accent">
      <div className="relative mx-10 flex h-full justify-between">
        {/* App Logo */}
        <Link to="/">
          <img
            src={globalTheme === "nord" ? logoDark : logoLight}
            alt="App Logo"
            width={100}
          />
        </Link>
        {/* Nav Links */}
        <div className="absolute bottom-1/2 left-1/2 hidden -translate-x-1/2 translate-y-1/2 transform items-center gap-3 md:flex">
          <Link
            className="link no-underline underline-offset-4 hover:underline"
            to="/"
          >
            Routines
          </Link>
          <Link
            className="link no-underline underline-offset-4 hover:underline"
            to="/"
          >
            Statistics
          </Link>
          <Link
            className="link no-underline underline-offset-4 hover:underline"
            to="/"
          >
            Exercises
          </Link>
        </div>
        {/* User Profile */}
        <div className="hidden items-center md:flex">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1 flex-nowrap">
              <div className="avatar placeholder">
                <div className="w-10 rounded-full bg-neutral text-neutral-content">
                  <span className="text-xl">C</span>
                </div>
              </div>
              <div className="text-nowrap">{globalUser!.name}</div>
            </div>
            <ul className="menu dropdown-content z-[1] w-52 rounded-lg border border-accent bg-base-100 p-2">
              <li>
                <Link to="/settings">Setting</Link>
              </li>
              <li>
                <button onClick={signOut}>Sign Out</button>
              </li>
            </ul>
          </div>
        </div>
        {/* Mobile Nav */}
        <div className="flex items-center md:hidden">
          <div className="dropdown dropdown-end">
            <button className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <ul className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
              <li>
                <Link className="link no-underline" to="/">
                  Routines
                </Link>
              </li>
              <li>
                <Link className="link no-underline" to="/">
                  Statistics
                </Link>
              </li>
              <li>
                <Link className="link no-underline" to="/">
                  Exercises
                </Link>
              </li>
              <li>
                <Link to="/settings">Setting</Link>
              </li>
              <li>
                <button onClick={signOut}>Sign Out</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
