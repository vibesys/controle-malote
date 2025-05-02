
// Default user to use for logging
export const currentUser = {
  id: "1",
  username: "admin@aguiadehaiacourier.com",
  name: "Administrador",
  isAdmin: true
};

export function getCurrentUser() {
  return currentUser;
}
