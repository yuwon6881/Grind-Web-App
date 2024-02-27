import React from "react";
import ExerciseCard from "../Exercise/ExerciseCard";

const RoutineDetails = () => {
  return (
    <div className="grid grid-cols-3 gap-10">
      <div>
        <ExerciseCard />
      </div>
      <div className="col-span-2">a</div>
    </div>
  );
};

export default RoutineDetails;
