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
          <Search className="h-5 w-5 text-gray-500 group-focus-within:text-vscode-blue transition-colors" />
        </div>
        <vscode-textfield
          className="w-full pl-12 pr-16"
          placeholder="Search Google or type a URL..."
          value={query}
          onInput={(e: any) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <vscode-badge>↵</vscode-badge>
        </div>
      </div>
    </form>
  );
}
