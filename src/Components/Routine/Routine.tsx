import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import { handleClick } from "../Layout/Navbar";
import { deleteRoutine } from "../../services/Fetchs";
import { Link } from "react-router-dom";
import { folders } from "../../Types/Types";
import config from "../../config";

const routine: React.FC<{
  name: string;
  id: string;
  routineRefetch: () => void;
  routineFolderID: string;
  folders: folders[];
  routineIndex: { id: string; index: number; folder_id: string }[];
}> = ({ name, id, routineRefetch, folders, routineFolderID, routineIndex }) => {
  return (
    <>
      <dialog id={`dialog-${id}`} className="modal">
        <div className="modal-box pb-2">
          <p className="text-center text-lg font-semibold">
            Confirm Delete Routine?
          </p>
          <form method="dialog" className="flex justify-center gap-10 py-4">
            <div className="flex gap-3">
              <button className="btn btn-accent text-accent-content">
                Cancel
              </button>
              <button
                className="btn btn-error text-error-content"
                onClick={() => {
                  deleteRoutine(id).then(() => {
                    routineIndex.splice(
                      routineIndex.findIndex((routine) => routine.id === id),
                      1,
                    );
                    handleClick();
                    routineRefetch();
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

      <dialog id={`move_dialog-${id}`} className="modal">
        <div className="modal-box pb-2">
          <p className="text-center text-lg font-semibold">Choose Folder</p>
          <div className="mt-2 flex flex-col gap-3">
            {folders.map((folder) => {
              return (
                <button
                  key={folder.id}
                  className="btn btn-outline hover:btn-accent"
                  onClick={() => {
                    updateFolderRoutine(id, folder.id).then(() => {
                      handleClick();
                      routineRefetch();
                    });
                  }}
                >
                  {folder.index != -1 ? folder.name : "Default"}
                  <div className="text-blue-600">
                    {folder.id === routineFolderID ? "✓" : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className="card border border-accent">
        <div className="card-body p-4">
          <div className="flex items-center justify-between">
            <h6>{name}</h6>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button">
                <HiDotsVertical />
              </div>
              <ul className="menu dropdown-content z-[1] w-52 border border-accent bg-base-100 p-2 shadow">
                <li>
                  <Link
                    to={`/routine/${id}`}
                    className="text-blue-600"
                    onClick={handleClick}
                  >
                    Edit
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      (
                        document.getElementById(
                          `dialog-${id}`,
                        ) as HTMLDialogElement
                      ).showModal();
                    }}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </li>
                {folders.length > 1 && (
                  <li>
                    <button
                      className="text-yellow-500"
                      onClick={() => {
                        (
                          document.getElementById(
                            `move_dialog-${id}`,
                          ) as HTMLDialogElement
                        ).showModal();
                      }}
                    >
                      Move to
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const updateFolderRoutine = async (id: string, folderID: string) => {
  try {
    const response = await fetch(
      config.API_URL + `/api/folder/${folderID}/routine/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Error updating folder routine");
    }
  } catch (error) {
    console.error(error);
  }
};

export default routine;
