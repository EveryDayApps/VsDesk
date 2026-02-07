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
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500 group-focus-within:text-vscode-blue transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-3 bg-vscode-input border border-vscode-border rounded-lg leading-5 placeholder-gray-500 text-gray-300 focus:outline-none focus:ring-1 focus:ring-vscode-blue focus:border-vscode-blue transition-all shadow-sm"
          placeholder="Search Google or type a URL..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-xs text-gray-500 border border-gray-600 rounded px-1.5 py-0.5">
            ↵
          </span>
        </div>
      </div>
    </form>
  );
}
