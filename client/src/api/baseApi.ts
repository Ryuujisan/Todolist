import {type BaseQueryApi, type FetchArgs, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {toast} from "react-toastify";
import {routes} from "../routes/Routes.tsx";
export const customBaseQuery = fetchBaseQuery({
    baseUrl: "https://localhost:5001/api",
    credentials: 'include',
});

type ErrorResponse = | string | {title:string } | {errors: string[]}

export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi,
                                                 extraOptions: object) => {
    //api.dispatch(startLoading());
    const result = await customBaseQuery(args, api, extraOptions);
   // api.dispatch(stopLoading())
    if (result.error) {
        const {status, data} = result.error
        console.log(data);
        const responseData = result.error.data as ErrorResponse;
        switch (status) {
            case 400:
                if (typeof responseData === 'string') toast.error(responseData);
                else if ('errors' in responseData) {
                    throw Object.values(responseData.errors).flat().join('\n');
                }
                else toast.error(responseData.title);
                break;
            case 401:
                if (typeof responseData === 'object' && 'title' in responseData)
                    toast.error(responseData.title);
                break;
            case 404:
                if (typeof responseData === 'object' && 'title' in responseData)
                    await routes.navigate('/not-found');
                break;
            case 500:
                if (typeof responseData === 'object' && 'title' in responseData)
                    await routes.navigate('/server-error', {state: {error: responseData}});
                break;
            default:
                break;
        }
    }
    return result;
}