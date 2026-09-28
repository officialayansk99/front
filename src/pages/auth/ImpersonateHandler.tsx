import { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { setAuth } from "@/modules/auth/authSlice";
import { http, getApiErrorMessage } from "@/shared/api/http";
import { toast } from "sonner";
import type { AuthUser } from "@/modules/auth/types";

/**
 * Handoff target for the admin "Auto-Login" action.
 *
 * The admin tab calls /admin/users/:id/impersonate, receives a one-time
 * `code`, and opens this page in a new tab with `?code=<code>`. This handler
 * exchanges the code for a real JWT, stores it in this tab's session-scoped
 * auth, and routes to the appropriate dashboard.
 *
 * The token never travels through the URL or browser history.
 */

type ExchangeResponseBody = {
  data: {
    token: string;
    user: AuthUser;
  };
};

// Module-level dedup so a code is exchanged at most once per tab, even if the
// component is mounted twice (React 18 StrictMode dev double-effect, Suspense
// boundary thrash from the lazy import, etc.). Concurrent mounts share the
// same in-flight promise; later mounts reuse the resolved/rejected result.
const exchanges = new Map<
  string,
  Promise<AxiosResponse<ExchangeResponseBody>>
>();

function exchangeOnce(code: string) {
  let p = exchanges.get(code);
  if (!p) {
    p = http.post<ExchangeResponseBody>("/auth/impersonate/exchange", { code });
    exchanges.set(code, p);
  }
  return p;
}

export default function ImpersonateHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const code = searchParams.get("code");
  const [exchangeError, setExchangeError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    let active = true;
    exchangeOnce(code)
      .then((res) => {
        if (!active) return;
        const payload = res.data?.data;
        const token = payload?.token;
        const user = payload?.user;
        if (!token || !user) {
          throw new Error("Malformed impersonation response");
        }
        dispatch(setAuth({ token, user }));
        toast.success(`Signed in as ${user.name}`);
        const target =
          user.role === "superadmin" ? "/admin/dashboard" : "/dashboard";
        navigate(target, { replace: true });
      })
      .catch((e) => {
        if (!active) return;
        setExchangeError(getApiErrorMessage(e));
      });

    return () => {
      active = false;
    };
  }, [code, dispatch, navigate]);

  const error = !code ? "Missing impersonation code." : exchangeError;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
        <h2 className="text-xl font-semibold text-destructive">
          Couldn't start impersonation session
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md">{error}</p>
        <Link to="/login" className="mt-6 text-sm text-primary hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="text-xl font-semibold">Switching to client portal…</h2>
      <p className="text-muted-foreground mt-2">
        Setting up a secure session for this tab.
      </p>
    </div>
  );
}
