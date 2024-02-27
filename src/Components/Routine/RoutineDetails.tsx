import React from "react";
import ExerciseCard from "../Exercise/ExerciseCard";
import { BiLeftArrowAlt, BiSave } from "react-icons/bi";
import { Link } from "react-router-dom";

const RoutineDetails = () => {
  return (
    <div className="grid grid-cols-3 gap-10">
      <div className="hidden md:block">
        <ExerciseCard />
      </div>
      <div className="col-span-2">
        <div className="flex justify-between">
          <Link
            to="/routines"
            className="flex items-center gap-2 hover:underline"
          >
            <BiLeftArrowAlt />
            Routine
          </Link>
          <button>
            <BiSave className="text-xl text-blue-600 hover:text-blue-300" />
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <input type="text" className="input input-sm input-bordered w-full" />
        </div>
      </div>
    </div>
  );
};

export default RoutineDetails;
