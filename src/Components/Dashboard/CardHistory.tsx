import React from "react";
import { Card } from "../../Types/Types";
import { FaTrophy } from "react-icons/fa";

const CardHistory: React.FC = () => {
  return (
    <div className="card w-1/2 overflow-hidden border border-accent">
      <div className="card-body">
        <div className="flex flex-col gap-8">
          <div className="avatar placeholder h-12 items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-neutral text-neutral-content">
              <span className="text-2xl">C</span>
            </div>
            <div className="flex flex-col">
              <h2 className="card-title">Username</h2>
              <span className="text-sm">Date</span>
            </div>
          </div>
          <div className="items-center justify-between lg:flex">
            <h6 className="mb-2 lg:mb-0">Note</h6>
            <div className="flex gap-4">
              <div>
                <div>
                  <span className="text-sm">Duration</span>
                  <h6>Hour, Minutes</h6>
                </div>
              </div>
              <div>
                <div>
                  <span className="text-sm">Volume</span>
                  <h6>111000kg</h6>
                </div>
              </div>
              <div>
                <div>
                  <span className="text-sm">Record</span>
                  <div className="flex items-center gap-1">
                    <FaTrophy />
                    <h6>6</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider m-0"></div>
      </div>
    </div>
  );
};

export default CardHistory;
