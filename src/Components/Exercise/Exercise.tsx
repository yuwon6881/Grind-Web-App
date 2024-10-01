import React, { useEffect, useState } from "react";
import ExerciseCard from "./ExerciseCard";
import { IoAlert } from "react-icons/io5";
import { fetchCustomExercise, fetchExercise } from "../../services/Fetchs";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loader/Loading";
import { FaDumbbell, FaTimesCircle } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import {
  SingleCustomExercise,
  SingleExercise,
  ExerciseMuscle,
  ExerciseCustomMuscle,
} from "../../Types/Types";
import { WeightUnitContext } from "../../services/Contexts";

const Exercise: React.FC = () => {
  // Exercise states
  const [exerciseID, setExerciseID] = useState("");
  const [custom, setCustom] = useState(false);
  const { globalWeightUnit } = React.useContext(WeightUnitContext);

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
      <dialog id="ss_exercise_modal" className="modal">
        <div className="modal-box overflow-hidden p-0">
          <ExerciseCard
            onExerciseClick={(exercise): void => {
              setExerciseID(exercise.id);
              setCustom(exercise.custom);

              (
                document.getElementById(
                  "ss_exercise_modal",
                ) as HTMLDialogElement
              ).close();
            }}
          />
        </div>
      </dialog>
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
          <div className="mt-3 flex h-full justify-center md:items-center">
            <div className="hidden items-center md:flex">
              <IoAlert />
              Click On An Exercise To See Statistics.
            </div>
            <div className="flex flex-grow-0 flex-col md:hidden">
              <div className="flex items-center">
                <IoAlert />
                Select Exercise To See Statistics.
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
                  Exercise
                </button>
              </div>
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
            {exerciseData &&
              exerciseStatistics(
                exerciseData,
                custom,
                globalWeightUnit!,
                setExerciseID,
              )}
            {customExerciseData &&
              exerciseStatistics(
                customExerciseData,
                custom,
                globalWeightUnit!,
                setExerciseID,
              )}
          </>
        )}
      </div>
    </div>
  );
};

const exerciseStatistics = (
  exerciseData: SingleCustomExercise | SingleExercise,
  custom: boolean,
  globalWeightUnit: string,
  setExerciseID: React.Dispatch<React.SetStateAction<string>>,
) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  );
  const { weightChartData, weightChartOption } = weightChart(
    exerciseData,
    globalWeightUnit,
  );
  const { maxesData, maxesOption } = maxesChart(exerciseData, globalWeightUnit);
  const { volumeData, volumeOption } = volumeChart(
    exerciseData,
    globalWeightUnit,
  );

  return (
    <div className="h-full">
      <div className="flex justify-between border-b-2 border-accent">
        <div className="flex items-center gap-8 p-4">
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
                  <span className="font-semibold">
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
                  <span className="font-semibold">
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
        <div className="flex items-center">
          <button
            onClick={() => {
              setExerciseID("");
            }}
          >
            <FaTimesCircle className="text-2xl" />
          </button>
        </div>
      </div>

      {exerciseData.Workout_Sets.length === 0 ? (
        <div className="flex h-full items-center justify-center pt-4 text-xl font-semibold">
          No Data Found
        </div>
      ) : (
        <div className="p-4">
          <div className="pb-6 text-xl font-semibold">
            Exercise Informations
          </div>
          <Line data={weightChartData} options={weightChartOption} />
          <Line
            className="border-t-2 border-accent"
            data={maxesData}
            options={maxesOption}
          />
          <Line
            className="border-t-2 border-accent"
            data={volumeData}
            options={volumeOption}
          />
        </div>
      )}
    </div>
  );
};

const volumeChart = (
  exerciseData: SingleCustomExercise | SingleExercise,
  globalWeightUnit: string,
) => {
  const workoutSets = exerciseData.Workout_Sets;

  const volumePerDay = new Map<string, number>();

  workoutSets.forEach((set) => {
    const date = new Date(set.Workout.start_date).toLocaleDateString();
    if (!volumePerDay.has(date)) {
      volumePerDay.set(
        date,
        globalWeightUnit === "KG"
          ? Math.round(set.volume)
          : Math.round(set.volume * 2.20462),
      );
    } else {
      volumePerDay.set(date, volumePerDay.get(date)! + set.volume);
    }
  });

  const filteredWorkoutSets = Array.from(volumePerDay.entries());

  const volumeData = {
    labels: filteredWorkoutSets.map((set) => set[0]),
    datasets: [
      {
        label: `Volume (${globalWeightUnit})`,
        data: filteredWorkoutSets.map((set) => set[1]),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const volumeOption = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Volume Over Time",
      },
    },
  };

  return { volumeData, volumeOption };
};

const maxesChart = (
  exerciseData: SingleCustomExercise | SingleExercise,
  globalWeightUnit: string,
) => {
  const workoutSets = exerciseData.Workout_Sets;

  const highestOneRepMaxesPerDay = new Map<
    string,
    { date: string; oneRepMax: number }
  >();

  workoutSets.forEach((set) => {
    const date = new Date(set.Workout.start_date).toLocaleDateString();
    const oneRepMax =
      globalWeightUnit === "KG"
        ? Math.round(set.weight / (1.0278 - 0.0278 * set.reps))
        : Math.round((set.weight / (1.0278 - 0.0278 * set.reps)) * 2.20462);

    if (
      !highestOneRepMaxesPerDay.has(date) ||
      highestOneRepMaxesPerDay.get(date)!.oneRepMax < oneRepMax
    ) {
      highestOneRepMaxesPerDay.set(date, { date, oneRepMax });
    }
  });

  const filteredWorkoutSets = Array.from(highestOneRepMaxesPerDay.values());

  const maxesData = {
    labels: filteredWorkoutSets.map((set) => set.date),
    datasets: [
      {
        label: `One Rep Max (${globalWeightUnit})`,
        data: filteredWorkoutSets.map((set) => set.oneRepMax),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const maxesOption = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "One Rep Maxes Over Time",
      },
    },
  };
  return { maxesData: maxesData, maxesOption: maxesOption };
};

const weightChart = (
  exerciseData: SingleCustomExercise | SingleExercise,
  globalWeightUnit: string,
) => {
  const workoutSets = exerciseData.Workout_Sets;

  const highestWeightPerDay = new Map<
    string,
    { date: string; weight: number }
  >();

  workoutSets.forEach((set) => {
    const date = new Date(set.Workout.start_date).toLocaleDateString();
    if (
      !highestWeightPerDay.has(date) ||
      highestWeightPerDay.get(date)!.weight < set.weight
    ) {
      highestWeightPerDay.set(date, {
        date,
        weight:
          globalWeightUnit === "KG"
            ? Math.round(set.weight)
            : Math.round(set.weight * 2.20462),
      });
    }
  });

  const filteredWorkoutSets = Array.from(highestWeightPerDay.values());

  const weightChartData = {
    labels: filteredWorkoutSets.map((set) => set.date),
    datasets: [
      {
        label: `Weights (${globalWeightUnit})`,
        data: filteredWorkoutSets.map((set) => set.weight),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const weightChartOption = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Weights Distribution Over Time",
      },
    },
  };

  return { weightChartData, weightChartOption };
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
