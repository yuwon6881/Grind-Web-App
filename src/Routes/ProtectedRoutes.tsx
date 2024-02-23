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
  const [user, setUser] = useState({
    name: "",
    profilePicture: "",
  });

  // fetch token
  const { tokenData, tokenLoading, tokenIsStale, tokenRefetch } = useToken();

  // fetch settings
  const { settingData, settingLoading, settingIsError, settingIsFetched } =
    useSetting();

  // // fetch user name & profile picture
  const { userData, userLoading, userIsError, userIsFetched } = useUser();

  if (tokenIsStale) tokenRefetch();

  if (tokenLoading) {
    return <Loading />;
  }

  if (!tokenData) {
    return <Navigate to="/login" />;
  }

  if (settingLoading || userLoading) {
    return <Loading />;
  }

  if (settingIsError || userIsError) {
    return <Error />;
  }

  if (settingIsFetched) {
    if (theme === undefined) {
      if (settingData.theme === "LIGHT") {
        setTheme("nord");
      } else {
        setTheme("black");
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
  const { data, isLoading, isStale, refetch } = useQuery({
    queryKey: ["fetchToken"],
    queryFn: fetchToken,
    staleTime: 1000 * 60 * 5,
  });

  return {
    tokenData: data,
    tokenLoading: isLoading,
    tokenIsStale: isStale,
    tokenRefetch: refetch,
  };
}

function useSetting() {
  const { data, isLoading, isError, isFetched } = useQuery({
    queryKey: ["fetchSettings"],
    queryFn: fetchSettings,
    staleTime: Infinity,
  });

  return {
    settingData: data,
    settingLoading: isLoading,
    settingIsError: isError,
    settingIsFetched: isFetched,
  };
}

function useUser() {
  const { data, isLoading, isError, isFetched } = useQuery({
    queryKey: ["fetchUser"],
    queryFn: fetchUser,
    staleTime: Infinity,
  });

  return {
    userData: data,
    userLoading: isLoading,
    userIsError: isError,
    userIsFetched: isFetched,
  };
}

export default ProtectedRoutes;
