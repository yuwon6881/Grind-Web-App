export type User = {
  name: string;
  profilePicture: string;
};

export type Card = {
  date: string;
  note: string;
  duration: number;
  volume: number;
  record: number;
  exercises: string[];
};

export type Exercise = {
  id: string;
  name: string;
  image: string | null;
  exerciseType: string;
  Exercise_Muscle: ExerciseMuscle[];
};

export type CustomExercise = {
  id: string;
  user_id: string;
  name: string;
  image: string | null;
  exerciseType: string;
  Custom_Exercise_Muscle: ExerciseMuscle[];
  Custom_Muscle_Custom_Exercise: ExerciseCustomMuscle[];
};

export type ExerciseCardProps = {
  onExerciseClick: (exercise: ExerciseInfo) => void;
};

type ExerciseMuscle = {
  muscleType: string;
  Muscle: {
    name: string;
  };
};

type ExerciseCustomMuscle = {
  muscleType: string;
  muscle: {
    name: string;
  };
};

export type ExerciseInfo = {
  name: string;
  custom: boolean;
  restTime: string;
  note: string;
  id: string;
};

export type ExerciseSet = {
  id: string;
  sets: number | string;
  reps: number | string;
  weight: number | string;
  rpe: number | string;
  set_type: "NORMAL" | "DROPSET" | "LONG_LENGTH_PARTIAL" | "WARMUP";
};
