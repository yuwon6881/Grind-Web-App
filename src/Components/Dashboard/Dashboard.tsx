import React, { useState } from "react";
import CardHistory from "./CardHistory";
import Calendar from "react-calendar";
import { fetchWorkouts } from "../../services/Fetchs";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loader/Loading";
import { Workout } from "../../Types/Types";
import { BiRefresh } from "react-icons/bi";

const Dashboard: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  const [filterDate, setFilterDate] = useState<string | null>(null);

  const getTileClassName = ({ date }: { date: Date }) => {
    if (data) {
      for (const workout of data) {
        if (
          date.getDate() === new Date(workout.start_date).getDate() &&
          date.getMonth() === new Date(workout.start_date).getMonth() &&
          workout.status === "COMPLETED"
        ) {
          return "bg-base-300";
        }
      }
    }
    return "bg-default";
  };

  const handleDayClick = (value: Date) => {
    if (data) {
      for (const workout of data) {
        if (
          value.getDate() === new Date(workout.start_date).getDate() &&
          value.getMonth() === new Date(workout.start_date).getMonth() &&
          workout.status === "COMPLETED"
        ) {
          setFilterDate(workout.start_date);
        }
      }
    }
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
          {filterDate && (
            <div className="flex gap-2 font-semibold">
              Selected Date: {new Date(filterDate).toLocaleDateString()}
              <button
                className="flex items-center rounded-full bg-accent text-2xl"
                onClick={() => {
                  setFilterDate(null);
                }}
              >
                <BiRefresh />
              </button>
            </div>
          )}
          {data &&
            data
              .filter((workout: Workout) => workout.status == "COMPLETED")
              .map((workout: Workout) =>
                filterDate === null ? (
                  <CardHistory key={workout.id} data={workout} />
                ) : workout.start_date === filterDate ? (
                  <CardHistory key={workout.id} data={workout} />
                ) : null,
              )}
        </div>
        <div className="order-1 col-span-3 mx-auto lg:order-2 lg:col-span-1">
          <Calendar
            tileClassName={getTileClassName}
            onClickDay={handleDayClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
