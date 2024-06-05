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
      <div className="col-span-3 md:col-span-2">
        <div className="flex justify-between">
          <Link
            to="/routines"
            className="flex items-center gap-2 text-lg underline-offset-4 hover:underline"
          >
            <BiLeftArrowAlt />
            Routine
          </Link>
          <button className="hover:text-primary">
            <BiSave className="text-3xl" />
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Routine Name"
            className="input input-sm input-bordered w-full"
          />
        </div>
        <div className="mt-3 flex justify-center gap-2">
          Press <kbd className="kbd kbd-sm rounded-lg">+</kbd> to add exercise.
        </div>
      </div>
    </div>
  );
};

export default RoutineDetails;