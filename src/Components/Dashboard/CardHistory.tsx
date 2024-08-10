import React from "react";
import { FaTrophy, FaDumbbell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext, WeightUnitContext } from "../../services/Contexts";
import { Workout } from "../../Types/Types";

const CardHistory: React.FC<{ data: Workout }> = ({ data }) => {
  const { globalUser } = React.useContext(UserContext);
  const { globalWeightUnit } = React.useContext(WeightUnitContext);

  const exercises = data.Workout_Exercise.map((exercise) => ({
    name: exercise.Exercise.name,
    index: exercise.index,
    id: exercise.exercise_id,
    exercise: true,
  }));

  const customExercises = data.Workout_Custom_Exercise.map(
    (customExercise) => ({
      name: customExercise.Custom_Exercise.name,
      index: customExercise.index,
      id: customExercise.custom_exercise_id,
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
    <div className="card overflow-hidden border border-accent">
      <div className="card-body">
        <div className="flex flex-col gap-8">
          <div className="avatar placeholder h-12 items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-neutral text-neutral-content">
              {globalUser!.profilePicture ? (
                <img
                  src={globalUser!.profilePicture}
                  alt="User Profile"
                  className="rounded-full"
                />
              ) : (
                <span className="text-xl">{globalUser!.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex flex-col">
              <h2 className="card-title">{globalUser?.name}</h2>
              <span className="text-sm">
                {new Date(data.start_date).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="items-center justify-between lg:flex">
            <h6 className="mb-2 lg:mb-0">{data.name}</h6>
            <div className="flex gap-6">
              <div>
                <div>
                  <span className="text-sm">Duration</span>
                  <h6>{data.duration}</h6>
                </div>
              </div>
              <div>
                <div>
                  <span className="text-sm">Volume</span>
                  <h6>
                    {globalWeightUnit === "KG"
                      ? Math.floor(totalVolume)
                      : Math.floor(totalVolume * 2.20462)}
                    {globalWeightUnit?.toLowerCase()}
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
          {sortedExercises.map((exercise) => (
            <div key={exercise.id} className="flex items-center gap-2">
              <FaDumbbell />
              <h6>
                {exercise.exercise
                  ? data.Workout_Sets.filter(
                      (set) => set.exercise_id === exercise.id,
                    ).length
                  : data.Workout_Sets.filter(
                      (set) => set.custom_exercise_id === exercise.id,
                    ).length}
                <span> Sets of </span>
                {exercise.name}
              </h6>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Link to="/" className="btn btn-outline btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardHistory;
