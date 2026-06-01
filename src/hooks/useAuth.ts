import { useState } from "react";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Mock user session
export const isAuthenticatedAtom = atomWithStorage<boolean>("axei_auth_status", false);

// Password mock
export const passwordAtom = atomWithStorage<string>("axei_admin_password", "admin");

// Recovery requests mock
export const recoveryRequestsAtom = atomWithStorage<any[]>("axei_recovery_requests", []);
