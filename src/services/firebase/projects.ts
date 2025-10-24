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
import { Project, ProjectStatus } from '@/shared/types/models';

/**
 * Create new project
 */
export const createProject = async (
  householdId: string,
  userId: string,
  data: Omit<Project, 'id' | 'householdId' | 'createdBy' | 'createdAt' | 'updatedAt'>
): Promise<{ project: Project | null; error: string | null }> => {
  try {
    const projectRef = doc(collection(db, 'households', householdId, 'projects'));
    const projectId = projectRef.id;

    const projectData: Omit<Project, 'createdAt' | 'updatedAt'> = {
      id: projectId,
      householdId,
      ...data,
      createdBy: userId,
    };

    await setDoc(projectRef, {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const project: Project = {
      ...projectData,
      createdAt: { seconds: Date.now() / 1000 } as any,
      updatedAt: { seconds: Date.now() / 1000 } as any,
    };

    return { project, error: null };
  } catch (error: any) {
    console.error('Error creating project:', error);
    return { project: null, error: 'Kunne ikke opprette prosjekt' };
  }
};

/**
 * Get project by ID
 */
export const getProject = async (
  householdId: string,
  projectId: string
): Promise<{ project: Project | null; error: string | null }> => {
  try {
    const projectRef = doc(db, 'households', householdId, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return { project: null, error: 'Prosjekt ikke funnet' };
    }

    return { project: projectSnap.data() as Project, error: null };
  } catch (error: any) {
    console.error('Error getting project:', error);
    return { project: null, error: 'Kunne ikke hente prosjekt' };
  }
};

/**
 * List projects with optional status filter
 */
export const listProjects = async (
  householdId: string,
  status?: ProjectStatus
): Promise<{ projects: Project[]; error: string | null }> => {
  try {
    const projectsRef = collection(db, 'households', householdId, 'projects');
    let q;

    if (status) {
      q = query(projectsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
    } else {
      q = query(projectsRef, orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);

    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      projects.push(doc.data() as Project);
    });

    return { projects, error: null };
  } catch (error: any) {
    console.error('Error listing projects:', error);
    return { projects: [], error: 'Kunne ikke hente prosjekter' };
  }
};

/**
 * Update project
 */
export const updateProject = async (
  householdId: string,
  projectId: string,
  data: Partial<Omit<Project, 'id' | 'householdId' | 'createdBy' | 'createdAt' | 'updatedAt'>>
): Promise<{ error: string | null }> => {
  try {
    const projectRef = doc(db, 'households', householdId, 'projects', projectId);

    await updateDoc(projectRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error updating project:', error);
    return { error: 'Kunne ikke oppdatere prosjekt' };
  }
};

/**
 * Delete project
 */
export const deleteProject = async (
  householdId: string,
  projectId: string
): Promise<{ error: string | null }> => {
  try {
    const projectRef = doc(db, 'households', householdId, 'projects', projectId);
    await deleteDoc(projectRef);

    return { error: null };
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return { error: 'Kunne ikke slette prosjekt' };
  }
};

