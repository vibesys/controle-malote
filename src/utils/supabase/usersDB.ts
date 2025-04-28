
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
      
      const authResponse = data as AuthResponse;
      if (authResponse && authResponse.error) throw new Error(authResponse.error);
      
      return authResponse;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },
  
  createUser: async (name: string, username: string, password: string, role: string) => {
    try {
      const { data, error } = await supabase.rpc('create_user', { 
        name, 
        username, 
        password,
        role
      });
      
      if (error) throw error;
      
      const authResponse = data as AuthResponse;
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
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
