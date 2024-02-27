import React from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../config";
const Register: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send request to the server
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const response = await fetch(config.API_URL + "/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, confirmPassword }),
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
        setConfirmPassword("");
      }
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h1>Register</h1>
      <form
        className="my-10 w-full max-w-lg px-5 md:w-1/2"
        onSubmit={handleSubmit}
      >
        {error && <p className="mb-1 text-sm text-red-500">{error}</p>}
        <input
          type="text"
          className="input input-bordered mt-2 w-full"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={true}
        />
        <input
          type="email"
          className="input input-bordered mt-2 w-full"
          placeholder="Email"
          value={email}
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
        <input
          type="password"
          className="input input-bordered mt-2 w-full"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required={true}
        />
        <div className="mt-2 flex justify-end">
          <Link className="link flex items-center" to="/login">
            Login
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
          <input type="submit" className="btn" value="Register" />
        </div>
      </form>
    </div>
  );
};

export default Register;
