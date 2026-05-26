import {TaskTable} from "./TaskTable.tsx";
import {useAppSelector} from "../../store/store.ts";
import {useFetchWorkspaceByIdQuery} from "./workspaceApi.ts";

export const Dashboard = () => {

    const user = useAppSelector(state => state.auth.user)
    const workspaceId = user?.workspaces[0]?.id;
    const { data: workspace, isLoading, isError } =
        useFetchWorkspaceByIdQuery(workspaceId ?? 0, {
            skip: !workspaceId,
        });

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="alert alert-error max-w-lg">Nie udalo sie pobrac workspace.</div>
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="alert max-w-lg">Brak workspace do wyswietlenia.</div>
            </div>
        );
    }

    const todoItems = workspace?.items?.filter(w => w.status === 0) ?? [];
    const inProgressItems = workspace?.items?.filter(w => w.status === 1) ?? [];
    const doneItems = workspace?.items?.filter(w => w.status === 2) ?? [];
    
    return (
        <div className="w-full flex justify-center px-4 py-4">
            <div className="w-full max-w-[100%] mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-center md:text-left">{workspace.name}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-9 bg-base-content/10 p-4 md:p-6 rounded-lg shadow min-h-[400px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            <TaskTable items={todoItems} name="Todo" numberStatus={0} workspaceId={workspace.id}/>
                            <TaskTable items={inProgressItems} name="In progress" numberStatus={1} workspaceId={workspace.id}/>
                            <TaskTable items={doneItems} name="Completed" numberStatus={2} workspaceId={workspace.id}/>
                        </div>
                    </div>

                    <div className="lg:col-span-3 bg-base-content/10 p-6 rounded-lg shadow h-fit">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm opacity-70 break-all">{user?.email}</p>
                        <div className="divider my-3" />
                        <p className="text-sm opacity-80">{workspace.description || "Brak opisu workspace."}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
