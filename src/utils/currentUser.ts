
import { useAuth } from "@/contexts/AuthContext";

// This is kept for compatibility with existing code
// but should be replaced with the useAuth hook in new components
export const currentUser = {
  id: "1",
  username: "admin@aguiadehaiacourier.com",
  name: "Administrador",
  isAdmin: true
};

export function getCurrentUser() {
  try {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return currentUser;
  } catch (err) {
    console.error('Failed to get current user:', err);
    return currentUser;
  }
}
