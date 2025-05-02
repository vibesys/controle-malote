
import { useLocation } from "react-router-dom";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { NovoMaloteForm } from "@/components/malotes/NovoMaloteForm";
import { useNavigate } from "react-router-dom";

interface TitulosTipos {
  [key: string]: string;
  recepcao: string;
  triagem: string;
  "dp-rh": string;
}

const titulosTipos: TitulosTipos = {
  recepcao: "Novo Malote Recepção",
  triagem: "Novo Malote Triagem",
  "dp-rh": "Novo Malote DP-RH"
};

export default function NovoMalote() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const urlParams = new URLSearchParams(location.search);
  const tipoTabela = urlParams.get('tipo') || "recepcao";
  
  const titulo = titulosTipos[tipoTabela as keyof TitulosTipos] || "Novo Malote";
  
  const handleCancel = () => {
    navigate(`/malotes?tipo=${tipoTabela}`);
  };

  return (
    <PageContainer title={titulo}>
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <NovoMaloteForm 
            tipoTabela={tipoTabela} 
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
