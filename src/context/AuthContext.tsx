
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '@/components/ui/toast-custom';

export type UserRole = 'administrador' | 'dp-rh' | 'recepcao' | 'triagem';

interface UserData {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
          await fetchUserData(newSession.user.id);
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
        await fetchUserData(session.user.id);
      }
      
      setIsLoading(false);
    };

    initSession();
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user data:', error);
      return;
    }
    
    if (data) {
      setUserData({
        id: data.id,
        username: data.username,
        name: data.name,
        role: data.role as UserRole
      });
    }
  };

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Call the authenticate function
      const { data, error } = await supabase.rpc('authenticate', {
        username,
        password
      });

      if (error) throw error;
      
      if (data && data.error) {
        showErrorToast(data.error);
        setIsLoading(false);
        return;
      }

      // If authentication successful, set user data
      if (data) {
        setUserData({
          id: data.id,
          username: data.username,
          name: data.name,
          role: data.role
        });
        
        // Log the action
        await supabase.from('logs').insert({
          acao: 'Login no sistema',
          usuario_email: username,
          data_hora: new Date().toISOString(),
          detalhes: 'Login bem-sucedido'
        });
        
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
        await supabase.from('logs').insert({
          acao: 'Logout do sistema',
          usuario_email: userData.username,
          data_hora: new Date().toISOString()
        });
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
      if (!userData) {
        showErrorToast('Usuário não está autenticado');
        return false;
      }
      
      // Verify current password
      const { data: verifyData, error: verifyError } = await supabase.rpc('authenticate', {
        username: userData.username,
        password: currentPassword
      });

      if (verifyError || (verifyData && verifyData.error)) {
        showErrorToast('Senha atual incorreta');
        return false;
      }
      
      // Update password
      const { error } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('id', userData.id);
        
      if (error) {
        showErrorToast('Erro ao atualizar a senha');
        return false;
      }
      
      // Log password change
      await supabase.from('logs').insert({
        acao: 'Alteração de senha',
        usuario_email: userData.username,
        data_hora: new Date().toISOString()
      });
      
      showSuccessToast('Senha alterada com sucesso!');
      return true;
    } catch (error) {
      console.error('Error during password change:', error);
      showErrorToast('Erro ao alterar senha.');
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
