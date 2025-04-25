
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
import { showSuccessToast, showConfirmDialog } from "@/components/ui/toast-custom";
import { Trash2 } from "lucide-react";
import { currentUser } from "@/types/user";
import { departamentosDB, logsDB } from "@/utils/localStorage";

// Schema de validação
const formSchema = z.object({
  nome_departamento: z.string().min(3, "Nome do departamento deve ter pelo menos 3 caracteres"),
});

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carrega dados do localStorage
  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      setIsLoading(true);
      const data = departamentosDB.getAll();
      // Sort by name
      data.sort((a, b) => a.nome_departamento.localeCompare(b.nome_departamento));
      setDepartamentos(data);
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_departamento: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      departamentosDB.create({ nome_departamento: values.nome_departamento });
      
      // Registra log da ação
      logsDB.create({
        acao: "Criou departamento",
        usuario_email: currentUser.username,
        data_hora: new Date().toISOString(),
        detalhes: `Departamento: ${values.nome_departamento}`
      });
      
      await fetchDepartamentos();
      showSuccessToast("Departamento cadastrado com sucesso!");
      form.reset();
    } catch (error) {
      console.error('Erro ao cadastrar departamento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (departamento: any) => {
    showConfirmDialog(
      `Deseja excluir o departamento ${departamento.nome_departamento}?`,
      async () => {
        try {
          departamentosDB.remove(departamento.id);
          
          // Registra log da ação
          logsDB.create({
            acao: "Excluiu departamento",
            usuario_email: currentUser.username,
            data_hora: new Date().toISOString(),
            detalhes: `Departamento: ${departamento.nome_departamento}`
          });
          
          await fetchDepartamentos();
          showSuccessToast("Departamento excluído com sucesso!");
        } catch (error) {
          console.error('Erro ao excluir departamento:', error);
        }
      }
    );
  };

  const columns = [
    {
      key: "nome_departamento",
      header: "Nome do Departamento",
    },
  ];

  return (
    <PageContainer title="Cadastrar Departamento" backUrl="/">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nome_departamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Departamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do departamento" {...field} />
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
            <h2 className="text-xl font-medium mb-4">Departamentos Cadastrados</h2>
            <DataTable
              data={departamentos}
              columns={columns}
              actions={(departamento) => (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(departamento)}
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
