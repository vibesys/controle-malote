
// This file is for backward compatibility
// It re-exports all the database modules from the new directory structure
import { 
  empresasDB, 
  departamentosDB, 
  destinatariosDB, 
  meiosTransporteDB, 
  malotesDB, 
  logsDB 
} from './supabase';

export {
  empresasDB,
  departamentosDB,
  destinatariosDB,
  meiosTransporteDB,
  malotesDB,
  logsDB
};
