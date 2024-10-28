import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import {
  fetchOnGoingWorkout,
  fetchSettings,
  fetchToken,
  fetchUser,
} from "../services/Fetchs";
import Loading from "../Components/Loader/Loading";
import {
  OnGoingWorkoutContext,
  OnGoingWorkoutInfoContext,
  ThemeContext,
  UserContext,
  WeightUnitContext,
} from "../services/Contexts";
import { useQuery } from "@tanstack/react-query";
import Error from "../Components/Error/Error";
import { setHtmlTheme } from "../Components/Layout/AppLayout";
import { OnGoingWorkout, OnGoingWorkoutInfo } from "../Types/Types";

const ProtectedRoutes: React.FC = () => {
  const [theme, setTheme] = useState<string | undefined>(undefined);
  const [weightUnit, setWeightUnit] = useState<string | undefined>(undefined);
  const [user, setUser] = useState({
    name: "",
    profilePicture: "",
  });
  const [onGoingWorkoutDetails, setOnGoingWorkoutDetails] = useState<
    OnGoingWorkout | undefined
  >(undefined);
  const [onGoingWorkoutInfo, setOnGoingWorkoutInfo] = useState<
    OnGoingWorkoutInfo | undefined
  >(undefined);

  // fetch token
  const {
    tokenData,
    tokenLoading,
    tokenIsStale,
    tokenIsRefetching,
    tokenRefetch,
  } = useToken();

  // fetch settings
  const { settingData, settingLoading, settingIsError, settingIsFetched } =
    useSetting();

  // fetch user name & profile picture
  const { userData, userLoading, userIsError, userIsFetched } = useUser();

  // fetch onGoing workout
  const {
    data: onGoingWorkoutData,
    isLoading: onGoingWorkoutLoading,
    isError: onGoingWorkoutError,
    refetch: onGoingWorkoutRefetch,
    isFetched: onGoingWorkoutIsFetched,
  } = useQuery<{ Workout_ID: string; Routine_ID: string }>({
    queryKey: ["fetchOnGoingWorkout"],
    queryFn: fetchOnGoingWorkout,
    staleTime: 0,
  });

  const location = useLocation();

  useEffect(() => {
    onGoingWorkoutRefetch();
  }, [location.pathname]);

  if (tokenIsStale) if (!tokenIsRefetching) tokenRefetch();

  if (tokenLoading) {
    return <Loading />;
  }

  if (!tokenData) {
    return <Navigate to="/login" />;
  }

  if (settingLoading || userLoading || onGoingWorkoutLoading) {
    return <Loading />;
  }

  if (settingIsError || userIsError || onGoingWorkoutError) {
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

  if (onGoingWorkoutIsFetched) {
    if (onGoingWorkoutDetails?.Workout_ID !== onGoingWorkoutData?.Workout_ID)
      if (onGoingWorkoutData)
        setOnGoingWorkoutDetails({
          Workout_ID: onGoingWorkoutData.Workout_ID,
          Routine_ID: onGoingWorkoutData.Routine_ID,
          currentTimer: 0,
          maxTimer: 0,
        });
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
          <OnGoingWorkoutContext.Provider
            value={{ onGoingWorkoutDetails, setOnGoingWorkoutDetails }}
          >
            <OnGoingWorkoutInfoContext.Provider
              value={{
                onGoingWorkoutInfo: onGoingWorkoutInfo,
                setOnGoingWorkoutInfo: setOnGoingWorkoutInfo,
              }}
            >
              <Outlet />
            </OnGoingWorkoutInfoContext.Provider>
          </OnGoingWorkoutContext.Provider>
        </UserContext.Provider>
      </WeightUnitContext.Provider>
    </ThemeContext.Provider>
  );
};

function useToken() {
  const { data, isLoading, isStale, refetch, isRefetching } = useQuery({
    queryKey: ["fetchToken"],
    queryFn: fetchToken,
    staleTime: 1000 * 60 * 5,
  });

  return {
    tokenData: data,
    tokenLoading: isLoading,
    tokenIsStale: isStale,
    tokenIsRefetching: isRefetching,
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
