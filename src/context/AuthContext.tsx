
// Re-export everything from the new auth folder
export * from './auth';

// For backwards compatibility, also export the specific items
export { default as AuthContext } from './auth/AuthContext';
export { default as AuthProvider } from './auth/AuthProvider';
export { default as useAuth } from './auth/useAuth';
