// src/slices/predictsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalAlert: false,
  datos: null,
  isLoading: true,
  isError: false,
  selectedDate: null,
  selectedDivision: 'Primera Division',
  selectedTournament: 'Apertura',
  filteredPartidos: [],
  pickerDataLoaded: false,
  puntos: { eq1: {}, eq2: {} },
  guardarPronosticos: false,
  partidosEditados: {}
};

const predictsSlice = createSlice({
  name: 'predicts',
  initialState,
  reducers: {
    setModalAlert: (state, action) => { state.modalAlert = action.payload; },
    setDatos: (state, action) => { state.datos = action.payload; },
    setIsLoading: (state, action) => { state.isLoading = action.payload; },
    setIsError: (state, action) => { state.isError = action.payload; },
    setSelectedDate: (state, action) => { state.selectedDate = action.payload; },
    setSelectedDivision: (state, action) => { state.selectedDivision = action.payload; },
    setSelectedTournament: (state, action) => { state.selectedTournament = action.payload; },
    setFilteredPartidos: (state, action) => { state.filteredPartidos = action.payload; },
    setPickerDataLoaded: (state, action) => { state.pickerDataLoaded = action.payload; },
    setPuntos: (state, action) => { state.puntos = action.payload; },
    setGuardarPronosticos: (state, action) => { state.guardarPronosticos = action.payload; },
    setPartidosEditados: (state, action) => { state.partidosEditados = action.payload; },
    resetState: (state) => { Object.assign(state, initialState); }
  }
});

export const {
  setModalAlert,
  setDatos,
  setIsLoading,
  setIsError,
  setSelectedDate,
  setSelectedDivision,
  setSelectedTournament,
  setFilteredPartidos,
  setPickerDataLoaded,
  setPuntos,
  setGuardarPronosticos,
  setPartidosEditados,
  resetState
} = predictsSlice.actions;

export default predictsSlice.reducer;
