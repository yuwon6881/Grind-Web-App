import React, { useEffect } from "react";
import ExerciseCard from "../Exercise/ExerciseCard";
import {
  BiDownArrow,
  BiLeftArrowAlt,
  BiSave,
  BiTrash,
  BiUpArrow,
} from "react-icons/bi";
import { IoAlert } from "react-icons/io5";
// eslint-disable-next-line import/named
import { Link, NavigateFunction, useParams } from "react-router-dom";
import {
  ExerciseInfo,
  ExerciseSet,
  InputFieldProps,
  OnGoingWorkout,
  Personal_Record,
  Personal_Record_State,
  RoutineWithInfo,
  SuperSet,
  WorkoutInfo,
  WorkoutWithInfo,
} from "../../Types/Types";
import { HiDotsVertical } from "react-icons/hi";
import { handleClick } from "../Layout/Navbar";
import { v4 as uuidv4 } from "uuid";
import config from "../../config";
import { useQuery } from "@tanstack/react-query";
import {
  createPersonalRecord,
  createWorkoutExercises,
  createWorkoutSuperset,
  deleteWorkout,
  fetchDefaultFolder,
  fetchPersonalRecords,
  fetchRoutine,
  fetchSets,
  fetchWorkout,
  getWorkout,
  updateWorkout,
} from "../../services/Fetchs";
import ErrorMessage from "../Error/Error";
import {
  OnGoingWorkoutContext,
  OnGoingWorkoutInfoContext,
  WeightUnitContext,
} from "../../services/Contexts";
import { useNavigate } from "react-router-dom";
import { FaDumbbell } from "react-icons/fa";
import prFile from "../../Assets/pr_sound.mp3";

const RoutineDetails = () => {
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [exercises, setExercises] = React.useState<ExerciseInfo[]>([]);
  const [exerciseSets, setExerciseSets] = React.useState<ExerciseSet[]>([]);
  const [superset, setSuperset] = React.useState<SuperSet[]>([]);
  const [routineName, setRoutineName] = React.useState("");
  const [personalRecords, setPersonalRecords] = React.useState<
    Personal_Record_State[]
  >([]);
  const { onGoingWorkoutDetails, setOnGoingWorkoutDetails } = React.useContext(
    OnGoingWorkoutContext,
  );
  const { onGoingWorkoutInfo, setOnGoingWorkoutInfo } = React.useContext(
    OnGoingWorkoutInfoContext,
  );
  const { globalWeightUnit } = React.useContext(WeightUnitContext);
  const [workoutInfo, setWorkoutInfo] = React.useState<WorkoutInfo | null>(
    null,
  );
  const [currentTime, setCurrentTime] = React.useState(
    new Date().toISOString(),
  );
  const { id, workout_id } = useParams();
  const navigate = useNavigate();

  const { data: routineData }: { data: { data: RoutineWithInfo } | undefined } =
    useQuery({
      queryKey: ["routine", id],
      queryFn: () => fetchRoutine(id!),
      enabled: !!id,
    });

  const { data: workoutData }: { data: { data: WorkoutWithInfo } | undefined } =
    useQuery({
      queryKey: ["workout", workout_id],
      queryFn: () => fetchWorkout(workout_id!),
      enabled: !!workout_id,
    });

  const { data: personalRecordsData } = useQuery<Personal_Record>({
    queryKey: ["personalRecords"],
    queryFn: () => fetchPersonalRecords(),
  });

  // Retrieve default folder id
  const { data, isError } = useQuery({
    queryKey: ["defaultFolder"],
    queryFn: fetchDefaultFolder,
  });

  displayRoutine(
    id,
    workout_id,
    setExercises,
    setExerciseSets,
    setSuperset,
    setRoutineName,
    routineData?.data,
    workoutData?.data,
    globalWeightUnit!,
    !!onGoingWorkoutInfo,
  );

  const isPersonalRecord = async (
    weight: number,
    reps: number,
    exercise_id: string,
    set_uuid: string,
    custom: boolean,
  ): Promise<boolean> => {
    if (!personalRecordsData) {
      return false;
    }

    // Check if personal records state already stored the same exercise pr
    const isRecord = personalRecords.find(
      (record) =>
        record.exercise_id === exercise_id ||
        record.custom_exercise_id === exercise_id,
    );

    if (isRecord) {
      if (weight >= isRecord.weight && weight * reps > isRecord.volume) {
        setPersonalRecords((prev) => {
          return prev.map((pr) => {
            if (pr.set_uuid === isRecord.set_uuid) {
              return {
                ...pr,
                weight: weight,
                reps: reps,
                volume: weight * reps,
              };
            }
            return pr;
          });
        });
        return true;
      } else {
        return false;
      }
    }
    const checkRecord = async (recordId: string) => {
      const response = await fetchSets(recordId);
      if (response) {
        if (weight >= response.weight && weight * reps > response.volume) {
          return true;
        }
      }
      return false;
    };

    const record = personalRecordsData.find(
      (record) =>
        record.exercise_id === exercise_id ||
        record.custom_exercise_id === exercise_id,
    );

    if (record) {
      const isRecord = await checkRecord(record.workout_set_id);
      if (isRecord) {
        setPersonalRecords((prev) => [
          ...prev,
          {
            set_uuid: set_uuid,
            exercise_id: record.exercise_id,
            custom_exercise_id: record.custom_exercise_id,
            weight: weight,
            reps: reps,
            volume: weight * reps,
          },
        ]);
        return true;
      }
    } else {
      setPersonalRecords((prev) => [
        ...prev,
        {
          set_uuid: set_uuid,
          exercise_id: custom ? null : exercise_id,
          custom_exercise_id: custom ? exercise_id : null,
          weight: weight,
          reps: reps,
          volume: weight * reps,
        },
      ]);
    }

    return false;
  };

  const calculateDuration = () => {
    if (!workoutInfo) return "N/A";

    const startDate = new Date(workoutInfo.start_date);
    const current = new Date(currentTime);
    const duration = current.getTime() - startDate.getTime();

    const durationInSeconds = Math.floor(duration / 1000);
    const durationInMinutes = Math.floor(durationInSeconds / 60);
    const durationInHours = Math.floor(durationInMinutes / 60);

    return `${durationInHours ? durationInHours + " hours, " : ""}${durationInMinutes ? (durationInMinutes % 60) + " minutes, " : ""} ${durationInSeconds % 60} seconds`;
  };

  const syncWorkoutInfo = () => {
    if (workout_id)
      setOnGoingWorkoutInfo!({
        Exercise: exercises,
        ExerciseSet: exerciseSets,
        Superset: superset,
        WorkoutName: routineName,
      });
  };

  const clearWorkoutInfo = () => {
    setOnGoingWorkoutInfo!(undefined);
  };

  useEffect(() => {
    // If exercise sets does not belongs to any exercise, remove it
    setExerciseSets((prev) => {
      return prev.filter((set) => exercises.find((ex) => ex.id === set.id));
    });
  }, [exercises]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (personalRecords) {
        setPersonalRecords((prev) => {
          return prev.map((pr) => {
            const relatedSets = exerciseSets.filter((set) => {
              return (
                (set.id.split("@")[0] === pr.custom_exercise_id &&
                  set.completed) ||
                (set.id.split("@")[0] === pr.exercise_id && set.completed)
              );
            });

            // retrieve the set with the highest volume
            const relatedSet = relatedSets.reduce((prev, current) => {
              return Number(prev.weight) * Number(prev.reps) >
                Number(current.weight) * Number(current.reps)
                ? prev
                : current;
            }, relatedSets[0]);

            return relatedSet
              ? {
                  ...pr,
                  weight:
                    globalWeightUnit === "KG"
                      ? Number(relatedSet.weight)
                      : Number(relatedSet.weight) / 2.20462,
                  reps: Number(relatedSet.reps),
                  volume:
                    globalWeightUnit === "KG"
                      ? Number(relatedSet.weight)
                      : (Number(relatedSet.weight) / 2.20462) *
                        Number(relatedSet.reps),
                }
              : pr;
          });
        });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [exerciseSets]);

  useEffect(() => {
    if (superset.length < 2) setSuperset([]);
  }, [exercises]);

  useEffect(() => {
    if (workoutInfo?.status === "IN_PROGRESS") syncWorkoutInfo();
  }, [exercises, exerciseSets, superset, routineName]);

  // Duration Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (id && !workout_id) {
      fetchRoutine(id).then((response) => {
        if (!response.success) {
          setErrorMsg("Routine Not Found");
        }
      });
    }
  }, [id]);

  React.useEffect(() => {
    if (workout_id) {
      getWorkout(workout_id).then((response) => {
        setWorkoutInfo(() => {
          return {
            start_date: new Date(response.data.start_date),
            status: response.data.status,
          };
        });
        if (onGoingWorkoutInfo !== undefined) {
          setExercises(onGoingWorkoutInfo.Exercise);
          setExerciseSets(onGoingWorkoutInfo.ExerciseSet);
          setSuperset(onGoingWorkoutInfo.Superset);
          setRoutineName(onGoingWorkoutInfo.WorkoutName);
        }
        if (!response.success) {
          setErrorMsg("Workout Not Found");
        }
        if (response.data?.routine_id !== id) {
          setErrorMsg("Workout Not Found");
        }
      });
    }
  }, [workout_id]);

  if (isError || errorMsg) {
    return <ErrorMessage message={errorMsg ?? "Folder Not Found"} />;
  }

  return (
    <div className="grid h-full grid-cols-3 gap-10">
      {move_dialog(exercises, setExercises)}
      {superset_dialog(exercises, superset, setSuperset)}
      {smallScreenExerciseDialog(
        setExercises,
        exercises,
        setExerciseSets,
        exerciseSets,
      )}
      <ExerciseCard
        className="hidden md:block"
        onExerciseClick={(exercise: ExerciseInfo): void => {
          // Create a unique ID for each exercise
          const exerciseID = exercise.id + "@" + uuidv4();

          setExercises([
            ...exercises,
            {
              name: exercise.name,
              id: exerciseID,
              restTime: exercise.restTime,
              note: exercise.note,
              custom: exercise.custom,
              index: exercises.length + 1,
              image: exercise.image,
            },
          ]);

          setExerciseSets([
            ...exerciseSets,
            {
              id: exerciseID,
              reps: "",
              weight: "",
              set_type: "NORMAL",
              rpe: "",
              completed: false,
              set_uuid: uuidv4(),
            },
          ]);
        }}
      />
      <div
        className="col-span-3 overflow-y-auto md:col-span-2"
        style={{
          height: onGoingWorkoutDetails?.Workout_ID ? "" : "100vh",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <form
          className="mt-2 flex flex-col gap-2"
          style={{
            height: onGoingWorkoutDetails?.Workout_ID ? "" : "100vh",
          }}
          onSubmit={(e) => {
            handleSubmit(
              e,
              id,
              workout_id,
              data,
              routineName,
              globalWeightUnit!,
              exercises,
              exerciseSets,
              superset,
              navigate,
              personalRecords,
            );
          }}
        >
          {workoutInfo?.start_date && workoutInfo?.status === "IN_PROGRESS" && (
            <div className="font-semibold">
              Duration:{" "}
              <span className="font-normal">{calculateDuration()}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            {workout_id && workoutInfo?.status === "IN_PROGRESS" ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  clearWorkoutInfo();
                  deleteWorkout(workout_id).then(() => {
                    navigate("/routines");
                  });
                }}
                className="btn btn-outline btn-error btn-sm"
              >
                Cancel
              </button>
            ) : workout_id ? (
              <Link
                to="/"
                className="flex items-center gap-2 text-lg underline-offset-4 hover:underline"
              >
                <BiLeftArrowAlt />
                Workout
              </Link>
            ) : (
              <Link
                to="/routines"
                className="flex items-center gap-2 text-lg underline-offset-4 hover:underline"
              >
                <BiLeftArrowAlt />
                Routine
              </Link>
            )}
            {workout_id &&
              workoutInfo?.status === "IN_PROGRESS" &&
              onGoingWorkoutDetails &&
              onGoingWorkoutDetails.currentTimer > 0 && (
                <div className="flex items-center gap-3">
                  <span>Timer</span>
                  <progress
                    className="progress progress-success sm:w-32 md:w-24 lg:w-56"
                    value={onGoingWorkoutDetails!.currentTimer}
                    max={onGoingWorkoutDetails!.maxTimer}
                  ></progress>
                  <span>{onGoingWorkoutDetails!.currentTimer + " Secs"}</span>
                  <button
                    className="btn btn-outline btn-warning btn-xs"
                    onClick={() => {
                      setOnGoingWorkoutDetails!({
                        ...onGoingWorkoutDetails!,
                        currentTimer: 0,
                        maxTimer: 0,
                      });
                    }}
                  >
                    Skip
                  </button>
                </div>
              )}
            {workout_id && workoutInfo?.status === "IN_PROGRESS" ? (
              <button
                onClick={() => {
                  clearWorkoutInfo();
                }}
                className="btn btn-outline btn-success btn-sm"
              >
                Finish
              </button>
            ) : (
              <button className="hover:text-primary">
                <BiSave className="text-3xl" />
              </button>
            )}
          </div>
          <div
            id="PR_alert"
            role="alert"
            className="alert alert-success hidden rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Congratulations On Your New PR</span>
          </div>
          <input
            type="text"
            placeholder="Routine Name"
            className="input input-sm input-bordered w-full"
            value={routineName}
            onChange={(e) => {
              setRoutineName(e.target.value);
            }}
            required
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
                  <button
                    type="button"
                    className="btn btn-accent btn-sm"
                    onClick={() =>
                      (
                        document.getElementById(
                          "ss_exercise_modal",
                        ) as HTMLDialogElement
                      )?.showModal()
                    }
                  >
                    Add
                  </button>
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
            <>
              {exercises
                .sort((a, b) => a.index - b.index)
                .map((exercise, index) => (
                  <div
                    key={`${exercise.id}-${index}`}
                    id={`id${exercise.id}-${index}`}
                    className="card card-compact flex flex-col gap-3 border border-accent"
                  >
                    <Exercise
                      exercise={exercise}
                      index={index}
                      exercises={exercises}
                      setExercises={setExercises}
                      exerciseSets={exerciseSets}
                      setExerciseSets={setExerciseSets}
                      superset={superset}
                      setSuperset={setSuperset}
                      workout_id={workout_id}
                      globalWeightUnit={globalWeightUnit!}
                      setOnGoingWorkoutDetails={setOnGoingWorkoutDetails!}
                      WorkoutInfo={workoutInfo}
                      isPersonalRecord={isPersonalRecord}
                    />
                  </div>
                ))}
              <div className="mt-2 flex justify-center md:hidden">
                <button
                  type="button"
                  className="btn btn-accent btn-sm"
                  onClick={() =>
                    (
                      document.getElementById(
                        "ss_exercise_modal",
                      ) as HTMLDialogElement
                    )?.showModal()
                  }
                >
                  Add
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

const SuperSetExercise: React.FC<{
  index: number;
  setSuperset: React.Dispatch<React.SetStateAction<SuperSet[]>>;
  superset: SuperSet[];
  exercise: ExerciseInfo;
}> = ({ index, setSuperset, superset, exercise }) => {
  const existInSuperset = superset.find((ss) => ss.id === exercise.id);
  return (
    <button
      key={index}
      className="btn btn-outline hover:btn-accent"
      onClick={() => {
        if (existInSuperset) {
          setSuperset(superset.filter((ss) => ss.id !== exercise.id));
        } else {
          setSuperset([
            ...superset,
            { id: exercise.id, custom: exercise.custom },
          ]);
        }
        handleClick();
      }}
    >
      {exercise.name}{" "}
      <div className="text-blue-600">{existInSuperset ? "✓" : null}</div>
    </button>
  );
};

const Exercise: React.FC<{
  exercise: ExerciseInfo;
  index: number;
  exercises: ExerciseInfo[];
  setExercises: React.Dispatch<React.SetStateAction<ExerciseInfo[]>>;
  exerciseSets: ExerciseSet[];
  setExerciseSets: React.Dispatch<React.SetStateAction<ExerciseSet[]>>;
  superset: SuperSet[];
  setSuperset: React.Dispatch<React.SetStateAction<SuperSet[]>>;
  workout_id: string | undefined;
  globalWeightUnit: string;
  setOnGoingWorkoutDetails: React.Dispatch<
    React.SetStateAction<OnGoingWorkout | undefined>
  >;
  WorkoutInfo: WorkoutInfo | null;
  isPersonalRecord: (
    weight: number,
    reps: number,
    exercise_id: string,
    set_uuid: string,
    custom: boolean,
  ) => Promise<boolean>;
}> = ({
  exercise,
  index,
  exercises,
  setExercises,
  exerciseSets,
  setExerciseSets,
  superset,
  setSuperset,
  workout_id,
  globalWeightUnit,
  setOnGoingWorkoutDetails,
  WorkoutInfo,
  isPersonalRecord,
}) => {
  function removeExercise(index: number): void {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
    setSuperset(superset.filter((ss) => ss.id !== exercise.id));
  }

  function addSet(id: string): void {
    const newSet: ExerciseSet = {
      id: id,
      reps: "",
      weight: "",
      rpe: "",
      set_type: "NORMAL",
      completed: false,
      set_uuid: uuidv4(),
    };
    setExerciseSets([...exerciseSets, newSet]);
  }

  function updateRestTime(exerciseId: string, restTime: string): void {
    const updatedExercises = exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        return { ...exercise, restTime: restTime };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  }

  function updateNote(exerciseId: string, note: string): void {
    const updatedExercises = exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        return { ...exercise, note: note };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  }

  return (
    <div className="card-body">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            {exercise.image ? (
              <img
                src={exercise.image}
                alt={exercise.name}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <FaDumbbell className="h-10 w-10 rounded-full" />
            )}
            {exercise.name}
            {superset.find((ss) => ss.id === exercise.id) && (
              <div className="rounded-md bg-accent px-2 py-1 font-semibold">
                Superset
              </div>
            )}
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button">
              <HiDotsVertical />
            </div>
            <ul className="menu dropdown-content z-[1] w-52 border border-accent bg-base-100 p-2 shadow">
              {exercises.length > 1 && (
                <>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById(
                          "superset_error",
                        )!.style.display = "none";
                        document.getElementById("superset_dialog")?.click();
                      }}
                      className="text-blue-600"
                    >
                      Superset
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        (
                          document.getElementById(
                            `move_dialog`,
                          ) as HTMLDialogElement
                        ).showModal();
                      }}
                      className="text-yellow-500"
                    >
                      Arrange Exercise
                    </button>
                  </li>
                </>
              )}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    removeExercise(index);
                    handleClick();
                  }}
                  className="text-red-600"
                >
                  Remove Exercise
                </button>
              </li>
            </ul>
          </div>
        </div>
        <input
          type="text"
          className="input input-sm input-accent"
          placeholder="Exercise Note"
          value={exercise.note}
          onChange={(e) => updateNote(exercise.id, e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span>Rest Timer</span>
        <select
          className="select select-accent select-sm max-w-xs"
          value={exercise.restTime}
          onChange={(e) => updateRestTime(exercise.id, e.target.value)}
        >
          <option value="0">No Rest</option>
          <option value="0.15">15s</option>
          <option value="0.3">30s</option>
          <option value="0.45">45s</option>
          <option value="1">1m</option>
          <option value="1.5">1m30s</option>
          <option value="2">2m</option>
          <option value="2.5">2m30s</option>
          <option value="3">3m</option>
          <option value="3.5">3m30s</option>
          <option value="4">4m</option>
          <option value="4.5">4m30s</option>
          <option value="5">5m</option>
        </select>
      </div>
      <Sets
        exercise={exercise}
        exerciseSets={exerciseSets}
        setExerciseSets={setExerciseSets}
        workout_id={workout_id}
        globalWeightUnit={globalWeightUnit}
        setOnGoingWorkoutDetails={setOnGoingWorkoutDetails!}
        WorkoutInfo={WorkoutInfo}
        isPersonalRecord={isPersonalRecord}
      />
      <button
        type="button"
        className="btn btn-accent btn-sm"
        onClick={() => {
          addSet(`${exercise.id}`);
        }}
      >
        Add Set
      </button>
    </div>
  );
};

const Sets: React.FC<{
  exercise: ExerciseInfo;
  exerciseSets: ExerciseSet[];
  setExerciseSets: React.Dispatch<React.SetStateAction<ExerciseSet[]>>;
  workout_id: string | undefined;
  globalWeightUnit: string;
  setOnGoingWorkoutDetails: React.Dispatch<
    React.SetStateAction<OnGoingWorkout | undefined>
  >;
  WorkoutInfo: WorkoutInfo | null;
  isPersonalRecord: (
    weight: number,
    reps: number,
    exercise_id: string,
    set_uuid: string,
    custom: boolean,
  ) => Promise<boolean>;
}> = ({
  exercise,
  exerciseSets,
  setExerciseSets,
  workout_id,
  globalWeightUnit,
  setOnGoingWorkoutDetails,
  WorkoutInfo,
  isPersonalRecord,
}) => {
  function removeSet(id: string): void {
    const [exerciseID, setIndex] = id.split("#");
    setExerciseSets((sets) => {
      // Filter the sets that belong to the exercise id
      let filteredSets = sets.filter((set) => set.id === exerciseID);

      // Remove the nth element from the filtered array
      filteredSets = filteredSets.filter(
        (set, index) => index !== Number(setIndex),
      );

      // combine filtered sets with the removed set
      return sets.filter((set) => set.id !== exerciseID).concat(filteredSets);
    });
  }

  function updateSet(
    setIndex: number,
    updateType: "weight" | "rpe" | "reps" | "set_type",
    newValue:
      | number
      | "NORMAL"
      | "DROPSET"
      | "LONG_LENGTH_PARTIAL"
      | "WARMUP"
      | string,
  ): void {
    setExerciseSets((sets) => {
      let filteredSets = sets.filter((set) => set.id === exercise.id);
      filteredSets = filteredSets.map((filteredSet, index) => {
        if (index === setIndex) {
          switch (updateType) {
            case "weight":
              return { ...filteredSet, weight: newValue };
            case "rpe":
              return { ...filteredSet, rpe: newValue };
            case "reps":
              return { ...filteredSet, reps: newValue };
            case "set_type":
              return {
                ...filteredSet,
                set_type: newValue as
                  | "NORMAL"
                  | "DROPSET"
                  | "LONG_LENGTH_PARTIAL",
              };
            default:
              return filteredSet;
          }
        }
        return filteredSet;
      });
      return sets.filter((set) => set.id !== exercise.id).concat(filteredSets);
    });
  }

  return (
    <>
      {exerciseSets
        .filter((set) => set.id === exercise.id)
        .map((set, setIndex) => (
          <div key={setIndex} className="sets flex justify-between">
            <div className="flex flex-col items-center gap-2">
              <span>Sets</span>
              <span>{setIndex + 1}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span>Set Type</span>
              <select
                id="a"
                value={set.set_type}
                className="select select-accent select-sm max-w-28"
                onChange={(e) => {
                  const setType = e.target.value as
                    | "NORMAL"
                    | "DROPSET"
                    | "LONG_LENGTH_PARTIAL"
                    | "WARMUP";
                  updateSet(setIndex, "set_type", setType);
                }}
              >
                <option value="NORMAL">Normal</option>
                <option value="WARMUP">Warmup</option>
                <option value="DROPSET">Dropset</option>
                <option value="LONG_LENGTH_PARTIAL">LLP</option>
              </select>
            </div>
            <InputField
              label={`Weight (${globalWeightUnit})`}
              max={1000}
              value={set.weight}
              onChange={(newWeight) => updateSet(setIndex, "weight", newWeight)}
              className="max-w-20"
              exercise_id={exercise.id}
              setIndex={setIndex}
            />
            <InputField
              label="Reps"
              max={100}
              value={set.reps}
              onChange={(newReps) => updateSet(setIndex, "reps", newReps)}
              className="max-w-20"
              exercise_id={exercise.id}
              setIndex={setIndex}
            />
            <InputField
              label="RPE"
              max={10}
              value={set.rpe}
              onChange={(newRpe) => updateSet(setIndex, "rpe", newRpe)}
              className="max-w-10"
              exercise_id={exercise.id}
              setIndex={setIndex}
            />
            {workout_id && (
              <div className="flex flex-col items-center gap-1 pb-2">
                <span>Completed?</span>
                <div className="form-control">
                  <input
                    type="checkbox"
                    id={`checkbox-${exercise.id}-${setIndex}`}
                    className="checkbox-accent checkbox rounded"
                    checked={set.completed}
                    onChange={async (e) => {
                      setExerciseSets((prev) => {
                        return prev.map((prevSet) => {
                          if (prevSet.set_uuid === set.set_uuid) {
                            return { ...prevSet, completed: e.target.checked };
                          }
                          return prevSet;
                        });
                      });

                      const checkbox = e.target as HTMLInputElement;
                      if (
                        checkbox.checked &&
                        WorkoutInfo?.status === "IN_PROGRESS"
                      ) {
                        const isPR = await isPersonalRecord(
                          globalWeightUnit === "KG"
                            ? Number(set.weight)
                            : Number(set.weight) / 2.20462,
                          Number(set.reps),
                          exercise.id.split("@")[0],
                          set.set_uuid,
                          exercise.custom,
                        );

                        if (isPR) {
                          const prAlert = document.querySelector(
                            "#PR_alert",
                          ) as HTMLElement;
                          prAlert.classList.remove("hidden");
                          const prSound = new Audio(prFile);
                          prSound.play();
                          setTimeout(() => {
                            prAlert.classList.add("hidden");
                          }, 3000);
                        }
                        setOnGoingWorkoutDetails!((prev) => {
                          if (parseFloat(exercise.restTime) >= 1) {
                            const seconds =
                              parseFloat(exercise.restTime.split(".")[0]) * 60 +
                              (parseFloat(exercise.restTime.split(".")[1])
                                ? 30
                                : 0);
                            return {
                              ...prev!,
                              currentTimer: seconds,
                              maxTimer: seconds,
                            };
                          }
                          return {
                            ...prev!,
                            currentTimer: parseFloat(exercise.restTime) * 100,
                            maxTimer: parseFloat(exercise.restTime) * 100,
                          };
                        });
                      }
                    }}
                  />
                </div>
              </div>
            )}
            <div
              className={`flex items-end pb-2 ${setIndex === 0 ? "invisible" : ""}`}
            >
              <button
                type="button"
                onClick={() => removeSet(`${exercise.id}#${setIndex}`)}
              >
                <BiTrash className="text-xl text-red-600" />
              </button>
            </div>
          </div>
        ))}
    </>
  );
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  max,
  value,
  onChange,
  className,
  exercise_id,
  setIndex,
}) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="whitespace-nowrap">{label}</span>
      <input
        type="number"
        max={max}
        className={`input input-sm input-accent ${className}`}
        value={value}
        onChange={(e) => {
          const checkbox = document.getElementById(
            `checkbox-${exercise_id}-${setIndex}`,
          ) as HTMLInputElement;
          if (checkbox?.checked && label !== "RPE") {
            checkbox.click();
          }
          let newValue: number | string = e.target.valueAsNumber;
          if (isNaN(newValue)) {
            newValue = "";
          } else if (newValue > max) {
            newValue = max;
          }
          onChange(newValue);
        }}
      />
    </div>
  );
};

const displayRoutine = async (
  id: string | undefined,
  workout_id: string | undefined,
  setExercises: React.Dispatch<React.SetStateAction<ExerciseInfo[]>>,
  setExerciseSets: React.Dispatch<React.SetStateAction<ExerciseSet[]>>,
  setSuperset: React.Dispatch<React.SetStateAction<SuperSet[]>>,
  setRoutineName: React.Dispatch<React.SetStateAction<string>>,
  routineData: RoutineWithInfo | undefined,
  workoutData: WorkoutWithInfo | undefined,
  globalWeightUnit: string,
  onGoingWorkoutInfo: boolean,
) => {
  const isWorkoutData = (
    data: RoutineWithInfo | WorkoutWithInfo,
  ): data is WorkoutWithInfo => {
    return "routine_id" in data;
  };

  React.useEffect(() => {
    if (workout_id && !workoutData) return;
    if (onGoingWorkoutInfo) return;

    const data =
      workout_id && workoutData?.status === "COMPLETED"
        ? workoutData!
        : routineData;

    let newExercises: ExerciseInfo[] = [];
    let supersetData = [];
    let newExerciseSets = [];
    const routineUUIDs = new Set<string>();
    const uuidMap = new Map<string, string>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const replaceUUIDs = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          replaceUUIDs(obj[key]);
        } else if (typeof obj[key] === "string" && uuidMap.has(obj[key])) {
          obj[key] = uuidMap.get(obj[key]);
        }
      }
    };

    if (data !== undefined && isWorkoutData(data)) {
      newExercises = [
        ...data.Workout_Exercise.map((exercise) => ({
          name: exercise.Exercise.name,
          id: exercise.exercise_id + "@" + exercise.workout_uuid,
          restTime: exercise.rest_timer.toString(),
          note: exercise.note,
          custom: false,
          index: exercise.index,
          image: exercise.Exercise.image,
        })),
        ...data.Workout_Custom_Exercise.map((customExercise) => ({
          name: customExercise.Custom_Exercise.name,
          id:
            customExercise.custom_exercise_id +
            "@" +
            customExercise.workout_uuid,
          restTime: customExercise.rest_timer.toString(),
          note: customExercise.note,
          custom: true,
          index: customExercise.index,
          image: customExercise.Custom_Exercise.image,
        })),
      ];
    } else {
      if (!data) return;
      data.Routine_Exercise.forEach((exercise) => {
        routineUUIDs.add(exercise.routine_uuid);
      });

      data.Routine_Custom_Exercise.forEach((exercise) => {
        routineUUIDs.add(exercise.routine_uuid);
      });

      routineUUIDs.forEach((uuid) => {
        uuidMap.set(uuid, uuidv4());
      });

      // Replace routine_uuid with new uuid for on going workout
      replaceUUIDs(data);

      newExercises = [
        ...data.Routine_Exercise.map((exercise) => ({
          name: exercise.Exercise.name,
          id: exercise.exercise_id + "@" + exercise.routine_uuid,
          restTime: exercise.rest_timer.toString(),
          note: exercise.note,
          custom: false,
          index: exercise.index,
          image: exercise.Exercise.image,
        })),
        ...data.Routine_Custom_Exercise.map((customExercise) => ({
          name: customExercise.Custom_Exercise.name,
          id:
            customExercise.custom_exercise_id +
            "@" +
            customExercise.routine_uuid,
          restTime: customExercise.rest_timer.toString(),
          note: customExercise.note,
          custom: true,
          index: customExercise.index,
          image: customExercise.Custom_Exercise.image,
        })),
      ];
    }

    if (data !== undefined && !isWorkoutData(data)) {
      supersetData = data.Routine_Superset.map((superset) => {
        const customExercises = superset.RoutineSuperset_CustomExercise.map(
          (exercise) => {
            const exercise_id = data.Routine_Custom_Exercise.find(
              (ex) => ex.routine_uuid === exercise.routine_uuid,
            )?.custom_exercise_id;

            return {
              id: exercise_id + "@" + exercise.routine_uuid,
              custom: true,
            };
          },
        );

        const exercises = superset.RoutineSuperset_Exercise.map((exercise) => {
          const exercise_id = data.Routine_Exercise.find(
            (ex) => ex.routine_uuid === exercise.routine_uuid,
          )?.exercise_id;

          return {
            id: exercise_id + "@" + exercise.routine_uuid,
            custom: false,
          };
        });

        return [...customExercises, ...exercises];
      }).flat();

      newExerciseSets = data.Routine_Set.map((set) => ({
        id: `${set.exercise_id ?? set.custom_exercise_id}@${set.set_uuid}`,
        reps: set.reps ? set.reps.toString() : "",
        weight: set.weight
          ? globalWeightUnit === "KG"
            ? Number(set.weight).toFixed(2)
            : Number(set.weight * 2.20462).toFixed(2)
          : "",
        rpe: set.rpe ? set.rpe.toString() : "",
        set_type: set.set_type as
          | "NORMAL"
          | "DROPSET"
          | "LONG_LENGTH_PARTIAL"
          | "WARMUP",
        completed: false,
        set_uuid: uuidv4(),
      }));
    } else {
      supersetData = data.Workout_Superset.map((superset) => {
        const customExercises = superset.WorkoutSuperset_CustomExercise.map(
          (exercise) => {
            const exercise_id = data.Workout_Custom_Exercise.find(
              (ex) => ex.workout_uuid === exercise.workout_uuid,
            )?.custom_exercise_id;

            return {
              id: exercise_id + "@" + exercise.workout_uuid,
              custom: true,
            };
          },
        );

        const exercises = superset.WorkoutSuperset_Exercise.map((exercise) => {
          const exercise_id = data.Workout_Exercise.find(
            (ex) => ex.workout_uuid === exercise.workout_uuid,
          )?.exercise_id;

          return {
            id: exercise_id + "@" + exercise.workout_uuid,
            custom: false,
          };
        });

        return [...customExercises, ...exercises];
      }).flat();

      newExerciseSets = data.Workout_Sets.map((set) => ({
        id: `${set.exercise_id ?? set.custom_exercise_id}@${set.set_uuid}`,
        reps: set.reps ? set.reps.toString() : "",
        weight: set.weight
          ? globalWeightUnit === "KG"
            ? Number(set.weight).toFixed(2)
            : Number(set.weight * 2.20462).toFixed(2)
          : "",
        rpe: set.rpe ? set.rpe.toString() : "",
        set_type: set.set_type as
          | "NORMAL"
          | "DROPSET"
          | "LONG_LENGTH_PARTIAL"
          | "WARMUP",
        completed: true,
        set_uuid: uuidv4(),
      }));
    }

    const filteredExercises = newExercises.filter((exercise) =>
      newExerciseSets.some((set) => set.id === exercise.id),
    );

    setExerciseSets(newExerciseSets);
    setExercises(filteredExercises);
    setRoutineName(data.name);
    setSuperset(supersetData);
  }, [workoutData, routineData]);
};

const move_dialog = (
  exercises: ExerciseInfo[],
  setExercises: React.Dispatch<React.SetStateAction<ExerciseInfo[]>>,
) => {
  const moveUpExercise = (
    exercises: ExerciseInfo[],
    setExercises: React.Dispatch<React.SetStateAction<ExerciseInfo[]>>,
    currentExercise: ExerciseInfo,
  ) => {
    // Find the index of the exercise
    const findExercise = exercises.find(
      (exercise) => exercise.id === currentExercise.id,
    );
    if (!findExercise) return;
    if (findExercise.index === 1) return;

    setExercises((prev) => {
      return prev.map((exercise) => {
        if (exercise.index === currentExercise.index) {
          return { ...exercise, index: exercise.index - 1 };
        } else if (exercise.index === currentExercise.index - 1) {
          return { ...exercise, index: exercise.index + 1 };
        }
        return exercise;
      });
    });
  };

  const moveDownExercise = (
    exercises: ExerciseInfo[],
    setExercises: React.Dispatch<React.SetStateAction<ExerciseInfo[]>>,
    currentExercise: ExerciseInfo,
  ) => {
    // Find the index of the exercise
    const findExercise = exercises.find(
      (exercise) => exercise.id === currentExercise.id,
    );
    if (!findExercise) return;
    if (findExercise.index === exercises.length) return;

    setExercises((prev) => {
      return prev.map((exercise) => {
        if (exercise.index === currentExercise.index) {
          return { ...exercise, index: exercise.index + 1 };
        } else if (exercise.index === currentExercise.index + 1) {
          return { ...exercise, index: exercise.index - 1 };
        }
        return exercise;
      });
    });
  };
  return (
    <dialog id="move_dialog" className="modal">
      <div className="modal-box pb-2">
        <p className="text-center text-lg font-semibold">Arrange Exercises</p>
        <div className="mt-2 flex flex-col gap-3">
          {exercises
            .sort((a, b) => a.index - b.index)
            .map((exercise) => {
              return (
                <div
                  key={exercise.id}
                  className="flex justify-between rounded-lg border border-accent p-4"
                >
                  <p>{exercise.name}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        moveUpExercise(exercises, setExercises, exercise);
                        handleClick();
                      }}
                    >
                      <BiUpArrow />
                    </button>
                    <button
                      onClick={() => {
                        moveDownExercise(exercises, setExercises, exercise);
                        handleClick();
                      }}
                    >
                      <BiDownArrow />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const superset_dialog = (
  exercises: ExerciseInfo[],
  superset: SuperSet[],
  setSuperset: React.Dispatch<React.SetStateAction<SuperSet[]>>,
) => {
  return (
    <>
      <input type="checkbox" id="superset_dialog" className="modal-toggle" />
      <div className="modal flex items-center justify-center" role="dialog">
        <div className="modal-box rounded-lg pb-2">
          <p className="text-center text-lg font-semibold">
            Choose SuperSet Exercise
          </p>
          <div
            id="superset_error"
            style={{ display: "none" }}
            className="text-center text-error"
          >
            Please Choose At Least 2 Exercises
          </div>
          <div className="mt-2 flex flex-col gap-3">
            {exercises.map((exercise, index) => (
              <SuperSetExercise
                key={index}
                exercise={exercise}
                index={index}
                superset={superset}
                setSuperset={setSuperset}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-center">
            <button
              className="btn btn-accent"
              onClick={() => {
                const dialog = document.getElementById(
                  "superset_dialog",
                ) as HTMLInputElement | null;
                if (dialog) {
                  if (superset.length < 2 && superset.length !== 0) {
                    document.getElementById("superset_error")!.style.display =
                      "block";
                    return;
                  }
                  dialog.checked = false;
                }
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const smallScreenExerciseDialog = (
  setExercises: React.Dispatch<React.SetStateAction<ExerciseInfo[]>>,
  exercises: ExerciseInfo[],
  setExerciseSets: React.Dispatch<React.SetStateAction<ExerciseSet[]>>,
  exerciseSets: ExerciseSet[],
) => {
  return (
    <dialog id="ss_exercise_modal" className="modal">
      <ExerciseCard
        className="modal-box overflow-hidden rounded"
        onExerciseClick={(exercise: ExerciseInfo): void => {
          // Create a unique ID for each exercise
          const exerciseID = exercise.id + "@" + uuidv4();

          setExercises([
            ...exercises,
            {
              name: exercise.name,
              id: exerciseID,
              restTime: exercise.restTime,
              note: exercise.note,
              custom: exercise.custom,
              index: exercises.length + 1,
              image: exercise.image,
            },
          ]);

          setExerciseSets([
            ...exerciseSets,
            {
              id: exerciseID,
              reps: "",
              weight: "",
              set_type: "NORMAL",
              rpe: "",
              completed: false,
              set_uuid: uuidv4(),
            },
          ]);

          (
            document.getElementById("ss_exercise_modal") as HTMLDialogElement
          ).close();
        }}
      />
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  id: string | undefined,
  workout_id: string | undefined,
  data: string,
  routineName: string,
  globalWeightUnit: string,
  exercises: ExerciseInfo[],
  exerciseSets: ExerciseSet[],
  superset: SuperSet[],
  navigate: NavigateFunction,
  personalRecord: Personal_Record_State[],
): Promise<void> => {
  e.preventDefault();

  let response: Response;
  try {
    if (id && workout_id === undefined) {
      const deleteRoutineExercisesResponse = await fetch(
        config.API_URL + `/api/routine/${id}/exercises`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!deleteRoutineExercisesResponse.ok) {
        const error = await deleteRoutineExercisesResponse.json();
        throw new Error(error.message);
      }

      response = await fetch(config.API_URL + `/api/routine/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: routineName }),
      });
    } else if (id === undefined && workout_id === undefined) {
      // Create routine
      response = await fetch(config.API_URL + `/api/folder/${data}/routine`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: routineName }),
      });
    } else {
      response = (await updateWorkout(
        workout_id!,
        routineName,
      )) as unknown as Response;
    }

    // Error here
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const infoData = await response.json();

    const formattedExercises = exercises.map((exercise) => {
      const sets = exerciseSets
        .filter((set) => {
          if (!workout_id) {
            return set.id === exercise.id;
          } else {
            return set.id === exercise.id && set.completed;
          }
        })
        .map((set, index) => ({
          reps: set.reps ? parseInt(set.reps as string) : null,
          weight: set.weight
            ? globalWeightUnit === "KG"
              ? parseFloat(set.weight as string)
              : parseFloat(set.weight as string) / 2.20462
            : null,
          rpe: set.rpe ? parseFloat(set.rpe as string) : null,
          index: index + 1,
          set_type: set.set_type,
          set_uuid: exercise.id.split("@")[1],
          ...(workout_id
            ? {
                volume:
                  (set.reps ? parseInt(set.reps as string) : 0) *
                  (set.weight
                    ? globalWeightUnit === "KG"
                      ? parseFloat(set.weight as string)
                      : parseFloat(set.weight as string) / 2.20462
                    : 0),
              }
            : {}),
        }));

      return {
        exercise_id: exercise.custom ? undefined : exercise.id.split("@")[0],
        custom_exercise_id: exercise.custom
          ? exercise.id.split("@")[0]
          : undefined,
        routine_uuid: exercise.id.split("@")[1],
        workout_uuid: exercise.id.split("@")[1],
        index: exercise.index,
        rest_timer: exercise.restTime ? parseFloat(exercise.restTime) : null,
        note: exercise.note,
        sets,
      };
    });

    const formattedSuperset = superset?.map((exercise) => ({
      exercise_id: exercise.custom ? undefined : exercise.id.split("@")[0],
      custom_exercise_id: exercise.custom
        ? exercise.id.split("@")[0]
        : undefined,
      workout_uuid: exercise.id.split("@")[1],
      workout_id: workout_id,
      routine_uuid: exercise.id.split("@")[1],
      routine_id: infoData.data.id as string,
    }));

    const filteredFormattedExercises = formattedExercises.filter(
      (exercise) => exercise.sets.length > 0,
    );

    const filteredFormattedSuperset = formattedSuperset?.filter((exercise) =>
      filteredFormattedExercises.some(
        (filteredExercise) =>
          filteredExercise.exercise_id === exercise.exercise_id &&
          filteredExercise.custom_exercise_id === exercise.custom_exercise_id,
      ),
    );

    if (!workout_id) {
      const exercisesResponse = await fetch(
        config.API_URL + `/api/routine/${infoData.data.id}/exercises`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exercises: formattedExercises }),
        },
      );

      if (!exercisesResponse.ok) {
        const error = await exercisesResponse.json();
        throw new Error(error.message);
      }
    } else {
      const exercisesResponse = (await createWorkoutExercises(
        workout_id!,
        filteredFormattedExercises,
      )) as unknown as Response;

      if (!exercisesResponse.ok) {
        const error = await exercisesResponse.json();
        throw new Error(error.message);
      }

      if (personalRecord.length > 0) {
        const prResponse = (await createPersonalRecord(
          personalRecord,
          workout_id,
        )) as unknown as Response;

        if (!prResponse.ok) {
          const error = await prResponse.json();
          throw new Error(error.message);
        }
      }
    }

    if (formattedSuperset.length > 1) {
      if (!workout_id) {
        const routineSuperSetResponse = await fetch(
          config.API_URL + `/api/routine/${infoData.data.id}/superset`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              routine_id: infoData.data.id,
              superset: formattedSuperset.filter((superset) =>
                formattedExercises.some(
                  (exercise) => exercise.routine_uuid === superset.routine_uuid,
                ),
              ),
            }),
          },
        );
        if (!routineSuperSetResponse.ok) {
          const error = await routineSuperSetResponse.json();
          throw new Error(error.message);
        }
      } else {
        if (filteredFormattedSuperset.length > 1) {
          const workoutSuperSetResponse = (await createWorkoutSuperset(
            workout_id!,
            filteredFormattedSuperset,
          )) as unknown as Response;

          if (!workoutSuperSetResponse.ok) {
            const error = await workoutSuperSetResponse.json();
            throw new Error(error.message);
          }
        }
      }
    }
    workout_id ? navigate("/") : navigate("/routines");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }
};
export default RoutineDetails;
