import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import type { AuthUser } from "@/modules/auth/types";

type Role = AuthUser["role"];

/**
 * Authentication gate. Redirects unauthenticated users to /login.
 * Role-based access uses RequireRole below.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector((state) =>
    Boolean(state.auth.accessToken),
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/**
 * Role gate that wraps RequireAuth. Use it on /admin/* routes so a logged-in
 * client can't see the admin chrome with empty data when they paste an
 * admin URL into the address bar. Unauthenticated users still get bounced
 * to /login; authenticated users with the wrong role get sent to a
 * sensible landing page for their role.
 */
export function RequireRole({
  children,
  allow,
}: {
  children: ReactNode;
  allow: Role | Role[];
}) {
  const location = useLocation();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);

  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const allowed = Array.isArray(allow) ? allow : [allow];
  if (!allowed.includes(user.role)) {
    // Send users to a destination that exists for their role rather than
    // dumping them on a blank admin shell. Clients land on their dashboard;
    // anything else falls back to the login page.
    const fallback = user.role === "client" ? "/dashboard" : "/login";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
