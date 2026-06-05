import { storage } from "./storage";

const STORAGE_KEY = "axei-feedback-v1";

export interface Feedback {
  id: string;
  liked: string;
  notUnderstood: string;
  missing: string;
  profile: string;
  whatsapp: string;
  createdAt: number;
}

type Listener = () => void;
const listeners: Listener[] = [];

export const feedbackRepository = {
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) listeners.splice(index, 1);
    };
  },
  
  notify: () => {
    listeners.forEach(l => l());
  },

  getAll: (): Feedback[] => {
    return storage.get(STORAGE_KEY, []);
  },

  add: (feedback: Omit<Feedback, "id" | "createdAt">) => {
    const feedbacks = feedbackRepository.getAll();
    const newFeedback: Feedback = {
      ...feedback,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    feedbacks.push(newFeedback);
    storage.set(STORAGE_KEY, feedbacks);
    feedbackRepository.notify();
  },

  delete: (id: string) => {
    const feedbacks = feedbackRepository.getAll().filter(f => f.id !== id);
    storage.set(STORAGE_KEY, feedbacks);
    feedbackRepository.notify();
  },

  getStats: () => {
    const feedbacks = feedbackRepository.getAll();
    return {
      total: feedbacks.length,
      byProfile: feedbacks.reduce((acc, f) => {
        acc[f.profile] = (acc[f.profile] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
};
