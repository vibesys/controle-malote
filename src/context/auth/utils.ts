
import { supabase } from '@/integrations/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/ui/toast-custom';
import { UserData, UserRole } from './types';

// Function to fetch user data from Supabase
export async function fetchUserData(userId: string): Promise<UserData | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
  
  if (data) {
    return {
      id: data.id,
      username: data.username,
      name: data.name,
      role: data.role as UserRole // Explicitly cast to UserRole type
    };
  }
  
  return null;
}

// Function to log user actions
export async function logUserAction(action: string, username: string, details?: string) {
  try {
    await supabase.from('logs').insert({
      acao: action,
      usuario_email: username,
      data_hora: new Date().toISOString(),
      detalhes: details
    });
  } catch (error) {
    console.error('Error logging action:', error);
  }
}
