import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SettingsProvider } from './context/SettingsContext.tsx'
import { WorkspaceProvider } from './context/WorkspaceContext.tsx'
import { workspaceRegistry } from './workspaces/index.ts'
import './index.css'
import './vscode-elements-setup'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <WorkspaceProvider workspaces={workspaceRegistry}>
        <App />
      </WorkspaceProvider>
    </SettingsProvider>
  </React.StrictMode>,
)
