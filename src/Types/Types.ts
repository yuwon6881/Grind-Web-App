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

export type ExerciseMuscle = {
  muscleType: string;
  Muscle: {
    name: string;
  };
};

export type ExerciseCustomMuscle = {
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

type ExerciseForWorkoutHistory = {
  id: string;
  name: string;
  image: string | null;
  exerciseType: string;
};

type CustomExerciseForWorkoutHistory = {
  id: string;
  name: string;
  image: string | null;
  exerciseType: string;
  user_id: string;
};

type WorkoutExercise = {
  workout_id: string;
  exercise_id: string;
  workout_uuid: string;
  index: number;
  rest_timer: number;
  note: string;
  Exercise: ExerciseForWorkoutHistory;
};

type WorkoutCustomExercise = {
  workout_id: string;
  custom_exercise_id: string;
  workout_uuid: string;
  index: number;
  rest_timer: number;
  note: string;
  Custom_Exercise: CustomExerciseForWorkoutHistory;
};

type PersonalRecord = {
  id: string;
  workout_set_id: string;
};

type WorkoutSet = {
  id: string;
  weight: number;
  reps: number;
  rpe: number;
  volume: number;
  index: number;
  set_type: string;
  workout_id: string;
  exercise_id: string | null;
  custom_exercise_id: string | null;
  set_uuid: string;
  Personal_Record: PersonalRecord | null;
};

type WorkoutSetWithWorkoutDate = {
  weight: number;
  reps: number;
  volume: number;
  Workout: {
    start_date: string;
  };
};

export type Workout = {
  id: string;
  start_date: string;
  end_date: string | null;
  name: string;
  duration: number | null;
  status: string;
  routine_id: string;
  Workout_Exercise: WorkoutExercise[];
  Workout_Custom_Exercise: WorkoutCustomExercise[];
  Workout_Sets: WorkoutSet[];
};

export type SingleCustomExercise = {
  id: string;
  name: string;
  image: string | null;
  exerciseType: string;
  Custom_Exercise_Muscle: ExerciseMuscle[];
  Custom_Muscle_Custom_Exercise: ExerciseCustomMuscle[];
  Workout_Sets: WorkoutSetWithWorkoutDate[];
};

export type SingleExercise = {
  id: string;
  name: string;
  image: string | null;
  exerciseType: string;
  Exercise_Muscle: ExerciseMuscle[];
  Workout_Sets: WorkoutSetWithWorkoutDate[];
};

export type SuperSet = {
  id: string;
  custom: boolean;
};

export type folders = {
  name: string;
  index: number;
  id: string;
};
