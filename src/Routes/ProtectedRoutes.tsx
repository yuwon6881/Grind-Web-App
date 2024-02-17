import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { fetchSettings, fetchToken, fetchUser } from "../services/Fetchs";
import Loading from "../Components/Loader/Loading";
import {
  ThemeContext,
  UserContext,
  WeightUnitContext,
} from "../services/Contexts";
import { useQuery } from "@tanstack/react-query";
import Error from "../Components/Error/Error";
import { setHtmlTheme } from "../Components/Layout/AppLayout";

const ProtectedRoutes: React.FC = () => {
  const [theme, setTheme] = useState<string | undefined>(undefined);
  const [weightUnit, setWeightUnit] = useState<string | undefined>(undefined);
  const [user, setUser] = useState({ name: "", profilePicture: "" });

  // user token validation
  const { tokenData } = useToken();

  // fetch settings
  const {
    settingData,
    settingLoading,
    settingIsError,
    settingRefetch,
    settingIsFetched,
  } = useSetting();

  // fetch user name & profile picture
  const { userData, userLoading, userIsError, userRefetch, userIsFetched } =
    useUser();

  if (tokenData === undefined) {
    return <Loading />;
  }

  if (!tokenData) {
    return <Navigate to="/login" />;
  }

  // fetch settings and user data
  settingRefetch();
  userRefetch();

  if (settingLoading || userLoading) {
    return <Loading />;
  }

  if (settingIsError || userIsError) {
    return <Error />;
  }

  if (settingIsFetched) {
    if (theme === undefined) {
      if (settingData.theme === "LIGHT") {
        setTheme("acid");
      } else {
        setTheme("halloween");
      }
    }
    if (weightUnit === undefined) {
      setWeightUnit(settingData.weightUnit);
    }
  }

  if (userIsFetched) {
    if (user.name === "" || user.profilePicture === "") {
      setUser({
        name: userData.name,
        profilePicture: userData.profilePicture,
      });
    }
  }

  setHtmlTheme(theme!);

  return (
    <ThemeContext.Provider
      value={{ globalTheme: theme, setGlobalTheme: setTheme }}
    >
      <WeightUnitContext.Provider
        value={{
          globalWeightUnit: weightUnit,
          setGlobalWeightUnit: setWeightUnit,
        }}
      >
        <UserContext.Provider
          value={{ globalUser: user, setGlobalUser: setUser }}
        >
          <Outlet />
        </UserContext.Provider>
      </WeightUnitContext.Provider>
    </ThemeContext.Provider>
  );
};

function useToken() {
  const [data, setData] = useState<boolean | undefined>(undefined);
  fetchToken().then((response) => {
    setData(response);
  });

  return {
    tokenData: data,
  };
}

function useSetting() {
  const { data, isLoading, isError, refetch, isFetched } = useQuery({
    queryKey: ["fetchSettings"],
    queryFn: fetchSettings,
    enabled: false,
  });

  return {
    settingData: data,
    settingLoading: isLoading,
    settingIsError: isError,
    settingRefetch: refetch,
    settingIsFetched: isFetched,
  };
}

function useUser() {
  const { data, isLoading, isError, refetch, isFetched } = useQuery({
    queryKey: ["fetchUser"],
    queryFn: fetchUser,
    enabled: false,
  });

  return {
    userData: data,
    userLoading: isLoading,
    userIsError: isError,
    userRefetch: refetch,
    userIsFetched: isFetched,
  };
}

export default ProtectedRoutes;
