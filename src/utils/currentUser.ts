
import { currentUser as userFromTypes } from "@/types/user";

// Use the currentUser from types.ts
export const currentUser = userFromTypes;

export function getCurrentUser() {
  return currentUser;
}
