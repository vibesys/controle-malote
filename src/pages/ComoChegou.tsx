
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { showSuccessToast, showErrorToast, showConfirmDialog } from "@/components/ui/toast-custom";
import { meiosTransporteDB, logsDB } from "@/utils/supabaseDB";
import { MeioTransporte } from "@/utils/localStorage";
import { useAuth } from "@/contexts/AuthContext";

export default function ComoChegou() {
  const [novoMeioTransporte, setNovoMeioTransporte] = useState("");
  const [meiosTransporte, setMeiosTransporte] = useState<MeioTransporte[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchMeiosTransporte();
  }, []);

  const fetchMeiosTransporte = async () => {
    try {
      setIsLoading(true);
      const data = await meiosTransporteDB.getAll();
      setMeiosTransporte(data);
    } catch (error) {
      console.error('Erro ao carregar meios de transporte:', error);
      showErrorToast("Erro ao carregar meios de transporte");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (novoMeioTransporte.trim()) {
      try {
        setIsLoading(true);
        console.log("Cadastrando novo meio de transporte:", novoMeioTransporte);
        await meiosTransporteDB.create({ nome: novoMeioTransporte.trim() });
        
        await logsDB.create({
          acao: "Criou meio de transporte",
          usuario_email: user?.username || "sistema",
          data_hora: new Date().toISOString(),
          detalhes: `Meio de transporte: ${novoMeioTransporte.trim()}`
        });
        
        await fetchMeiosTransporte();
        setNovoMeioTransporte("");
        showSuccessToast("Meio de transporte adicionado com sucesso!");
      } catch (error) {
        console.error('Erro ao adicionar meio de transporte:', error);
        showErrorToast("Erro ao adicionar meio de transporte");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleDelete = async (meio: MeioTransporte) => {
    showConfirmDialog(
      `Deseja excluir o meio de transporte ${meio.nome}?`,
      async () => {
        try {
          setIsLoading(true);
          await meiosTransporteDB.remove(meio.id);
          
          await logsDB.create({
            acao: "Excluiu meio de transporte",
            usuario_email: user?.username || "sistema",
            data_hora: new Date().toISOString(),
            detalhes: `Meio de transporte: ${meio.nome}`
          });
          
          await fetchMeiosTransporte();
          showSuccessToast("Meio de transporte excluído com sucesso!");
        } catch (error) {
          console.error('Erro ao excluir meio de transporte:', error);
          showErrorToast("Erro ao excluir meio de transporte");
        } finally {
          setIsLoading(false);
        }
      }
    );
  };
  
  return (
    <PageContainer title="Cadastro de Como Chegou">
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Digite um novo meio de transporte"
              value={novoMeioTransporte}
              onChange={(e) => setNovoMeioTransporte(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <Button 
              onClick={handleAdd} 
              className="bg-blue-medium hover:bg-blue-dark"
              disabled={isLoading}
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-4">
            {meiosTransporte.map((meio) => (
              <div 
                key={meio.id} 
                className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
              >
                <span>{meio.nome}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(meio)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
            
            {meiosTransporte.length === 0 && !isLoading && (
              <div className="text-center py-4 text-gray-500">
                Nenhum meio de transporte cadastrado
              </div>
            )}
            
            {isLoading && (
              <div className="text-center py-4 text-gray-500">
                Carregando...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
