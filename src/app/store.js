// src/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importa tus reducers existentes
import authReducer from '../features/auth/authSlice';
import categoryReducer from '../features/category/categorySlice';
import uiReducer from '../features/slice/uiSlice';

// Importa tus APIs existentes
import { profileApi } from './services/profile';

// Importa el reducer de preferencias
import preferencesReducer from '../features/preferences/preferencesSlice';

// **Importa el reducer de suscripciones**
import subscriptionReducer from '../features/subscriptions/subscriptionSlice';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['preferences', 'subscription'], // Añade 'subscription' a la whitelist
};

// Combina todos los reducers de la aplicación
const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  preferences: preferencesReducer, 
  ui: uiReducer,
  [profileApi.reducerPath]: profileApi.reducer,
  subscription: subscriptionReducer,
});

// Aplica persistReducer al rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configura la tienda de Redux con el persistedReducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora las acciones específicas de redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(profileApi.middleware),
});

// Configura el persistor
export const persistor = persistStore(store);

// Configura los listeners para las APIs (si es necesario)
setupListeners(store.dispatch);
