
import { supabase } from "@/integrations/supabase/client";
import { Malote } from "@/types/malote";

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
    // Fetch all records using pagination
    let allMalotes: any[] = [];
    let page = 0;
    const pageSize = 1000; // Maximum allowed by Supabase
    let hasMore = true;
    
    console.log(`Starting to fetch malotes for tipo_tabela: ${tipo}`);
    
    while (hasMore) {
      try {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        
        console.log(`Fetching page ${page + 1}, range ${from}-${to}`);
        
        const { data, error } = await supabase
          .from('malotes')
          .select('*')
          .eq('tipo_tabela', tipo)
          .order('data_cadastro', { ascending: false })
          .range(from, to);
        
        if (error) {
          console.error(`Error fetching page ${page + 1}:`, error);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log(`Retrieved ${data.length} records on page ${page + 1}`);
          allMalotes = [...allMalotes, ...data];
          page++;
          
          // Check if we got a full page of results, suggesting there might be more
          hasMore = data.length === pageSize;
        } else {
          console.log(`No more data found after page ${page}`);
          hasMore = false;
        }
      } catch (err) {
        console.error(`Failed during pagination at page ${page + 1}:`, err);
        hasMore = false;
        throw err;
      }
    }
    
    console.log(`Total records fetched for ${tipo}: ${allMalotes.length}`);
    return allMalotes;
  },
  create: async (malote: {
    data_cadastro: string;
    documento_recebido: string;
    data_chegada: string;
    como_chegou: string;
    informar_outros?: string;
    empresa_id?: string | null;
    razao_social: string;
    pessoa_remetente: string;
    departamento_id?: string | null;
    nome_departamento: string;
    destinatario_id?: string | null;
    nome_destinatario: string;
    pessoa_que_recebeu: string;
    data_entrega: string;
    tipo_tabela: string;
  }) => {
    console.log("Creating malote with tipo_tabela:", malote.tipo_tabela);
    
    // Use the create_malote function that bypasses RLS
    const { data, error } = await supabase
      .rpc('create_malote', {
        p_data_cadastro: malote.data_cadastro,
        p_documento_recebido: malote.documento_recebido,
        p_data_chegada: malote.data_chegada,
        p_como_chegou: malote.como_chegou,
        p_informar_outros: malote.informar_outros || '',
        p_empresa_id: malote.empresa_id || null,
        p_razao_social: malote.razao_social,
        p_pessoa_remetente: malote.pessoa_remetente,
        p_departamento_id: malote.departamento_id || null,
        p_nome_departamento: malote.nome_departamento,
        p_destinatario_id: malote.destinatario_id || null,
        p_nome_destinatario: malote.nome_destinatario,
        p_pessoa_que_recebeu: malote.pessoa_que_recebeu,
        p_data_entrega: malote.data_entrega,
        p_tipo_tabela: malote.tipo_tabela
      });
    
    if (error) throw error;
    return data;
  },
  update: async (id: string, malote: Partial<Malote>) => {
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
