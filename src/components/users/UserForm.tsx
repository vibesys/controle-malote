
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  SelectValue
} from "@/components/ui/select";
import { UserCog } from "lucide-react";
import { usersDB, logsDB } from "@/utils/supabase";
import { User } from "@/types/user";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast-custom";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  username: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.string().min(1, "Selecione um perfil"),
});

interface UserFormProps {
  currentUser: User | null;
  onSuccess: () => Promise<void>;
}

export function UserForm({ currentUser, onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setCreateError(null);
    
    try {
      console.log("Submitting user creation form:", values);
      
      const response = await usersDB.createUser(
        values.name, 
        values.username, 
        values.password, 
        values.role
      );
      
      console.log("User creation response:", response);
      
      if (response && response.error) {
        throw new Error(response.error);
      }
      
      await logsDB.create({
        acao: "Criou usuário",
        usuario_email: currentUser?.username || "admin",
        data_hora: new Date().toISOString(),
        detalhes: `Usuário: ${values.username}, Perfil: ${values.role}`
      });
      
      await onSuccess();
      showSuccessToast("Usuário cadastrado com sucesso!");
      form.reset();
    } catch (error: any) {
      console.error('Erro ao cadastrar usuário:', error);
      setCreateError(error.message || "Erro ao cadastrar usuário.");
      showErrorToast(error.message || "Não foi possível cadastrar o usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
        <UserCog className="h-5 w-5" />
        Novo Usuário
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do usuário" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input placeholder="Nome de usuário" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Senha do usuário" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um perfil" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="recepcao">Recepção</SelectItem>
                    <SelectItem value="triagem">Triagem</SelectItem>
                    <SelectItem value="dp-rh">DP-RH</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {createError && (
            <div className="text-red-500 text-sm mt-2">{createError}</div>
          )}
          <Button 
            type="submit" 
            className="w-full bg-blue-medium hover:bg-blue-dark mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </Form>
    </>
  );
}
