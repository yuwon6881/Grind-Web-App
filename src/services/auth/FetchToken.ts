import config from "../../config";

const fetchToken = async () => {
  const response = await fetch(config.API_URL + "/verifyJWT", {
    method: "GET",
    credentials: "include",
  });
  const data: { success: boolean } = await response.json();
  return data.success;
};

export default fetchToken;
