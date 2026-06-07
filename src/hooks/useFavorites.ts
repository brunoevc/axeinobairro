import { useState, useEffect } from 'react';
import { storage } from '@/repositories/storage';
import { toast } from 'sonner';

const FAVORITES_KEY = 'axei_favorites';

export type FavoriteItem = {
  id: string;
  type: 'merchant' | 'service' | 'news' | 'community';
  addedAt: string;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const saved = storage.get<FavoriteItem[]>(FAVORITES_KEY, []);
    setFavorites(saved);
  }, []);

  const toggleFavorite = (id: string, type: FavoriteItem['type'], name?: string) => {
    const isFavorite = favorites.some(f => f.id === id);
    let newFavorites: FavoriteItem[];

    if (isFavorite) {
      newFavorites = favorites.filter(f => f.id !== id);
      toast.info(`${name || 'Item'} removido dos favoritos`);
    } else {
      newFavorites = [...favorites, { id, type, addedAt: new Date().toISOString() }];
      toast.success(`${name || 'Item'} adicionado aos favoritos!`);
    }

    setFavorites(newFavorites);
    storage.set(FAVORITES_KEY, newFavorites);
  };

  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  return { favorites, toggleFavorite, isFavorite };
}
