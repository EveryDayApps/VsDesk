import { Search } from 'lucide-react';
import { FormEvent, useState } from 'react';

export function GoogleSearch() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        query
      )}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-8 mb-12">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-gray-500 group-focus-within:text-[var(--vscode-focusBorder)] transition-colors" />
        </div>
        <input
          type="text"
          className="w-full bg-[var(--vscode-input-background)] text-[var(--vscode-input-foreground)] border border-[var(--vscode-input-border)] rounded-md px-12 py-3 focus:outline-none focus:border-[var(--vscode-focusBorder)] focus:ring-1 focus:ring-[var(--vscode-focusBorder)] transition-all placeholder-gray-500"
          placeholder="Search Google or type a URL..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <div className="flex items-center justify-center h-6 w-6 rounded text-xs text-gray-400 border border-gray-600">
            ↵
          </div>
        </div>
      </div>
    </form>
  );
}
