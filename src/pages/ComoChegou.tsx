
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { showSuccessToast } from "@/components/ui/toast-custom";
import { meiosTransporteDB } from "@/utils/supabase";
import { MeioTransporte } from "@/utils/localStorage";

export default function ComoChegou() {
  const [novoMeioTransporte, setNovoMeioTransporte] = useState("");
  const [meiosTransporte, setMeiosTransporte] = useState<MeioTransporte[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (novoMeioTransporte.trim()) {
      try {
        await meiosTransporteDB.create({ nome: novoMeioTransporte.trim() });
        await fetchMeiosTransporte();
        setNovoMeioTransporte("");
        showSuccessToast("Meio de transporte adicionado com sucesso!");
      } catch (error) {
        console.error('Erro ao adicionar meio de transporte:', error);
      }
    }
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
              <div key={meio.id} className="p-3 bg-gray-50 rounded-md">
                <span>{meio.nome}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
