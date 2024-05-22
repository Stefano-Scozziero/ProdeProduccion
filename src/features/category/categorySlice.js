import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedCategory: null,
}

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    }
  }
})

export const { setSelectedCategory, clearSelectedCategory } = categorySlice.actions

export default categorySlice.reducer
