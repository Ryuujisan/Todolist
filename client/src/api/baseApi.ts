import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";



export const customBaseQuery = fetchBaseQuery({
    baseUrl: "https://localhost:5001/api",
    credentials: 'include',
});
