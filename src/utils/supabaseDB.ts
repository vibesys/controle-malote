
// This file is now just a re-export of all the individual database modules
// for backward compatibility with existing code

import { authAPI } from "./supabase/auth";
import { empresasDB } from "./supabase/empresas";
import { departamentosDB } from "./supabase/departamentos";
import { destinatariosDB } from "./supabase/destinatarios";
import { meiosTransporteDB } from "./supabase/meios-transporte";
import { malotesDB } from "./supabase/malotes";
import { logsDB } from "./supabase/logs";

export {
  authAPI,
  empresasDB,
  departamentosDB,
  destinatariosDB,
  meiosTransporteDB,
  malotesDB,
  logsDB
};
