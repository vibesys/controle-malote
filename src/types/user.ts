
export interface User {
  id: string;
  username: string;
  name: string;
  isAdmin: boolean;
  password?: string;
  role?: string;
}

// Current user singleton for easy access across the app
export let currentUser: User | null = null;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

export const getCurrentUser = () => {
  return currentUser;
};

export const isAuthorized = (requiredRole: string | string[] | null): boolean => {
  if (!currentUser) return false;
  
  // Administrators have full access
  if (currentUser.isAdmin) return true;
  
  // If no specific role is required
  if (!requiredRole) return true;
  
  // Check if user has the required role or one of the required roles
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(currentUser.role || '');
  } else {
    return currentUser.role === requiredRole;
  }
};
