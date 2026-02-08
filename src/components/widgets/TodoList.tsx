import { Calendar, Trash2 } from 'lucide-react';
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
        <vscode-badge>{todos.filter((t) => t.completed).length}/{todos.length}</vscode-badge>
      </div>

      <vscode-scrollable className="flex-1 p-2">
        <div className="space-y-1">
          {todos.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-vscode-text opacity-40 py-8">
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
              <vscode-checkbox
                checked={todo.completed}
                onClick={() => toggleTodo(todo.id)}
              />
              <span
                className={cn(
                  "flex-1 text-sm text-vscode-text truncate",
                  todo.completed && "line-through text-vscode-text-muted"
                )}
              >
                {todo.text}
              </span>
              <vscode-button
                appearance="icon"
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </vscode-button>
            </div>
          ))}
        </div>
      </vscode-scrollable>

      <form onSubmit={addTodo} className="p-3 bg-vscode-bg border-t border-vscode-border">
        <div className="flex gap-2">
          <vscode-textfield
            className="flex-1"
            placeholder="Add a task..."
            value={inputValue}
            onInput={(e: any) => setInputValue(e.target.value)}
          />
          <vscode-button
            type="submit"
            disabled={!inputValue.trim()}
          >
            Add
          </vscode-button>
        </div>
      </form>
    </div>
  );
}
