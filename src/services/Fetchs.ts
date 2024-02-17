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
