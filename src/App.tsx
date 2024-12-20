import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth/Auth";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GuestRoute from "./Routes/GuestRoutes";
import AppLayout from "./Components/Layout/AppLayout";
import Error from "./Components/Error/Error";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<AppLayout component="dashboard" />} />
              <Route
                path="/settings"
                element={<AppLayout component="settings" />}
              />
              <Route
                path="/routines"
                element={<AppLayout component="routines" />}
              />
              <Route
                path="/routine"
                element={<AppLayout component="routine" />}
              />
              <Route
                path="/routine/:id"
                element={<AppLayout component="routine" />}
              />
              <Route
                path="/routine/:id/:workout_id"
                element={<AppLayout component="routine" />}
              />
              <Route
                path="/exercises"
                element={<AppLayout component="exercises" />}
              />
              <Route
                path="/routineOverview/:id"
                element={<AppLayout component="routineOverview" />}
              />
              <Route
                path="/workoutOverview/:id"
                element={<AppLayout component="routineOverview" />}
              />
            </Route>
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Auth path="login" />} />
              <Route path="/register" element={<Auth path="register" />} />
            </Route>
            <Route path="*" element={Error({ message: "Page Not Found" })} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
