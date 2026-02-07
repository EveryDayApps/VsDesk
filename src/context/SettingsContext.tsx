import { createContext, ReactNode, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface SettingsState {
  showTitleBar: boolean;
  showActivityBar: boolean;
  showSidebar: boolean;
  showStatusBar: boolean;
  showClock: boolean;
  showGoogleSearch: boolean;
  showQuickLinks: boolean;
  showNotes: boolean;
  showTodoList: boolean;
}

const defaultSettings: SettingsState = {
  showTitleBar: true,
  showActivityBar: true,
  showSidebar: true,
  showStatusBar: true,
  showClock: true,
  showGoogleSearch: true,
  showQuickLinks: true,
  showNotes: true,
  showTodoList: true,
};

interface SettingsContextType {
  settings: SettingsState;
  updateSetting: (key: keyof SettingsState, value: boolean) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<SettingsState>('vsdesk-settings', defaultSettings);

  const updateSetting = (key: keyof SettingsState, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
