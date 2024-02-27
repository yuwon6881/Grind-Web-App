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
        setPassword("");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Login</h1>
      <form className="my-10 max-w-lg px-5 md:w-1/2" onSubmit={handleSubmit}>
        {error && <p className="mb-1 text-sm text-red-500">{error}</p>}
        <input
          type="email"
          className="input input-bordered w-full"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        />
        <input
          type="password"
          className="input input-bordered mt-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />
        <div className="mt-2 flex w-full justify-end">
          <Link className="link flex items-center" to="/register">
            Register
            <svg
              className="h-4 w-4 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
        <div className="mt-3 flex justify-center">
          <input type="submit" className="btn" value="Login" />
        </div>
      </form>
    </div>
  );
};

export default Login;
