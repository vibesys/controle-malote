
export interface Malote {
  id: string;
  data_cadastro: string;
  documento_recebido: string;
  data_chegada: string;
  como_chegou: string;
  informar_outros: string;
  empresa_id: string | null;
  razao_social: string;
  pessoa_remetente: string;
  departamento_id: string | null;
  nome_departamento: string;
  destinatario_id: string | null;
  nome_destinatario: string;
  pessoa_que_recebeu: string;
  data_entrega: string;
  tipo_tabela: string;
}
