import React, { useContext } from "react";
// eslint-disable-next-line import/named
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import {
  createRoutineWorkout,
  deleteRoutine,
  deleteWorkout,
  fetchRoutine,
  fetchWorkout,
} from "../../services/Fetchs";
import { useQuery } from "@tanstack/react-query";
import {
  RoutineCustomExercise,
  RoutineExercise,
  RoutineWithInfo,
  WorkoutCustomExercise,
  WorkoutExercise,
  WorkoutWithInfo,
} from "../../Types/Types";
import Loading from "../Loader/Loading";
import ErrorMessage from "../Error/Error";
import { HiDotsVertical } from "react-icons/hi";
import { handleClick } from "../Layout/Navbar";
import { FaDumbbell } from "react-icons/fa";
import { BiNotepad, BiTimer } from "react-icons/bi";
import { IoRepeat } from "react-icons/io5";
import { OnGoingWorkoutContext } from "../../services/Contexts";

const RoutineOverview = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: RoutineData,
    isLoading: routineIsLoading,
    isError: routineIsError,
    isFetched: routineIsFetched,
  } = useQuery<{ data: RoutineWithInfo; success: boolean }>({
    queryKey: ["routine", id],
    queryFn: () => fetchRoutine(id!),
  });

  const {
    data: WorkoutData,
    isLoading: workoutIsLoading,
    isError: workoutIsError,
    isFetched: workoutIsFetched,
  } = useQuery<{ data: WorkoutWithInfo; success: boolean }>({
    queryKey: ["workout", id],
    queryFn: () => fetchWorkout(id!),
  });

  const { onGoingWorkoutDetails } = useContext(OnGoingWorkoutContext);

  const navigate = useNavigate();

  const isWorkoutData = (
    data: RoutineWithInfo | WorkoutWithInfo,
  ): data is WorkoutWithInfo => {
    return "routine_id" in data;
  };

  if (routineIsLoading || workoutIsLoading) return <Loading />;
  if (routineIsError) return <ErrorMessage message="Routine Not Found" />;
  if (workoutIsError) return <ErrorMessage message="Workout Not Found" />;
  if (!RoutineData!.success && !WorkoutData!.success)
    return <ErrorMessage message="Not Found" />;

  if (!routineIsFetched || !workoutIsFetched) return <Loading />;

  const data = RoutineData!.success ? RoutineData!.data : WorkoutData!.data;

  return (
    <>
      {deleteDialog(id!, navigate, isWorkoutData(data) ? "Workout" : "Routine")}
      <div>
        <div className="card border border-accent">
          <div className="card-body">
            <div className="flex items-center justify-between border-b-2 border-accent pb-8">
              <h2>{data?.name}</h2>
              <div className="flex items-center gap-2">
                {!isWorkoutData(data) ? (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      handleClick();
                      if (id) {
                        createRoutineWorkout(id, data.name).then((res) => {
                          if (res) {
                            navigate(`/routine/${id}/${res.id}`);
                          } else {
                            console.error("Failed to create workout");
                          }
                        });
                      }
                    }}
                    disabled={!!onGoingWorkoutDetails?.Workout_ID}
                  >
                    Start Routine
                  </button>
                ) : null}
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button">
                    <HiDotsVertical />
                  </div>
                  <ul className="menu dropdown-content z-[1] w-52 border border-accent bg-base-100 p-2 shadow">
                    {isWorkoutData(data) ? (
                      <li>
                        <button
                          className="text-blue-600"
                          onClick={() => {
                            handleClick();
                            navigate(`/routine/${data.routine_id}/${id}`);
                          }}
                        >
                          Edit Workout
                        </button>
                      </li>
                    ) : (
                      <li>
                        <button
                          className="text-blue-600"
                          onClick={() => {
                            handleClick();
                            navigate(`/routine/${id}`);
                          }}
                        >
                          Edit Routine
                        </button>
                      </li>
                    )}
                    <li>
                      <button
                        className="text-red-600"
                        onClick={() => {
                          handleClick();
                          (
                            document.getElementById(
                              "dialog",
                            ) as HTMLDialogElement
                          )?.showModal();
                        }}
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="my-2">
              <div className="text-lg font-bold">Exercise Overview</div>
            </div>
            <div>
              {isWorkoutData(data)
                ? WorkoutExerciseOverview(data)
                : RoutineExerciseOverview(data)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const deleteDialog = (id: string, navigate: NavigateFunction, name: string) => {
  return (
    <dialog id="dialog" className="modal">
      <div className="modal-box pb-2">
        <p className="text-center text-lg font-semibold">
          Confirm Delete {name}?
        </p>
        <form method="dialog" className="flex justify-center gap-10 py-4">
          <div className="flex gap-3">
            <button className="btn btn-accent text-accent-content">
              Cancel
            </button>
            <button
              className="btn btn-error text-error-content"
              onClick={() => {
                if (name === "Routine") {
                  deleteRoutine(id).then(() => {
                    navigate("/routines");
                  });
                } else if (name === "Workout") {
                  deleteWorkout(id).then(() => {
                    navigate("/");
                  });
                }
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

const RoutineExerciseOverview = (data: RoutineWithInfo) => {
  const exercises = [...data.Routine_Exercise, ...data.Routine_Custom_Exercise];
  return (
    <div className="flex flex-col gap-3">
      {exercises
        .sort((a, b) => a.index - b.index)
        .map((exercise) => {
          const isCustomExercise = "Custom_Exercise" in exercise;
          return (
            <div key={exercise.routine_uuid}>
              {isCustomExercise ? (
                <Exercise
                  image={exercise.Custom_Exercise.image}
                  name={exercise.Custom_Exercise.name}
                  exercise={exercise}
                  set={
                    data.Routine_Set.filter(
                      (set) => set.set_uuid === exercise.routine_uuid,
                    ).length
                  }
                  superset={data.Routine_Superset.some(
                    (routineCustomExercise) =>
                      routineCustomExercise.RoutineSuperset_CustomExercise.some(
                        (superset) =>
                          superset.routine_uuid === exercise.routine_uuid,
                      ),
                  )}
                  maxReps={data.Routine_Set.filter(
                    (set) => set.set_uuid === exercise.routine_uuid,
                  ).reduce((acc, curr) => {
                    if (curr.reps && curr.reps > acc) return curr.reps;
                    return acc;
                  }, 0)}
                  minReps={data.Routine_Set.filter(
                    (set) => set.set_uuid === exercise.routine_uuid,
                  ).reduce((acc, curr) => {
                    if (curr.reps && curr.reps < acc) return curr.reps;
                    return acc;
                  }, 1000)}
                />
              ) : (
                <Exercise
                  image={exercise.Exercise.image}
                  name={exercise.Exercise.name}
                  exercise={exercise}
                  set={
                    data.Routine_Set.filter(
                      (set) => set.set_uuid === exercise.routine_uuid,
                    ).length
                  }
                  superset={data.Routine_Superset.some((routineExercise) =>
                    routineExercise.RoutineSuperset_Exercise.some(
                      (superset) =>
                        superset.routine_uuid === exercise.routine_uuid,
                    ),
                  )}
                  maxReps={data.Routine_Set.filter(
                    (set) => set.set_uuid === exercise.routine_uuid,
                  ).reduce((acc, curr) => {
                    if (curr.reps && curr.reps > acc) return curr.reps;
                    return acc;
                  }, 0)}
                  minReps={data.Routine_Set.filter(
                    (set) => set.set_uuid === exercise.routine_uuid,
                  ).reduce((acc, curr) => {
                    if (curr.reps && curr.reps < acc) return curr.reps;
                    return acc;
                  }, 1000)}
                />
              )}
            </div>
          );
        })}
    </div>
  );
};

const WorkoutExerciseOverview = (data: WorkoutWithInfo) => {
  const exercises = [...data.Workout_Exercise, ...data.Workout_Custom_Exercise];
  return (
    <div className="flex flex-col gap-3">
      {exercises
        .sort((a, b) => a.index - b.index)
        .map((exercise) => {
          const isCustomExercise = "Custom_Exercise" in exercise;
          return (
            <div key={exercise.workout_uuid}>
              {isCustomExercise ? (
                <Exercise
                  image={exercise.Custom_Exercise.image}
                  name={exercise.Custom_Exercise.name}
                  exercise={exercise}
                  set={
                    data.Workout_Sets.filter(
                      (set) => set.set_uuid === exercise.workout_uuid,
                    ).length
                  }
                  superset={data.Workout_Superset.some(
                    (routineCustomExercise) =>
                      routineCustomExercise.WorkoutSuperset_CustomExercise.some(
                        (superset) =>
                          superset.workout_uuid === exercise.workout_uuid,
                      ),
                  )}
                  maxReps={data.Workout_Sets.filter(
                    (set) => set.set_uuid === exercise.workout_uuid,
                  ).reduce((acc, curr) => {
                    if (curr.reps && curr.reps > acc) return curr.reps;
                    return acc;
                  }, 0)}
                  minReps={data.Workout_Sets.filter(
                    (set) => set.set_uuid === exercise.workout_uuid,
                  ).reduce((acc, curr) => {
                    if (curr.reps && curr.reps < acc) return curr.reps;
                    return acc;
                  }, 1000)}
                />
              ) : (
                <Exercise
                  image={exercise.Exercise.image}
                  name={exercise.Exercise.name}
                  exercise={exercise}
                  set={
                    data.Workout_Sets.filter(
                      (set) => set.set_uuid === exercise.workout_uuid,
                    ).length
                  }
                  superset={data.Workout_Superset.some((workoutExercise) =>
                    workoutExercise.WorkoutSuperset_Exercise.some(
                      (superset) =>
                        superset.workout_uuid === exercise.workout_uuid,
                    ),
                  )}
                  maxReps={data.Workout_Sets.filter(
                    (set) => set.set_uuid === exercise.workout_uuid,
                  ).reduce((acc, curr) => {
                    if (curr.reps && curr.reps > acc) return curr.reps;
                    return acc;
                  }, 0)}
                  minReps={data.Workout_Sets.filter(
                    (set) => set.set_uuid === exercise.workout_uuid,
                  ).reduce((acc, curr) => {
                    if (curr.reps && curr.reps < acc) return curr.reps;
                    return acc;
                  }, 1000)}
                />
              )}
            </div>
          );
        })}
    </div>
  );
};

const Exercise = ({
  image,
  name,
  exercise,
  set,
  maxReps,
  minReps,
  superset,
}: {
  image: string | null;
  name: string;
  exercise:
    | RoutineCustomExercise
    | RoutineExercise
    | WorkoutExercise
    | WorkoutCustomExercise;
  set: number;
  superset?: boolean;
  maxReps: number;
  minReps: number;
}) => {
  return (
    <div className="flex items-center gap-5">
      {image ? (
        <img src={image} className="h-12 w-12 rounded-full" alt={name} />
      ) : (
        <FaDumbbell className="h-12 w-12 rounded-full" />
      )}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="font-semibold">{name}</div>
          {superset ? (
            <div className="flex items-center rounded-md bg-accent px-2 text-sm">
              Superset
            </div>
          ) : null}
        </div>
        <div className="opacity-80">{exercise.note}</div>
        <div className="flex gap-1">
          <div className="flex items-center gap-1 rounded border border-accent px-2">
            <BiNotepad />
            {set > 1 ? set + " Sets" : set + " Set"}
          </div>
          <div className="flex items-center gap-1 rounded border border-accent px-2">
            <IoRepeat />
            {minReps >= maxReps
              ? maxReps === 0
                ? "No Reps"
                : maxReps + " Reps"
              : minReps + "-" + maxReps + " Reps"}
          </div>
          <div className="flex items-center gap-1 rounded border border-accent px-2">
            <BiTimer />
            {exercise.rest_timer >= 1
              ? "Rest " +
                exercise.rest_timer.toString().split(".")[0] +
                " min" +
                (exercise.rest_timer.toString().split(".")[1] === "5"
                  ? " 30 sec"
                  : "")
              : exercise.rest_timer === 0
                ? "No Rest"
                : "Rest " + exercise.rest_timer * 100 + " sec"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineOverview;
