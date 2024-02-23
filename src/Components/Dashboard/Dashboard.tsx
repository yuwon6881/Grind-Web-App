import React from "react";
import CardHistory from "./CardHistory";

const Dashboard: React.FC = () => {
  return (
    <div className="mt-4 flex justify-center">
      <div className="container">
        <h2>Dashboard</h2>
        <CardHistory />
      </div>
    </div>
  );
};

export default Dashboard;
