
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/metrics';

export interface CartItem extends Product {
  quantity: number;
  itemNote?: string;
}


export interface CheckoutData {
  customerName: string;
  customerPhone: string;
  orderType: 'retirada' | 'entrega';
  address: string;
  neighborhood: string;
  neighborhoodId?: string; // New field for delivery zone linking
  deliveryFee: number;     // New field
  referencePoint: string;
  paymentMethod: 'pix' | 'dinheiro' | 'cartao';
  changeFor: string;
  pixReceiptInstruction: boolean;
  deliveryLocationShared?: boolean;
}


const DEFAULT_CHECKOUT_DATA: CheckoutData = {
  customerName: '',
  customerPhone: '',
  orderType: 'retirada',
  address: '',
  neighborhood: '',
  deliveryFee: 0,
  referencePoint: '',
  paymentMethod: 'pix',
  changeFor: '',
  pixReceiptInstruction: true,
};


interface CartContextType {
  items: CartItem[];
  merchantId: string | null;
  notes: string;
  checkoutData: CheckoutData;
  addItem: (product: Product, itemNote?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  updateItemNote: (productId: string, note: string) => void;

  clearCart: () => void;
  setNotes: (notes: string) => void;
  setCheckoutData: (data: Partial<CheckoutData>) => void;
  getTotal: () => number;
  getItemsCount: () => number;
}

const CART_STORAGE_KEY = 'axei_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [checkoutData, setCheckoutDataState] = useState<CheckoutData>(DEFAULT_CHECKOUT_DATA);

  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed.items || []);
        setMerchantId(parsed.merchantId || null);
        setNotes(parsed.notes || '');
        if (parsed.checkoutData) {
          setCheckoutDataState(prev => ({ ...prev, ...parsed.checkoutData }));
        }
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, merchantId, notes, checkoutData }));
  }, [items, merchantId, notes, checkoutData]);

  const addItem = (product: Product, itemNote?: string) => {
    if (merchantId && merchantId !== product.merchantId) {
      return;
    }

    if (!merchantId) setMerchantId(product.merchantId);

    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.itemNote === itemNote);
      if (existingIndex !== -1) {
        const newItems = [...prev];
        newItems[existingIndex] = { 
          ...newItems[existingIndex], 
          quantity: newItems[existingIndex].quantity + 1 
        };
        return newItems;
      }
      return [...prev, { ...product, quantity: 1, itemNote }];
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

  const updateItemNote = (productId: string, note: string) => {
    setItems(prev => prev.map(item => 
      item.id === productId ? { ...item, itemNote: note } : item
    ));
  };

  const clearCart = () => {

    setItems([]);
    setMerchantId(null);
    setNotes('');
  };

  const setCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutDataState(prev => ({ ...prev, ...data }));
  };

  const getTotal = () => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getItemsCount = () => items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, 
      merchantId, 
      notes, 
      checkoutData,
      addItem, 
      removeItem, 
      updateQuantity, 
      updateItemNote,
      clearCart, 
      setNotes, 
      setCheckoutData,

      getTotal, 
      getItemsCount
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
