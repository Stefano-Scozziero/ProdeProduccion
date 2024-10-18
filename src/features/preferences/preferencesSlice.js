// src/features/preferences/preferencesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRankedMode: false,
  isDarkMode: true,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleRankedMode: (state) => {
      state.isRankedMode = !state.isRankedMode;
    },
    setRankedMode: (state, action) => {
      state.isRankedMode = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const {
  toggleRankedMode,
  setRankedMode,
  toggleDarkMode,
  setDarkMode,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
