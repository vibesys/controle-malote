
// Basic types for our data
export interface BaseEntity {
  id: string;
}

export interface Empresa extends BaseEntity {
  razao_social: string;
}

export interface Departamento extends BaseEntity {
  nome_departamento: string;
}

export interface Destinatario extends BaseEntity {
  nome_destinatario: string;
}

export interface MeioTransporte extends BaseEntity {
  nome: string;
}

export interface Malote extends BaseEntity {
  data_cadastro: string;
  documento_recebido: string;
  data_chegada: string;
  como_chegou: string;
  informar_outros: string;
  empresa_id: string | null;
  razao_social: string;
  pessoa_remetente: string;
  departamento_id: string | null;
  nome_departamento: string;
  destinatario_id: string | null;
  nome_destinatario: string;
  pessoa_que_recebeu: string;
  data_entrega: string;
  tipo_tabela: string;
}

export interface Log {
  id: string;
  acao: string;
  usuario_email: string;
  data_hora: string;
  detalhes: string;
}

// Collection names in localStorage
const COLLECTIONS = {
  EMPRESAS: 'empresas',
  DEPARTAMENTOS: 'departamentos',
  DESTINATARIOS: 'destinatarios',
  MEIOS_TRANSPORTE: 'meiosTransporte',
  MALOTES: 'malotes',
  LOGS: 'logs',
  USERS: 'users',
};

// Initialize collections if they don't exist
export function initializeCollections(): void {
  Object.values(COLLECTIONS).forEach(collection => {
    if (!localStorage.getItem(collection)) {
      localStorage.setItem(collection, JSON.stringify([]));
    }
  });
}

// Generic CRUD operations
export function getAll<T>(collection: string): T[] {
  const data = localStorage.getItem(collection);
  return data ? JSON.parse(data) : [];
}

export function getById<T extends BaseEntity>(collection: string, id: string): T | null {
  const items = getAll<T>(collection);
  return items.find(item => item.id === id) || null;
}

export function create<T extends BaseEntity>(collection: string, item: Omit<T, 'id'>): T {
  const items = getAll<T>(collection);
  const newItem = { ...item, id: crypto.randomUUID() } as T;
  localStorage.setItem(collection, JSON.stringify([...items, newItem]));
  return newItem;
}

export function update<T extends BaseEntity>(collection: string, id: string, item: Partial<T>): T | null {
  const items = getAll<T>(collection);
  const index = items.findIndex(i => i.id === id);
  
  if (index === -1) return null;
  
  const updatedItem = { ...items[index], ...item };
  items[index] = updatedItem;
  localStorage.setItem(collection, JSON.stringify(items));
  
  return updatedItem;
}

export function remove<T extends BaseEntity>(collection: string, id: string): boolean {
  const items = getAll<T>(collection);
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) return false;
  
  localStorage.setItem(collection, JSON.stringify(filteredItems));
  return true;
}

// Specific collection operations
export const empresasDB = {
  getAll: () => getAll<Empresa>(COLLECTIONS.EMPRESAS),
  getById: (id: string) => getById<Empresa>(COLLECTIONS.EMPRESAS, id),
  create: (empresa: Omit<Empresa, 'id'>) => create<Empresa>(COLLECTIONS.EMPRESAS, empresa),
  update: (id: string, empresa: Partial<Empresa>) => update<Empresa>(COLLECTIONS.EMPRESAS, id, empresa),
  remove: (id: string) => remove<Empresa>(COLLECTIONS.EMPRESAS, id)
};

export const departamentosDB = {
  getAll: () => getAll<Departamento>(COLLECTIONS.DEPARTAMENTOS),
  getById: (id: string) => getById<Departamento>(COLLECTIONS.DEPARTAMENTOS, id),
  create: (departamento: Omit<Departamento, 'id'>) => create<Departamento>(COLLECTIONS.DEPARTAMENTOS, departamento),
  update: (id: string, departamento: Partial<Departamento>) => update<Departamento>(COLLECTIONS.DEPARTAMENTOS, id, departamento),
  remove: (id: string) => remove<Departamento>(COLLECTIONS.DEPARTAMENTOS, id)
};

export const destinatariosDB = {
  getAll: () => getAll<Destinatario>(COLLECTIONS.DESTINATARIOS),
  getById: (id: string) => getById<Destinatario>(COLLECTIONS.DESTINATARIOS, id),
  create: (destinatario: Omit<Destinatario, 'id'>) => create<Destinatario>(COLLECTIONS.DESTINATARIOS, destinatario),
  update: (id: string, destinatario: Partial<Destinatario>) => update<Destinatario>(COLLECTIONS.DESTINATARIOS, id, destinatario),
  remove: (id: string) => remove<Destinatario>(COLLECTIONS.DESTINATARIOS, id)
};

export const meiosTransporteDB = {
  getAll: () => getAll<MeioTransporte>(COLLECTIONS.MEIOS_TRANSPORTE),
  getById: (id: string) => getById<MeioTransporte>(COLLECTIONS.MEIOS_TRANSPORTE, id),
  create: (meioTransporte: Omit<MeioTransporte, 'id'>) => create<MeioTransporte>(COLLECTIONS.MEIOS_TRANSPORTE, meioTransporte),
  update: (id: string, meioTransporte: Partial<MeioTransporte>) => update<MeioTransporte>(COLLECTIONS.MEIOS_TRANSPORTE, id, meioTransporte),
  remove: (id: string) => remove<MeioTransporte>(COLLECTIONS.MEIOS_TRANSPORTE, id)
};

export const malotesDB = {
  getAll: () => getAll<Malote>(COLLECTIONS.MALOTES),
  getByTipo: (tipo: string) => {
    const malotes = getAll<Malote>(COLLECTIONS.MALOTES);
    return malotes.filter(m => m.tipo_tabela === tipo);
  },
  getById: (id: string) => getById<Malote>(COLLECTIONS.MALOTES, id),
  create: (malote: Omit<Malote, 'id'>) => create<Malote>(COLLECTIONS.MALOTES, malote),
  update: (id: string, malote: Partial<Malote>) => update<Malote>(COLLECTIONS.MALOTES, id, malote),
  remove: (id: string) => remove<Malote>(COLLECTIONS.MALOTES, id),
  removeMany: (ids: string[]) => {
    let malotes = getAll<Malote>(COLLECTIONS.MALOTES);
    const initialCount = malotes.length;
    malotes = malotes.filter(m => !ids.includes(m.id));
    localStorage.setItem(COLLECTIONS.MALOTES, JSON.stringify(malotes));
    return initialCount - malotes.length;
  }
};

export const logsDB = {
  getAll: () => getAll<Log>(COLLECTIONS.LOGS),
  create: (log: Omit<Log, 'id'>) => create<Log>(COLLECTIONS.LOGS, log)
};

// Initialize all collections when this module loads
initializeCollections();
