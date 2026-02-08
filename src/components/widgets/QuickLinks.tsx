import { Cloud, Github, Layers, Mail, MessageSquare, Youtube } from 'lucide-react';

const links = [
  { name: 'GitHub', url: 'https://github.com', icon: Github, color: 'text-white' },
  { name: 'ChatGPT', url: 'https://chat.openai.com', icon: MessageSquare, color: 'text-emerald-400' },
  { name: 'Gmail', url: 'https://mail.google.com', icon: Mail, color: 'text-red-400' },
  { name: 'YouTube', url: 'https://youtube.com', icon: Youtube, color: 'text-red-500' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: Layers, color: 'text-orange-400' },
  { name: 'Vercel', url: 'https://vercel.com', icon: Cloud, color: 'text-white' },
];

export function QuickLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-4xl mx-auto px-4">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          className="group flex flex-col items-center justify-center p-4 rounded-xl bg-vscode-sidebar border border-transparent hover:border-vscode-focusBorder hover:bg-vscode-list-hover transition-all duration-200 ease-in-out transform hover:-translate-y-1"
        >
          <div className={`p-3 rounded-full bg-vscode-bg group-hover:bg-vscode-activityBar transition-colors ${link.color}`}>
            <link.icon className="w-8 h-8" />
          </div>
          <span className="mt-3 text-sm font-medium text-vscode-text-secondary group-hover:text-white transition-colors">
            {link.name}
          </span>
        </a>
      ))}
    </div>
  );
}
