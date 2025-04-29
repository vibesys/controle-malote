
import { supabase } from "@/integrations/supabase/client";
import { AuthResponse } from "@/types/user";

export const usersDB = {
  authenticate: async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc('authenticate', { 
        username, 
        password 
      });
      
      if (error) throw error;
      
      const authResponse = data as unknown as AuthResponse;
      if (authResponse && authResponse.error) throw new Error(authResponse.error);
      
      return authResponse;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },
  
  createUser: async (name: string, username: string, password: string, role: string) => {
    try {
      console.log("Creating user with data:", { name, username, role }); // Debug log
      
      const { data, error } = await supabase.rpc('create_user', { 
        name: name.trim(), 
        username: username.trim(), 
        password: password.trim(),
        role: role.trim()
      });
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("User creation response:", data); // Debug log
      
      // Special handling for null response
      if (data === null) {
        throw new Error("Não foi possível criar o usuário. Verifique se o nome de usuário já existe.");
      }
      
      const authResponse = data as unknown as AuthResponse;
      if (authResponse && authResponse.error) throw new Error(authResponse.error);
      
      return authResponse;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },
  
  getUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },
  
  updateUser: async (id: string, updates: { name?: string, password?: string, role?: string }) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Usuário não encontrado");
      }
      
      return data[0];
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },
  
  deleteUser: async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }
};
