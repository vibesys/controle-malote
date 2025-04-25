
import { useState, useEffect } from "react";
import { Malote } from "@/types/malote";
import { showSuccessToast } from "@/components/ui/toast-custom";
import { currentUser } from "@/types/user";
import { parseBrazilianDate } from "@/utils/maloteUtils";
import { malotesDB, logsDB } from "@/utils/supabaseDB";

export function useMalotes(tipoTabela: string = "recepcao") {
  const [malotes, setMalotes] = useState<Malote[]>([]);
  const [selectedMalotes, setSelectedMalotes] = useState<Malote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMalotes();
  }, [tipoTabela]);

  const fetchMalotes = async () => {
    try {
      setLoading(true);
      const filteredMalotes = await malotesDB.getByTipo(tipoTabela);
      setMalotes(filteredMalotes);
    } catch (error) {
      console.error("Erro ao carregar malotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarEdicao = async (maloteAtualizado: Malote) => {
    try {
      const processedMalote = {
        ...maloteAtualizado,
        tipo_tabela: tipoTabela,
        data_cadastro: parseBrazilianDate(maloteAtualizado.data_cadastro as any),
        data_chegada: parseBrazilianDate(maloteAtualizado.data_chegada as any),
        data_entrega: parseBrazilianDate(maloteAtualizado.data_entrega as any),
      };
      
      await malotesDB.update(processedMalote.id, processedMalote);
      
      await logsDB.create({
        acao: "Editou malote",
        usuario_email: currentUser.username,
        data_hora: new Date().toISOString(),
        detalhes: `Malote: ${processedMalote.documento_recebido}`
      });
      
      await fetchMalotes();
      showSuccessToast("Malote atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar malote:", error);
      return false;
    }
  };

  const handleDelete = async (malote: Malote) => {
    try {
      await malotesDB.remove(malote.id);
      
      await logsDB.create({
        acao: "Excluiu malote",
        usuario_email: currentUser.username,
        data_hora: new Date().toISOString(),
        detalhes: `Malote: ${malote.documento_recebido}`
      });
      
      await fetchMalotes();
      showSuccessToast("Malote excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir malote:", error);
    }
  };

  const handleDeleteSelected = async (selectedItems: Malote[]) => {
    if (selectedItems.length === 0) return;
    
    try {
      const selectedIds = selectedItems.map(item => item.id);
      
      await malotesDB.removeMany(selectedIds);
      
      await logsDB.create({
        acao: "Excluiu múltiplos malotes",
        usuario_email: currentUser.username,
        data_hora: new Date().toISOString(),
        detalhes: `Quantidade: ${selectedItems.length}`
      });
      
      await fetchMalotes();
      setSelectedMalotes([]);
      showSuccessToast(`${selectedItems.length} malote(s) excluído(s) com sucesso!`);
    } catch (error) {
      console.error("Erro ao excluir malotes:", error);
    }
  };

  return {
    malotes,
    loading,
    selectedMalotes,
    setSelectedMalotes,
    handleSalvarEdicao,
    handleDelete,
    handleDeleteSelected,
  };
}
