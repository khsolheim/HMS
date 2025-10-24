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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Location } from '@/shared/types/models';

/**
 * Create new location
 */
export const createLocation = async (
  householdId: string,
  data: Omit<Location, 'id' | 'householdId' | 'createdAt' | 'updatedAt' | 'itemCount' | 'path'>
): Promise<{ location: Location | null; error: string | null }> => {
  try {
    const locationRef = doc(collection(db, 'households', householdId, 'locations'));
    const locationId = locationRef.id;

    // Calculate path for hierarchy
    let path: string[] = [locationId];
    if (data.parentId) {
      const { location: parentLocation } = await getLocation(householdId, data.parentId);
      if (parentLocation && parentLocation.path) {
        path = [...parentLocation.path, locationId];
      }
    }

    const locationData: Omit<Location, 'createdAt' | 'updatedAt'> = {
      id: locationId,
      householdId,
      ...data,
      itemCount: 0,
      path,
    };

    await setDoc(locationRef, {
      ...locationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const location: Location = {
      ...locationData,
      createdAt: { seconds: Date.now() / 1000 } as any,
      updatedAt: { seconds: Date.now() / 1000 } as any,
    };

    return { location, error: null };
  } catch (error: any) {
    console.error('Error creating location:', error);
    return { location: null, error: 'Kunne ikke opprette lokasjon' };
  }
};

/**
 * Get location by ID
 */
export const getLocation = async (
  householdId: string,
  locationId: string
): Promise<{ location: Location | null; error: string | null }> => {
  try {
    const locationRef = doc(db, 'households', householdId, 'locations', locationId);
    const locationSnap = await getDoc(locationRef);

    if (!locationSnap.exists()) {
      return { location: null, error: 'Lokasjon ikke funnet' };
    }

    return { location: locationSnap.data() as Location, error: null };
  } catch (error: any) {
    console.error('Error getting location:', error);
    return { location: null, error: 'Kunne ikke hente lokasjon' };
  }
};

/**
 * List all locations for a household
 */
export const listLocations = async (
  householdId: string
): Promise<{ locations: Location[]; error: string | null }> => {
  try {
    const locationsRef = collection(db, 'households', householdId, 'locations');
    const q = query(locationsRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);

    const locations: Location[] = [];
    querySnapshot.forEach((doc) => {
      locations.push(doc.data() as Location);
    });

    return { locations, error: null };
  } catch (error: any) {
    console.error('Error listing locations:', error);
    return { locations: [], error: 'Kunne ikke hente lokasjoner' };
  }
};

/**
 * Get child locations of a parent
 */
export const getChildLocations = async (
  householdId: string,
  parentId: string | null
): Promise<{ locations: Location[]; error: string | null }> => {
  try {
    const locationsRef = collection(db, 'households', householdId, 'locations');
    const q = parentId
      ? query(locationsRef, where('parentId', '==', parentId), orderBy('name', 'asc'))
      : query(locationsRef, where('parentId', '==', null), orderBy('name', 'asc'));

    const querySnapshot = await getDocs(q);

    const locations: Location[] = [];
    querySnapshot.forEach((doc) => {
      locations.push(doc.data() as Location);
    });

    return { locations, error: null };
  } catch (error: any) {
    console.error('Error getting child locations:', error);
    return { locations: [], error: 'Kunne ikke hente underlokasjoner' };
  }
};

/**
 * Update location
 */
export const updateLocation = async (
  householdId: string,
  locationId: string,
  data: Partial<Omit<Location, 'id' | 'householdId' | 'createdAt' | 'updatedAt' | 'path'>>
): Promise<{ error: string | null }> => {
  try {
    const locationRef = doc(db, 'households', householdId, 'locations', locationId);

    // If parentId is being updated, recalculate path
    let updates: any = { ...data, updatedAt: serverTimestamp() };

    if (data.parentId !== undefined) {
      let path: string[] = [locationId];
      if (data.parentId) {
        const { location: parentLocation } = await getLocation(householdId, data.parentId);
        if (parentLocation && parentLocation.path) {
          path = [...parentLocation.path, locationId];
        }
      }
      updates.path = path;
    }

    await updateDoc(locationRef, updates);

    return { error: null };
  } catch (error: any) {
    console.error('Error updating location:', error);
    return { error: 'Kunne ikke oppdatere lokasjon' };
  }
};

/**
 * Delete location
 */
export const deleteLocation = async (
  householdId: string,
  locationId: string
): Promise<{ error: string | null }> => {
  try {
    // Check if location has children
    const { locations: children } = await getChildLocations(householdId, locationId);
    if (children.length > 0) {
      return { error: 'Kan ikke slette lokasjon med underlokasjoner' };
    }

    // TODO: Check if location has items (requires querying items collection)

    const locationRef = doc(db, 'households', householdId, 'locations', locationId);
    await deleteDoc(locationRef);

    return { error: null };
  } catch (error: any) {
    console.error('Error deleting location:', error);
    return { error: 'Kunne ikke slette lokasjon' };
  }
};

/**
 * Build location hierarchy tree
 */
export const buildLocationTree = (locations: Location[]): Location[] => {
  const locationMap = new Map<string, Location & { children?: Location[] }>();
  const roots: Location[] = [];

  // Create map
  locations.forEach((loc) => {
    locationMap.set(loc.id, { ...loc, children: [] });
  });

  // Build tree
  locations.forEach((loc) => {
    const location = locationMap.get(loc.id)!;
    if (loc.parentId) {
      const parent = locationMap.get(loc.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(location);
      } else {
        roots.push(location);
      }
    } else {
      roots.push(location);
    }
  });

  return roots;
};

