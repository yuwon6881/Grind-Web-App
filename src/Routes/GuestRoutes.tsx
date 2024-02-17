import React from "react";
import { fetchToken } from "../services/Fetchs";
import Loading from "../Components/Loader/Loading";
import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Error from "../Components/Error/Error";

const GuestRoute: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchToken"],
    queryFn: fetchToken,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  if (data) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default GuestRoute;
