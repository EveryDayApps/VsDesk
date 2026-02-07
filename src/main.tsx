import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SettingsProvider } from './context/SettingsContext.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { WorkspaceProvider } from './context/WorkspaceContext.tsx'
import './index.css'
import './vscode-elements-setup'
import { workspaceRegistry } from './workspaces/index.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <SettingsProvider>
        <WorkspaceProvider workspaces={workspaceRegistry}>
          <App />
        </WorkspaceProvider>
      </SettingsProvider>
    </UserProvider>
  </React.StrictMode>,
)
