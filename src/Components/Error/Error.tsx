import React from "react";

const Error = ({ message = "Oops, something went wrong" }) => {
  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-5xl">{message}</h1>
    </div>
  );
};

export default Error;
