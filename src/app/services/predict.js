import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getAuth from '@react-native-firebase/auth';

export const predictApi = createApi({
    reducerPath:"predictApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://prodesco-6910f-default-rtdb.firebaseio.com",
        prepareHeaders: (headers) => {
            const auth = getAuth();
            console.log(auth)
            const token = auth.currentUser?.getIdToken();  // Obtiene el token actual del usuario autenticado
            console.log(token)
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints:(builder)=>({
        getPredictsByCategory:builder.query({
            query: (category) => `/predicts.json?orderBy="category"&equalTo="${category}"`,
            transformResponse:(response)=>{
                const data = Object.values(response)
                return data
            }
        }),
        getCategories: builder.query({
            query: () => "/categories.json"
        }),
        getPredicts:builder.query({
            query:(id) => `/predicts/${id}.json`
        })
    })
})

export const {useGetCategoriesQuery,useGetPredictsByCategoryQuery,useGetPredictsQuery} = predictApi