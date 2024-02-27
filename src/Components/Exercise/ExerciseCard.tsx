import React from "react";
import { BiPlus } from "react-icons/bi";
import { FaDumbbell } from "react-icons/fa";
const ExerciseCard = () => {
  return (
    <div className="card flex flex-col gap-4 border border-accent p-3">
      <h5>Exercise Library</h5>
      <div className="flex flex-col gap-2">
        <select className="select select-accent">
          <option value="">Muscle 1</option>
          <option value="">Muscle 2</option>
          <option value="">Muscle 3</option>
        </select>
        <input
          type="text"
          placeholder="Search Exercises"
          className="input input-bordered"
        />
        <div className="flex items-center justify-between">
          <div className="text-lg">Exercise List</div>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-black hover:bg-blue-500">
            <BiPlus />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <ExerciseList name="Exercise 1" muscle={["Muscle 1"]} />
          <ExerciseList name="Exercise 2" muscle={["Muscle 2"]} />
        </div>
      </div>
    </div>
  );
};

const ExerciseList: React.FC<{ name: string; muscle: string[] }> = ({
  name,
  muscle,
}) => {
  return (
    <div className="flex items-center gap-4">
      <FaDumbbell />
      <div className="flex flex-col items-start">
        <div className="font-semibold">{name}</div>
        <div className="text-sm">{muscle}</div>
      </div>
    </div>
  );
};

export default ExerciseCard;
