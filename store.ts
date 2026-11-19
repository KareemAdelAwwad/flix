import { create } from 'zustand';
import { fetchWatchlistIds } from '@/lib/FetchWatchlist';
import { fetchCompletedIds } from '@/lib/FetchCompleted';
import { addToWatchlist } from '@/lib/AddToWatchlist';
import { addToCompleted } from '@/lib/AddToCompleted';

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
  isActive: false,
  isLoading: true,
  expirationDate: null,
  price: 0,

  setSubscriptionStatus: (active) => set({ isActive: active }),
  setLoading: (loading) => set({ isLoading: loading }),
  setPrice: (price) => set({ price }),
  setExpirationDate: (date) => set({ expirationDate: date }),
}));

interface UserListsState {
  watchlistSet: Set<string>;
  completedSet: Set<string>;
  loadedUserId: string | null;
  isLoading: boolean;
  initUserLists: (userId: string) => Promise<void>;
  clearUserLists: () => void;
  toggleWatchlist: (userId: string, titleId: string, titleType: 'movie' | 'tv') => Promise<void>;
  toggleCompleted: (userId: string, titleId: string, titleType: 'movie' | 'tv') => Promise<void>;
}

const makeKey = (titleType: 'movie' | 'tv', titleId: string) => `${titleType}:${titleId}`;

export const useUserListsStore = create<UserListsState>((set, get) => ({
  watchlistSet: new Set<string>(),
  completedSet: new Set<string>(),
  loadedUserId: null,
  isLoading: false,

  initUserLists: async (userId: string) => {
    const { loadedUserId, isLoading } = get();
    if (!userId || loadedUserId === userId || isLoading) return;

    set({ isLoading: true });
    try {
      const [watchlistKeys, completedKeys] = await Promise.all([
        fetchWatchlistIds(userId),
        fetchCompletedIds(userId),
      ]);
      set({
        watchlistSet: new Set(watchlistKeys),
        completedSet: new Set(completedKeys),
        loadedUserId: userId,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load user lists:', error);
      set({ isLoading: false });
    }
  },

  clearUserLists: () =>
    set({
      watchlistSet: new Set<string>(),
      completedSet: new Set<string>(),
      loadedUserId: null,
      isLoading: false,
    }),

  toggleWatchlist: async (userId: string, titleId: string, titleType: 'movie' | 'tv') => {
    const key = makeKey(titleType, titleId);
    const prevSet = get().watchlistSet;
    const nextSet = new Set(prevSet);
    const wasPresent = nextSet.has(key);

    if (wasPresent) {
      nextSet.delete(key);
    } else {
      nextSet.add(key);
    }
    set({ watchlistSet: nextSet });

    try {
      await addToWatchlist(userId, titleId, titleType);
    } catch (error) {
      set({ watchlistSet: prevSet });
      throw error;
    }
  },

  toggleCompleted: async (userId: string, titleId: string, titleType: 'movie' | 'tv') => {
    const key = makeKey(titleType, titleId);
    const prevSet = get().completedSet;
    const nextSet = new Set(prevSet);
    const wasPresent = nextSet.has(key);

    if (wasPresent) {
      nextSet.delete(key);
    } else {
      nextSet.add(key);
    }
    set({ completedSet: nextSet });

    try {
      await addToCompleted(userId, titleId, titleType);
    } catch (error) {
      set({ completedSet: prevSet });
      throw error;
    }
  },
}));
