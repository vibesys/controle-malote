
import { supabase } from "@/integrations/supabase/client";
import { showSuccessToast } from "@/components/ui/toast-custom";

export const empresasDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('razao_social');
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

export const destinatariosDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('destinatarios')
      .select('*')
      .order('nome_destinatario');
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

export const meiosTransporteDB = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('meios_transporte')
      .select('*')
      .order('nome');
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

export const logsDB = {
  create: async (log: { acao: string; usuario_email: string; data_hora: string; detalhes?: string }) => {
    const { data, error } = await supabase
      .from('logs')
      .insert(log)
      .select()
      .single();
    if (error) throw error;
    return data;
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
