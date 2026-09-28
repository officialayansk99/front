import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearAuth, setAuth } from "@/modules/auth/authSlice";
import type { AuthPayload } from "@/modules/auth/types";

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) =>
    Boolean(state.auth.accessToken),
  );

  const setSession = useCallback(
    (payload: AuthPayload) => {
      dispatch(setAuth(payload));
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    setSession,
    logout,
  };
}
