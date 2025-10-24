import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { Item } from '@/shared/types/models';

/**
 * Create new item
 */
export const createItem = async (
  householdId: string,
  userId: string,
  data: Omit<Item, 'id' | 'householdId' | 'createdBy' | 'createdAt' | 'updatedAt'>
): Promise<{ item: Item | null; error: string | null }> => {
  try {
    const itemRef = doc(collection(db, 'households', householdId, 'items'));
    const itemId = itemRef.id;

    const itemData: Omit<Item, 'createdAt' | 'updatedAt'> = {
      id: itemId,
      householdId,
      ...data,
      createdBy: userId,
    };

    await setDoc(itemRef, {
      ...itemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const item: Item = {
      ...itemData,
      createdAt: { seconds: Date.now() / 1000 } as any,
      updatedAt: { seconds: Date.now() / 1000 } as any,
    };

    return { item, error: null };
  } catch (error: any) {
    console.error('Error creating item:', error);
    return { item: null, error: 'Kunne ikke opprette gjenstand' };
  }
};

/**
 * Get item by ID
 */
export const getItem = async (
  householdId: string,
  itemId: string
): Promise<{ item: Item | null; error: string | null }> => {
  try {
    const itemRef = doc(db, 'households', householdId, 'items', itemId);
    const itemSnap = await getDoc(itemRef);

    if (!itemSnap.exists()) {
      return { item: null, error: 'Gjenstand ikke funnet' };
    }

    return { item: itemSnap.data() as Item, error: null };
  } catch (error: any) {
    console.error('Error getting item:', error);
    return { item: null, error: 'Kunne ikke hente gjenstand' };
  }
};

/**
 * List items with optional filters
 */
export const listItems = async (
  householdId: string,
  options?: {
    categoryId?: string;
    locationId?: string;
    tags?: string[];
    isArchived?: boolean;
    limit?: number;
    orderByField?: 'name' | 'createdAt' | 'updatedAt' | 'purchasePrice';
    orderDirection?: 'asc' | 'desc';
  }
): Promise<{ items: Item[]; error: string | null }> => {
  try {
    const itemsRef = collection(db, 'households', householdId, 'items');
    const constraints: QueryConstraint[] = [];

    // Add filters
    if (options?.categoryId) {
      constraints.push(where('categoryId', '==', options.categoryId));
    }
    if (options?.locationId) {
      constraints.push(where('locationId', '==', options.locationId));
    }
    if (options?.isArchived !== undefined) {
      constraints.push(where('isArchived', '==', options.isArchived));
    }

    // Add ordering
    const orderByField = options?.orderByField || 'createdAt';
    const orderDirection = options?.orderDirection || 'desc';
    constraints.push(orderBy(orderByField, orderDirection));

    // Add limit
    if (options?.limit) {
      constraints.push(firestoreLimit(options.limit));
    }

    const q = query(itemsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const items: Item[] = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data() as Item);
    });

    return { items, error: null };
  } catch (error: any) {
    console.error('Error listing items:', error);
    return { items: [], error: 'Kunne ikke hente gjenstander' };
  }
};

/**
 * Update item
 */
export const updateItem = async (
  householdId: string,
  itemId: string,
  data: Partial<Omit<Item, 'id' | 'householdId' | 'createdBy' | 'createdAt' | 'updatedAt'>>
): Promise<{ error: string | null }> => {
  try {
    const itemRef = doc(db, 'households', householdId, 'items', itemId);

    await updateDoc(itemRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error updating item:', error);
    return { error: 'Kunne ikke oppdatere gjenstand' };
  }
};

/**
 * Delete item
 */
export const deleteItem = async (
  householdId: string,
  itemId: string
): Promise<{ error: string | null }> => {
  try {
    const itemRef = doc(db, 'households', householdId, 'items', itemId);
    await deleteDoc(itemRef);

    return { error: null };
  } catch (error: any) {
    console.error('Error deleting item:', error);
    return { error: 'Kunne ikke slette gjenstand' };
  }
};

/**
 * Archive/Unarchive item
 */
export const toggleItemArchive = async (
  householdId: string,
  itemId: string,
  isArchived: boolean
): Promise<{ error: string | null }> => {
  return updateItem(householdId, itemId, { isArchived });
};

/**
 * Search items by name or description
 */
export const searchItems = async (
  householdId: string,
  searchTerm: string
): Promise<{ items: Item[]; error: string | null }> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that fetches all items and filters client-side
    // For production, consider using Algolia or similar
    const { items, error } = await listItems(householdId, { limit: 1000 });

    if (error) {
      return { items: [], error };
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );

    return { items: filtered, error: null };
  } catch (error: any) {
    console.error('Error searching items:', error);
    return { items: [], error: 'Kunne ikke søke i gjenstander' };
  }
};

