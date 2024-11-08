// store.ts
import { create } from 'zustand';

interface Subscription {
  isActive: boolean;
  isLoading: boolean;
  price: number;
  expirationDate: Date | null;
}

interface SubscriptionActions {
  setSubscriptionStatus: (active: boolean) => void;
  setLoading: (loading: boolean) => void;
  setPrice: (price: number) => void;
  setExpirationDate: (date: Date | null) => void;
}

type SubscriptionStore = Subscription & SubscriptionActions;

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  // Initial state
  isActive: false,
  isLoading: true,
  expirationDate: null,
  price: 0,

  // Actions
  setSubscriptionStatus: (active) => set({ isActive: active }),
  setLoading: (loading) => set({ isLoading: loading }),
  setPrice: (price) => set({ price }),
  setExpirationDate: (date) => set({ expirationDate: date }),
}));