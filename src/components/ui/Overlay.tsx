import { cn } from '../../utils/cn';

interface OverlayProps {
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
  blur?: boolean;
}

export function Overlay({ 
  onClose, 
  className, 
  children, 
  blur = true
}: OverlayProps) {
  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-all duration-200 animate-in fade-in",
        blur && "backdrop-blur-sm",
        className
      )}
      onClick={(e) => {
        // Only close if clicking the overlay itself
        if (e.target === e.currentTarget && onClose) {
           onClose();
        }
      }}
    >
      {children}
    </div>
  );
}
