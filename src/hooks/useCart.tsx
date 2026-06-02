
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/metrics';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  merchantId: string | null;
  notes: string;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  setNotes: (notes: string) => void;
  getTotal: () => number;
  getItemsCount: () => number;
}

const CART_STORAGE_KEY = 'axei_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed.items || []);
        setMerchantId(parsed.merchantId || null);
        setNotes(parsed.notes || '');
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, merchantId, notes }));
  }, [items, merchantId, notes]);

  const addItem = (product: Product) => {
    if (merchantId && merchantId !== product.merchantId) {
      // Logic for changing merchant would be handled in the UI before calling this
      // or we can force reset here for simplicity if needed
      return;
    }

    if (!merchantId) setMerchantId(product.merchantId);

    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    trackEvent(product.merchantId, "product_added");

    toast.success(`${product.name} adicionado ao carrinho`);

  };

  const removeItem = (productId: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== productId);
      if (newItems.length === 0) setMerchantId(null);
      return newItems;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
    setMerchantId(null);
    setNotes('');
  };

  const getTotal = () => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getItemsCount = () => items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, merchantId, notes, addItem, removeItem, updateQuantity, clearCart, setNotes, getTotal, getItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
