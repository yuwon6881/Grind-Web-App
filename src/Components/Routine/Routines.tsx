import React from "react";
import Routine from "./Routine";
import { BiPlus } from "react-icons/bi";
import { handleClick } from "../Layout/Navbar";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  addFolder,
  deleteFolder,
  fetchFolders,
  fetchRoutinesWithFolders,
} from "../../services/Fetchs";
import Loading from "../Loader/Loading";
import { HiDotsVertical } from "react-icons/hi";

const Routines = () => {
  const {
    routineData,
    routineIsLoading,
    routineIsError,
    routineIsFetched,
    routineRefetch,
  } = useRoutine();
  const {
    folderData,
    folderIsLoading,
    folderIsError,
    folderIsFetched,
    folderRefetch,
  } = useFolder();
  const [folderName, setFolderName] = React.useState("");

  const submitFolder = (e: React.FormEvent) => {
    e.preventDefault();
    addFolder(folderName).then(() => {
      setFolderName("");
      (document.getElementById("addFolderModal") as HTMLDialogElement)?.close();
      folderRefetch();
    });
  };

  return (
    <div>
      <div className="dropdown dropdown-end flex justify-between gap-3">
        <h2 className="flex items-center">Routines</h2>
        <div
          tabIndex={0}
          role="button"
          className="rounded-lg border border-accent p-3 hover:bg-base-300"
        >
          <BiPlus />
        </div>
        <div className="menu dropdown-content z-[1] border border-accent bg-base-100">
          <li>
            <button
              onClick={() => {
                (
                  document.getElementById("addFolderModal") as HTMLDialogElement
                )?.showModal();
                handleClick();
              }}
            >
              Add Folder
            </button>
            <Link to="/routine" onClick={handleClick}>
              Add Routine
            </Link>
          </li>
        </div>
      </div>
      <div className="card mt-6 border border-accent bg-base-100">
        <div className="card-body">
          {routineIsLoading || (folderIsLoading && <Loading />)}
          {routineIsError ||
            (folderIsError && (
              <div className="text-center">Failed to fetch routines</div>
            ))}
          {routineIsFetched && folderIsFetched && (
            <>
              {folderData.map(
                (folder: { name: string; index: number; id: string }) => (
                  <div key={folder.id} className="mt-3 flex flex-col gap-2">
                    <div className="flex justify-between">
                      {folder.index != -1 && (
                        <>
                          <h5>{folder.name}</h5>
                          <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button">
                              <HiDotsVertical />
                            </div>
                            <ul className="menu dropdown-content z-[1] w-52 border border-accent bg-base-100 p-2 shadow">
                              <li>
                                <button
                                  onClick={() => {
                                    deleteFolder(folder.id).then(() => {
                                      handleClick();
                                      folderRefetch();
                                    });
                                    handleClick();
                                  }}
                                  className="text-red-600"
                                >
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                    {routineData.filter(
                      (routine: { folder_id: string; id: string }) =>
                        routine.folder_id === folder.id,
                    ).length > 0 ? (
                      routineData
                        .filter(
                          (routine: { folder_id: string; id: string }) =>
                            routine.folder_id === folder.id,
                        )
                        .map(
                          (routine: {
                            name: string;
                            index: number;
                            id: string;
                          }) => (
                            <Routine
                              key={routine.id}
                              name={routine.name}
                              id={routine.id}
                              routineRefetch={routineRefetch}
                            />
                          ),
                        )
                    ) : (
                      <>
                        {folderData.length === 1 && folder.index === -1 && (
                          <div className="flex justify-center text-sm">
                            No Routine Found
                          </div>
                        )}

                        {folderData.length > 0 && folder.index !== -1 && (
                          <div className="flex justify-center text-sm">
                            No Routine Found
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ),
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Folder Modal */}
      <dialog id="addFolderModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add Folder</h3>
          <form
            className="mt-3 flex flex-col items-center"
            onSubmit={submitFolder}
          >
            <input
              type="text"
              placeholder="Folder Name"
              className="input input-bordered w-full"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              required
            />
            <button className="btn mt-3 w-20">Create</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

const useRoutine = () => {
  const { data, isLoading, isFetched, isError, refetch } = useQuery({
    queryKey: ["routines"],
    queryFn: fetchRoutinesWithFolders,
  });

  return {
    routineData: data,
    routineIsLoading: isLoading,
    routineIsError: isError,
    routineIsFetched: isFetched,
    routineRefetch: refetch,
  };
};

const useFolder = () => {
  const { data, isLoading, isFetched, isError, refetch } = useQuery({
    queryKey: ["folders"],
    queryFn: fetchFolders,
  });

  return {
    folderData: data,
    folderIsLoading: isLoading,
    folderIsError: isError,
    folderIsFetched: isFetched,
    folderRefetch: refetch,
  };
};

export default Routines;
