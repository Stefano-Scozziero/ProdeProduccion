// src/store/slices/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../app/services/firebase/config'; // Ajusta la ruta según tu estructura de carpetas


// Thunk para obtener las categorías desde Firebase
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const db = database();
      const snapshot = await db.ref('/categories').once('value');
      if (snapshot.exists()) {
        const fetchedCategories = snapshot.val();
        const formattedCategories = Object.keys(fetchedCategories).map(key => ({
          ...fetchedCategories[key],
          id: key,
        }));
        return formattedCategories;
      } else {
        return rejectWithValue('No se encontraron categorías');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  selectedCategory: null,
  categories: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSelectedCategory, clearSelectedCategory } = categorySlice.actions;

export default categorySlice.reducer;
