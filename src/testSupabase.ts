
import { supabase } from './caminho/do/arquivo/supabase';  // Substitua pelo caminho correto do arquivo

// Testar autenticação e monitorar mudanças de sessão
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Evento de autenticação:', event);
  console.log('Sessão:', session);
});

// Teste de login
const testLogin = async () => {
  try {
    const { user, error } = await supabase.auth.signInWithPassword({
      email: 'usuario_teste@example.com', // Substitua com um email válido ou usuário
      password: 'senha_teste',             // Substitua com uma senha válida
    });

    if (error) {
      console.log('Erro ao tentar login:', error.message);
    } else {
      console.log('Login bem-sucedido! Usuário:', user);
    }
  } catch (error) {
    console.log('Erro durante o login:', error);
  }
};

// Iniciar o teste
testLogin();
