import { format } from 'date-fns';
import { useTime } from '../../hooks/useTime';

export function Clock() {
  const time = useTime();

  return (
    <div className="flex flex-col items-center justify-center p-8 select-none">
      <h1 className="text-8xl font-bold tracking-tight text-white/90">
        {format(time, 'HH:mm')}
      </h1>
      <p className="mt-2 text-xl text-vscode-text font-light tracking-wide">
        {format(time, 'EEEE, MMMM do, yyyy')}
      </p>
    </div>
  );
}
