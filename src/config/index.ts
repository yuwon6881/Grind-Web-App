import merge from "lodash.merge";
import * as testing from "./testing";
import * as dev from "./dev";
import.meta.env.MODE = import.meta.env.MODE || "development";

let envConfig = {};

switch (import.meta.env.MODE) {
  case "test":
    envConfig = testing.default;
    break;
  default:
    envConfig = dev.default;
}

export default merge(
  {
    API_URL: import.meta.env.VITE_API_URL,
  },
  envConfig,
);
