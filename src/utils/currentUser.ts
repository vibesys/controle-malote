
import { useAuth } from "@/contexts/AuthContext";

// For backward compatibility with existing code
export const currentUser = {
  id: "1",
  username: "admin@aguiadehaiacourier.com",
  name: "Administrador",
  isAdmin: true
};

export function getCurrentUser() {
  // Try to get user from localStorage for non-React contexts
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (error) {
    console.error("Failed to parse stored user data", error);
  }
  
  return currentUser; // Fallback to default user
}
