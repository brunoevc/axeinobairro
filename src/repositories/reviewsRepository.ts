import { Review, ReviewTargetType } from "@/types/reviews";
import { mockReviews } from "@/data/reviews";
import { storage } from "./storage";

const STORAGE_KEY = "axei_reviews";

export const reviewsRepository = {
  getAll: (): Review[] => {
    return storage.get(STORAGE_KEY, mockReviews);
  },

  getByTarget: (targetType: ReviewTargetType, targetId: string): Review[] => {
    return reviewsRepository.getAll().filter(
      (r) => r.targetType === targetType && r.targetId === targetId && r.isVisible
    );
  },

  create: (review: Omit<Review, "id" | "createdAt" | "isVisible">): Review => {
    if (!review.authorName) throw new Error("Nome é obrigatório");
    if (review.rating < 1 || review.rating > 5) throw new Error("Nota deve ser entre 1 e 5");
    if (review.comment.length < 10) throw new Error("Comentário deve ter no mínimo 10 caracteres");

    const all = reviewsRepository.getAll();
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isVisible: true,
    };
    
    all.push(newReview);
    storage.set(STORAGE_KEY, all);
    return newReview;
  },

  update: (id: string, updates: Partial<Review>): void => {
    const all = reviewsRepository.getAll();
    const index = all.findIndex((r) => r.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      storage.set(STORAGE_KEY, all);
    }
  },

  delete: (id: string): void => {
    const all = reviewsRepository.getAll().filter((r) => r.id !== id);
    storage.set(STORAGE_KEY, all);
  },

  hide: (id: string): void => {
    reviewsRepository.update(id, { isVisible: false });
  },

  restore: (id: string): void => {
    reviewsRepository.update(id, { isVisible: true });
  },

  getAverageRating: (targetType: ReviewTargetType, targetId: string) => {
    const reviews = reviewsRepository.getByTarget(targetType, targetId);
    if (reviews.length === 0) return { average: 0, total: 0 };
    
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: Number((sum / reviews.length).toFixed(1)),
      total: reviews.length
    };
  }
};

