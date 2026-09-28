import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useLogin, useRegister } from "@/modules/auth/hooks";
import { useAppDispatch } from "@/app/hooks";
import { setAuth } from "@/modules/auth/authSlice";
import { http, getApiErrorMessage } from "@/shared/api/http";
import { toast } from "sonner";
import type { LoginInput, RegisterInput } from "@/modules/auth/types";
import { loginSchema, registerSchema } from "@/modules/auth/validation";

const defaultLoginValues: LoginInput = { email: "", password: "" };
const defaultRegisterValues: RegisterInput = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
    mode: "onChange",
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegisterValues,
    mode: "onChange",
  });

  async function onLoginSubmit(values: LoginInput) {
    setError(null);
    try {
      const payload = loginSchema.parse(values) as LoginInput;
      const result = await loginMutation.mutateAsync(payload);
      dispatch(setAuth(result));
      const target =
        result.user.role === "superadmin" ? "/admin/dashboard" : "/dashboard";
      navigate(target, { replace: true });
    } catch (e: unknown) {
      const msg = getApiErrorMessage(e);
      setError(msg);
    }
  }

  async function onRegisterSubmit(values: RegisterInput) {
    setError(null);
    try {
      const payload = registerSchema.parse(values) as RegisterInput;
      const result = await registerMutation.mutateAsync(payload);
      toast.success(result.message);
      registerForm.reset({ name: "", email: "", phone: "", password: "" });
      loginForm.setValue("email", payload.email);
      setMode("login");
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  async function onForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const email = loginForm.getValues("email");
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    try {
      const res = await http.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setTimeout(() => setMode("login"), 3000);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="text-2xl font-semibold text-foreground">
          {mode === "login"
            ? "Sign In"
            : mode === "register"
              ? "Create Account"
              : "Reset Password"}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          {mode === "login"
            ? "Access your Equiti Capitals client dashboard."
            : mode === "register"
              ? "Register your Equiti Capitals trading profile."
              : "Enter your email and we'll send you a password reset link."}
        </div>

        {message ? (
          <div className="mt-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {mode === "login" ? (
          <form
            className="mt-4 space-y-3"
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
          >
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                placeholder="name@company.com"
                autoComplete="email"
                {...loginForm.register("email")}
              />
              {loginForm.formState.errors.email ? (
                <div className="text-xs text-red-600">
                  {loginForm.formState.errors.email.message}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              {...loginForm.register("password")}
            />
            {loginForm.formState.errors.password ? (
              <div className="text-xs text-red-600">
                {loginForm.formState.errors.password.message}
              </div>
            ) : null}

            <Button className="w-full" disabled={isPending} type="submit">
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        ) : mode === "forgot" ? (
          <form className="mt-4 space-y-3" onSubmit={onForgotSubmit}>
            <div className="space-y-1">
              <label
                htmlFor="forgotEmail"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <Input
                id="forgotEmail"
                placeholder="name@company.com"
                {...loginForm.register("email")}
              />
            </div>
            <Button className="w-full" type="submit">
              Send Reset Link
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setMode("login")}
              type="button"
            >
              Back to Login
            </Button>
          </form>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
          >
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </label>
              <Input
                id="name"
                placeholder="John Doe"
                autoComplete="name"
                {...registerForm.register("name")}
              />
              {registerForm.formState.errors.name ? (
                <div className="text-xs text-red-600">
                  {registerForm.formState.errors.name.message}
                </div>
              ) : null}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="registerEmail"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="registerEmail"
                placeholder="name@company.com"
                autoComplete="email"
                {...registerForm.register("email")}
              />
              {registerForm.formState.errors.email ? (
                <div className="text-xs text-red-600">
                  {registerForm.formState.errors.email.message}
                </div>
              ) : null}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="registerPhone"
                className="text-sm font-medium text-foreground"
              >
                Phone Number
              </label>
              <Input
                id="registerPhone"
                type="tel"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                {...registerForm.register("phone")}
              />
              {registerForm.formState.errors.phone ? (
                <div className="text-xs text-red-600">
                  {registerForm.formState.errors.phone.message}
                </div>
              ) : null}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="registerPassword"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <PasswordInput
                id="registerPassword"
                autoComplete="new-password"
                {...registerForm.register("password")}
              />
              {registerForm.formState.errors.password ? (
                <div className="text-xs text-red-600">
                  {registerForm.formState.errors.password.message}
                </div>
              ) : null}
            </div>

            <Button
              className="w-full"
              disabled={isPending || !registerForm.formState.isValid}
              type="submit"
            >
              {isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            className="text-primary hover:underline font-medium"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            type="button"
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
