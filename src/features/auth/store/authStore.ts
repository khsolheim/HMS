import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/shared/types/models';

interface AuthState {
  // Firebase auth user
  firebaseUser: FirebaseUser | null;
  
  // Full user data from Firestore
  user: User | null;
  
  // Loading states
  isLoading: boolean;
  isInitializing: boolean;
  
  // Actions
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitializing: (initializing: boolean) => void;
  clearAuth: () => void;
  
  // Derived state
  isAuthenticated: () => boolean;
  isPro: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  firebaseUser: null,
  user: null,
  isLoading: true,
  isInitializing: true,
  
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  
  setUser: (user) => set({ user }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setInitializing: (isInitializing) => set({ isInitializing }),
  
  clearAuth: () => set({
    firebaseUser: null,
    user: null,
    isLoading: false,
  }),
  
  isAuthenticated: () => {
    const state = get();
    return state.firebaseUser !== null && state.user !== null;
  },
  
  isPro: () => {
    const state = get();
    return state.user?.subscriptionTier === 'pro' || state.user?.subscriptionTier === 'team';
  },
}));

