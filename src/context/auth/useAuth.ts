
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Certifique-se de importar a instância do Supabase

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado automaticamente
    const session = supabase.auth.session();
    if (session?.user) {
      setUser(session.user);
    }
    setLoading(false);

    // Subscribing para mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null); // Atualiza o usuário conforme o evento
      }
    );

    return () => {
      authListener?.unsubscribe(); // Limpa o listener ao desmontar
    };
  }, []);

  const login = async (username: string, password: string) => {
  setLoading(true);
  try {
    const { user, error } = await supabase.auth.signInWithPassword({
      email: username, // Pode ser username ou outro campo
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Agora, busque o perfil do usuário na tabela `profiles`
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user?.id)
      .single(); // Espera-se que tenha apenas um perfil

    if (profileError) {
      throw new Error('Erro ao buscar perfil do usuário');
    }

    // Agora você tem acesso ao perfil e permissões
    setUser({
      ...user,
      role: profile?.role,
      permissions: profile?.permissions,
    });

  } catch (error) {
    console.error('Erro no login:', error.message);
  } finally {
    setLoading(false);
  }
};


  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut(); // Logout do Supabase
      setUser(null); // Limpa o estado do usuário
    } catch (error) {
      console.error('Erro no logout:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login, logout };
};

export default useAuth;
