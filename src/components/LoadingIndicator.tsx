
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Processing document...' 
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50 animate-fade-in">
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center gap-5 max-w-xs w-full">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary opacity-25 animate-spin-slow"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-pulse-opacity"></div>
        </div>
        
        <div className="space-y-1 text-center">
          <p className="font-medium text-lg animate-pulse">{message}</p>
          <p className="text-sm text-muted-foreground">This may take a moment...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
