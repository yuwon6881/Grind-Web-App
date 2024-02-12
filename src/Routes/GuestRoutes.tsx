import React, { useEffect, useState } from "react";
import fetchToken from "../services/auth/FetchToken";
import Loading from "../Components/Loader/Loading";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute: React.FC = () => {
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    fetchToken().then((valid): void => {
      setValid(valid);
    });
  }, []);

  if (valid === null) {
    return <Loading />;
  }

  if (valid) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default GuestRoute;
