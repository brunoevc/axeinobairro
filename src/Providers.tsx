
import React from 'react';
import { CartProvider } from './hooks/useCart';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
};
