import { createContext } from "react";
import { User } from "../Types/Types";

export const ThemeContext = createContext<{
  globalTheme: string | undefined;
  setGlobalTheme:
    | React.Dispatch<React.SetStateAction<string | undefined>>
    | undefined;
}>({ globalTheme: undefined, setGlobalTheme: undefined });

export const WeightUnitContext = createContext<{
  globalWeightUnit: string | undefined;
  setGlobalWeightUnit:
    | React.Dispatch<React.SetStateAction<string | undefined>>
    | undefined;
}>({ globalWeightUnit: undefined, setGlobalWeightUnit: undefined });

export const UserContext = createContext<{
  globalUser: User | undefined;
  setGlobalUser: React.Dispatch<React.SetStateAction<User>> | undefined;
}>({ globalUser: undefined, setGlobalUser: undefined });
