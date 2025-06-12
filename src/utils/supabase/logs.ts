
import { supabase } from "@/integrations/supabase/client";

export const logsDB = {
  create: async (log: { acao: string; usuario_email: string; data_hora: string; detalhes?: string }) => {
    try {
      const { data, error } = await supabase
        .from('logs')
        .insert(log)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating log:', error);
      // We don't throw here to prevent log errors from affecting the main functionality
      return null;
    }
  },
  getAll: async () => {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('data_hora', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
