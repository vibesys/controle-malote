
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kcyaxdhdqmjdvqbtxxtq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjeWF4ZGhkcW1qZHZxYnR4eHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MDc0ODgsImV4cCI6MjA2MTE4MzQ4OH0.DbEURaEA3Y5kWFTaXi_LA8AjYbihA8jDEVK93-Di8g8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true
  }
});
