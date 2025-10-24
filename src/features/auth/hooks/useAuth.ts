import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { useAuthStore } from '../store/authStore';
import { getUser, createUser } from '@/services/firebase/firestore';

/**
 * Hook to initialize auth state listener
 * Call this once in App.tsx
 */
export const useAuthInit = () => {
  const { setFirebaseUser, setUser, setInitializing, clearAuth } = useAuthStore();

  useEffect(() => {
    setInitializing(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setFirebaseUser(firebaseUser);

        // Fetch user data from Firestore
        const { user, error } = await getUser(firebaseUser.uid);

        if (error || !user) {
          // User doesn't exist in Firestore, create it
          const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
          
          await createUser(firebaseUser.uid, {
            displayName,
            email: firebaseUser.email!,
            photoURL: firebaseUser.photoURL || undefined,
          });

          // Fetch newly created user
          const { user: newUser } = await getUser(firebaseUser.uid);
          setUser(newUser);
        } else {
          setUser(user);
        }
      } else {
        // User is signed out
        clearAuth();
      }

      setInitializing(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [setFirebaseUser, setUser, setInitializing, clearAuth]);
};

/**
 * Hook to get current auth state
 */
export const useAuth = () => {
  const authState = useAuthStore();

  return {
    user: authState.user,
    firebaseUser: authState.firebaseUser,
    isLoading: authState.isLoading,
    isInitializing: authState.isInitializing,
    isAuthenticated: authState.isAuthenticated(),
    isPro: authState.isPro(),
  };
};

