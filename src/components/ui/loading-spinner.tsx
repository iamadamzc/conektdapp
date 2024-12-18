import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        {
          'h-4 w-4': size === 'sm',
          'h-6 w-6': size === 'md',
          'h-8 w-8': size === 'lg',
        },
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};