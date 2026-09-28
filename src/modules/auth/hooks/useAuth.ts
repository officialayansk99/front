import { useMutation } from "@tanstack/react-query";
import { login, register } from "@/modules/auth/api/authApi";
import type { LoginInput, RegisterInput } from "@/modules/auth/types";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginInput) => login(payload),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterInput) => register(payload),
  });
}
