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
    <form className="flex flex-col items-center gap-8" onSubmit={handleForm}>
      <label
        htmlFor="fileInput"
        className="avatar placeholder relative cursor-pointer"
      >
        <input
          type="file"
          id="fileInput"
          className="absolute h-0 w-0 opacity-0"
          value={user.profilePicture ? user.profilePicture : ""}
          onChange={(e) => setUser({ ...user, profilePicture: e.target.value })}
        />
        <div className="w-36 rounded-full bg-neutral text-neutral-content">
          <span className="text-7xl">C</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 rounded-full bg-black bg-opacity-50 py-1 text-center text-white opacity-0 transition-opacity duration-200 hover:opacity-100">
          Click to upload
        </div>
      </label>
      <label className="input input-bordered flex items-center gap-3">
        Name:
        <input
          type="text"
          className="grow border-0 bg-base-100"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
      </label>
      <input type="submit" className="btn btn-accent" />
    </form>
  );
};

export default Profile;
