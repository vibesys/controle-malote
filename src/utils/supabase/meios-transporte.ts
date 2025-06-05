
import { supabase } from "@/integrations/supabase/client";

export const meiosTransporteDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('meios_transporte')
      .select('*')
      .order('nome', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('meios_transporte')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  create: async (meioTransporte: { nome: string }) => {
    const { data, error } = await supabase
      .from('meios_transporte')
      .insert(meioTransporte)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  update: async (id: string, meioTransporte: { nome: string }) => {
    const { data, error } = await supabase
      .from('meios_transporte')
      .update(meioTransporte)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  remove: async (id: string) => {
    const { error } = await supabase
      .from('meios_transporte')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
