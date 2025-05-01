
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { User } from "@/types/user";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().optional(),
  isAdmin: z.boolean()
});

export type UserFormData = z.infer<typeof formSchema>;

export function useUserForm(user: User | null, open: boolean) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      isAdmin: false
    },
  });

  // Reset form when modal opens or user changes
  useEffect(() => {
    if (open) {
      if (user) {
        // Quando editando um usuário existente, preencha os campos com os dados do usuário
        form.reset({
          name: user.name,
          username: user.username,
          password: "", // Sempre deixe a senha em branco ao editar
          isAdmin: user.isAdmin
        });
      } else {
        // Quando criando um novo usuário, deixe todos os campos em branco
        form.reset({
          name: "",
          username: "",
          password: "",
          isAdmin: false
        });
      }
    }
  }, [user, open, form]);

  return form;
}
