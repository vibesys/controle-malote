
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";

export const usersDB = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*");
    
    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }

    return data || [];
  },

  async getByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();
    
    if (error && error.code !== 'PGSQL_NO_ROWS_RETURNED') {
      console.error("Error fetching user by username:", error);
      throw error;
    }

    return data || null;
  },

  async authenticate(username: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .rpc('authenticate', { username, password });
    
    if (error) {
      console.error("Authentication error:", error);
      throw error;
    }

    if (data.error) {
      console.error("Authentication failed:", data.error);
      return null;
    }

    return data as User;
  },

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const { error } = await supabase
      .from("users")
      .update({ password: newPassword })
      .eq("id", userId);
    
    if (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const { data, error } = await supabase
      .rpc('create_user', { 
        name: user.name,
        username: user.username,
        password: user.password || "",
        role: user.isAdmin ? 'administrador' : user.role || 'user'
      });
    
    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }

    if (data.error) {
      console.error("User creation failed:", data.error);
      throw new Error(data.error);
    }

    return data as User;
  }
};

