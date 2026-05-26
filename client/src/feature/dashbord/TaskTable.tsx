import type {ItemView} from "../../type/Workspace.ts";
import {Plus} from "lucide-react";
import {CardTask} from "./CardTask.tsx";
import {useState} from "react";
import {useAddTaskMutation} from "./workspaceApi.ts";
import {toast} from "react-toastify";

type Props = {
    items: ItemView[],
    name : string
    numberStatus : number
    workspaceId: number
}
export const TaskTable = ({items, name, numberStatus, workspaceId}: Props) => {
    
    const [create, setCreate] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [add, {isLoading}] = useAddTaskMutation();
    
    const handleAddTask = async () => {
        const name = taskName.trim();
        if (!name) return;

        try {
            await add({name, description: "", status: numberStatus, workspaceId}).unwrap();
            toast.success("Task added successfully");
            setCreate(false);
            setTaskName("");
        } catch (error) {
            console.error("Error adding task:", error);
            toast.error("Failed to add task");
        }
    }
    
    return (
        <div className="bg-base-200 rounded-lg p-4 flex flex-col min-h-[350px]">
            <h2 className="font-bold text-lg mb-4">{name}</h2>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] h-fit">
                {items.map((item) => (
                    <CardTask key={item.id} item={item} workspaceId={workspaceId} />
                ))}

                {!create && <button type="button" className= "btn btn-outline m-2" onClick={() => setCreate(true)}><Plus/>Add Card</button>}
                {
                    create &&(
                        <div className="flex flex-col gap-3">
                            <input type="text" placeholder="Task Name" className="input input-bordered w-full" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                            <button type="button" className="btn btn-primary" disabled={isLoading || !taskName.trim()} onClick={handleAddTask}>Create</button>
                            <button type="button" className="btn btn-error" disabled={isLoading} onClick={() => setCreate(false)}>Cancel</button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
