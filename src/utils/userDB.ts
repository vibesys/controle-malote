
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/context/AuthContext";

export const userDB = {
  createUser: async (userData: { 
    username: string; 
    password: string; 
    name: string; 
    role: UserRole;
  }) => {
    const { data, error } = await supabase.rpc('create_user', {
      username: userData.username,
      password: userData.password,
      name: userData.name,
      role: userData.role
    });
    
    if (error) throw error;
    return data;
  },
  
  getAll: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, name, role, created_at')
      .order('name');
    
    if (error) throw error;
    return data;
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, name, role, created_at')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, userData: { name?: string; role?: UserRole }) => {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select('id, username, name, role, created_at')
      .single();
    
    if (error) throw error;
    return data;
  },
  
  updatePassword: async (id: string, password: string) => {
    const { data, error } = await supabase
      .from('users')
      .update({ password })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  remove: async (id: string) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Initialize the default admin user if it doesn't exist
export const initializeDefaultAdmin = async () => {
  try {
    // Check if the default admin user exists
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'michelsomcl')
      .limit(1);
    
    // If the user doesn't exist, create it
    if (!users || users.length === 0) {
      await userDB.createUser({
        username: 'michelsomcl',
        password: '123456',
        name: 'Administrador',
        role: 'administrador'
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error initializing default admin:', error);
  }
};
