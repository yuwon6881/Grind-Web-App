import React, { useState } from "react";
import config from "../../config/index";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error message
    setError("");

    // Send request to the server
    try {
      const response = await fetch(config.API_URL + "/signIn", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        setEmail("");
        setPassword("");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Login</h1>
      <form
        className="my-10 w-full px-5 md:w-1/2 lg:w-1/3"
        onSubmit={handleSubmit}
      >
        {error && <p className="mb-1 text-sm text-red-500">{error}</p>}
        <input
          type="email"
          className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        />
        <input
          type="password"
          className="mt-3 block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />
        <div className="mt-2 flex justify-end">
          <Link
            className="flex text-sm text-blue-600 underline decoration-blue-600 underline-offset-4 hover:opacity-80"
            to="/register"
          >
            Register
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="my-auto flex h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </Link>
        </div>
        <div className="mt-3 flex justify-center">
          <input
            type="submit"
            className="inline-flex cursor-pointer items-center gap-x-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-600 dark:hover:text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            value="Login"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
