import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { currentUser } from "@/types/user";
import { 
  empresasDB, 
  departamentosDB, 
  destinatariosDB, 
  meiosTransporteDB, 
  malotesDB,
  logsDB 
} from "@/utils/localStorage";
import { Empresa, Departamento, Destinatario, MeioTransporte } from "@/utils/localStorage";

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

export default function NovoMalote() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const urlParams = new URLSearchParams(location.search);
  const tipoTabela = urlParams.get('tipo') || "recepcao";
  
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([]);
  const [meiosTransporte, setMeiosTransporte] = useState<MeioTransporte[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalEmpresa, setModalEmpresa] = useState(false);
  const [modalDepartamento, setModalDepartamento] = useState(false);
  const [modalDestinatario, setModalDestinatario] = useState(false);
  const [modalComoChegou, setModalComoChegou] = useState(false);
  const [empresaNome, setEmpresaNome] = useState("");
  const [departamentoNome, setDepartamentoNome] = useState("");
  const [destinatarioNome, setDestinatarioNome] = useState("");
  const [novoMeioTransporte, setNovoMeioTransporte] = useState("");

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

  const handleAddEmpresa = async () => {
    if (empresaNome.trim()) {
      try {
        await empresasDB.create({ razao_social: empresaNome });
        
        await logsDB.create({
          acao: "Criou empresa",
          usuario_email: currentUser.username,
          data_hora: new Date().toISOString(),
          detalhes: `Empresa: ${empresaNome}`
        });
        
        await fetchData();
        setEmpresaNome("");
        setModalEmpresa(false);
        showSuccessToast("Empresa cadastrada!");
      } catch (error) {
        console.error('Erro ao cadastrar empresa:', error);
      }
    }
  };

  const handleAddDepartamento = async () => {
    if (departamentoNome.trim()) {
      try {
        await departamentosDB.create({ nome_departamento: departamentoNome });
        
        await logsDB.create({
          acao: "Criou departamento",
          usuario_email: currentUser.username,
          data_hora: new Date().toISOString(),
          detalhes: `Departamento: ${departamentoNome}`
        });
        
        await fetchData();
        setDepartamentoNome("");
        setModalDepartamento(false);
        showSuccessToast("Departamento cadastrado!");
      } catch (error) {
        console.error('Erro ao cadastrar departamento:', error);
      }
    }
  };

  const handleAddDestinatario = async () => {
    if (destinatarioNome.trim()) {
      try {
        await destinatariosDB.create({ nome_destinatario: destinatarioNome });
        
        await logsDB.create({
          acao: "Criou destinatário",
          usuario_email: currentUser.username,
          data_hora: new Date().toISOString(),
          detalhes: `Destinatário: ${destinatarioNome}`
        });
        
        await fetchData();
        setDestinatarioNome("");
        setModalDestinatario(false);
        showSuccessToast("Destinatário cadastrado!");
      } catch (error) {
        console.error('Erro ao cadastrar destinatário:', error);
      }
    }
  };

  const handleAddComoChegou = async () => {
    if (novoMeioTransporte.trim()) {
      try {
        await meiosTransporteDB.create({ nome: novoMeioTransporte });
        
        await fetchData();
        setNovoMeioTransporte("");
        setModalComoChegou(false);
        showSuccessToast("Meio de transporte cadastrado!");
      } catch (error) {
        console.error('Erro ao cadastrar meio de transporte:', error);
      }
    }
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

  const titulo = titulosTipos[tipoTabela as keyof TitulosTipos] || "Novo Malote";

  return (
    <PageContainer title={titulo}>
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="data_cadastro"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Cadastro</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
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

                <FormField
                  control={form.control}
                  name="data_chegada"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data que Chegou</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="como_chegou"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Como Chegou</FormLabel>
                        <Dialog open={modalComoChegou} onOpenChange={setModalComoChegou}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="border border-blue-300">
                              <Plus className="text-blue-dark"/>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cadastro rápido de Como Chegou</DialogTitle>
                            </DialogHeader>
                            <Input 
                              placeholder="Novo meio de transporte" 
                              value={novoMeioTransporte}
                              onChange={e => setNovoMeioTransporte(e.target.value)}
                            />
                            <Button className="mt-4 w-full" onClick={handleAddComoChegou}>
                              Salvar
                            </Button>
                          </DialogContent>
                        </Dialog>
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
                        <Dialog open={modalEmpresa} onOpenChange={setModalEmpresa}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="border border-blue-300">
                              <Plus className="text-blue-dark"/>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cadastro rápido de Empresa</DialogTitle>
                            </DialogHeader>
                            <Input 
                              placeholder="Nome da empresa" 
                              value={empresaNome}
                              onChange={e => setEmpresaNome(e.target.value)}
                            />
                            <Button className="mt-4 w-full" onClick={handleAddEmpresa}>
                              Salvar
                            </Button>
                          </DialogContent>
                        </Dialog>
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
                        <Dialog open={modalDepartamento} onOpenChange={setModalDepartamento}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="border border-blue-300">
                              <Plus className="text-blue-dark"/>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cadastro rápido de Departamento</DialogTitle>
                            </DialogHeader>
                            <Input 
                              placeholder="Nome do departamento" 
                              value={departamentoNome}
                              onChange={e => setDepartamentoNome(e.target.value)}
                            />
                            <Button className="mt-4 w-full" onClick={handleAddDepartamento}>
                              Salvar
                            </Button>
                          </DialogContent>
                        </Dialog>
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
                        <Dialog open={modalDestinatario} onOpenChange={setModalDestinatario}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="border border-blue-300">
                              <Plus className="text-blue-dark"/>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cadastro rápido de Destinatário</DialogTitle>
                            </DialogHeader>
                            <Input 
                              placeholder="Nome do destinatário" 
                              value={destinatarioNome}
                              onChange={e => setDestinatarioNome(e.target.value)}
                            />
                            <Button className="mt-4 w-full" onClick={handleAddDestinatario}>
                              Salvar
                            </Button>
                          </DialogContent>
                        </Dialog>
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

                <FormField
                  control={form.control}
                  name="data_entrega"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data da Entrega</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/malotes?tipo=${tipoTabela}`)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-medium hover:bg-blue-dark" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar Malote"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
