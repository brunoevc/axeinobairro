export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
      
      // Fallback for old keys (axe_ -> axei_)
      const oldKey = key.replace('axei_', 'axe_');
      const oldStored = localStorage.getItem(oldKey);
      if (oldStored) {
        const parsed = JSON.parse(oldStored);
        localStorage.setItem(key, JSON.stringify(parsed));
        return parsed;
      }
    } catch (e) {
      console.error(`Error reading ${key}, returning default`, e);
    }
    return defaultValue;
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key}`, e);
    }
  }
};
