import React from "react";

const Loading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="loading loading-ring loading-lg">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
