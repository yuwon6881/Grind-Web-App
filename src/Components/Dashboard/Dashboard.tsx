import React from "react";
import CardHistory from "./CardHistory";
import Calendar from "react-calendar";
import { fetchWorkouts } from "../../services/Fetchs";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loader/Loading";
import { Workout } from "../../Types/Types";

const Dashboard: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  const getTileClassName = ({ date }: { date: Date }) => {
    if (data) {
      for (const workout of data) {
        if (
          date.getDate() === new Date(workout.start_date).getDate() &&
          date.getMonth() === new Date(workout.start_date).getMonth()
        ) {
          return "bg-base-300";
        }
      }
    }
    return "bg-default";
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="mt-6 grid grid-cols-3 gap-10">
        <div className="order-2 col-span-3 mb-4 space-y-4 lg:order-1 lg:col-span-2">
          {isLoading && <Loading />}
          {error && (
            <div className="text-center text-red-500">
              Failed to load workout history
            </div>
          )}
          {data &&
            data
              .filter((workout: Workout) => workout.status == "IN_PROGRESS")
              .map((workout: Workout) => (
                <CardHistory key={workout.id} data={workout} />
              ))}
        </div>
        <div className="order-1 col-span-3 mx-auto lg:order-2 lg:col-span-1">
          <Calendar tileClassName={getTileClassName} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
