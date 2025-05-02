import { useNavigate, useLocation } from "react-router-dom";
import { PageContainer } from "@/components/layout/page-container";
import { MalotesContent } from "@/components/malotes/MalotesContent";
import { useMalotes } from "@/hooks/useMalotes";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  
  // Set tipoTabela based on user profile if not specified in URL
  let tipoTabela = urlParams.get('tipo') || "recepcao";

  // If no tipo is specified in the URL and user is not admin, 
  // default to their profile-specific view
  if (!urlParams.get('tipo') && user && user.perfil !== "Administrador") {
    // Convert user.perfil to lowercase for matching tipoTabela format
    const profileType = user.perfil.toLowerCase();
    if (profileType === "recepcao" || profileType === "triagem" || profileType === "dp-rh") {
      tipoTabela = profileType;
    }
  }
  
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
    console.log("Malotes data:", { count: malotes.length, loading });
    setIsInitialized(true);
  }, [tipoTabela, malotes, loading]);

  // Check if user has permission to access this tipo
  const canAccessTipo = () => {
    if (!user) return false;
    
    // Admin can access all types
    if (user.perfil === "Administrador") return true;
    
    // Other profiles can only access their corresponding type
    return user.perfil.toLowerCase() === tipoTabela;
  };

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (!loading && !canAccessTipo()) {
      navigate("/acesso-negado");
    }
  }, [loading, tipoTabela, user]);

  const titulo = titulosTipos[tipoTabela as keyof TitulosTipos] || "Malotes Recebidos";

  return (
    <PageContainer title={titulo} backUrl="/">
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
