import { useEffect, useRef, useState } from 'react';
import { Overlay } from './Overlay';

export type DialogType = 'alert' | 'confirm' | 'prompt';

interface DialogProps {
  isOpen: boolean;
  type: DialogType;
  message: string;
  defaultValue?: string;
  onClose: (result: any) => void;
}

export function Dialog({ isOpen, type, message, defaultValue, onClose }: DialogProps) {
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue || '');
      // Focus input if prompt, or confirm button if alert/confirm
      const timer = setTimeout(() => {
        if (type === 'prompt' && inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, defaultValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === 'prompt') {
      onClose(inputValue);
    } else {
      onClose(true);
    }
  };

  const handleCancel = () => {
    onClose(type === 'prompt' ? null : false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Overlay blur={true} onClose={type === 'alert' ? handleConfirm : handleCancel} className="flex items-center justify-center p-4">
      <div 
        className="bg-[var(--sidebar-bg)] border border-[var(--border-secondary)] shadow-lg rounded-sm w-[400px] max-w-[90vw] p-4 animate-in zoom-in-95 duration-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="text-[var(--text-heading)] font-medium mb-3">
          {type === 'alert' ? 'Notification' : type === 'confirm' ? 'Confirmation' : 'Input Required'}
        </div>
        
        <p className="text-[var(--text-primary)] text-sm mb-4 whitespace-pre-wrap leading-relaxed select-text">
          {message}
        </p>

        {type === 'prompt' && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-fg)] px-2 py-1 text-sm outline-none focus:border-[var(--focus-border)] mb-4 block"
            spellCheck={false}
          />
        )}

        <div className="flex justify-end gap-2 mt-auto">
          {type !== 'alert' && (
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm rounded-sm bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-fg)] hover:bg-[var(--btn-secondary-hover)] transition-colors border border-transparent focus:border-[var(--focus-border)] outline-none"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-3 py-1.5 text-sm rounded-sm bg-[var(--vscode-button-background)] text-[var(--vscode-button-foreground)] hover:bg-[var(--vscode-button-hoverBackground)] transition-colors border border-transparent focus:border-[var(--focus-border)] outline-none"
            autoFocus={type !== 'prompt'}
          >
            OK
          </button>
        </div>
      </div>
    </Overlay>
  );
}
