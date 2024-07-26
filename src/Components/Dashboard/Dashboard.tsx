import React from "react";
import CardHistory from "./CardHistory";
import Calendar from "react-calendar";

const Dashboard: React.FC = () => {
  const getTileClassName = ({ date }: { date: Date }) => {
    if (date.getDate() === 25 && date.getMonth() + 1 === 6) {
      return "bg-base-300";
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="mt-6 grid grid-cols-3 gap-10">
        <div className="order-2 col-span-3 mb-4 space-y-4 lg:order-1 lg:col-span-2">
          <CardHistory />
        </div>
        <div className="order-1 col-span-3 mx-auto lg:order-2 lg:col-span-1">
          <Calendar tileClassName={getTileClassName} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
