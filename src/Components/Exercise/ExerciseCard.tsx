import React from "react";
import { BiPlus } from "react-icons/bi";
import { FaDumbbell, FaExclamationCircle } from "react-icons/fa";
import { fetchCustomExercises, fetchExercises } from "../../services/Fetchs";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loader/Loading";
import { CustomExercise, Exercise } from "../../Types/Types";
const ExerciseCard = () => {
  const { exerciseData, exerciseisLoading, exerciseIsError } = useExercise();
  const { customExerciseData, customExerciseisLoading, customExerciseIsError } =
    useCustomExercise();

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
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent hover:bg-primary">
            <BiPlus />
          </button>
        </div>
        {exerciseisLoading || (customExerciseisLoading && <Loading />)}

        {exerciseIsError ||
          (customExerciseIsError && (
            <div className="flex items-center justify-center gap-2 text-red-500">
              <FaExclamationCircle />
              Failed to fetch exercises
            </div>
          ))}

        {exerciseData && customExerciseData && (
          <div className="flex flex-col gap-3 p-1">
            {exerciseData.map((exercise) => {
              const primaryMuscle = exercise.Exercise_Muscle.filter(
                (muscle) => muscle.muscleType === "PRIMARY",
              )[0]?.Muscle?.name;
              return (
                <ExerciseList
                  key={exercise.id}
                  name={exercise.name}
                  muscle={primaryMuscle}
                />
              );
            })}
            {customExerciseData.map((exercise) => {
              let primaryMuscle = exercise.Custom_Exercise_Muscle.filter(
                (muscle) => muscle.muscleType === "PRIMARY",
              )[0]?.Muscle?.name;

              primaryMuscle ??= exercise.Custom_Muscle_Custom_Exercise.filter(
                (muscle) => muscle.muscleType === "PRIMARY",
              )[0]?.muscle?.name;
              return (
                <CustomExerciseList
                  key={exercise.id}
                  name={exercise.name}
                  muscle={primaryMuscle}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const ExerciseList: React.FC<{ name: string; muscle: string }> = ({
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

const CustomExerciseList: React.FC<{ name: string; muscle: string }> = ({
  name,
  muscle,
}) => {
  return (
    <div className="flex items-center gap-4">
      <FaDumbbell />
      <div className="flex flex-grow flex-col items-start">
        <div className="font-semibold">{name}</div>
        <div className="flex w-full justify-between text-sm">
          <span>{muscle}</span>
          <div className="rounded-md bg-accent px-2 font-semibold">Custom</div>
        </div>
      </div>
    </div>
  );
};

const useExercise = () => {
  const { data, isLoading, isError } = useQuery<{ data: Exercise[] }>({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });
  return {
    exerciseData: data?.data,
    exerciseisLoading: isLoading,
    exerciseIsError: isError,
  };
};

const useCustomExercise = () => {
  const { data, isLoading, isError } = useQuery<{ data: CustomExercise[] }>({
    queryKey: ["customExercises"],
    queryFn: fetchCustomExercises,
  });
  return {
    customExerciseData: data?.data,
    customExerciseisLoading: isLoading,
    customExerciseIsError: isError,
  };
};

export default ExerciseCard;
