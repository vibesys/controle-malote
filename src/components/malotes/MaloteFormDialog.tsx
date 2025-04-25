import { Malote } from "@/types/malote";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { DatePickerField } from "./DatePickerField";

interface MaloteFormDialogProps {
  open: boolean;
  onClose: () => void;
  malote: Malote | null;
  onSave: (data: Malote) => void;
  tipoTabela?: string;
}

export const MaloteFormDialog = ({ 
  open, 
  onClose, 
  malote, 
  onSave, 
  tipoTabela = "recepcao" 
}: MaloteFormDialogProps) => {
  const form = useForm<Malote>({
    defaultValues: malote || {
      id: "",
      data_cadastro: "",
      documento_recebido: "",
      data_chegada: "",
      como_chegou: "",
      informar_outros: "",
      empresa_id: null,
      razao_social: "",
      pessoa_remetente: "",
      departamento_id: null,
      nome_departamento: "",
      destinatario_id: null,
      nome_destinatario: "",
      pessoa_que_recebeu: "",
      data_entrega: "",
      tipo_tabela: tipoTabela
    }
  });

  const handleSubmit = (data: Malote) => {
    // Ensure the tipo_tabela is preserved
    const updatedData = {
      ...data,
      tipo_tabela: malote?.tipo_tabela || tipoTabela
    };
    console.log("Saving edited malote with tipo_tabela:", updatedData.tipo_tabela);
    onSave(updatedData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Malote</DialogTitle>
          <DialogDescription>
            Edite as informações do malote e clique em salvar para confirmar as alterações.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="documento_recebido">Documento Recebido</Label>
              <Input 
                id="documento_recebido"
                {...form.register("documento_recebido")}
              />
            </div>
            
            <div>
              <Label>Data de Cadastro</Label>
              <DatePickerField
                name="data_cadastro"
                value={form.watch("data_cadastro")}
                onChange={(date) => form.setValue("data_cadastro", date)}
              />
            </div>
            
            <div>
              <Label>Data de Chegada</Label>
              <DatePickerField
                name="data_chegada"
                value={form.watch("data_chegada")}
                onChange={(date) => form.setValue("data_chegada", date)}
              />
            </div>
            
            <div>
              <Label htmlFor="como_chegou">Como Chegou</Label>
              <Input 
                id="como_chegou"
                {...form.register("como_chegou")}
              />
            </div>
            
            <div>
              <Label htmlFor="informar_outros">Observações</Label>
              <Input 
                id="informar_outros"
                {...form.register("informar_outros")}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="razao_social">Razão Social</Label>
              <Input 
                id="razao_social"
                {...form.register("razao_social")}
              />
            </div>
            
            <div>
              <Label htmlFor="pessoa_remetente">Pessoa Remetente</Label>
              <Input 
                id="pessoa_remetente"
                {...form.register("pessoa_remetente")}
              />
            </div>
            
            <div>
              <Label htmlFor="nome_departamento">Departamento</Label>
              <Input 
                id="nome_departamento"
                {...form.register("nome_departamento")}
              />
            </div>
            
            <div>
              <Label htmlFor="nome_destinatario">Destinatário</Label>
              <Input 
                id="nome_destinatario"
                {...form.register("nome_destinatario")}
              />
            </div>
            
            <div>
              <Label htmlFor="pessoa_que_recebeu">Pessoa que Recebeu</Label>
              <Input 
                id="pessoa_que_recebeu"
                {...form.register("pessoa_que_recebeu")}
              />
            </div>
            
            <div>
              <Label>Data de Entrega</Label>
              <DatePickerField
                name="data_entrega"
                value={form.watch("data_entrega")}
                onChange={(date) => form.setValue("data_entrega", date)}
              />
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancelar</Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-medium hover:bg-blue-dark">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
