
export interface User {
  id: string;
  username: string;
  name: string;
  isAdmin: boolean;
  perfil?: string;
}

// This is kept for compatibility with existing code
// but should be replaced with the useAuth hook in new components
export const currentUser = {
  id: "1",
  username: "admin@aguiadehaiacourier.com",
  name: "Administrador",
  isAdmin: true
};
