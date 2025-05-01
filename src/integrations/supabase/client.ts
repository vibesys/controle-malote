
import { createClient } from '@supabase/supabase-js';

// Chaves da API do Supabase
const SUPABASE_URL = "https://kcyaxdhdqmjdvqbtxxtq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjeWF4ZGhkcW1qZHZxYnR4eHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MDc0ODgsImV4cCI6MjA2MTE4MzQ4OH0.DbEURaEA3Y5kWFTaXi_LA8AjYbihA8jDEVK93-Di8g8";

// Criando o cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage, // Utiliza o armazenamento local para persistir a sessão
    persistSession: true,  // Permite que a sessão seja persistida
    autoRefreshToken: true // Refresca automaticamente o token de autenticação
  }
});
