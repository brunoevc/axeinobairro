import React from 'react';
import { CartProvider } from './hooks/useCart';
import { LocationProvider } from './hooks/useLocation';
import { TooltipProvider } from './components/ui/tooltip';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TooltipProvider>
      <LocationProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </LocationProvider>
    </TooltipProvider>
  );
};

