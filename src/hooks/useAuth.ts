import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface AuthUser {
  name: string;
  email: string;
  avatar?: string;
  provider: "local" | "google";
}

// Mock user session
export const isAuthenticatedAtom = atomWithStorage<boolean>("axei_auth_status", false);
export const authUserAtom = atomWithStorage<AuthUser | null>("axei_auth_user", null);

// Password mock
export const passwordAtom = atomWithStorage<string>("axei_admin_password", "admin");

// Recovery requests mock
export const recoveryRequestsAtom = atomWithStorage<any[]>("axei_recovery_requests", []);
