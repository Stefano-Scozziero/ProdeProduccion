import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from './services/auth'
import authReducer from '../features/auth/authSlice'
import { profileApi } from './services/profile'
import { predictApi } from './services/predict'
import categoryReducer from '../features/category/categorySlice'

export const store = configureStore({
    reducer: {
        auth:authReducer,
        category:categoryReducer,
        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [predictApi.reducerPath]: predictApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,profileApi.middleware, predictApi.middleware),

  })

  setupListeners(store.dispatch)
