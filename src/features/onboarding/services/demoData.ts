import { Timestamp } from 'firebase/firestore';
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';

/**
 * Generate demo data for a new household
 */
export const generateDemoData = async (
  householdId: string,
  userId: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Demo Locations
    const locations = [
      {
        id: 'demo-loc-1',
        name: 'Stue',
        description: 'Hovedstue med sofa og TV',
        icon: 'sofa',
        color: '#4CAF50',
      },
      {
        id: 'demo-loc-2',
        name: 'Kjøkken',
        description: 'Kjøkken med hvitevarer',
        parentId: undefined,
        icon: 'silverware-fork-knife',
        color: '#FF9800',
      },
      {
        id: 'demo-loc-3',
        name: 'Garasje',
        description: 'Garasje med verktøy',
        icon: 'garage',
        color: '#2196F3',
      },
    ];

    for (const location of locations) {
      const locationRef = doc(db, 'households', householdId, 'locations', location.id);
      await setDoc(locationRef, {
        ...location,
        householdId,
        qrCode: `qr-${location.id}`,
        itemCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Demo Categories
    const categories = [
      {
        id: 'demo-cat-1',
        name: 'Elektronikk',
        icon: 'laptop',
        color: '#9C27B0',
        customFields: [],
      },
      {
        id: 'demo-cat-2',
        name: 'Verktøy',
        icon: 'tools',
        color: '#F44336',
        customFields: [],
      },
    ];

    for (const category of categories) {
      const categoryRef = doc(db, 'households', householdId, 'categories', category.id);
      await setDoc(categoryRef, {
        ...category,
        householdId,
        itemCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Demo Items
    const items = [
      {
        id: 'demo-item-1',
        name: 'Samsung TV 55"',
        description: 'Smart TV i stuen',
        categoryId: 'demo-cat-1',
        locationId: 'demo-loc-1',
        brand: 'Samsung',
        model: 'UE55TU7025',
        purchasePrice: 5999,
        quantity: 1,
        unit: 'stk',
        tags: ['elektronikk', 'tv', 'stue'],
      },
      {
        id: 'demo-item-2',
        name: 'Bosch Drill',
        description: 'Trådløs drill med batterier',
        categoryId: 'demo-cat-2',
        locationId: 'demo-loc-3',
        brand: 'Bosch',
        model: 'PSR 1800 LI-2',
        purchasePrice: 1299,
        quantity: 1,
        unit: 'stk',
        tags: ['verktøy', 'drill'],
      },
      {
        id: 'demo-item-3',
        name: 'Miele Oppvaskmaskin',
        description: 'Integrert oppvaskmaskin',
        categoryId: 'demo-cat-1',
        locationId: 'demo-loc-2',
        brand: 'Miele',
        purchasePrice: 8999,
        quantity: 1,
        unit: 'stk',
        tags: ['hvitevarer', 'kjøkken'],
      },
      {
        id: 'demo-item-4',
        name: 'Verktøykasse',
        description: 'Komplett verktøysett',
        categoryId: 'demo-cat-2',
        locationId: 'demo-loc-3',
        purchasePrice: 599,
        quantity: 1,
        unit: 'stk',
        tags: ['verktøy'],
      },
      {
        id: 'demo-item-5',
        name: 'Kaffemaskin',
        description: 'Nespresso kaffemaskin',
        categoryId: 'demo-cat-1',
        locationId: 'demo-loc-2',
        brand: 'Nespresso',
        model: 'Pixie',
        purchasePrice: 1499,
        quantity: 1,
        unit: 'stk',
        tags: ['kaffe', 'kjøkken'],
      },
    ];

    for (const item of items) {
      const itemRef = doc(db, 'households', householdId, 'items', item.id);
      await setDoc(itemRef, {
        ...item,
        householdId,
        images: [],
        attachments: [],
        customFields: {},
        qrCode: `qr-${item.id}`,
        createdBy: userId,
        isArchived: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Demo Project
    const projectRef = doc(db, 'households', householdId, 'projects', 'demo-project-1');
    await setDoc(projectRef, {
      id: 'demo-project-1',
      householdId,
      name: 'Renovere garasje',
      description: 'Male vegger og organisere verktøy',
      status: 'planning',
      priority: 'medium',
      budget: 5000,
      actualCost: 0,
      materialList: [
        {
          itemId: 'demo-item-2',
          itemName: 'Bosch Drill',
          quantity: 1,
          unit: 'stk',
          purchased: true,
        },
      ],
      tasks: [
        {
          id: 'task-1',
          title: 'Kjøpe maling',
          completed: false,
        },
        {
          id: 'task-2',
          title: 'Rydde garasje',
          completed: false,
        },
      ],
      attachments: [],
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error generating demo data:', error);
    return { success: false, error: 'Kunne ikke generere demo-data' };
  }
};

