export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      authentication: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          email: string
          id: string
          perfil: string
          senha: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          email: string
          id?: string
          perfil: string
          senha: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          email?: string
          id?: string
          perfil?: string
          senha?: string
        }
        Relationships: []
      }
      departamentos: {
        Row: {
          created_at: string | null
          id: string
          nome_departamento: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome_departamento: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome_departamento?: string
        }
        Relationships: []
      }
      destinatarios: {
        Row: {
          created_at: string | null
          id: string
          nome_destinatario: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome_destinatario: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome_destinatario?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          created_at: string | null
          id: string
          razao_social: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          razao_social: string
        }
        Update: {
          created_at?: string | null
          id?: string
          razao_social?: string
        }
        Relationships: []
      }
      logs: {
        Row: {
          acao: string
          created_at: string | null
          data_hora: string
          detalhes: string | null
          id: string
          usuario_email: string
        }
        Insert: {
          acao: string
          created_at?: string | null
          data_hora: string
          detalhes?: string | null
          id?: string
          usuario_email: string
        }
        Update: {
          acao?: string
          created_at?: string | null
          data_hora?: string
          detalhes?: string | null
          id?: string
          usuario_email?: string
        }
        Relationships: []
      }
      malotes: {
        Row: {
          como_chegou: string
          created_at: string | null
          data_cadastro: string
          data_chegada: string
          data_entrega: string
          departamento_id: string | null
          destinatario_id: string | null
          documento_recebido: string
          empresa_id: string | null
          id: string
          informar_outros: string | null
          nome_departamento: string
          nome_destinatario: string
          pessoa_que_recebeu: string
          pessoa_remetente: string
          razao_social: string
          tipo_tabela: string
        }
        Insert: {
          como_chegou: string
          created_at?: string | null
          data_cadastro?: string
          data_chegada: string
          data_entrega: string
          departamento_id?: string | null
          destinatario_id?: string | null
          documento_recebido: string
          empresa_id?: string | null
          id?: string
          informar_outros?: string | null
          nome_departamento: string
          nome_destinatario: string
          pessoa_que_recebeu: string
          pessoa_remetente: string
          razao_social: string
          tipo_tabela: string
        }
        Update: {
          como_chegou?: string
          created_at?: string | null
          data_cadastro?: string
          data_chegada?: string
          data_entrega?: string
          departamento_id?: string | null
          destinatario_id?: string | null
          documento_recebido?: string
          empresa_id?: string | null
          id?: string
          informar_outros?: string | null
          nome_departamento?: string
          nome_destinatario?: string
          pessoa_que_recebeu?: string
          pessoa_remetente?: string
          razao_social?: string
          tipo_tabela?: string
        }
        Relationships: [
          {
            foreignKeyName: "malotes_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "malotes_destinatario_id_fkey"
            columns: ["destinatario_id"]
            isOneToOne: false
            referencedRelation: "destinatarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "malotes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      meios_transporte: {
        Row: {
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_user: {
        Args: { p_email: string; p_senha: string }
        Returns: Json
      }
      create_malote: {
        Args: {
          p_data_cadastro: string
          p_documento_recebido: string
          p_data_chegada: string
          p_como_chegou: string
          p_informar_outros: string
          p_empresa_id: string
          p_razao_social: string
          p_pessoa_remetente: string
          p_departamento_id: string
          p_nome_departamento: string
          p_destinatario_id: string
          p_nome_destinatario: string
          p_pessoa_que_recebeu: string
          p_data_entrega: string
          p_tipo_tabela: string
        }
        Returns: string
      }
      is_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
      update_password: {
        Args: {
          p_user_email: string
          p_current_password: string
          p_new_password: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
