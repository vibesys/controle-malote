
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { showSuccessToast, showErrorToast, showConfirmDialog } from "@/components/ui/toast-custom";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { logsDB } from "@/utils/supabaseDB";
import { empresasDB } from "@/utils/supabaseDB";

// Schema de validação
const formSchema = z.object({
  razao_social: z.string().min(3, "Razão social deve ter pelo menos 3 caracteres"),
});

export default function Empresas() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Carrega dados do localStorage
  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching empresas...");
      const data = await empresasDB.getAll();
      console.log("Empresas loaded:", data);
      setEmpresas(data || []);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      showErrorToast("Erro ao carregar empresas");
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      razao_social: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("Cadastrando nova empresa:", values);
      const novaEmpresa = await empresasDB.create({ razao_social: values.razao_social });
      console.log("Empresa cadastrada:", novaEmpresa);
      
      // Add the new item directly to the state instead of fetching again
      setEmpresas(prevEmpresas => [...prevEmpresas, novaEmpresa]);
      showSuccessToast("Empresa cadastrada com sucesso!");
      form.reset();
      
      // Try to log the action, but don't block on failure
      try {
        await logsDB.create({
          acao: "Criou empresa",
          usuario_email: user?.username || "sistema",
          data_hora: new Date().toISOString(),
          detalhes: `Empresa: ${values.razao_social}`
        });
      } catch (logError) {
        console.error('Erro ao criar log (não crítico):', logError);
        // This error doesn't affect the main functionality, so we just log it
      }
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error);
      showErrorToast("Erro ao cadastrar empresa");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (empresa: any) => {
    showConfirmDialog(
      `Deseja excluir a empresa ${empresa.razao_social}?`,
      async () => {
        try {
          await empresasDB.remove(empresa.id);
          
          // Update the state directly by filtering out the deleted item
          setEmpresas(prevEmpresas => prevEmpresas.filter(e => e.id !== empresa.id));
          showSuccessToast("Empresa excluída com sucesso!");
          
          // Try to log the action, but don't block on failure
          try {
            await logsDB.create({
              acao: "Excluiu empresa",
              usuario_email: user?.username || "sistema",
              data_hora: new Date().toISOString(),
              detalhes: `Empresa: ${empresa.razao_social}`
            });
          } catch (logError) {
            console.error('Erro ao criar log (não crítico):', logError);
            // This error doesn't affect the main functionality, so we just log it
          }
        } catch (error) {
          console.error('Erro ao excluir empresa:', error);
          showErrorToast("Erro ao excluir empresa");
        }
      }
    );
  };

  const columns = [
    {
      key: "razao_social",
      header: "Razão Social",
    },
  ];

  return (
    <PageContainer title="Cadastrar Empresa" backUrl="/">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="razao_social"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razão Social</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-blue-medium hover:bg-blue-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md">
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4">Empresas Cadastradas</h2>
            <DataTable
              data={empresas}
              columns={columns}
              actions={(empresa) => (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(empresa)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
