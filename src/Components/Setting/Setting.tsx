import React from "react";
import Preferences from "./Preferences";
import Profile from "./Profile";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("profile");
  return (
    <div className="card mt-8 w-auto border border-accent md:mx-32 xl:mx-96">
      <div className="card-body">
        <div className="mb-6 flex justify-between">
          <div className="col-span-12 md:col-span-4">
            <h5>Settings</h5>
          </div>
          <div className="col-span-12 md:col-span-8">
            <div role="tablist" className="tabs-boxed tabs">
              <button
                role="tab"
                className={`tab ${activeTab === "profile" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                role="tab"
                className={`tab ${
                  activeTab === "preferences" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("preferences")}
              >
                Preferences
              </button>
            </div>
          </div>
        </div>
        {activeTab === "profile" ? <Profile /> : <Preferences />}
      </div>
    </div>
  );
};

export default Settings;
