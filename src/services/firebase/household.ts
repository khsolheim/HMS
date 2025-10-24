import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from './config';
import { Household, HouseholdMember, HouseholdSettings } from '@/shared/types/models';

/**
 * Create new household
 */
export const createHousehold = async (
  ownerId: string,
  data: {
    name: string;
    description?: string;
    address?: string;
    icon?: string;
    color?: string;
  }
): Promise<{ household: Household | null; error: string | null }> => {
  try {
    const householdRef = doc(collection(db, 'households'));
    const householdId = householdRef.id;

    const defaultSettings: HouseholdSettings = {
      defaultCurrency: 'NOK',
      lowStockThreshold: 5,
      allowGuestAccess: false,
      requireApprovalForNewMembers: false,
    };

    const ownerMember: HouseholdMember = {
      uid: ownerId,
      role: 'owner',
      joinedAt: { seconds: Date.now() / 1000 } as any,
      invitedBy: ownerId,
    };

    const householdData: Omit<Household, 'createdAt' | 'updatedAt'> = {
      id: householdId,
      name: data.name,
      description: data.description,
      address: data.address,
      icon: data.icon,
      color: data.color,
      ownerId,
      members: {
        [ownerId]: ownerMember,
      },
      settings: defaultSettings,
      itemCount: 0,
      totalValue: 0,
    };

    await setDoc(householdRef, {
      ...householdData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const household: Household = {
      ...householdData,
      createdAt: { seconds: Date.now() / 1000 } as any,
      updatedAt: { seconds: Date.now() / 1000 } as any,
    };

    return { household, error: null };
  } catch (error: any) {
    console.error('Error creating household:', error);
    return { household: null, error: 'Kunne ikke opprette husholdning' };
  }
};

/**
 * Get household by ID
 */
export const getHousehold = async (
  householdId: string
): Promise<{ household: Household | null; error: string | null }> => {
  try {
    const householdRef = doc(db, 'households', householdId);
    const householdSnap = await getDoc(householdRef);

    if (!householdSnap.exists()) {
      return { household: null, error: 'Husholdning ikke funnet' };
    }

    return { household: householdSnap.data() as Household, error: null };
  } catch (error: any) {
    console.error('Error getting household:', error);
    return { household: null, error: 'Kunne ikke hente husholdning' };
  }
};

/**
 * Get all households for a user
 */
export const getUserHouseholds = async (
  userId: string
): Promise<{ households: Household[]; error: string | null }> => {
  try {
    const householdsRef = collection(db, 'households');
    const q = query(householdsRef, where(`members.${userId}`, '!=', null));
    const querySnapshot = await getDocs(q);

    const households: Household[] = [];
    querySnapshot.forEach((doc) => {
      households.push(doc.data() as Household);
    });

    return { households, error: null };
  } catch (error: any) {
    console.error('Error getting user households:', error);
    return { households: [], error: 'Kunne ikke hente husholdninger' };
  }
};

/**
 * Update household
 */
export const updateHousehold = async (
  householdId: string,
  data: Partial<Omit<Household, 'id' | 'ownerId' | 'members' | 'createdAt' | 'updatedAt'>>
): Promise<{ error: string | null }> => {
  try {
    const householdRef = doc(db, 'households', householdId);

    await updateDoc(householdRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error updating household:', error);
    return { error: 'Kunne ikke oppdatere husholdning' };
  }
};

