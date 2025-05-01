
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeDefaultAdmin } from './utils/userDB.ts'

// Initialize the default admin user
initializeDefaultAdmin()
  .then(() => {
    console.log('Authentication initialization complete');
  })
  .catch(error => {
    console.error('Error during authentication initialization:', error);
  });

createRoot(document.getElementById("root")!).render(<App />);
