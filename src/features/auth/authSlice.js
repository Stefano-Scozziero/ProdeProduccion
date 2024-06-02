import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    email: "",
    idToken: "",
    localId: "",
    isAdmin: false,
    emailVerified: false,
    updateAt: 0
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => ({ ...state, ...action.payload }),
        clearUser: (state) => state = ({ email: "", idToken: "", localId: "", isAdmin: false, emailVerified: false, updateAt: 0 }),
        setAdmin: (state, action) => { state.isAdmin = action.payload }
    }
})

export const { setUser, clearUser, setAdmin } = authSlice.actions 

export default authSlice.reducer