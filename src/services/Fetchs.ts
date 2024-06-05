import config from "../config";

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
