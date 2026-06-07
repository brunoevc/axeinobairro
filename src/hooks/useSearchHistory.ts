import { useState, useEffect } from 'react';
import { storage } from '@/repositories/storage';

const SEARCH_HISTORY_KEY = 'axei_search_history';
const MAX_HISTORY = 5;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = storage.get<string[]>(SEARCH_HISTORY_KEY, []);
    setHistory(saved);
  }, []);

  const addSearchTerm = (term: string) => {
    if (!term.trim()) return;
    
    const normalized = term.trim();
    const newHistory = [
      normalized,
      ...history.filter(t => t.toLowerCase() !== normalized.toLowerCase())
    ].slice(0, MAX_HISTORY);

    setHistory(newHistory);
    storage.set(SEARCH_HISTORY_KEY, newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    storage.set(SEARCH_HISTORY_KEY, []);
  };

  return { history, addSearchTerm, clearHistory };
}
