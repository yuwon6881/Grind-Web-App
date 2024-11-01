import config from "../config";
import { Personal_Record_State } from "../Types/Types";

export const fetchToken = async () => {
  try {
    const response = await fetch(config.API_URL + "/verifyJWT", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok)
      throw new Error(`Failed to fetch token, status: ${response.status}`);
    const data: { success: boolean } = await response.json();
    return data.success;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchSettings = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/setting", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to fetch settings, status: ${response.status}`);

    const data = await response.json();
    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchUser = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/user", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to fetch user, status: ${response.status}`);

    const data = await response.json();
    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchExercises = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/exercises", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to fetch exercises, status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchCustomExercises = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/custom_exercises", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(
        `Failed to fetch custom exercises, status: ${response.status}`,
      );

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchMuscles = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/muscles", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to fetch muscles, status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchCustomMuscles = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/custom_muscles", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(
        `Failed to fetch custom muscles, status: ${response.status}`,
      );

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchDefaultFolder = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/defaultFolder", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(
        `Failed to fetch default folder, status: ${response.status}`,
      );

    const data = await response.json();
    return data.data.id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchRoutinesWithFolders = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/routines", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to fetch routines, status: ${response.status}`);

    const data = await response.json();
    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchFolders = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/folders", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to fetch folders, status: ${response.status}`);

    const data = await response.json();
    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const deleteRoutine = async (id: string) => {
  try {
    const response = await fetch(config.API_URL + "/api/routine/" + id, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to delete routine, status: ${response.status}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const deleteFolder = async (id: string) => {
  try {
    const response = await fetch(config.API_URL + "/api/folder/" + id, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to delete folder, status: ${response.status}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const addFolder = async (name: string) => {
  try {
    const response = await fetch(config.API_URL + "/api/folder", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok)
      throw new Error(`Failed to add folder, status: ${response.status}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const updateUser = async (formData: FormData): Promise<Response> => {
  try {
    const response = await fetch(config.API_URL + "/api/user", {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    if (!response.ok)
      throw new Error(`Failed to edit profile, status: ${response.status}`);

    return response;
  } catch (error: unknown) {
    return Promise.reject(new Error("An unknown error occurred"));
  }
};

export const fetchWorkouts = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/workouts", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to fetch workouts, status: ${response.status}`);

    const data = await response.json();
    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const deleteCustomExercise = async (id: string) => {
  try {
    const response = await fetch(
      config.API_URL + "/api/custom_exercise/" + id,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!response.ok)
      throw new Error(`Failed to delete exercise, status: ${response.status}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchExercise = async (id: string) => {
  try {
    const response = await fetch(config.API_URL + "/api/exercise/" + id, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to fetch exercise, status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchCustomExercise = async (id: string) => {
  try {
    const response = await fetch(
      config.API_URL + "/api/custom_exercise/" + id,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok)
      throw new Error(
        `Failed to fetch custom exercise, status: ${response.status}`,
      );

    const data = await response.json();
    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchRoutine = async (id: string) => {
  try {
    const response = await fetch(config.API_URL + "/api/routine/" + id, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to fetch routine, status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchWorkout = async (id: string) => {
  try {
    const response = await fetch(config.API_URL + "/api/workout/" + id, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to fetch workout, status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const createRoutineWorkout = async (
  routine_id: string,
  name: string,
) => {
  try {
    const response = await fetch(
      config.API_URL + `/api/routine/${routine_id}/workout`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      },
    );

    if (!response.ok)
      throw new Error(`Failed to create workout, status: ${response.status}`);

    const data = await response.json();
    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const deleteWorkout = async (id: string) => {
  try {
    const response = await fetch(config.API_URL + "/api/workout/" + id, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to delete workout, status: ${response.status}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const getWorkout = async (id: string) => {
  try {
    const response = await fetch(config.API_URL + "/api/workout/" + id, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(`Failed to fetch workout, status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchOnGoingWorkout = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/workoutInProgress", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(
        `Failed to fetch on going workout, status: ${response.status}`,
      );

    const data = await response.json();
    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const updateWorkout = async (id: string, name: string) => {
  try {
    const response = await fetch(config.API_URL + "/api/workout/" + id, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok)
      throw new Error(`Failed to update workout, status: ${response.status}`);

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const createWorkoutExercises = async (
  workout_id: string,
  exercises: {
    exercise_id: string | undefined;
    custom_exercise_id: string | undefined;
    routine_uuid: string;
    index: number;
    rest_timer: number | null;
    note: string;
    sets: {
      reps: number | null;
      weight: number | null;
      rpe: number | null;
      index: number;
      set_type: "NORMAL" | "DROPSET" | "LONG_LENGTH_PARTIAL" | "WARMUP";
      set_uuid: string;
      volume?: number | undefined;
    }[];
  }[],
) => {
  try {
    const response = await fetch(
      config.API_URL + `/api/workout/${workout_id}/exercises`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exercises }),
      },
    );

    if (!response.ok)
      throw new Error(
        `Failed to create workout exercises, status: ${response.status}`,
      );

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const createWorkoutSuperset = async (
  workout_id: string,
  superset: {
    exercise_id: string | undefined;
    custom_exercise_id: string | undefined;
    routine_uuid: string;
    routine_id: string;
  }[],
) => {
  try {
    const response = await fetch(
      config.API_URL + `/api/workout/${workout_id}/superset`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workout_id: workout_id,
          superset: superset,
        }),
      },
    );

    if (!response.ok)
      throw new Error(
        `Failed to create workout superset, status: ${response.status}`,
      );

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchPersonalRecords = async () => {
  try {
    const response = await fetch(config.API_URL + "/api/personal_records", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok)
      throw new Error(
        `Failed to fetch personal records, status: ${response.status}`,
      );

    const data = await response.json();
    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const fetchSets = async (set_id: string) => {
  try {
    const response = await fetch(
      config.API_URL + "/api/personal_record_set/" + set_id,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok)
      throw new Error(`Failed to fetch sets, status: ${response.status}`);

    const data = await response.json();
    return data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};

export const createPersonalRecord = async (
  personal_record: Personal_Record_State[],
  workout_id: string,
) => {
  try {
    const response = await fetch(
      config.API_URL + `/api/personal_record/${workout_id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ personal_record }),
      },
    );

    if (!response.ok)
      throw new Error(
        `Failed to create personal record, status: ${response.status}`,
      );

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
  }
};
