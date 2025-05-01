
import { Session, User } from '@supabase/supabase-js';

// Define user roles type
export type UserRole = 'administrador' | 'dp-rh' | 'recepcao' | 'triagem';

// Define user data structure
export interface UserData {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

// Define the auth context interface
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}
