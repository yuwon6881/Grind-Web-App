import React, { useEffect, useState } from "react";
import ExerciseCard from "./ExerciseCard";
import { IoAlert } from "react-icons/io5";
import { fetchCustomExercise, fetchExercise } from "../../services/Fetchs";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loader/Loading";
import { FaDumbbell } from "react-icons/fa";
import {
  SingleCustomExercise,
  SingleExercise,
  ExerciseMuscle,
  ExerciseCustomMuscle,
} from "../../Types/Types";

const Exercise: React.FC = () => {
  // Exercise states
  const [exerciseID, setExerciseID] = useState("");
  const [custom, setCustom] = useState(false);

  const { exerciseData, exerciseError, exerciseLoading, exerciseRefetch } =
    useExercise(exerciseID);

  const {
    customExerciseData,
    customExerciseError,
    customExerciseLoading,
    customExerciseRefetch,
  } = useCustomExercise(exerciseID);

  useEffect(() => {
    if (exerciseID && custom) {
      customExerciseRefetch();
    } else if (exerciseID && !custom) {
      exerciseRefetch();
    }
  }, [exerciseID, exerciseRefetch, customExerciseRefetch]);

  return (
    <div className="grid h-full grid-cols-3 gap-10">
      <div className="hidden md:block">
        <ExerciseCard
          onExerciseClick={(exercise): void => {
            setExerciseID(exercise.id);
            setCustom(exercise.custom);
          }}
        />
      </div>
      <div className="col-span-3 md:col-span-2">
        {!exerciseID ? (
          <div className="mt-3 flex h-full items-start justify-center md:items-center">
            <div className="flex items-center">
              <IoAlert />
              Click On An Exercise To See Statistics.
            </div>
          </div>
        ) : (
          <>
            {(exerciseLoading || customExerciseLoading) && <Loading />}
            {(exerciseError || customExerciseError) && (
              <div className="flex h-full items-center justify-center">
                <div className="text-lg text-red-500">
                  Failed to Load Statistics
                </div>
              </div>
            )}
            {exerciseData && exerciseStatistics(exerciseData, custom)}
            {customExerciseData &&
              exerciseStatistics(customExerciseData, custom)}
          </>
        )}
      </div>
    </div>
  );
};

const exerciseStatistics = (
  exerciseData: SingleCustomExercise | SingleExercise,
  custom: boolean,
) => {
  return (
    <div className="m-2 flex items-center gap-8">
      <div>
        {exerciseData.image ? (
          <img
            src={exerciseData.image}
            alt="Exercise"
            width={100}
            className="rounded-full"
          />
        ) : (
          <FaDumbbell size={100} />
        )}
      </div>
      {
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-semibold">{exerciseData.name}</div>
          <div>
            <div className="text-sm">
              Primary Muscle:{" "}
              <span>
                {isSingleCustomExercise(exerciseData, custom)
                  ? exerciseData.Custom_Exercise_Muscle.find(
                      (muscle) => muscle.muscleType === "PRIMARY",
                    )?.Muscle.name ||
                    exerciseData.Custom_Muscle_Custom_Exercise.find(
                      (muscle) => muscle.muscleType === "PRIMARY",
                    )?.muscle.name
                  : exerciseData.Exercise_Muscle.find(
                      (muscle) => muscle.muscleType === "PRIMARY",
                    )?.Muscle.name}
              </span>
            </div>
            <div className="text-sm">
              Secondary Muscle:{" "}
              <span>
                {isSingleCustomExercise(exerciseData, custom)
                  ? [
                      ...exerciseData.Custom_Exercise_Muscle.filter(
                        (muscle) => muscle.muscleType === "SECONDARY",
                      ),
                      ...exerciseData.Custom_Muscle_Custom_Exercise.filter(
                        (muscle) => muscle.muscleType === "SECONDARY",
                      ),
                    ]
                      .map((muscle) =>
                        isExerciseMuscle(muscle)
                          ? muscle.Muscle.name
                          : muscle.muscle.name,
                      )
                      .join(", ")
                  : exerciseData.Exercise_Muscle.filter(
                      (muscle) => muscle.muscleType === "SECONDARY",
                    )
                      .map((muscle) => muscle.Muscle.name)
                      .join(", ")}
              </span>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

const isSingleCustomExercise = (
  exerciseData: SingleCustomExercise | SingleExercise,
  custom: boolean,
): exerciseData is SingleCustomExercise => {
  return custom;
};

const isExerciseMuscle = (
  muscle: ExerciseMuscle | ExerciseCustomMuscle,
): muscle is ExerciseMuscle => {
  return "Muscle" in muscle;
};

const useExercise = (id: string) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["exercise", id],
    queryFn: () => fetchExercise(id),
    enabled: false,
  });

  return {
    exerciseData: data,
    exerciseError: error,
    exerciseLoading: isLoading,
    exerciseRefetch: refetch,
  };
};

const useCustomExercise = (id: string) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["customExercise", id],
    queryFn: () => fetchCustomExercise(id),
    enabled: false,
  });

  return {
    customExerciseData: data,
    customExerciseError: error,
    customExerciseLoading: isLoading,
    customExerciseRefetch: refetch,
  };
};

export default Exercise;
