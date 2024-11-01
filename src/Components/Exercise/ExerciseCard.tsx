import React, { useState } from "react";
import { FaDumbbell, FaExclamationCircle } from "react-icons/fa";
import {
  deleteCustomExercise,
  fetchCustomExercises,
  fetchCustomMuscles,
  fetchExercises,
  fetchMuscles,
} from "../../services/Fetchs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../Loader/Loading";
import { CustomExercise, Exercise, ExerciseCardProps } from "../../Types/Types";
import Select from "react-select";
import config from "../../config";
import { BiTrash } from "react-icons/bi";

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  onExerciseClick,
  className,
}) => {
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
  const [error, setError] = useState("");

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

  let muscleOptions: { value: string; label: string }[] = [];
  if (muscleData && customMuscleData) {
    muscleOptions = [...muscleData, ...customMuscleData].map((muscle) => ({
      value: muscle.id,
      label: muscle.name,
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!exerciseName || !exerciseType || !primaryMuscle) {
      setError("Please fill all the required fields");
      return;
    }

    if (secondaryMuscle.includes(primaryMuscle)) {
      setError("Primary muscle cannot be secondary muscle");
      return;
    }

    const muscles = primaryMuscle
      ? [{ muscleID: primaryMuscle, muscleType: "PRIMARY" }]
      : [];
    if (secondaryMuscle.length > 0) {
      secondaryMuscle.forEach((muscle) =>
        muscles.push({ muscleID: muscle, muscleType: "SECONDARY" }),
      );
    }

    // Get the image
    const fileInput = document.querySelector(".file-input") as HTMLInputElement;

    const file = fileInput.files?.[0];

    const formData = new FormData();

    if (file) {
      formData.append("image", file);
    }

    formData.append("name", exerciseName);
    formData.append("exerciseType", exerciseType);
    formData.append("muscles", JSON.stringify(muscles));

    // Submit the form
    const response = await fetch(config.API_URL + "/api/custom_exercise", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    // Handle the response
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    // Reset the form
    setExerciseName("");
    setExerciseType(null);
    setPrimaryMuscle(null);
    setSecondaryMuscle([]);
    fileInput.value = "";
    setError("");

    customExerciseRefetch();
    (document.getElementById("exercise_modal") as HTMLDialogElement)?.close();
  };

  return (
    <div
      className={`h-full flex-col gap-4 border border-accent p-3 ${className}`}
    >
      {muscleisLoading || (customMuscleisLoading && <Loading />)}
      {muscleIsError ||
        (customMuscleIsError && (
          <div className="flex items-center justify-center gap-2 text-red-500">
            <FaExclamationCircle />
            Failed to fetch muscles
          </div>
        ))}
      <h5>Exercise Library</h5>
      <div className="flex h-full flex-col gap-2">
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
            <div className="modal-box h-1/2 rounded-xl border border-accent">
              {muscleData && customMuscleData && (
                <form
                  className="mb-2 flex flex-col items-center gap-4"
                  onSubmit={handleSubmit}
                >
                  <h3 className="text-lg font-bold">Add Exercise</h3>
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <FaExclamationCircle />
                      {error}
                    </div>
                  )}
                  <div className="flex w-full flex-col gap-3">
                    <div>
                      <label htmlFor="exercise_name">Exercise Name*</label>
                      <input
                        type="text"
                        value={exerciseName}
                        onChange={(event) =>
                          setExerciseName(event?.target.value)
                        }
                        className="h-9 w-full rounded border border-accent bg-white p-3 text-black focus-visible:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="exercise_type">Exercise Type*</label>
                      <Select
                        className="w-full text-black"
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
                    </div>
                    <div>
                      <label htmlFor="primary_muscle">Primary Muscle*</label>
                      <Select
                        className="w-full text-black"
                        value={
                          primaryMuscle
                            ? muscleOptions &&
                              muscleOptions.find(
                                (option) => option.value === primaryMuscle,
                              )
                            : null
                        }
                        onChange={(e) => e && setPrimaryMuscle(e.value)}
                        options={muscleOptions?.filter((value) => {
                          if (secondaryMuscle.includes(value.value)) {
                            return false;
                          }
                          return true;
                        })}
                      />
                    </div>
                    <div>
                      <label htmlFor="secondary_muscle">Secondary Muscle</label>

                      <Select
                        className="w-full text-black"
                        isMulti
                        value={
                          muscleOptions &&
                          secondaryMuscle.map((muscle) =>
                            muscleOptions.find(
                              (option: { value: string; label: string }) =>
                                option.value === muscle,
                            ),
                          )
                        }
                        options={muscleOptions?.filter((value) => {
                          if (primaryMuscle === value.value) {
                            return false;
                          }
                          return true;
                        })}
                        onChange={(selectedOptions) =>
                          setSecondaryMuscle(
                            Array.isArray(selectedOptions)
                              ? selectedOptions.map((option) => option.value)
                              : [],
                          )
                        }
                      />
                    </div>
                    <label
                      htmlFor="file-upload"
                      className="rounded-lg bg-accent p-2 text-center text-accent-content hover:cursor-pointer hover:bg-success"
                    >
                      Choose Image
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="file-input hidden w-full"
                    />
                  </div>
                  <button className="btn btn-accent" type="submit">
                    Add Exercise
                  </button>
                </form>
              )}
            </div>
            <form method="dialog" className="modal-backdrop">
              <button
                onClick={() => {
                  setExerciseName("");
                  setExerciseType(null);
                  setPrimaryMuscle(null);
                  setSecondaryMuscle([]);
                  setError("");
                }}
              >
                close
              </button>
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
          <div className="mb-10 flex h-full flex-col gap-3 overflow-auto p-1">
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
                    ) ||
                    exercise.Custom_Muscle_Custom_Exercise.some(
                      (muscle) => muscle.muscle?.name === selectedMuscle,
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
                        onClick={() =>
                          onExerciseClick({
                            ...exercise,
                            custom: false,
                            restTime: "0",
                            note: "",
                            index: 0,
                          })
                        }
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
                        image={exercise.image}
                        id={exercise.id}
                        onClick={() =>
                          onExerciseClick({
                            ...exercise,
                            custom: true,
                            restTime: "0",
                            note: "",
                            index: 0,
                          })
                        }
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

const ExerciseList: React.FC<{
  name: string;
  muscle: string;
  onClick: () => void;
}> = ({ name, muscle, onClick }) => {
  return (
    <button
      className="flex items-center gap-4 hover:cursor-pointer"
      onClick={onClick}
    >
      <FaDumbbell />
      <div className="flex flex-col items-start">
        <div className="font-semibold">{name}</div>
        <div className="text-sm">{muscle}</div>
      </div>
    </button>
  );
};

const CustomExerciseList: React.FC<{
  name: string;
  muscle: string;
  id: string;
  image: string | null;
  onClick: () => void;
}> = ({ name, muscle, image, id, onClick }) => {
  const queryClient = useQueryClient();

  const deleteExercise = async (id: string) => {
    await deleteCustomExercise(id);
    queryClient.invalidateQueries({
      queryKey: ["customExercises"],
    });
  };

  const deleteAlert = (id: string) => {
    const dialogID = `deleteAlert-${id}`;
    return (
      <dialog id={dialogID} className="modal">
        <div className="modal-box pb-2">
          <p className="text-center text-lg font-semibold">
            Confirm Delete Exercise?
          </p>
          <form method="dialog" className="flex justify-center gap-10 py-4">
            <div className="flex gap-3">
              <button className="btn btn-accent text-accent-content">
                Cancel
              </button>
              <button
                className="btn btn-error text-error-content"
                onClick={() => {
                  deleteExercise(id);
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

  return (
    <>
      {deleteAlert(id)}
      <button
        className="flex items-center gap-4 hover:cursor-pointer"
        onClick={onClick}
      >
        {image === null && <FaDumbbell />}
        {image !== null && (
          <img src={`${image}`} alt="Description" width="18" height="18" />
        )}
        <div className="grid flex-grow grid-cols-12">
          <div className="col-span-10 flex flex-col items-start">
            <div className="font-semibold">{name}</div>
            <div className="flex w-full justify-between text-sm">
              <span>{muscle}</span>
              <div className="flex items-center">
                <div className="rounded-md bg-accent px-2 py-1 text-xs font-semibold">
                  Custom
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex items-center justify-end">
            <BiTrash
              type="button"
              className="text-2xl text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                (
                  document.getElementById(
                    `deleteAlert-${id}`,
                  ) as HTMLDialogElement
                ).showModal();
              }}
            />
          </div>
        </div>
      </button>
    </>
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
