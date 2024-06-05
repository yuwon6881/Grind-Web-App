import React, { useState } from "react";
import { FaDumbbell, FaExclamationCircle } from "react-icons/fa";
import {
  fetchCustomExercises,
  fetchCustomMuscles,
  fetchExercises,
  fetchMuscles,
} from "../../services/Fetchs";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loader/Loading";
import { CustomExercise, Exercise } from "../../Types/Types";
import Select from "react-select";
import config from "../../config";

const ExerciseCard = () => {
  // UseQuery to fetch exercises and muscles
  const { exerciseData, exerciseisLoading, exerciseIsError } = useExercise();
  const {
    customExerciseData,
    customExerciseisLoading,
    customExerciseIsError,
    customExerciseRefetch,
  } = useCustomExercise();
  const { muscleData, muscleisLoading, muscleIsError } = useMuscle();
  const { customMuscleData, customMuscleisLoading, customMuscleIsError } =
    useCustomMuscle();

  // State to handle create exercise form data
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseType, setExerciseType] = useState<string | null>(null);
  const [primaryMuscle, setPrimaryMuscle] = useState<string | null>(null);
  const [secondaryMuscle, setSecondaryMuscle] = useState<string[]>([]);

  // State to handle exercise filter
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [search, setSearch] = useState("");
  const exerciseOptions = [
    { value: "BARBELL", label: "Barbell" },
    { value: "DUMBBELL", label: "Dumbbell" },
    { value: "MACHINE", label: "Machine" },
    { value: "CABLE", label: "Cable" },
    { value: "BODYWEIGHT", label: "BodyWeight" },
    { value: "DURATION", label: "Duration" },
  ];
  let muscleOptions;
  if (muscleData && customMuscleData) {
    muscleOptions = [...muscleData, ...customMuscleData].map((muscle) => ({
      value: muscle.id,
      label: muscle.name,
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const muscles = primaryMuscle
      ? [{ muscleID: primaryMuscle, muscleType: "PRIMARY" }]
      : [];
    if (secondaryMuscle.length > 0) {
      secondaryMuscle.forEach((muscle) =>
        muscles.push({ muscleID: muscle, muscleType: "SECONDARY" }),
      );
    }

    const response = await fetch(config.API_URL + "/api/custom_exercise", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: exerciseName,
        exerciseType: exerciseType,
        muscles: muscles,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    setExerciseName("");
    setExerciseType(null);
    setPrimaryMuscle(null);
    setSecondaryMuscle([]);

    customExerciseRefetch();
    (document.getElementById("exercise_modal") as HTMLDialogElement)?.close();
  };

  return (
    <div className="card flex flex-col gap-4 border border-accent p-3">
      {muscleisLoading || (customMuscleisLoading && <Loading />)}
      {muscleIsError ||
        (customMuscleIsError && (
          <div className="flex items-center justify-center gap-2 text-red-500">
            <FaExclamationCircle />
            Failed to fetch muscles
          </div>
        ))}
      <h5>Exercise Library</h5>
      <div className="flex flex-col gap-2">
        {muscleData && customMuscleData && (
          <select
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)}
            className="select"
          >
            <option value="">All Muscles</option>
            {muscleData.map((muscle: { id: string; name: string }) => (
              <option value={muscle.name} key={muscle.id}>
                {muscle.name}
              </option>
            ))}
            {customMuscleData.map((muscle: { id: string; name: string }) => (
              <option value={muscle.name} key={muscle.id}>
                {muscle.name}
              </option>
            ))}
          </select>
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Exercises"
          className="input input-bordered"
        />
        <div className="flex items-center justify-between">
          <div className="text-lg">Exercise List</div>
          <button
            className="btn btn-sm bg-accent hover:bg-primary"
            onClick={() =>
              (
                document.getElementById("exercise_modal") as HTMLDialogElement
              )?.showModal()
            }
          >
            +
          </button>
          <dialog id="exercise_modal" className="modal">
            <div className="modal-box h-1/3 rounded-xl border border-accent">
              {muscleData && customMuscleData && (
                <form
                  className="mb-2 flex flex-col items-center gap-4"
                  onSubmit={handleSubmit}
                >
                  <h3 className="text-lg font-bold">Add Exercise</h3>
                  <input
                    type="text"
                    value={exerciseName}
                    onChange={(event) => setExerciseName(event?.target.value)}
                    className="input input-bordered w-full max-w-xs"
                  />
                  <Select
                    className="w-full max-w-xs"
                    options={exerciseOptions}
                    value={
                      exerciseType
                        ? exerciseOptions.find(
                            (option) => option.value === exerciseType,
                          )
                        : null
                    }
                    onChange={(e) => e && setExerciseType(e.value)}
                  />
                  <Select
                    className="w-full max-w-xs"
                    value={
                      primaryMuscle
                        ? muscleOptions &&
                          muscleOptions.find(
                            (option) => option.value === primaryMuscle,
                          )
                        : null
                    }
                    onChange={(e) => e && setPrimaryMuscle(e.value)}
                    options={muscleOptions}
                  />
                  <Select
                    className="w-full max-w-xs"
                    isMulti
                    value={
                      muscleOptions &&
                      secondaryMuscle.map((muscle) =>
                        muscleOptions.find(
                          (option: { value: string; name: string }) =>
                            option.value === muscle,
                        ),
                      )
                    }
                    options={muscleOptions}
                    onChange={(selectedOptions) =>
                      setSecondaryMuscle(
                        selectedOptions.map((option) => option.value),
                      )
                    }
                  />
                  <button className="btn" type="submit">
                    Add Exercise
                  </button>
                </form>
              )}
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
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
            {(() => {
              const filteredExerciseData = exerciseData.filter(
                (exercise) =>
                  exercise.name.toLowerCase().includes(search.toLowerCase()) &&
                  (selectedMuscle === "" ||
                    exercise.Exercise_Muscle.some(
                      (muscle) => muscle.Muscle?.name === selectedMuscle,
                    )),
              );

              const filteredCustomExerciseData = customExerciseData.filter(
                (exercise) =>
                  exercise.name.toLowerCase().includes(search.toLowerCase()) &&
                  (selectedMuscle === "" ||
                    exercise.Custom_Exercise_Muscle.some(
                      (muscle) => muscle.Muscle?.name === selectedMuscle,
                    )),
              );

              if (
                filteredExerciseData.length === 0 &&
                filteredCustomExerciseData.length === 0
              ) {
                return <div className="text-center">No exercises found</div>;
              }

              return (
                <>
                  {filteredExerciseData.map((exercise) => {
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
                  {filteredCustomExerciseData.map((exercise) => {
                    let primaryMuscle = exercise.Custom_Exercise_Muscle.filter(
                      (muscle) => muscle.muscleType === "PRIMARY",
                    )[0]?.Muscle?.name;

                    primaryMuscle ??=
                      exercise.Custom_Muscle_Custom_Exercise.filter(
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
                </>
              );
            })()}
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
          <div className="flex items-center rounded-md bg-accent px-2 py-1 text-xs font-semibold">
            Custom
          </div>
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
  const { data, isLoading, isError, refetch } = useQuery<{
    data: CustomExercise[];
  }>({
    queryKey: ["customExercises"],
    queryFn: fetchCustomExercises,
  });
  return {
    customExerciseData: data?.data,
    customExerciseisLoading: isLoading,
    customExerciseIsError: isError,
    customExerciseRefetch: refetch,
  };
};

const useMuscle = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["muscles"],
    queryFn: fetchMuscles,
  });
  return {
    muscleData: data?.data,
    muscleisLoading: isLoading,
    muscleIsError: isError,
  };
};

const useCustomMuscle = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["customMuscles"],
    queryFn: fetchCustomMuscles,
  });
  return {
    customMuscleData: data?.data,
    customMuscleisLoading: isLoading,
    customMuscleIsError: isError,
  };
};

export default ExerciseCard;
