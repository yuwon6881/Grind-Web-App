import React from "react";
import { FaTrophy, FaDumbbell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext, WeightUnitContext } from "../../services/Contexts";
import { Workout } from "../../Types/Types";
import { HiDotsVertical } from "react-icons/hi";
import { deleteWorkout } from "../../services/Fetchs";
import { handleClick } from "../Layout/Navbar";

const CardHistory: React.FC<{ data: Workout; workoutRefetch: () => void }> = ({
  data,
  workoutRefetch,
}) => {
  const { globalUser } = React.useContext(UserContext);
  const { globalWeightUnit } = React.useContext(WeightUnitContext);

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = endDate.getTime() - startDate.getTime();
  
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
  
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const exercises = data.Workout_Exercise.map((exercise) => ({
    name: exercise.Exercise.name,
    index: exercise.index,
    id: exercise.exercise_id,
    image: exercise.Exercise.image,
    workout_uuid: exercise.workout_uuid,
    exercise: true,
  }));

  const customExercises = data.Workout_Custom_Exercise.map(
    (customExercise) => ({
      name: customExercise.Custom_Exercise.name,
      index: customExercise.index,
      id: customExercise.custom_exercise_id,
      image: customExercise.Custom_Exercise.image,
      workout_uuid: customExercise.workout_uuid,
      exercise: false,
    }),
  );

  //Combine the exercises and custom exercises and sort them by index
  const combinedExercises = [...exercises, ...customExercises];

  const sortedExercises = combinedExercises.sort((a, b) => a.index - b.index);

  //Calculate total volume
  const totalVolume = data.Workout_Sets.reduce((acc, set) => {
    return acc + set.weight * set.reps;
  }, 0);

  //Calculate personal record
  const personalRecordCount = data.Workout_Sets.filter(
    (set) => set.Personal_Record !== null,
  ).length;

  return (
    <>
      {deleteWorkoutDialog(data.id, workoutRefetch)}
      <div className="card overflow-hidden border border-accent">
        <div className="card-body">
          <div className="flex flex-col gap-8">
            <div className="flex h-12 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral text-neutral-content">
                  {globalUser!.profilePicture ? (
                    <img
                      src={globalUser!.profilePicture}
                      alt="User Profile"
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-xl">
                      {globalUser!.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <h2 className="card-title">{globalUser?.name}</h2>
                  <span className="w-full text-sm">
                    {new Date(data.start_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button">
                  <HiDotsVertical />
                </div>
                <ul className="menu dropdown-content z-[1] w-52 border border-accent bg-base-100 p-2 shadow">
                  <li>
                    <Link
                      to={`/routine/${data.routine_id}/${data.id}`}
                      className="text-blue-600"
                    >
                      Edit Workout
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={() => {
                        (
                          document.getElementById(
                            "dialog-" + data.id,
                          ) as HTMLDialogElement
                        ).showModal();
                      }}
                    >
                      Delete Workout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="items-center justify-between lg:flex">
              <h6 className="mb-2 lg:mb-0">{data.name}</h6>
              <div className="flex gap-6">
                <div>
                  <div>
                    <span className="text-sm">Duration</span>
                    <h6>{formatDuration(data.start_date, data.end_date!)}</h6>
                  </div>
                </div>
                <div>
                  <div>
                    <span className="text-sm">Volume</span>
                    <h6>
                      {globalWeightUnit === "KG"
                        ? Math.round(totalVolume)
                        : Math.round(totalVolume * 2.20462)}
                      {globalWeightUnit?.toLowerCase() === "kg" ? "kg" : "lbs"}
                    </h6>
                  </div>
                </div>
                <div>
                  <div>
                    <span className="text-sm">Record</span>
                    <div className="flex items-center gap-1">
                      <FaTrophy />
                      <h6>{personalRecordCount}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="divider m-0"></div>
          <div className="flex flex-col gap-3">
            {sortedExercises.slice(0, 3).map((exercise) => (
              <div
                key={exercise.workout_uuid}
                className="flex items-center gap-3"
              >
                {exercise.image ? (
                  <img
                    src={exercise.image}
                    alt={exercise.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <FaDumbbell className="h-8 w-8 rounded-full" />
                )}
                <h6>
                  {
                    data.Workout_Sets.filter(
                      (set) => set.set_uuid === exercise.workout_uuid,
                    ).length
                  }
                  <span> Sets of </span>
                  {exercise.name}
                </h6>
              </div>
            ))}
            {sortedExercises.length > 3 && (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-accent-content  ">
                  + {sortedExercises.length - 3} More
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <Link
              to={`/workoutOverview/${data.id}`}
              className="btn btn-outline btn-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const deleteWorkoutDialog = (id: string, workoutRefetch: () => void) => {
  return (
    <dialog id={`dialog-${id}`} className="modal">
      <div className="modal-box pb-2">
        <p className="text-center text-lg font-semibold">
          Confirm Delete Workout?
        </p>
        <form method="dialog" className="flex justify-center gap-10 py-4">
          <div className="flex gap-3">
            <button className="btn btn-accent text-accent-content">
              Cancel
            </button>
            <button
              className="btn btn-error text-error-content"
              onClick={() => {
                deleteWorkout(id).then(() => {
                  handleClick();
                  workoutRefetch();
                });
              }}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default CardHistory;
