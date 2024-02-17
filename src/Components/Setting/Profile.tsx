import React, { useContext, useState } from "react";
import { UserContext } from "../../services/Contexts";

const Profile: React.FC = () => {
  const { globalUser, setGlobalUser } = useContext(UserContext);
  const [user, setUser] = useState(globalUser!);
  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (setGlobalUser) setGlobalUser(user);
  };
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="avatar placeholder">
        <div className="w-36 rounded-full bg-neutral text-neutral-content">
          <span className="text-7xl">C</span>
        </div>
      </div>
      <form className="flex flex-col items-center gap-4" onSubmit={handleForm}>
        <label className="input input-bordered flex items-center gap-2">
          Name:
          <input
            type="text"
            className="grow border-0 bg-base-100"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </label>
        <input type="submit" className="btn" />
      </form>
    </div>
  );
};

export default Profile;
