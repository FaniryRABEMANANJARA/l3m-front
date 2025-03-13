import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
      auth: authReducer,  // Ajoutez vos reducers ici
    },
  });
  
  export type RootState = ReturnType<typeof store.getState>;  // Type de l'état global
  export type AppDispatch = typeof store.dispatch;  // Type pour dispatch
  export default store;