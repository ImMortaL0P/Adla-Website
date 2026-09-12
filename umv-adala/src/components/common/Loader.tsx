import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'muted' | 'white';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses = {
  primary: 'text-[hsl(var(--primary-strong))]',
  muted: 'text-[hsl(var(--muted-foreground))]',
  white: 'text-white',
};

export function Loader({ 
  text, 
  className,
  size = 'md',
  variant = 'primary'
}: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 
        className={cn("animate-spin", sizeClasses[size], variantClasses[variant])} 
        aria-hidden="true" 
      />
      {text && (
        <span className={cn(
          "font-medium animate-pulse", 
          variant === 'white' ? 'text-white/80' : 'text-[hsl(var(--muted-foreground))]'
        )}>
          {text}
        </span>
      )}
    </div>
  );
}
