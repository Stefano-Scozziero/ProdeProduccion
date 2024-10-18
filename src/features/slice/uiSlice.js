// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCategoriesModalVisible: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCategoriesModal: (state) => {
      state.isCategoriesModalVisible = true;
    },
    closeCategoriesModal: (state) => {
      state.isCategoriesModalVisible = false;
    },
  },
});

export const { openCategoriesModal, closeCategoriesModal } = uiSlice.actions;

export default uiSlice.reducer;
