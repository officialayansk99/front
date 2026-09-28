/**
 * Auth persistence is per-tab when the tab was opened as an impersonation
 * window, and per-browser otherwise. This module owns that decision so the
 * Redux slice and HTTP layer don't have to guess.
 *
 * Design:
 * - A normal sign-in writes to `localStorage` so refreshes and additional
 *   tabs share the session, which is what users expect from a portal.
 * - An impersonation handoff (admin -> client) writes to `sessionStorage`,
 *   which is scoped to that one tab. The admin's other tabs and the original
 *   admin session are never overwritten.
 *
 * The mode is decided once, synchronously, at module load:
 * - If the current URL is the impersonation handoff route, switch to session
 *   mode immediately (before Redux hydrates). This prevents the new tab from
 *   booting up with the admin's identity for one render and then "snapping"
 *   to the client identity (the visible glitch).
 * - Otherwise, if a sessionStorage marker is already set (we are mid-flow on
 *   that tab), stay in session mode.
 * - Otherwise, default to local mode.
 */

import type { AuthUser } from "@/modules/auth/types";

export const STORAGE_KEY = "brand.auth";
const MODE_KEY = "brand.auth.mode";
export const IMPERSONATION_PATH = "/auth/impersonate";

export type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
};

type StorageMode = "local" | "session";

function isImpersonationRoute(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith(IMPERSONATION_PATH);
}

function detectInitialMode(): StorageMode {
  if (typeof window === "undefined") return "local";

  // New tab opened from the admin "Auto-Login" action. Mark this tab as
  // session-isolated *before* anything reads the auth state.
  if (isImpersonationRoute()) {
    window.sessionStorage.setItem(MODE_KEY, "session");
    return "session";
  }

  if (window.sessionStorage.getItem(MODE_KEY) === "session") {
    return "session";
  }

  return "local";
}

const mode: StorageMode = detectInitialMode();

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  return mode === "session" ? window.sessionStorage : window.localStorage;
}

export function getStorageMode(): StorageMode {
  return mode;
}

export function isImpersonationTab(): boolean {
  return mode === "session";
}

export function loadAuthState(): AuthState {
  const empty: AuthState = { accessToken: null, user: null };
  const s = storage();
  if (!s) return empty;
  const raw = s.getItem(STORAGE_KEY);
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw) as Partial<AuthState>;
    return {
      accessToken: parsed.accessToken ?? null,
      user: parsed.user ?? null,
    };
  } catch {
    // Corrupt entry; clear it so we don't keep tripping on every read.
    s.removeItem(STORAGE_KEY);
    return empty;
  }
}

export function persistAuthState(state: AuthState): void {
  const s = storage();
  if (!s) return;
  s.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearAuthState(): void {
  const s = storage();
  if (s) s.removeItem(STORAGE_KEY);
}
