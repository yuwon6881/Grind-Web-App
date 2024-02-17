import React, { useContext, useState } from "react";
import config from "../../config";
import { ThemeContext, WeightUnitContext } from "../../services/Contexts";
import { useNavigate } from "react-router-dom";

const Preferences = () => {
  const [theme, setTheme] = useState<string | undefined>(undefined);
  const [weightUnit, setWeightUnit] = useState<string | undefined>(undefined);
  const { globalTheme, setGlobalTheme } = useContext(ThemeContext);
  const { globalWeightUnit, setGlobalWeightUnit } =
    useContext(WeightUnitContext);
  const navigate = useNavigate();

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send request to the server
      const response = await fetch(config.API_URL + "/api/setting", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme,
          weightUnit,
        }),
      });

      // Check if the request was successful
      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
        }
        throw new Error("Failed to update settings");
      }

      // Update the global state
      if (setGlobalTheme && theme) {
        switch (theme) {
          case "LIGHT":
            setGlobalTheme("acid");
            break;
          case "DARK":
            setGlobalTheme("halloween");
            break;
        }
      }

      if (setGlobalWeightUnit && weightUnit) {
        setGlobalWeightUnit(weightUnit);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  if (theme === undefined && weightUnit === undefined) {
    if (globalTheme === "halloween") {
      setTheme("DARK");
    } else {
      setTheme("LIGHT");
    }
    setWeightUnit(globalWeightUnit);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleForm}>
      <label className="form-control">
        Theme:
        <select
          className="select select-bordered w-auto max-w-lg"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="LIGHT">Light</option>
          <option value="DARK">Dark</option>
        </select>
      </label>
      <label className="form-control">
        Weight Unit:
        <select
          className="select select-bordered w-auto max-w-lg"
          value={weightUnit}
          onChange={(e) => setWeightUnit(e.target.value)}
        >
          <option value="KG">Kg</option>
          <option value="LB">Lb</option>
        </select>
      </label>
      <div className="mt-4 flex justify-center">
        <input type="submit" value="Apply" className="btn" />
      </div>
    </form>
  );
};

export default Preferences;
