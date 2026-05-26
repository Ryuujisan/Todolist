import type {ItemView} from "../../type/Workspace.ts";
import {useDeleteTaskMutation, useFetchItemByIdQuery} from "./workspaceApi.ts";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {useEffect} from "react";
import {Trash} from "lucide-react";
import {StatusTask} from "../../type/Item.ts";
import {toast} from "react-toastify";

type Props = {
    itemView: ItemView
    workspaceId: number
}

export const TaskModal = ({itemView, workspaceId}: Props) => {
    const {data: item, isLoading} = useFetchItemByIdQuery(itemView.id, {
        skip: !itemView.id,
    });
    const [deleteTask, {isLoading: isDeleting}] = useDeleteTaskMutation();
    const editor = useEditor({
        extensions: [StarterKit],
        content: item?.description || "",
        editable: true,
        editorProps: {
            attributes: {
                class: "min-h-[180px] rounded-xl p-4 bg-base-100 text-base-content focus:outline-none",
            },
        },
    });

    useEffect(() => {
        if (editor && item?.description !== undefined) {
            editor.commands.setContent(item.description || "");
        }
    }, [editor, item?.description]);

    if (isLoading) {
        return (
            <div className="flex min-h-[280px] items-center justify-center p-6">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="p-6">
                <div className="alert alert-warning">Nie udalo sie pobrac szczegolow zadania.</div>
            </div>
        );
    }

    const handleDelete = async () => {
        try {
            await deleteTask({itemId: item.id, workspaceId}).unwrap();
            toast.success("Task deleted successfully");
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    };

    const userEmail = (item?.user as { email?: string } | undefined)?.email;
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 md:p-6">
            <div className="lg:col-span-8">
                <h1 className="text-2xl font-bold mb-4 break-words">{item?.title ?? "Szczegoly zadania"}</h1>
                <div className="border border-base-300 rounded-lg bg-base-200/60 overflow-auto max-h-[55vh]">
                    <EditorContent editor={editor}/>
                </div>
                <button type="button" className="btn btn-error mt-4" disabled={isDeleting} onClick={handleDelete}><Trash />Delete</button>
            </div>

            <div className="lg:col-span-4 bg-base-200 p-4 rounded-lg h-fit">
                <div className="flex items-center gap-3 mb-4">
                    <div className="avatar avatar-placeholder">
                        <div className="bg-neutral text-neutral-content w-12 rounded-full">
                            <span className="text-lg">{item?.user?.name?.charAt(0) ?? "?"}</span>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold leading-tight">{item?.user?.name ?? "Brak autora"}</p>
                        {userEmail && <p className="text-sm opacity-70 break-all">{userEmail}</p>}
                    </div>
                </div>

                <p className="text-sm opacity-80">
                    Create at: {item?.createdAt ? new Date(item.createdAt).toLocaleString() : "brak daty"}
                </p>
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn m-1">{StatusTask[item.status]}</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        {StatusTask.map((name, index) => (
                            <li key={index}><a>{name}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
