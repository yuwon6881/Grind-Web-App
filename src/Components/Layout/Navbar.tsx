import React from "react";
import config from "../../config";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const signOut = async () => {
    const response = await fetch(config.API_URL + "/api/userSignOut", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      navigate("/login");
    }
  };
  return (
    <div>
      HOME
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default Navbar;
