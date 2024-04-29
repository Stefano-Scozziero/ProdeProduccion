import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({baseUrl:"https://identitytoolkit.googleapis.com/v1/"}),
    endpoints:(builder) => ({
        register:builder.mutation({
            query: (user) => ({
                url:"accounts:signUp?key=AIzaSyCDj6CNPDV80JSOqInW4GsG2ai2h5lAONg",
                method:"POST",
                body:user
                
            })
           
        }),
        login: builder.mutation({
            query: (user) => ({
                url:"accounts:signInWithPassword?key=AIzaSyCDj6CNPDV80JSOqInW4GsG2ai2h5lAONg",
                method:"POST",
                body:user
            })
        })
    })
    
})

export const {useRegisterMutation,useLoginMutation} = authApi