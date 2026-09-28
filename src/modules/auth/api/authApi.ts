import { http } from "@/shared/api/http";
import type {
  AuthPayload,
  LoginInput,
  RegisterInput,
  RegisterResult,
} from "@/modules/auth/types";

export async function login(input: LoginInput) {
  const res = await http.post<{ data: AuthPayload }>("/auth/login", input);
  return res.data.data;
}

export async function register(input: RegisterInput) {
  const res = await http.post<{ data: RegisterResult }>(
    "/auth/register",
    input,
  );
  return res.data.data;
}
