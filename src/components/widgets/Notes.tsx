import { useLocalStorage } from '../../hooks/useLocalStorage';

export function Notes() {
  const [notes, setNotes] = useLocalStorage('vshome-notes', '');

  return (
    <div className="flex flex-col h-full bg-vscode-sidebar rounded-lg border border-vscode-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-vscode-sidebar border-b border-vscode-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-vscode-text">
          Scratchpad
        </h2>
        <span className="text-xs text-vscode-text opacity-50">Local Storage</span>
      </div>
      <textarea
        className="flex-1 w-full bg-vscode-bg p-4 resize-none focus:outline-none text-sm font-mono text-gray-300 leading-relaxed placeholder-gray-600"
        placeholder="- Type your quick notes here...&#10;- They are saved automatically."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
