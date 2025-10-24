import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from './config';
import { User, UserSettings } from '@/shared/types/models';

/**
 * Create new user document in Firestore
 */
export const createUser = async (
  uid: string,
  data: {
    displayName: string;
    email: string;
    photoURL?: string;
    googleUid?: string;
    appleUid?: string;
  }
): Promise<{ error: string | null }> => {
  try {
    const userRef = doc(db, 'users', uid);
    
    const defaultSettings: UserSettings = {
      theme: 'auto',
      language: 'nb-NO',
      currency: 'NOK',
      notifications: {
        enabled: true,
        lowStock: true,
        loanReminders: true,
        projectDeadlines: true,
        systemUpdates: true,
      },
      privacy: {
        showProfile: true,
        allowAnalytics: true,
      },
    };

    const userData: Omit<User, 'createdAt' | 'updatedAt'> = {
      uid,
      displayName: data.displayName,
      email: data.email,
      photoURL: data.photoURL,
      googleUid: data.googleUid,
      appleUid: data.appleUid,
      settings: defaultSettings,
      households: [],
      subscriptionTier: 'free',
    };

    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { error: 'Kunne ikke opprette bruker' };
  }
};

/**
 * Get user document from Firestore
 */
export const getUser = async (uid: string): Promise<{ user: User | null; error: string | null }> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { user: null, error: 'Bruker ikke funnet' };
    }

    return { user: userSnap.data() as User, error: null };
  } catch (error: any) {
    console.error('Error getting user:', error);
    return { user: null, error: 'Kunne ikke hente bruker' };
  }
};

/**
 * Update user document in Firestore
 */
export const updateUser = async (
  uid: string,
  data: Partial<Omit<User, 'uid' | 'createdAt' | 'updatedAt'>>
): Promise<{ error: string | null }> => {
  try {
    const userRef = doc(db, 'users', uid);
    
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { error: 'Kunne ikke oppdatere bruker' };
  }
};

/**
 * Update user settings
 */
export const updateUserSettings = async (
  uid: string,
  settings: Partial<UserSettings>
): Promise<{ error: string | null }> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { error: 'Bruker ikke funnet' };
    }

    const currentSettings = (userSnap.data() as User).settings;
    const updatedSettings = { ...currentSettings, ...settings };

    await updateDoc(userRef, {
      settings: updatedSettings,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error updating user settings:', error);
    return { error: 'Kunne ikke oppdatere innstillinger' };
  }
};

/**
 * Add household to user's households array
 */
export const addHouseholdToUser = async (
  uid: string,
  householdId: string
): Promise<{ error: string | null }> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { error: 'Bruker ikke funnet' };
    }

    const currentHouseholds = (userSnap.data() as User).households || [];
    
    if (currentHouseholds.includes(householdId)) {
      return { error: null }; // Already added
    }

    await updateDoc(userRef, {
      households: [...currentHouseholds, householdId],
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error adding household to user:', error);
    return { error: 'Kunne ikke legge til husholdning' };
  }
};

/**
 * Remove household from user's households array
 */
export const removeHouseholdFromUser = async (
  uid: string,
  householdId: string
): Promise<{ error: string | null }> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { error: 'Bruker ikke funnet' };
    }

    const currentHouseholds = (userSnap.data() as User).households || [];
    const updatedHouseholds = currentHouseholds.filter((id) => id !== householdId);

    await updateDoc(userRef, {
      households: updatedHouseholds,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error removing household from user:', error);
    return { error: 'Kunne ikke fjerne husholdning' };
  }
};

/**
 * Check if user exists by email
 */
export const userExistsByEmail = async (
  email: string
): Promise<{ exists: boolean; error: string | null }> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    return { exists: !querySnapshot.empty, error: null };
  } catch (error: any) {
    console.error('Error checking user existence:', error);
    return { exists: false, error: 'Kunne ikke sjekke bruker' };
  }
};

