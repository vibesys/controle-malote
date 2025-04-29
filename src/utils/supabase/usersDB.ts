
import { supabase } from "@/integrations/supabase/client";
import { AuthResponse } from "@/types/user";

export const usersDB = {
  authenticate: async (username: string, password: string) => {
    try {
      console.log("Authenticating user:", username);
      
      const { data, error } = await supabase.rpc('authenticate', { 
        username: username.trim(), 
        password: password.trim() 
      });
      
      if (error) {
        console.error("Authentication error from Supabase:", error);
        throw error;
      }
      
      console.log("Authentication response:", data);
      
      const authResponse = data as unknown as AuthResponse;
      if (authResponse && authResponse.error) {
        console.error("Authentication error from response:", authResponse.error);
        throw new Error(authResponse.error);
      }
      
      return authResponse;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },
  
  createUser: async (name: string, username: string, password: string, role: string) => {
    try {
      console.log("Creating user with data:", { name, username, role });
      
      const { data, error } = await supabase.rpc('create_user', { 
        name: name.trim(), 
        username: username.trim(), 
        password: password.trim(),
        role: role.trim()
      });
      
      if (error) {
        console.error("Supabase error during user creation:", error);
        throw error;
      }
      
      console.log("User creation response:", data);
      
      // Special handling for null response
      if (data === null) {
        throw new Error("Não foi possível criar o usuário. Verifique se o nome de usuário já existe.");
      }
      
      const authResponse = data as unknown as AuthResponse;
      if (authResponse && authResponse.error) {
        console.error("Error in auth response:", authResponse.error);
        throw new Error(authResponse.error);
      }
      
      return authResponse;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },
  
  getUsers: async () => {
    try {
      console.log("Fetching users list");
      
      // Add debug information to check why no users are being returned
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('name');
      
      console.log("Users query response:", { data, error, count });
      
      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} users`);
      return data || [];
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },
  
  updateUser: async (id: string, updates: { name?: string, password?: string, role?: string }) => {
    try {
      console.log("Updating user:", id, "with data:", {...updates, password: updates.password ? '****' : undefined});
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error("Error updating user:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error("Usuário não encontrado");
      }
      
      console.log("User updated successfully:", data[0]);
      return data[0];
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },
  
  deleteUser: async (id: string) => {
    try {
      console.log("Deleting user:", id);
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
      
      console.log("User deleted successfully");
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }
};
