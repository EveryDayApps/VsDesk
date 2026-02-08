import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { Dialog, DialogType } from '../components/ui/Dialog';

interface DialogContextType {
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
  showPrompt: (message: string, defaultValue?: string) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: DialogType;
    message: string;
    defaultValue?: string;
    resolve: (value: any) => void;
  }>({
    isOpen: false,
    type: 'alert',
    message: '',
    resolve: () => {},
  });

  const closeDialog = useCallback((result: any) => {
    setDialogState((prev) => {
      // Resolve the promise via the stored resolve function
      prev.resolve(result);
      return { ...prev, isOpen: false };
    });
  }, []);

  const showAlert = useCallback((message: string) => {
    return new Promise<void>((resolve) => {
      setDialogState({
        isOpen: true,
        type: 'alert',
        message,
        resolve: () => resolve(),
      });
    });
  }, []);

  const showConfirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        isOpen: true,
        type: 'confirm',
        message,
        resolve,
      });
    });
  }, []);

  const showPrompt = useCallback((message: string, defaultValue?: string) => {
    return new Promise<string | null>((resolve) => {
      setDialogState({
        isOpen: true,
        type: 'prompt',
        message,
        defaultValue,
        resolve,
      });
    });
  }, []);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      <Dialog
        isOpen={dialogState.isOpen}
        type={dialogState.type}
        message={dialogState.message}
        defaultValue={dialogState.defaultValue}
        onClose={closeDialog}
      />
    </DialogContext.Provider>
  );
}
