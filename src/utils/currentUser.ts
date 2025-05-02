
import { useAuth } from "@/contexts/AuthContext";

// This is for backward compatibility
export const currentUser = {
  id: "1",
  username: "admin@aguiadehaiacourier.com",
  name: "Administrador",
  isAdmin: true
};

export function getCurrentUser() {
  // This is just a fallback for existing code
  return currentUser;
}

// New function to get the authenticated user
export function useCurrentUser() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return {
    id: user.id,
    username: user.email,
    name: user.perfil,
    isAdmin: user.perfil === "Administrador"
  };
}
