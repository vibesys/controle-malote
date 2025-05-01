
import { supabase } from "@/integrations/supabase/client";

export const malotesDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('malotes')
      .select('*')
      .order('data_cadastro', { ascending: false });
    if (error) throw error;
    return data;
  },
  getByTipo: async (tipo: string) => {
    const { data, error } = await supabase
      .from('malotes')
      .select('*')
      .eq('tipo_tabela', tipo)
      .order('data_cadastro', { ascending: false });
    if (error) throw error;
    return data;
  },
  create: async (malote: {
    data_cadastro: string;
    documento_recebido: string;
    data_chegada: string;
    como_chegou: string;
    informar_outros?: string;
    empresa_id?: string;
    razao_social: string;
    pessoa_remetente: string;
    departamento_id?: string;
    nome_departamento: string;
    destinatario_id?: string;
    nome_destinatario: string;
    pessoa_que_recebeu: string;
    data_entrega: string;
    tipo_tabela: string;
  }) => {
    console.log("Creating malote with tipo_tabela:", malote.tipo_tabela);
    const { data, error } = await supabase
      .from('malotes')
      .insert(malote)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, malote: Partial<any>) => {
    const { data, error } = await supabase
      .from('malotes')
      .update(malote)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  remove: async (id: string) => {
    const { error } = await supabase
      .from('malotes')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
  removeMany: async (ids: string[]) => {
    const { error } = await supabase
      .from('malotes')
      .delete()
      .in('id', ids);
    if (error) throw error;
    return ids.length;
  }
};
