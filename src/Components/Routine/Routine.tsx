import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import { handleClick } from "../Layout/Navbar";
import { deleteRoutine } from "../../services/Fetchs";
import { Link } from "react-router-dom";

const routine: React.FC<{
  name: string;
  id: string;
  routineRefetch: () => void;
}> = ({ name, id, routineRefetch }) => {
  return (
    <div className="card border border-accent">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h6>{name}</h6>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button">
              <HiDotsVertical />
            </div>
            <ul className="menu dropdown-content z-[1] w-52 border border-accent bg-base-100 p-2 shadow">
              <li>
                <Link
                  to={`/routine/${id}`}
                  className="text-blue-600"
                  onClick={handleClick}
                >
                  Edit
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    deleteRoutine(id).then(() => {
                      handleClick();
                      routineRefetch();
                    });
                  }}
                  className="text-red-600"
                >
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
