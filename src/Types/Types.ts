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
  className?: string;
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
  image: string | null;
  custom: boolean;
  restTime: string;
  note: string;
  id: string;
  index: number;
};

export type ExerciseSet = {
  id: string;
  set_uuid: string;
  reps: number | string;
  weight: number | string;
  rpe: number | string;
  set_type: "NORMAL" | "DROPSET" | "LONG_LENGTH_PARTIAL" | "WARMUP";
  completed: boolean;
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
  duration: number;
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

export type routine = {
  folder_id: string;
  name: string;
  id: string;
  index: number;
};

export type RoutineExercise = {
  routine_id: string;
  exercise_id: string;
  routine_uuid: string;
  index: number;
  rest_timer: number;
  note: string;
  Exercise: {
    name: string;
    image: string | null;
  };
};

export type RoutineCustomExercise = {
  routine_id: string;
  custom_exercise_id: string;
  routine_uuid: string;
  index: number;
  rest_timer: number;
  note: string;
  Custom_Exercise: {
    name: string;
    image: string | null;
  };
};

export type RoutineSet = {
  id: string;
  weight: number | null;
  reps: number | null;
  rpe: number | null;
  index: number;
  set_type: string;
  routine_id: string;
  exercise_id: string | null;
  custom_exercise_id: string | null;
  set_uuid: string;
};

type RoutineSuperset_Exercise = {
  id: string;
  supersets_id: string;
  routine_uuid: string;
};

type RoutineSuperset_CustomExercise = {
  id: string;
  supersets_id: string;
  routine_uuid: string;
};

type WorkoutSuperset_Exercise = {
  id: string;
  supersets_id: string;
  workout_uuid: string;
};

type WorkoutSuperset_CustomExercise = {
  id: string;
  supersets_id: string;
  workout_uuid: string;
};

export type RoutineSuperset = {
  id: string;
  routine_id: string;
  RoutineSuperset_Exercise: RoutineSuperset_Exercise[];
  RoutineSuperset_CustomExercise: RoutineSuperset_CustomExercise[];
};

export type RoutineWithInfo = {
  id: string;
  name: string;
  index: number;
  folder_id: string;
  Routine_Exercise: RoutineExercise[];
  Routine_Custom_Exercise: RoutineCustomExercise[];
  Routine_Set: RoutineSet[];
  Routine_Superset: RoutineSuperset[];
};

export type WorkoutSuperset = {
  id: string;
  routine_id: string;
  WorkoutSuperset_Exercise: WorkoutSuperset_Exercise[];
  WorkoutSuperset_CustomExercise: WorkoutSuperset_CustomExercise[];
};

export type WorkoutWithInfo = {
  id: string;
  name: string;
  index: number;
  routine_id: string;
  duration: number | null;
  end_date: Date | null;
  status: "COMPLETED" | "IN_PROGRESS";
  Workout_Exercise: WorkoutExercise[];
  Workout_Custom_Exercise: WorkoutCustomExercise[];
  Workout_Sets: WorkoutSet[];
  Workout_Superset: WorkoutSuperset[];
};

export type InputFieldProps = {
  label: string;
  max: number;
  value: number | string;
  onChange: (value: number | string) => void;
  className?: string;
};

export type OnGoingWorkout = {
  Workout_ID: string;
  Routine_ID: string;
  currentTimer: number;
  maxTimer: number;
};

export type WorkoutInfo = {
  start_date: Date;
  status: "COMPLETED" | "IN_PROGRESS";
};

export type OnGoingWorkoutInfo = {
  Exercise: ExerciseInfo[];
  ExerciseSet: ExerciseSet[];
  Superset: SuperSet[];
  WorkoutName: string;
};
