import React, { useContext, useState } from "react";
import { UserContext } from "../../services/Contexts";
import { updateUser } from "../../services/Fetchs";

const Profile: React.FC = () => {
  const { globalUser, setGlobalUser } = useContext(UserContext);
  const [user, setUser] = useState(globalUser!);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;

    const file = fileInput.files?.[0];

    const formData = new FormData();

    if (file) {
      formData.append("profilePicture", file);
    }

    formData.append("name", user.name);

    const response = await updateUser(formData);

    if (response.ok) {
      if (setGlobalUser) setGlobalUser(user);
      const successMessage = document.getElementById("successMessage");
      if (successMessage) {
        successMessage.style.display = "block";
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 3000);
      }
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  };
  return (
    <form className="flex flex-col items-center gap-8" onSubmit={handleForm}>
      <label
        htmlFor="fileInput"
        className="avatar placeholder relative cursor-pointer"
      >
        <div>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="absolute h-0 w-0 opacity-0"
            onChange={handleFileChange}
          />
        </div>
        {user!.profilePicture ? (
          <img
            src={user!.profilePicture}
            alt="User Profile"
            className="rounded-full"
            style={{ width: "144px", height: "144px" }}
          />
        ) : (
          <div className="w-36 rounded-full bg-neutral text-neutral-content">
            <span className="text-7xl">{globalUser!.name.charAt(0)}</span>
          </div>
        )}
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
      <span
        id="successMessage"
        className="text-success"
        style={{ display: "none" }}
      >
        Changes Saved
      </span>
    </form>
  );
};

export default Profile;
