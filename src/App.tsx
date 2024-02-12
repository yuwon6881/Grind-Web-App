import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth/Auth";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GuestRoute from "./Routes/GuestRoutes";
import Navbar from "./Components/Layout/Navbar";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Navbar />} />
            </Route>
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Auth path="login" />} />
              <Route path="/register" element={<Auth path="register" />} />
            </Route>
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
