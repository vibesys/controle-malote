
import { supabase } from "@/integrations/supabase/client";
import { AuthResponse, LoginCredentials, PasswordChangeData } from "@/types/auth";

export const authAPI = {
  login: async ({ email, password }: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase
        .rpc('authenticate_user', { p_email: email, p_senha: password });
      
      if (error) throw error;
      
      // Explicitly cast data to AuthResponse to ensure type safety
      const authResponse = data as unknown as AuthResponse;
      return authResponse;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: 'Erro ao fazer login' };
    }
  },

  changePassword: async (userEmail: string, { currentPassword, newPassword }: PasswordChangeData): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase
        .rpc('update_password', { 
          p_user_email: userEmail, 
          p_current_password: currentPassword, 
          p_new_password: newPassword 
        });
      
      if (error) throw error;
      
      // Explicitly cast data to AuthResponse to ensure type safety
      const authResponse = data as unknown as AuthResponse;
      return authResponse;
    } catch (error) {
      console.error("Password change error:", error);
      return { success: false, message: 'Erro ao alterar senha' };
    }
  }
};
