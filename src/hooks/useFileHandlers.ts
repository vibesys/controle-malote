
import { Malote } from "@/types/malote";
import { maloteColumns, formatDate } from "@/utils/maloteUtils";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast-custom";
import { malotesDB } from "@/utils/localStorage";

export const useFileHandlers = () => {
  const exportToExcel = (malotes: Malote[]) => {
    const headers = maloteColumns.map(col => col.header);
    
    const rows = malotes.map(malote => [
      formatDate(malote.data_cadastro),
      malote.documento_recebido,
      formatDate(malote.data_chegada),
      malote.como_chegou,
      malote.informar_outros,
      malote.razao_social,
      malote.pessoa_remetente,
      malote.nome_departamento,
      malote.nome_destinatario,
      malote.pessoa_que_recebeu,
      formatDate(malote.data_entrega)
    ]);
    
    const csvContent = [
      headers.join(";"),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(";"))
    ].join("\n");
    
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `malotes_${formatDate(new Date().toISOString())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessToast("Arquivo exportado com sucesso!");
  };

  const downloadTemplate = () => {
    const headers = maloteColumns.map(col => col.header);
    const csvContent = headers.join(";");
    
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_malotes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileImport = async (file: File | undefined, onImport: (newMalotes: Malote[]) => void, existingMalotes: Malote[]) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const headers = lines[0].split(";");
        
        const headerMap: Record<string, number> = {};
        headers.forEach((header, index) => {
          const cleanHeader = header.trim().replace(/^"(.+)"$/, '$1');
          headerMap[cleanHeader] = index;
        });
        
        const newMalotes: Malote[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(";").map(value => 
            value.replace(/^"(.+)"$/, '$1').trim()
          );
          
          if (values.length < 5) continue;
          
          const newMalote: Malote = {
            id: crypto.randomUUID(),
            data_cadastro: values[headerMap["DATA INCLUSÃO CONTROLE"] || 0] || new Date().toISOString(),
            documento_recebido: values[headerMap["DOCUMENTO RECEBIDO"] || 1] || "",
            data_chegada: values[headerMap["DATA QUE CHEGOU"] || 2] || new Date().toISOString(),
            como_chegou: values[headerMap["COMO CHEGOU"] || 3] || "",
            informar_outros: values[headerMap["INFORMAR SE OUTROS"] || 4] || "",
            empresa_id: null,
            razao_social: values[headerMap["RAZÃO SOCIAL"] || 5] || "",
            pessoa_remetente: values[headerMap["PESSOA REMETENTE"] || 6] || "",
            departamento_id: null,
            nome_departamento: values[headerMap["DESTINATÁRIO DEPARTAMENTO"] || 7] || "",
            destinatario_id: null,
            nome_destinatario: values[headerMap["DESTINATÁRIO"] || 8] || "",
            pessoa_que_recebeu: values[headerMap["PESSOA QUE RECEBEU"] || 9] || "",
            data_entrega: values[headerMap["DATA DA ENTREGA"] || 10] || new Date().toISOString(),
            tipo_tabela: "recepcao"
          };
          
          newMalotes.push(newMalote);
        }
        
        if (newMalotes.length === 0) {
          throw new Error("Nenhum dado válido encontrado");
        }
        
        onImport(newMalotes);
        showSuccessToast(`${newMalotes.length} malotes importados com sucesso!`);
      } catch (error) {
        console.error("Erro na importação:", error);
        showErrorToast("Erro ao importar arquivo. Verifique o formato e cabeçalhos.");
      }
    };
    reader.readAsText(file);
  };

  return {
    exportToExcel,
    downloadTemplate,
    handleFileImport
  };
};
