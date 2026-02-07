import { useLocalStorage } from '../../hooks/useLocalStorage';

export function Notes() {
  const [notes, setNotes] = useLocalStorage('vshome-notes', '');

  return (
    <div className="flex flex-col h-full bg-vscode-sidebar rounded-lg border border-vscode-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-vscode-sidebar border-b border-vscode-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-vscode-text">
          Scratchpad
        </h2>
        <vscode-badge>Local Storage</vscode-badge>
      </div>
      <vscode-textarea
        className="flex-1 w-full"
        rows={20}
        resize="vertical"
        placeholder="- Type your quick notes here...&#10;- They are saved automatically."
        value={notes}
        onInput={(e: any) => setNotes(e.target.value)}
      />
    </div>
  );
}
