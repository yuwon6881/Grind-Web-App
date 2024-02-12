import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import fetchToken from "../services/auth/FetchToken";
import Loading from "../Components/Loader/Loading";

const ProtectedRoutes: React.FC = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    fetchToken().then((valid): void => {
      setIsValid(valid);
    });
  }, []);

  if (isValid === null) {
    return <Loading />;
  }

  if (!isValid) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
