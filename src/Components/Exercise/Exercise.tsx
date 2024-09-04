import React, { useState } from "react";
import ExerciseCard from "./ExerciseCard";
import { IoAlert } from "react-icons/io5";
import { fetchCustomExercise, fetchExercise } from "../../services/Fetchs";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loader/Loading";

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

  if (exerciseID && custom) {
    customExerciseRefetch();
  } else if (exerciseID && !custom) {
    exerciseRefetch();
  }

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
            {exerciseData && !custom && <div>Exercise Data</div>}
            {customExerciseData && custom && <div>Custom Exercise Data</div>}
          </>
        )}
      </div>
    </div>
  );
};

const useExercise = (id: string) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["exercise"],
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
    queryKey: ["customExercise"],
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
