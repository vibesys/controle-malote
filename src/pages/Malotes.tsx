
import { useNavigate, useLocation } from "react-router-dom";
import { PageContainer } from "@/components/layout/page-container";
import { MalotesContent } from "@/components/malotes/MalotesContent";
import { useMalotes } from "@/hooks/useMalotes";
import { useState, useEffect } from "react";

interface TitulosTipos {
  [key: string]: string;
  recepcao: string;
  triagem: string;
  "dp-rh": string;
}

const titulosTipos: TitulosTipos = {
  recepcao: "Malotes Recebidos - Recepção",
  triagem: "Malotes Recebidos - Triagem",
  "dp-rh": "Malotes Recebidos - DP-RH"
};

export default function Malotes() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tipoTabela = urlParams.get('tipo') || "recepcao";
  
  const { 
    malotes, 
    loading,
    selectedMalotes, 
    setSelectedMalotes,
    handleSalvarEdicao,
    handleDelete,
    handleDeleteSelected,
  } = useMalotes(tipoTabela);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Log current state to help with debugging
    console.log("Malotes component mounted with tipo_tabela:", tipoTabela);
    console.log(`Malotes data loaded: ${malotes.length} records`, { loading });
    setIsInitialized(true);
  }, [tipoTabela, malotes, loading]);

  const titulo = titulosTipos[tipoTabela as keyof TitulosTipos] || "Malotes Recebidos";

  return (
    <PageContainer title={titulo} backUrl="/">
      <div className="mb-2 text-sm text-gray-500">
        {loading ? "Carregando dados..." : `Exibindo ${malotes.length} registros no total`}
      </div>
      <MalotesContent
        malotes={malotes}
        loading={loading}
        tipoTabela={tipoTabela}
        selectedMalotes={selectedMalotes}
        onCreateMalote={() => navigate(`/malotes/novo?tipo=${tipoTabela}`)}
        onSelectionChange={setSelectedMalotes}
        onSaveEdit={handleSalvarEdicao}
        onDelete={handleDelete}
        onDeleteSelected={handleDeleteSelected}
      />
    </PageContainer>
  );
}
