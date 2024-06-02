import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '../features/auth/authSlice'
import { profileApi } from './services/profile'
import { predictApi } from './services/predict'
import categoryReducer from '../features/category/categorySlice'
import predictsReducer from '../features/predicts/predictsSlice'

export const store = configureStore({
    reducer: {
        auth:authReducer,
        predicts:predictsReducer,
        category:categoryReducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [predictApi.reducerPath]: predictApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(profileApi.middleware, predictApi.middleware),

  })

  setupListeners(store.dispatch)
