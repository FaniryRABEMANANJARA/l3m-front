import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: {
    id: number;
  } | null;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
    },
  },
});

export const { setToken, setUser, setError, clearAuth } = authSlice.actions;
export default authSlice.reducer;