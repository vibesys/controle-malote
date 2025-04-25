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
      departamentos: {
        Row: {
          id: string
          nome_departamento: string
        }
        Insert: {
          id?: string
          nome_departamento: string
        }
        Update: {
          id?: string
          nome_departamento?: string
        }
        Relationships: []
      }
      destinatarios: {
        Row: {
          id: string
          nome_destinatario: string
        }
        Insert: {
          id?: string
          nome_destinatario: string
        }
        Update: {
          id?: string
          nome_destinatario?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          id: string
          razao_social: string
        }
        Insert: {
          id?: string
          razao_social: string
        }
        Update: {
          id?: string
          razao_social?: string
        }
        Relationships: []
      }
      logs: {
        Row: {
          acao: string
          data_hora: string
          detalhes: string | null
          id: string
          usuario_email: string
        }
        Insert: {
          acao: string
          data_hora: string
          detalhes?: string | null
          id?: string
          usuario_email: string
        }
        Update: {
          acao?: string
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
          data_cadastro: string
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
          id: string
          nome: string
        }
        Insert: {
          id?: string
          nome: string
        }
        Update: {
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
      [_ in never]: never
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
