
import { User } from "./user";

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  id?: string;
  email?: string;
  perfil?: string;
  message?: string;
}
