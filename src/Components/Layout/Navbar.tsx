import React, { useContext, useRef } from "react";
import config from "../../config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoDark from "../../Assets/logo_dark.png";
import logoLight from "../../Assets/logo_light.png";
import {
  OnGoingWorkoutContext,
  ThemeContext,
  UserContext,
} from "../../services/Contexts";
import { BiArrowToBottom, BiArrowToTop } from "react-icons/bi";
import { deleteWorkout } from "../../services/Fetchs";
import { useQueryClient } from "@tanstack/react-query";
import audioFile from "../../Assets/rest_timer_sound.mp3";

export const handleClick = () => {
  const elem = document.activeElement as HTMLElement;
  if (elem) {
    elem.blur();
  }
};

const Navbar: React.FC = () => {
  //Sign out function
  const navigate = useNavigate();
  const audio = new Audio(audioFile);
  const [isCollapseOpen, setIsCollapseOpen] = React.useState(true);
  const { globalTheme } = useContext(ThemeContext);
  const { globalUser } = useContext(UserContext);
  const { onGoingWorkoutDetails, setOnGoingWorkoutDetails } = useContext(
    OnGoingWorkoutContext,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const queryClient = useQueryClient();
  const isRoutinePath = /^\/routine\/[^/]+\/[^/]+$/.test(location.pathname);

  // Rest Timer
  React.useEffect(() => {
    if (onGoingWorkoutDetails!.currentTimer > 0) {
      intervalRef.current = setInterval(() => {
        setOnGoingWorkoutDetails!((prev) => {
          if (prev!.currentTimer - 1 <= 0) {
            clearInterval(intervalRef.current!);
            audio.play();
            return {
              ...prev!,
              currentTimer: 0,
            };
          }
          return {
            ...prev!,
            currentTimer: prev!.currentTimer - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onGoingWorkoutDetails!.currentTimer]);

  const signOut = async () => {
    try {
      const response = await fetch(config.API_URL + "/api/userSignOut", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok || response.status === 401) {
        navigate("/login");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <>
      {onGoingWorkoutDetails?.Workout_ID
        ? deleteWorkoutDialog(onGoingWorkoutDetails?.Workout_ID, queryClient)
        : null}
      <div className="h-28 shadow-sm shadow-accent">
        <div className="relative mx-10 flex h-full justify-between">
          {/* App Logo */}
          <Link to="/">
            <img
              src={globalTheme === "nord" ? logoDark : logoLight}
              alt="App Logo"
              width={100}
            />
          </Link>
          {/* Nav Links */}
          <div className="absolute bottom-1/2 left-1/2 hidden -translate-x-1/2 translate-y-1/2 transform items-center gap-3 md:flex">
            <Link
              className="link no-underline underline-offset-4 hover:underline"
              to="/routines"
            >
              Routines
            </Link>
            <Link
              className="link no-underline underline-offset-4 hover:underline"
              to="/"
            >
              Statistics
            </Link>
            <Link
              className="link no-underline underline-offset-4 hover:underline"
              to="/exercises"
            >
              Exercises
            </Link>
          </div>
          {/* User Profile */}
          <div className="hidden items-center md:flex">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1 flex-nowrap">
                <div className="avatar placeholder">
                  <div className="w-10 rounded-full bg-neutral text-neutral-content">
                    {globalUser!.profilePicture ? (
                      <img
                        src={globalUser!.profilePicture}
                        alt="User Profile"
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-xl">
                        {globalUser!.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-nowrap">{globalUser!.name}</div>
              </div>
              <ul className="menu dropdown-content z-[999] w-52 border border-accent bg-base-100 p-2">
                <li>
                  <Link to="/settings" onClick={handleClick}>
                    Setting
                  </Link>
                </li>
                <li>
                  <button onClick={signOut}>Sign Out</button>
                </li>
              </ul>
            </div>
          </div>
          {/* Mobile Nav */}
          <div className="flex items-center md:hidden">
            <div className="dropdown dropdown-end">
              <button className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
              <ul className="menu dropdown-content z-[1] w-52 bg-base-100 p-2 shadow">
                <li>
                  <Link
                    className="link no-underline"
                    onClick={handleClick}
                    to="/routines"
                  >
                    Routines
                  </Link>
                </li>
                <li>
                  <Link
                    className="link no-underline"
                    onClick={handleClick}
                    to="/"
                  >
                    Statistics
                  </Link>
                </li>
                <li>
                  <Link
                    className="link no-underline"
                    onClick={handleClick}
                    to="/exercises"
                  >
                    Exercises
                  </Link>
                </li>
                <li>
                  <Link to="/settings" onClick={handleClick}>
                    Setting
                  </Link>
                </li>
                <li>
                  <button onClick={signOut}>Sign Out</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {onGoingWorkoutDetails?.Workout_ID && !isRoutinePath && (
        <div
          className={`collapse border border-accent ${isCollapseOpen ? "collapse-open" : "collapse-close"}`}
        >
          <button
            className="collapse-title flex items-center justify-center p-0 text-xl font-medium"
            onClick={() => {
              setIsCollapseOpen(!isCollapseOpen);
            }}
          >
            {isCollapseOpen ? <BiArrowToTop /> : <BiArrowToBottom />}
          </button>
          <div className="collapse-content flex flex-col items-center justify-center gap-3">
            <span>Workout In Progress</span>
            {onGoingWorkoutDetails!.currentTimer > 0 ? (
              <div className="flex items-center gap-3">
                <progress
                  className="progress progress-success w-24"
                  value={onGoingWorkoutDetails!.currentTimer}
                  max={onGoingWorkoutDetails!.maxTimer}
                ></progress>
              </div>
            ) : null}
            <div className="flex gap-3">
              <button
                className="btn btn-outline btn-success btn-sm"
                onClick={() => {
                  navigate(
                    `/routine/${onGoingWorkoutDetails.Routine_ID}/${onGoingWorkoutDetails.Workout_ID}`,
                  );
                }}
              >
                Continue
              </button>
              <button
                className="btn btn-outline btn-error btn-sm"
                onClick={() => {
                  const dialog = document.getElementById(
                    `deleteWorkoutDialog`,
                  ) as HTMLDialogElement;
                  if (dialog) {
                    dialog.showModal();
                  }
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const deleteWorkoutDialog = (
  id: string,
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  return (
    <dialog id={`deleteWorkoutDialog`} className="modal">
      <div className="modal-box pb-2">
        <p className="text-center text-lg font-semibold">
          Confirm Discard Workout?
        </p>
        <form method="dialog" className="flex justify-center gap-10 py-4">
          <div className="flex gap-3">
            <button className="btn btn-accent text-accent-content">
              Cancel
            </button>
            <button
              className="btn btn-error text-error-content"
              onClick={() => {
                deleteWorkout(id).then(() => {
                  queryClient.invalidateQueries({
                    queryKey: ["fetchOnGoingWorkout"],
                  });
                  handleClick();
                });
              }}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default Navbar;
