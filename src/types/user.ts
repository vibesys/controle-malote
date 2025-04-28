
export interface User {
  id: string;
  username: string;
  name: string;
  isAdmin: boolean;
  role: string;
  password?: string;
}

// For backward compatibility with existing code
export const currentUser = {
  id: "1",
  username: "admin@aguiadehaiacourier.com",
  name: "Administrador",
  isAdmin: true
};

// Define a type for the authentication response from Supabase
export interface AuthResponse {
  id: string;
  username: string;
  name: string;
  role: string;
  error?: string;
}
