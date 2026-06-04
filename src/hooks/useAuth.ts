import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { UserRole } from "@/types/users";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  neighborhood?: string;
  interests?: string[];
  faithCommunity?: string;
  avatar?: string;
  provider: "local" | "google";
  pixConfig?: any;
}


// Mock user session
export const isAuthenticatedAtom = atomWithStorage<boolean>("axei_auth_status", false);
export const authUserAtom = atomWithStorage<AuthUser | null>("axei_auth_user", null);

// Recovery requests mock
export const recoveryRequestsAtom = atomWithStorage<any[]>("axei_recovery_requests", []);

