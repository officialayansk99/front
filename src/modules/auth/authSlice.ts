import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthPayload } from "@/modules/auth/types";
import {
  loadAuthState,
  persistAuthState,
  clearAuthState,
  type AuthState,
} from "@/modules/auth/authStorage";

const initialState: AuthState = loadAuthState();

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthPayload>) {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      persistAuthState(state);
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      clearAuthState();
    },
  },
});

export const { setAuth, clearAuth } = slice.actions;
export default slice.reducer;
