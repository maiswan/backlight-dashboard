import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { DashbaordProvider } from './hooks/useCommandContext.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DashbaordProvider>
            <App />
        </DashbaordProvider>
    </StrictMode>,
)
