import {TaskModal} from "./TaskModal.tsx";
import {useRef} from "react";
import type {ItemView} from "../../type/Workspace.ts";

type Props = {
    item: ItemView
    workspaceId: number
}

export const CardTask = ({item, workspaceId}: Props) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    return (
        <>
            <div
                className="btn card w-auto h-15 bg-base-100 card-md shadow-sm"
                onClick={() => dialogRef.current?.showModal()}
            >
                <div className="card-body">
                    <h2 className="card-title">{item.title ?? ""}</h2>
                </div>
            </div>

            <dialog ref={dialogRef} className="modal">
                <div className="modal-box max-w-4xl p-0">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">X</button>
                    </form>
                    <TaskModal itemView={item} workspaceId={workspaceId}/>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}
