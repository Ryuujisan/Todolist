import type {Owner} from "./Workspace.ts";

export type Item = {
    id: number
    title: string
    description: string
    status: number
    createdAt: string
    dueDate: string | null
    user: Owner
}

export const StatusTask = ["Todo", "In progress", "Completed"] as const;
