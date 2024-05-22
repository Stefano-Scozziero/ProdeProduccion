import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    email:"",
    idToken:"",
    localId:"",
    isAdmin: false,
    updateAt: 0

}

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser: (state, actions) => state = actions.payload,
        clearUser:(state) => state = {email:"", idToken:"",localId:"", isAdmin: false, updateAt:0},
        setAdmin: (state, actions) => {state.isAdmin = actions.payload} 
    }
})

export const {setUser,clearUser,setAdmin} = authSlice.actions 

export default authSlice.reducer