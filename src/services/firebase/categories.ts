import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Category } from '@/shared/types/models';

/**
 * Create new category
 */
export const createCategory = async (
  householdId: string,
  data: Omit<Category, 'id' | 'householdId' | 'createdAt' | 'updatedAt' | 'itemCount'>
): Promise<{ category: Category | null; error: string | null }> => {
  try {
    const categoryRef = doc(collection(db, 'households', householdId, 'categories'));
    const categoryId = categoryRef.id;

    const categoryData: Omit<Category, 'createdAt' | 'updatedAt'> = {
      id: categoryId,
      householdId,
      ...data,
      itemCount: 0,
    };

    await setDoc(categoryRef, {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const category: Category = {
      ...categoryData,
      createdAt: { seconds: Date.now() / 1000 } as any,
      updatedAt: { seconds: Date.now() / 1000 } as any,
    };

    return { category, error: null };
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { category: null, error: 'Kunne ikke opprette kategori' };
  }
};

/**
 * Get category by ID
 */
export const getCategory = async (
  householdId: string,
  categoryId: string
): Promise<{ category: Category | null; error: string | null }> => {
  try {
    const categoryRef = doc(db, 'households', householdId, 'categories', categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
      return { category: null, error: 'Kategori ikke funnet' };
    }

    return { category: categorySnap.data() as Category, error: null };
  } catch (error: any) {
    console.error('Error getting category:', error);
    return { category: null, error: 'Kunne ikke hente kategori' };
  }
};

/**
 * List all categories for a household
 */
export const listCategories = async (
  householdId: string
): Promise<{ categories: Category[]; error: string | null }> => {
  try {
    const categoriesRef = collection(db, 'households', householdId, 'categories');
    const q = query(categoriesRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);

    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      categories.push(doc.data() as Category);
    });

    return { categories, error: null };
  } catch (error: any) {
    console.error('Error listing categories:', error);
    return { categories: [], error: 'Kunne ikke hente kategorier' };
  }
};

/**
 * Update category
 */
export const updateCategory = async (
  householdId: string,
  categoryId: string,
  data: Partial<Omit<Category, 'id' | 'householdId' | 'createdAt' | 'updatedAt'>>
): Promise<{ error: string | null }> => {
  try {
    const categoryRef = doc(db, 'households', householdId, 'categories', categoryId);

    await updateDoc(categoryRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error updating category:', error);
    return { error: 'Kunne ikke oppdatere kategori' };
  }
};

/**
 * Delete category
 */
export const deleteCategory = async (
  householdId: string,
  categoryId: string
): Promise<{ error: string | null }> => {
  try {
    // TODO: Check if category has items (requires querying items collection)

    const categoryRef = doc(db, 'households', householdId, 'categories', categoryId);
    await deleteDoc(categoryRef);

    return { error: null };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return { error: 'Kunne ikke slette kategori' };
  }
};

