import React from 'react';
import { CartProvider } from './hooks/useCart';
import { LocationProvider } from './hooks/useLocation';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LocationProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </LocationProvider>
  );
};
