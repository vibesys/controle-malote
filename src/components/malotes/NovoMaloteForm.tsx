
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccessToast } from "@/components/ui/toast-custom";
import { currentUser } from "@/types/user";
import { 
  empresasDB, 
  departamentosDB, 
  destinatariosDB, 
  meiosTransporteDB, 
  malotesDB,
  logsDB 
} from "@/utils/supabase";
import { Empresa, Departamento, Destinatario, MeioTransporte } from "@/utils/localStorage";
import { DateFieldComponent } from "./DateFieldComponent";
import { QuickAddDialog } from "./QuickAddDialog";

const formSchema = z.object({
  data_cadastro: z.date(),
  documento_recebido: z.string().min(1, "Campo obrigatório"),
  data_chegada: z.date(),
  como_chegou: z.string().min(1, "Campo obrigatório"),
  informar_outros: z.string().optional(),
  empresa_id: z.string().min(1, "Campo obrigatório"),
  pessoa_remetente: z.string().min(1, "Campo obrigatório"),
  departamento_id: z.string().min(1, "Campo obrigatório"),
  destinatario_id: z.string().min(1, "Campo obrigatório"),
  pessoa_que_recebeu: z.string().min(1, "Campo obrigatório"),
  data_entrega: z.date(),
});

interface NovoMaloteFormProps {
  tipoTabela: string;
  onCancel: () => void;
}

export function NovoMaloteForm({ tipoTabela, onCancel }: NovoMaloteFormProps) {
  const navigate = useNavigate();
  
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([]);
  const [meiosTransporte, setMeiosTransporte] = useState<MeioTransporte[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const empresasData = await empresasDB.getAll();
      setEmpresas(empresasData);
      
      const departamentosData = await departamentosDB.getAll();
      setDepartamentos(departamentosData);
      
      const destinatariosData = await destinatariosDB.getAll();
      setDestinatarios(destinatariosData);
      
      const meiosTransporteData = await meiosTransporteDB.getAll();
      setMeiosTransporte(meiosTransporteData);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_cadastro: new Date(),
      documento_recebido: "",
      data_chegada: new Date(),
      como_chegou: "",
      informar_outros: "",
      empresa_id: "",
      pessoa_remetente: "",
      departamento_id: "",
      destinatario_id: "",
      pessoa_que_recebeu: "",
      data_entrega: new Date(),
    },
  });

  const handleAddEmpresa = async (nome: string) => {
    if (nome.trim()) {
      try {
        await empresasDB.create({ razao_social: nome });
        
        await logsDB.create({
          acao: "Criou empresa",
          usuario_email: currentUser.username,
          data_hora: new Date().toISOString(),
          detalhes: `Empresa: ${nome}`
        });
        
        await fetchData();
        showSuccessToast("Empresa cadastrada!");
        return true;
      } catch (error) {
        console.error('Erro ao cadastrar empresa:', error);
        return false;
      }
    }
    return false;
  };

  const handleAddDepartamento = async (nome: string) => {
    if (nome.trim()) {
      try {
        await departamentosDB.create({ nome_departamento: nome });
        
        await logsDB.create({
          acao: "Criou departamento",
          usuario_email: currentUser.username,
          data_hora: new Date().toISOString(),
          detalhes: `Departamento: ${nome}`
        });
        
        await fetchData();
        showSuccessToast("Departamento cadastrado!");
        return true;
      } catch (error) {
        console.error('Erro ao cadastrar departamento:', error);
        return false;
      }
    }
    return false;
  };

  const handleAddDestinatario = async (nome: string) => {
    if (nome.trim()) {
      try {
        await destinatariosDB.create({ nome_destinatario: nome });
        
        await logsDB.create({
          acao: "Criou destinatário",
          usuario_email: currentUser.username,
          data_hora: new Date().toISOString(),
          detalhes: `Destinatário: ${nome}`
        });
        
        await fetchData();
        showSuccessToast("Destinatário cadastrado!");
        return true;
      } catch (error) {
        console.error('Erro ao cadastrar destinatário:', error);
        return false;
      }
    }
    return false;
  };

  const handleAddComoChegou = async (nome: string) => {
    if (nome.trim()) {
      try {
        await meiosTransporteDB.create({ nome: nome });
        
        await fetchData();
        showSuccessToast("Meio de transporte cadastrado!");
        return true;
      } catch (error) {
        console.error('Erro ao cadastrar meio de transporte:', error);
        return false;
      }
    }
    return false;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("Starting onSubmit with tipo_tabela:", tipoTabela);
      
      const empresaData = empresas.find(e => e.id === values.empresa_id);
      const departamentoData = departamentos.find(d => d.id === values.departamento_id);
      const destinatarioData = destinatarios.find(d => d.id === values.destinatario_id);
      
      const newMalote = {
        data_cadastro: values.data_cadastro.toISOString(),
        documento_recebido: values.documento_recebido,
        data_chegada: values.data_chegada.toISOString(),
        como_chegou: values.como_chegou,
        informar_outros: values.informar_outros || "",
        empresa_id: values.empresa_id,
        razao_social: empresaData?.razao_social || "",
        pessoa_remetente: values.pessoa_remetente,
        departamento_id: values.departamento_id,
        nome_departamento: departamentoData?.nome_departamento || "",
        destinatario_id: values.destinatario_id,
        nome_destinatario: destinatarioData?.nome_destinatario || "",
        pessoa_que_recebeu: values.pessoa_que_recebeu,
        data_entrega: values.data_entrega.toISOString(),
        tipo_tabela: tipoTabela
      };
      
      console.log("Creating malote with data:", newMalote);
      await malotesDB.create(newMalote);
      
      await logsDB.create({
        acao: `Criou malote (${tipoTabela})`,
        usuario_email: currentUser.username,
        data_hora: new Date().toISOString(),
        detalhes: `Malote: ${values.documento_recebido}`
      });
      
      showSuccessToast("Malote cadastrado com sucesso!");
      navigate(`/malotes?tipo=${tipoTabela}`);
    } catch (error) {
      console.error('Erro ao cadastrar malote:', error);
      showSuccessToast("Erro ao cadastrar malote. Verifique o console para mais informações.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DateFieldComponent
            control={form.control}
            name="data_cadastro"
            label="Data de Cadastro"
          />

          <FormField
            control={form.control}
            name="documento_recebido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento Recebido</FormLabel>
                <FormControl>
                  <Input placeholder="Tipo de documento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DateFieldComponent
            control={form.control}
            name="data_chegada"
            label="Data que Chegou"
          />

          <FormField
            control={form.control}
            name="como_chegou"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Como Chegou</FormLabel>
                  <QuickAddDialog
                    title="Cadastro rápido de Como Chegou"
                    placeholder="Novo meio de transporte"
                    onSave={handleAddComoChegou}
                  />
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione como chegou" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {meiosTransporte.map((meio) => (
                      <SelectItem key={meio.id} value={meio.nome}>
                        {meio.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="informar_outros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Input placeholder="Observações adicionais" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="empresa_id"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Empresa</FormLabel>
                  <QuickAddDialog
                    title="Cadastro rápido de Empresa"
                    placeholder="Nome da empresa"
                    onSave={handleAddEmpresa}
                  />
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id}>
                        {empresa.razao_social}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pessoa_remetente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pessoa Remetente</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do remetente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departamento_id"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Departamento</FormLabel>
                  <QuickAddDialog
                    title="Cadastro rápido de Departamento"
                    placeholder="Nome do departamento"
                    onSave={handleAddDepartamento}
                  />
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departamentos.map((departamento) => (
                      <SelectItem key={departamento.id} value={departamento.id}>
                        {departamento.nome_departamento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destinatario_id"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Destinatário</FormLabel>
                  <QuickAddDialog
                    title="Cadastro rápido de Destinatário"
                    placeholder="Nome do destinatário"
                    onSave={handleAddDestinatario}
                  />
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o destinatário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {destinatarios.map((destinatario) => (
                      <SelectItem key={destinatario.id} value={destinatario.id}>
                        {destinatario.nome_destinatario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pessoa_que_recebeu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pessoa que Recebeu</FormLabel>
                <FormControl>
                  <Input placeholder="Nome de quem recebeu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DateFieldComponent
            control={form.control}
            name="data_entrega"
            label="Data da Entrega"
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-medium hover:bg-blue-dark" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar Malote"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
