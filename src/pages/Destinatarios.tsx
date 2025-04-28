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
import { destinatariosDB, logsDB } from "@/utils/supabase";

// Schema de validação
const formSchema = z.object({
  nome_destinatario: z.string().min(3, "Nome do destinatário deve ter pelo menos 3 caracteres"),
});

export default function Destinatarios() {
  const [destinatarios, setDestinatarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchDestinatarios();
  }, []);

  const fetchDestinatarios = async () => {
    try {
      setIsLoading(true);
      const data = await destinatariosDB.getAll();
      setDestinatarios(data);
    } catch (error) {
      console.error('Erro ao carregar destinatários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_destinatario: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      await destinatariosDB.create({ nome_destinatario: values.nome_destinatario });
      
      await logsDB.create({
        acao: "Criou destinatário",
        usuario_email: currentUser.username,
        data_hora: new Date().toISOString(),
        detalhes: `Destinatário: ${values.nome_destinatario}`
      });
      
      await fetchDestinatarios();
      showSuccessToast("Destinatário cadastrado com sucesso!");
      form.reset();
    } catch (error) {
      console.error('Erro ao cadastrar destinatário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (destinatario: any) => {
    showConfirmDialog(
      `Deseja excluir o destinatário ${destinatario.nome_destinatario}?`,
      async () => {
        try {
          await destinatariosDB.remove(destinatario.id);
          
          await logsDB.create({
            acao: "Excluiu destinatário",
            usuario_email: currentUser.username,
            data_hora: new Date().toISOString(),
            detalhes: `Destinatário: ${destinatario.nome_destinatario}`
          });
          
          await fetchDestinatarios();
          showSuccessToast("Destinatário excluído com sucesso!");
        } catch (error) {
          console.error('Erro ao excluir destinatário:', error);
        }
      }
    );
  };

  const columns = [
    {
      key: "nome_destinatario",
      header: "Nome do Destinatário",
    },
  ];

  return (
    <PageContainer title="Cadastrar Destinatário" backUrl="/">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nome_destinatario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Destinatário</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do destinatário" {...field} />
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
            <h2 className="text-xl font-medium mb-4">Destinatários Cadastrados</h2>
            <DataTable
              data={destinatarios}
              columns={columns}
              actions={(destinatario) => (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(destinatario)}
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
