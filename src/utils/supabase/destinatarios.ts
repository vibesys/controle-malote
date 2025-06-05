
import { supabase } from "@/integrations/supabase/client";

export const destinatariosDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('destinatarios')
      .select('*')
      .order('nome_destinatario', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('destinatarios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  create: async (destinatario: { nome_destinatario: string }) => {
    const { data, error } = await supabase
      .from('destinatarios')
      .insert(destinatario)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  update: async (id: string, destinatario: { nome_destinatario: string }) => {
    const { data, error } = await supabase
      .from('destinatarios')
      .update(destinatario)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  remove: async (id: string) => {
    const { error } = await supabase
      .from('destinatarios')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
