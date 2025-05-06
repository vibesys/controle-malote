
import { supabase } from "@/integrations/supabase/client";

export const empresasDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('razao_social', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  create: async (empresa: { razao_social: string }) => {
    const { data, error } = await supabase
      .from('empresas')
      .insert(empresa)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  update: async (id: string, empresa: { razao_social: string }) => {
    const { data, error } = await supabase
      .from('empresas')
      .update(empresa)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  remove: async (id: string) => {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
