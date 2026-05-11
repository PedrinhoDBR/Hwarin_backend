import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from './lib/query-client'
import 'react-quill-new/dist/quill.snow.css';
import "./global.css"
import App from './App.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);