import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getAuth from '@react-native-firebase/auth';

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://prodesco-6910f-default-rtdb.firebaseio.com",
        prepareHeaders: (headers) => {
            const auth = getAuth();
            const token = auth.currentUser?.getIdToken();  // Obtiene el token actual del usuario autenticado
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ["userImage", "userName"],
    endpoints: (builder) => ({
        putImage: builder.mutation({
            query: ({ image, localId, username }) => ({
                url: `/profile/${localId}.json`,
                method: "PATCH",
                body: { image, username }
            }),
            invalidatesTags: ["userImage"]
        }),
        getImage: builder.query({
            query: (localId) => `/profile/${localId}.json`,
            providesTags: ["userImage"]
        }),
        putUsername: builder.mutation({
            query: ({ username, localId, phone }) => ({
                url: `/profile/${localId}.json`,
                method: "PATCH",
                body: { username, phone }
            }),
            invalidatesTags: ["userName"]
        }),
        getUsername: builder.query({
            query: (localId) => `/profile/${localId}.json`,
            providesTags: ["userName"]
        }),
    })
});

export const {
    usePutImageMutation,
    useGetImageQuery,
    usePutUsernameMutation,
    useGetUsernameQuery
} = profileApi;
