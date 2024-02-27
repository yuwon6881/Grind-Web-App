import React from "react";
import Routine from "./Routine";
import { BiPlus } from "react-icons/bi";
import { handleClick } from "../Layout/Navbar";
import { Link } from "react-router-dom";

const Routines = () => {
  return (
    <div>
      <h2>Routines</h2>
      <div className="dropdown dropdown-end flex justify-end gap-3">
        <div
          tabIndex={0}
          role="button"
          className="rounded-lg border border-accent p-3 hover:bg-base-300"
        >
          <BiPlus />
        </div>
        <div className="menu dropdown-content z-[1] border border-accent bg-base-100">
          <li>
            <button onClick={handleClick}>Add Folder</button>
            <Link to="/routine" onClick={handleClick}>
              Add Routine
            </Link>
          </li>
        </div>
      </div>
      <div className="card mt-6 border border-accent bg-base-100">
        <div className="card-body">
          <div>
            <Routine />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <h5>Folder 1</h5>
            <Routine />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routines;
