import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
const formSchema = z.object({
  email: z.string().email({
    message: "Email inválido"
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória"
  })
});
type FormData = z.infer<typeof formSchema>;
export default function Login() {
  const {
    user,
    loading,
    error,
    login
  } = useAuth();
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const onSubmit = async (data: FormData) => {
    const success = await login({
      email: data.email,
      password: data.password
    });
    if (success) {
      navigate("/");
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Carregando...</p>
      </div>;
  }
  return <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-dark">
            Controle Malote Águia de Haia
          </h1>
          <p className="text-gray-500 mt-2">Faça login para acessar o sistema</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="email" render={({
                field
              }) => <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input placeholder="seu.email@exemplo.com" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="password" render={({
                field
              }) => <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input type="password" placeholder="******" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>} />

                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                    {error}
                  </div>}

                <Button type="submit" className="w-full bg-blue-medium hover:bg-blue-dark">
                  Entrar
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
        </CardFooter>
        </Card>
      </div>
    </div>;
}