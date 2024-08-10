import React from "react";
import ExerciseCard from "../Exercise/ExerciseCard";
import { BiLeftArrowAlt, BiSave, BiTrash } from "react-icons/bi";
import { IoAlert } from "react-icons/io5";
import { Link } from "react-router-dom";
import { ExerciseInfo, ExerciseSet } from "../../Types/Types";
import { HiDotsVertical } from "react-icons/hi";
import { handleClick } from "../Layout/Navbar";
import { v4 as uuidv4 } from "uuid";
import config from "../../config";
import { useQuery } from "@tanstack/react-query";
import { fetchDefaultFolder } from "../../services/Fetchs";
import ErrorMessage from "../Error/Error";
import { WeightUnitContext } from "../../services/Contexts";
import { useNavigate } from "react-router-dom";

const RoutineDetails = () => {
  const [exercises, setExercises] = React.useState<ExerciseInfo[]>([]);
  const [exerciseSets, setExerciseSets] = React.useState<ExerciseSet[]>([]);
  const [routineName, setRoutineName] = React.useState("");
  const { globalWeightUnit } = React.useContext(WeightUnitContext);
  const navigate = useNavigate();

  // Retrieve default folder id
  const { data, isError } = useQuery({
    queryKey: ["defaultFolder"],
    queryFn: fetchDefaultFolder,
  });

  if (isError) {
    return <ErrorMessage />;
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    // Create routine
    try {
      const routineResponse = await fetch(
        config.API_URL + `/api/folder/${data}/routine`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: routineName }),
        },
      );

      if (!routineResponse.ok) {
        const error = await routineResponse.json();
        throw new Error(error.message);
      }

      const routineData = await routineResponse.json();

      const formattedExercises = exercises.map((exercise, index) => {
        const sets = exerciseSets
          .filter((set) => set.id === exercise.id)
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
          }));

        return {
          exercise_id: exercise.custom ? undefined : exercise.id.split("@")[0],
          custom_exercise_id: exercise.custom
            ? exercise.id.split("@")[0]
            : undefined,
          routine_uuid: exercise.id.split("@")[1],
          index: index + 1,
          rest_timer: exercise.restTime ? parseFloat(exercise.restTime) : null,
          note: exercise.note,
          sets,
        };
      });

      const routineExerciseResponse = await fetch(
        config.API_URL + `/api/routine/${routineData.data.id}/exercises`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exercises: formattedExercises }),
        },
      );

      if (!routineExerciseResponse.ok) {
        const error = await routineExerciseResponse.json();
        throw new Error(error.message);
      }

      navigate("/routines");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  return (
    <div className="grid h-full grid-cols-3 gap-10">
      <div className="hidden md:block">
        <ExerciseCard
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
              },
            ]);

            setExerciseSets([
              ...exerciseSets,
              {
                id: exerciseID,
                sets: "",
                reps: "",
                weight: "",
                set_type: "NORMAL",
                rpe: "",
              },
            ]);
          }}
        />
      </div>
      <dialog id="ss_exercise_modal" className="modal">
        <div className="modal-box overflow-hidden rounded-3xl p-0">
          <ExerciseCard
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
                },
              ]);

              setExerciseSets([
                ...exerciseSets,
                {
                  id: exerciseID,
                  sets: "",
                  reps: "",
                  weight: "",
                  set_type: "NORMAL",
                  rpe: "",
                },
              ]);

              (
                document.getElementById(
                  "ss_exercise_modal",
                ) as HTMLDialogElement
              ).close();
            }}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div className="col-span-3 md:col-span-2">
        <form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
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
          <input
            type="text"
            placeholder="Routine Name"
            className="input input-sm input-bordered w-full"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
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
              {exercises.map((exercise, index) => (
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

const Exercise: React.FC<{
  exercise: ExerciseInfo;
  index: number;
  exercises: ExerciseInfo[];
  setExercises: React.Dispatch<React.SetStateAction<ExerciseInfo[]>>;
  exerciseSets: ExerciseSet[];
  setExerciseSets: React.Dispatch<React.SetStateAction<ExerciseSet[]>>;
}> = ({
  exercise,
  index,
  exercises,
  setExercises,
  exerciseSets,
  setExerciseSets,
}) => {
  function removeExercise(index: number): void {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  }

  function addSet(id: string): void {
    const newSet: ExerciseSet = {
      id: id,
      sets: "",
      reps: "",
      weight: "",
      rpe: "",
      set_type: "NORMAL",
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
          {exercise.name}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button">
              <HiDotsVertical />
            </div>
            <ul className="menu dropdown-content z-[1] w-52 border border-accent bg-base-100 p-2 shadow">
              <li>
                <button
                  type="button"
                  onClick={handleClick}
                  className="text-blue-600"
                >
                  Superset
                </button>
              </li>
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
          <option value="0.30">30s</option>
          <option value="0.45">45s</option>
          <option value="1">1m</option>
          <option value="1.50">1m30s</option>
          <option value="2">2m</option>
          <option value="2.50">2m30s</option>
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
}> = ({ exercise, exerciseSets, setExerciseSets }) => {
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
    newValue: number | "NORMAL" | "DROPSET" | "LONG_LENGTH_PARTIAL" | "WARMUP",
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
            <div className="flex flex-col items-center gap-1">
              <span>Weights</span>
              <input
                type="number"
                max={1000}
                className="input input-sm input-accent max-w-20"
                value={set.weight}
                onChange={(e) => {
                  const newWeight =
                    e.target.valueAsNumber > 1000
                      ? 1000
                      : e.target.valueAsNumber;

                  updateSet(setIndex, "weight", newWeight);
                }}
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span>Reps</span>
              <input
                type="number"
                max={100}
                className="input input-sm input-accent max-w-20"
                value={set.reps}
                onChange={(e) => {
                  const newReps =
                    e.target.valueAsNumber > 100 ? 100 : e.target.valueAsNumber;
                  updateSet(setIndex, "reps", newReps);
                }}
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span>RPE</span>
              <input
                type="number"
                max={10}
                className="input input-sm input-accent max-w-10"
                value={set.rpe}
                onChange={(e) => {
                  const newRpe =
                    e.target.valueAsNumber > 10 ? 10 : e.target.valueAsNumber;
                  updateSet(setIndex, "rpe", newRpe);
                }}
              />
            </div>
            <div
              className={`flex items-center ${setIndex === 0 ? "invisible" : null}`}
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

export default RoutineDetails;
