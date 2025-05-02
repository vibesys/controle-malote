
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

export const maloteColumns = [
  {
    key: "data_cadastro",
    header: "DATA INCLUSÃO CONTROLE",
  },
  {
    key: "documento_recebido",
    header: "DOCUMENTO RECEBIDO",
  },
  {
    key: "data_chegada",
    header: "DATA QUE CHEGOU",
  },
  {
    key: "como_chegou",
    header: "COMO CHEGOU",
  },
  {
    key: "informar_outros",
    header: "INFORMAR SE OUTROS",
  },
  {
    key: "razao_social",
    header: "RAZÃO SOCIAL",
  },
  {
    key: "pessoa_remetente",
    header: "PESSOA REMETENTE",
  },
  {
    key: "nome_departamento",
    header: "DESTINATÁRIO DEPARTAMENTO",
  },
  {
    key: "nome_destinatario",
    header: "DESTINATÁRIO",
  },
  {
    key: "pessoa_que_recebeu",
    header: "PESSOA QUE RECEBEU",
  },
  {
    key: "data_entrega",
    header: "DATA DA ENTREGA",
  },
];

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "";

  try {
    // If the date is already formatted as dd/mm/yyyy, return it as is
    if (dateString.includes("/")) {
      return dateString;
    }

    // Handle ISO date format
    if (dateString.includes("T")) {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    }

    // Handle other date formats
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || "";
  }
};

export const parseBrazilianDate = (dateString: string): string => {
  if (!dateString) return new Date().toISOString();

  try {
    // Check if the date is already in ISO format
    if (dateString.includes("T")) {
      return dateString;
    }

    // Check if the date is in dd/mm/yyyy format
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toISOString();
    }

    // Default case
    return new Date(dateString).toISOString();
  } catch (error) {
    console.error("Error parsing date:", error);
    return new Date().toISOString();
  }
};
