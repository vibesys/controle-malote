
import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { showSuccessToast, showErrorToast } from '@/components/ui/toast-custom';
import AuthContext from './AuthContext';
import { UserData, UserRole } from './types';
import { fetchUserData, logUserAction } from './utils';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          const data = await fetchUserData(newSession.user.id);
          setUserData(data);
        } else {
          setUserData(null);
        }
      }
    );

    // THEN check for existing session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const data = await fetchUserData(session.user.id);
        setUserData(data);
      }
      
      setIsLoading(false);
    };

    initSession();
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    // Autenticação oficial Supabase
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (!session || !session.user) {
      showErrorToast('Falha na autenticação');
      return;
    }

    setSession(session);
    setUser(session.user);

    // Carrega dados extras do usuário
    const data = await fetchUserData(session.user.id);
    setUserData(data);

    // Log da ação
    await logUserAction('Login no sistema', email, 'Login bem-sucedido');

    showSuccessToast('Login realizado com sucesso!');
    navigate('/');
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    showErrorToast('Erro ao fazer login. Verifique suas credenciais.');
  } finally {
    setIsLoading(false);
  }
};


  const signOut = async () => {
    setIsLoading(true);
    try {
      if (userData) {
        await logUserAction('Logout do sistema', userData.username);
      }
      
      await supabase.auth.signOut();
      navigate('/login');
      showSuccessToast('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Error during sign out:', error);
      showErrorToast('Erro ao fazer logout.');
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
  setIsLoading(true);
  try {
    if (!userData || !session) {
      showErrorToast('Usuário não está autenticado ou a sessão expirou');
      return false;
    }
    
    // Restante do código para alterar a senha
    const { data: verifyData, error: verifyError } = await supabase.rpc('authenticate', {
      username: userData.username,
      password: currentPassword
    });

    if (verifyError || (verifyData && typeof verifyData === 'object' && 'error' in verifyData)) {
      showErrorToast('Senha atual incorreta');
      return false;
    }
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Erro ao atualizar a senha:', error);
      showErrorToast('Erro ao atualizar a senha');
      return false;
    }

    await logUserAction('Alteração de senha', userData.username);
    return true;
  } catch (error) {
    console.error('Erro ao alterar a senha:', error);
    showErrorToast('Erro ao alterar a senha.');
    return false;
  } finally {
    setIsLoading(false);
  }
};


  return (
    <AuthContext.Provider value={{ 
      session, 
      user,
      userData, 
      isLoading, 
      signIn, 
      signOut,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
