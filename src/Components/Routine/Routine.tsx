import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import { handleClick } from "../Layout/Navbar";

const routine = () => {
  return (
    <div className="card border border-accent">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h6>Example</h6>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button">
              <HiDotsVertical />
            </div>
            <ul className="menu dropdown-content z-[1] w-52 border border-accent bg-base-100 p-2 shadow">
              <li>
                <button onClick={handleClick} className="text-blue-600">
                  Edit
                </button>
              </li>
              <li>
                <button onClick={handleClick} className="text-red-600">
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default routine;
