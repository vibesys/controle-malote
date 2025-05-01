
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

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Call the authenticate function
      const { data, error } = await supabase.rpc('authenticate', {
        username,
        password
      });

      if (error) throw error;
      
      // Handle the data response which could be an error message or user data
      if (data && typeof data === 'object' && 'error' in data) {
        showErrorToast(data.error as string);
        setIsLoading(false);
        return;
      }

      // If authentication successful, set user data
      if (data && typeof data === 'object') {
        const typedData = data as unknown as UserData;
        
        setUserData({
          id: typedData.id,
          username: typedData.username,
          name: typedData.name,
          role: typedData.role
        });
        
        // Log the action
        await logUserAction('Login no sistema', username, 'Login bem-sucedido');
        
        showSuccessToast('Login realizado com sucesso!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
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
