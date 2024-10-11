import React, { useEffect } from "react";
import Routine from "./Routine";
import { BiDownArrow, BiPlus, BiShuffle, BiUpArrow } from "react-icons/bi";
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
import { folders, routine } from "../../Types/Types";
import config from "../../config";

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
  const [folderIndex, setFolderIndex] = React.useState<
    { id: string; index: number }[]
  >([]);
  const [routineIndex, setRoutineIndex] = React.useState<
    { id: string; index: number; folder_id: string }[]
  >([]);
  const [arrangeFolderID, setArrangeFolderID] = React.useState("");

  useEffect(() => {
    if (folderData) {
      const newFolderIndex = [...folderIndex];

      folderData
        .sort((a: { index: number }, b: { index: number }) => a.index - b.index)
        .forEach((folder: folders, index: number) => {
          // Check if folder index already contains the folder id
          if (!newFolderIndex.some((item) => item.id === folder.id)) {
            newFolderIndex.push({ id: folder.id, index: index - 1 });
          }
        });

      setFolderIndex(newFolderIndex);
    }
  }, [folderData]);

  useEffect(() => {
    routineData
      ?.filter((routine: routine) => routine.folder_id === arrangeFolderID)
      .sort((a: { index: number }, b: { index: number }) => a.index - b.index) // Sort by id, you can change this to routine.index if needed
      .forEach((routine: routine, index: number) => {
        // Check if routine index already contains the routine id
        if (!routineIndex.some((index) => index.id === routine.id)) {
          setRoutineIndex((prev) => [
            ...prev,
            { id: routine.id, index: index, folder_id: routine.folder_id },
          ]);
        }
      });
  }, [routineData, arrangeFolderID]);

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
      {arrangeFolderDialog(
        folderData,
        folderIndex,
        setFolderIndex,
        folderRefetch,
      )}
      {arrangeRoutineDialog(
        routineData,
        routineIndex,
        setRoutineIndex,
        routineRefetch,
      )}
      <div className="dropdown dropdown-end flex justify-between gap-3">
        <h2 className="flex items-center">Routines</h2>
        <button className="btn border border-accent hover:bg-base-300">
          <BiPlus />
        </button>
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
          <div className="flex justify-end">
            <div className="dropdown dropdown-right flex justify-between gap-3">
              {routineData?.length > 1 || folderData?.length > 2 ? (
                <button className="btn border border-accent hover:bg-base-300">
                  <BiShuffle />
                </button>
              ) : null}
              <div className="menu dropdown-content z-[1] border border-accent bg-base-100">
                <li>
                  {folderData?.length > 2 && (
                    <button
                      onClick={() => {
                        (
                          document.getElementById(
                            "arrangeFolder_dialog",
                          ) as HTMLDialogElement
                        )?.showModal();
                      }}
                    >
                      Arrange Folders
                    </button>
                  )}
                  {routineData?.length > 1 && (
                    <button
                      onClick={() => {
                        setArrangeFolderID(
                          folderData.find((f: folders) => f.index === -1)?.id ||
                            "",
                        );
                        (
                          document.getElementById(
                            "arrangeRoutine_dialog",
                          ) as HTMLDialogElement
                        )?.showModal();
                      }}
                    >
                      Arrange Routines
                    </button>
                  )}
                </li>
              </div>
            </div>
          </div>
          {routineIsLoading || (folderIsLoading && <Loading />)}
          {routineIsError ||
            (folderIsError && (
              <div className="text-center">Failed to fetch routines</div>
            ))}
          {routineIsFetched && folderIsFetched && (
            <>
              {folderData
                .sort(
                  (a: { index: number }, b: { index: number }) =>
                    a.index - b.index,
                )
                .map(
                  (
                    folder: { name: string; index: number; id: string },
                    arrayIndex: number,
                  ) => (
                    <div
                      key={folder.id}
                      className={`flex flex-col gap-2 ${arrayIndex > 0 ? "mt-3" : ""}`}
                    >
                      <dialog id={`dialog-${folder.id}`} className="modal">
                        <div className="modal-box pb-2">
                          <p className="text-center text-lg font-semibold">
                            Confirm Delete Folder?
                          </p>
                          <form
                            method="dialog"
                            className="flex justify-center gap-10 py-4"
                          >
                            <div className="flex gap-3">
                              <button className="btn btn-accent text-accent-content">
                                Cancel
                              </button>
                              <button
                                className="btn btn-error text-error-content"
                                onClick={() => {
                                  deleteFolder(folder.id).then(() => {
                                    folderIndex.splice(
                                      folderIndex.findIndex(
                                        (f) => f.id === folder.id,
                                      ),
                                      1,
                                    );
                                    handleClick();
                                    folderRefetch();
                                  });
                                  handleClick();
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
                      <div className="flex items-center justify-between">
                        {folder.index != -1 && (
                          <>
                            <h5>{folder.name}</h5>
                            <div className="dropdown dropdown-end">
                              <div tabIndex={0} role="button">
                                <HiDotsVertical />
                              </div>
                              <ul className="menu dropdown-content z-[1] w-52 border border-accent bg-base-100 p-2 shadow">
                                {routineData.filter(
                                  (routine: {
                                    folder_id: string;
                                    id: string;
                                  }) => routine.folder_id === folder.id,
                                ).length > 1 ? (
                                  <li>
                                    <button
                                      className="text-yellow-500"
                                      onClick={() => {
                                        setArrangeFolderID(folder.id);
                                        (
                                          document.getElementById(
                                            "arrangeRoutine_dialog",
                                          ) as HTMLDialogElement
                                        ).showModal();
                                        handleClick();
                                      }}
                                    >
                                      Rearrange Routines
                                    </button>
                                  </li>
                                ) : null}
                                <li>
                                  <button
                                    onClick={() => {
                                      (
                                        document.getElementById(
                                          `dialog-${folder.id}`,
                                        ) as HTMLDialogElement
                                      ).showModal();
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
                          .sort(
                            (a: { index: number }, b: { index: number }) =>
                              a.index - b.index,
                          )
                          .map(
                            (routine: {
                              folder_id: string;
                              name: string;
                              index: number;
                              id: string;
                            }) => (
                              <Routine
                                key={routine.id}
                                name={routine.name}
                                id={routine.id}
                                routineFolderID={routine.folder_id}
                                folders={folderData}
                                routineRefetch={routineRefetch}
                                routineIndex={routineIndex}
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
        <div className="modal-box rounded-lg border border-accent">
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
            <button className="btn btn-accent mt-3 w-20">Create</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

const arrangeFolderDialog = (
  folderData: folders[],
  folderIndex: { id: string; index: number }[],
  setFolderIndex: React.Dispatch<
    React.SetStateAction<{ id: string; index: number }[]>
  >,
  folderRefetch: () => void,
) => {
  const moveUpFolder = (id: string, index: number) => {
    // Find the index of the folder
    const findfolder = folderIndex.find((folder) => folder.id === id);
    if (!findfolder) return;
    if (findfolder.index === 0) return;

    setFolderIndex((prev) => {
      // Find the current folder by id
      const currentFolder = prev.find((folder) => folder.id === id);
      // Find the previous folder by index
      const prevFolder = prev.find((folder) => folder.index === index - 1);

      if (currentFolder && prevFolder) {
        // Swap their index properties
        const tempIndex = currentFolder.index;
        currentFolder.index = prevFolder.index;
        prevFolder.index = tempIndex;
      }

      return [...prev];
    });
  };

  const moveDownFolder = (id: string, index: number) => {
    // Find the index of the folder
    const findfolder = folderIndex.find((folder) => folder.id === id);
    if (!findfolder) return;
    if (findfolder.index === folderData.length - 1) return;

    setFolderIndex((prev) => {
      // Find the current folder by id
      const currentFolder = prev.find((folder) => folder.id === id);
      // Find the next folder by index
      const nextFolder = prev.find((folder) => folder.index === index + 1);

      if (currentFolder && nextFolder) {
        // Swap their index properties
        const tempIndex = currentFolder.index;
        currentFolder.index = nextFolder.index;
        nextFolder.index = tempIndex;
      }

      return [...prev];
    });
  };

  return (
    <dialog id="arrangeFolder_dialog" className="modal">
      <div className="modal-box pb-2">
        <p className="text-center text-lg font-semibold">Arrange Folders</p>
        <div className="mt-2 flex flex-col gap-3">
          {folderIndex
            .filter((folder) => folder.index !== -1)
            .sort((a, b) => a.index - b.index)
            .map((folder) => {
              const folderDataItem = folderData.find((f) => f.id === folder.id);
              if (!folderDataItem) return null;
              return (
                <div
                  key={folder.id}
                  className="flex justify-between rounded-lg border border-accent p-4"
                >
                  <p>{folderDataItem.name}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        moveUpFolder(folder.id, folder.index);
                      }}
                    >
                      <BiUpArrow />
                    </button>
                    <button
                      onClick={() => {
                        moveDownFolder(folder.id, folder.index);
                      }}
                    >
                      <BiDownArrow />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="mt-3 flex justify-center">
          <button
            className="btn btn-accent"
            onClick={() => {
              submitFolderIndex(folderIndex, folderRefetch);
            }}
          >
            Done
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const arrangeRoutineDialog = (
  routineData: routine[],
  routineIndex: { id: string; index: number; folder_id: string }[],
  setRoutineIndex: React.Dispatch<
    React.SetStateAction<{ id: string; index: number; folder_id: string }[]>
  >,
  routineRefetch: () => void,
) => {
  const moveUpRoutine = (id: string, index: number) => {
    // Find the index of the routine
    const findRoutine = routineIndex.find((routine) => routine.id === id);
    if (!findRoutine) return;
    if (findRoutine.index === 0) return;

    setRoutineIndex((prev) => {
      // Find the current routine by id
      const currentRoutine = prev.find((routine) => routine.id === id);
      // Find the previous routine by index
      const prevRoutine = prev.find((routine) => routine.index === index - 1);

      if (currentRoutine && prevRoutine) {
        // Swap their index properties
        const tempIndex = currentRoutine.index;
        currentRoutine.index = prevRoutine.index;
        prevRoutine.index = tempIndex;
      }

      return [...prev];
    });
  };

  const moveDownRoutine = (id: string, index: number) => {
    // Find the index of the routine
    const findRoutine = routineIndex.find((routine) => routine.id === id);
    if (!findRoutine) return;
    if (findRoutine.index === routineData.length - 1) return;

    setRoutineIndex((prev) => {
      // Find the current routine by id
      const currentRoutine = prev.find((routine) => routine.id === id);
      // Find the next routine by index
      const nextRoutine = prev.find((routine) => routine.index === index + 1);

      if (currentRoutine && nextRoutine) {
        // Swap their index properties
        const tempIndex = currentRoutine.index;
        currentRoutine.index = nextRoutine.index;
        nextRoutine.index = tempIndex;
      }

      return [...prev];
    });
  };

  return (
    <dialog id="arrangeRoutine_dialog" className="modal">
      <div className="modal-box pb-2">
        <p className="text-center text-lg font-semibold">Arrange Routines</p>
        <div className="mt-2 flex flex-col gap-3">
          {routineIndex
            .sort((a, b) => a.index - b.index)
            .map((routine) => {
              const routineDataItem = routineData.find(
                (r) => r.id === routine.id,
              );
              if (!routineDataItem) return null;
              return (
                <div
                  key={routine.id}
                  className="flex justify-between rounded-lg border border-accent p-4"
                >
                  <p>{routineDataItem.name}</p>
                  <div className="flex gap-3">
                    <button>
                      <BiUpArrow
                        onClick={() => moveUpRoutine(routine.id, routine.index)}
                      />
                    </button>
                    <button>
                      <BiDownArrow
                        onClick={() =>
                          moveDownRoutine(routine.id, routine.index)
                        }
                      />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-3 flex justify-center">
          <button
            className="btn btn-accent"
            onClick={() => {
              submitRoutineIndex(routineIndex, routineRefetch);
            }}
          >
            Done
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const submitRoutineIndex = async (
  routineIndex: {
    id: string;
    index: number;
    folder_id: string;
  }[],
  routineRefetch: () => void,
) => {
  try {
    const response = await fetch(config.API_URL + `/api/routine`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routineIndex),
    });

    if (!response.ok) {
      throw new Error("Failed to update routine index");
    }

    routineRefetch();

    (
      document.getElementById("arrangeRoutine_dialog") as HTMLDialogElement
    )?.close();
  } catch (e) {
    console.error(e);
  }
};

const submitFolderIndex = async (
  folderIndex: {
    id: string;
    index: number;
  }[],
  folderRefetch: () => void,
) => {
  try {
    const response = await fetch(config.API_URL + `/api/folder`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(folderIndex),
    });

    if (!response.ok) {
      throw new Error("Failed to update folder index");
    }

    folderRefetch();

    (
      document.getElementById("arrangeFolder_dialog") as HTMLDialogElement
    )?.close();
  } catch (e) {
    console.error(e);
  }
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
