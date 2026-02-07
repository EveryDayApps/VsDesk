import { Calendar, Check, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { cn } from '../../utils/cn';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export function TodoList() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('vshome-todos', []);
  const [inputValue, setInputValue] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-vscode-sidebar border border-vscode-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-vscode-sidebar border-b border-vscode-border">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-vscode-blue" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-vscode-text">
            Tasks
          </h2>
        </div>
        <span className="text-xs text-vscode-text opacity-50">
          {todos.filter((t) => t.completed).length}/{todos.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-vscode-text opacity-40">
            <span className="text-sm">No tasks yet</span>
          </div>
        )}
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={cn(
              "group flex items-center gap-3 p-2 rounded-md hover:bg-vscode-list-hover transition-colors",
              todo.completed && "opacity-50"
            )}
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={cn(
                "flex items-center justify-center w-5 h-5 rounded border border-gray-600 transition-colors",
                todo.completed
                  ? "bg-vscode-blue border-vscode-blue text-white"
                  : "hover:border-vscode-blue bg-vscode-input"
              )}
            >
              {todo.completed && <Check className="w-3 h-3" />}
            </button>
            <span
              className={cn(
                "flex-1 text-sm text-gray-300 truncate",
                todo.completed && "line-through text-gray-500"
              )}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={addTodo} className="p-3 bg-vscode-bg border-t border-vscode-border">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-vscode-input border border-vscode-input hover:border-vscode-border focus:border-vscode-blue rounded px-3 py-2 text-sm text-gray-300 focus:outline-none transition-colors pr-8"
            placeholder="Add a task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-vscode-blue hover:text-blue-400 transition-colors disabled:opacity-50"
            disabled={!inputValue.trim()}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
