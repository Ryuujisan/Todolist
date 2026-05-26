import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../api/baseApi.ts";
import type {WorkspaceView} from "../../type/User.ts";
import type { Workspace } from "../../type/Workspace.ts";
import type {Item} from "../../type/Item.ts";

type CreateTaskRequest = {
    workspaceId: number;
    name: string;
    description?: string;
    status: number;
};

type UpdateTaskRequest = CreateTaskRequest & {
    itemId: number;
};

type DeleteTaskRequest = {
    itemId: number;
    workspaceId: number;
};

export const workspaceApi = createApi({
    reducerPath: 'workspaceApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Workspace', 'Item'],
    endpoints: (builder) => ({
        FetchWorkspace: builder.query<WorkspaceView[], void>({
            query: () => '/workspaces',
            providesTags: ['Workspace']
        }),
        FetchWorkspaceById: builder.query<Workspace, number>({
            query: (id) => `/workspace/${id}`,
            providesTags: ['Workspace']
        }),
        FetchItemById: builder.query<Item, number>({
            query: (id) => `/item/${id}`,
            providesTags: ['Item']
        }),
        
        AddTask: builder.mutation<Item, CreateTaskRequest>({
            query: ({ workspaceId, name, description, status }) => ({
                url: `/item/create`,
                method: 'POST',
                body: {name, workspaceId, description: description ?? "", status }
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const { data: item} = await queryFulfilled;

                     dispatch(
                        workspaceApi.util.updateQueryData("FetchWorkspaceById", data.workspaceId, draft => {
                            draft.items.push({
                                id: item.id,
                                title: item.title,
                                status: item.status,
                            });
                        })
                    );

                    dispatch(
                        workspaceApi.util.upsertQueryData("FetchItemById", item.id, item)
                    );
                } catch (error) {
                    console.error("Error adding task:", error);
                }
            },
        }),
        DeleteTask: builder.mutation<void, DeleteTaskRequest>({
            query: ({itemId}) =>({
                url: `/item/${itemId}`,
                method: 'DELETE'
            }),
            
            async onQueryStarted({itemId, workspaceId}, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    
                    dispatch(
                        workspaceApi.util.updateQueryData("FetchWorkspaceById", workspaceId, draft => {
                            draft.items = draft.items.filter(i => i.id !== itemId);
                        })
                    );
                    
                } catch (error) {
                    console.error("Error deleting task:", error);
                }
            }
        }),
        
        UpdateTask: builder.mutation<Item, UpdateTaskRequest>({
            query: ({itemId, workspaceId, name, description, status}) => ({
                url: `/item/${itemId}`,
                method: 'PUT',
                body: { workspaceId, name, description: description ?? "", status }
            }),
            async onQueryStarted({itemId, workspaceId}, {dispatch, queryFulfilled}) {
                try {
                    const { data: updatedItem } = await queryFulfilled;
                    dispatch(workspaceApi.util.updateQueryData("FetchItemById", itemId, draft =>{
                        draft.title = updatedItem.title;
                        draft.description = updatedItem.description;
                        draft.status = updatedItem.status;
                    }));
                    dispatch(workspaceApi.util.updateQueryData("FetchWorkspaceById", workspaceId, draft => {
                        const index = draft.items.findIndex(i => i.id === itemId);
                        if (index !== -1) {
                            draft.items[index] = {
                                id: updatedItem.id,
                                title: updatedItem.title,
                                status: updatedItem.status,
                            };
                        }
                    }));
                } catch (error) {
                    console.error("Error updating task:", error);
                }
            }
            
        })
        
    }),
})

export const {
    useFetchWorkspaceQuery,
    useFetchWorkspaceByIdQuery,
    useFetchItemByIdQuery,
    useAddTaskMutation,
    useDeleteTaskMutation,
    useUpdateTaskMutation,
} = workspaceApi
