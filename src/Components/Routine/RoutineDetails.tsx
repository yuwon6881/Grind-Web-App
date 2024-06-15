import React from "react";
import ExerciseCard from "../Exercise/ExerciseCard";
import { BiLeftArrowAlt, BiSave } from "react-icons/bi";
import { IoAlert } from "react-icons/io5";
import { Link } from "react-router-dom";
import { ExerciseInfo } from "../../Types/Types";

const RoutineDetails = () => {
  const [exercises, setExercises] = React.useState<ExerciseInfo[]>([]);
  return (
    <div className="grid h-full grid-cols-3 gap-10">
      <div className="hidden md:block">
        <ExerciseCard
          onExerciseClick={(exercise: ExerciseInfo): void => {
            setExercises([...exercises, exercise]);
          }}
        />
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
        <form className="mt-2 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Routine Name"
            className="input input-sm input-bordered w-full"
          />
          {exercises.length === 0 ? (
            <>
              {/* Routine Guide */}
              <div className="block md:hidden">
                <div className="mt-3 flex justify-center gap-2">
                  Press <kbd className="kbd kbd-sm rounded-lg">Add</kbd> to add
                  exercise.
                </div>
                <div className="mt-2 flex justify-center">
                  <button className="btn btn-accent btn-sm">Add</button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="mt-3 flex items-center justify-center">
                  <IoAlert />
                  Select Exercises On Exercise Card To Add To Routine.
                </div>
              </div>
            </>
          ) : (
            exercises.map((exercise, index) => (
              <div
                key={`${exercise.id}-${index}`}
                className="flex justify-between"
              >
                <div>{exercise.name}</div>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => removeExercise(index)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </form>
      </div>
    </div>
  );

  function removeExercise(index: number): void {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  }
};

export default RoutineDetails;
