
import { supabase } from "@/integrations/supabase/client";

export const departamentosDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('departamentos')
      .select('*')
      .order('nome_departamento');
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('departamentos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  create: async (departamento: { nome_departamento: string }) => {
    const { data, error } = await supabase
      .from('departamentos')
      .insert(departamento)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, departamento: { nome_departamento: string }) => {
    const { data, error } = await supabase
      .from('departamentos')
      .update(departamento)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  remove: async (id: string) => {
    const { error } = await supabase
      .from('departamentos')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
