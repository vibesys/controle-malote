
export interface User {
  id: string;
  username: string;
  name: string;
  isAdmin: boolean;
  password?: string;
}

// Current user singleton for easy access across the app
export const currentUser = {
  id: "1",
  username: "admin@aguiadehaiacourier.com",
  name: "Administrador",
  isAdmin: true
};
