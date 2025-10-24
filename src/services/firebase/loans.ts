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
import { Loan, LoanStatus } from '@/shared/types/models';

/**
 * Create new loan
 */
export const createLoan = async (
  householdId: string,
  userId: string,
  data: Omit<Loan, 'id' | 'householdId' | 'createdBy' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<{ loan: Loan | null; error: string | null }> => {
  try {
    const loanRef = doc(collection(db, 'households', householdId, 'loans'));
    const loanId = loanRef.id;

    const loanData: Omit<Loan, 'createdAt' | 'updatedAt'> = {
      id: loanId,
      householdId,
      ...data,
      status: 'active',
      createdBy: userId,
    };

    await setDoc(loanRef, {
      ...loanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const loan: Loan = {
      ...loanData,
      createdAt: { seconds: Date.now() / 1000 } as any,
      updatedAt: { seconds: Date.now() / 1000 } as any,
    };

    return { loan, error: null };
  } catch (error: any) {
    console.error('Error creating loan:', error);
    return { loan: null, error: 'Kunne ikke opprette utlån' };
  }
};

/**
 * Get loan by ID
 */
export const getLoan = async (
  householdId: string,
  loanId: string
): Promise<{ loan: Loan | null; error: string | null }> => {
  try {
    const loanRef = doc(db, 'households', householdId, 'loans', loanId);
    const loanSnap = await getDoc(loanRef);

    if (!loanSnap.exists()) {
      return { loan: null, error: 'Utlån ikke funnet' };
    }

    return { loan: loanSnap.data() as Loan, error: null };
  } catch (error: any) {
    console.error('Error getting loan:', error);
    return { loan: null, error: 'Kunne ikke hente utlån' };
  }
};

/**
 * List loans with optional status filter
 */
export const listLoans = async (
  householdId: string,
  status?: LoanStatus
): Promise<{ loans: Loan[]; error: string | null }> => {
  try {
    const loansRef = collection(db, 'households', householdId, 'loans');
    let q;

    if (status) {
      q = query(loansRef, where('status', '==', status), orderBy('loanDate', 'desc'));
    } else {
      q = query(loansRef, orderBy('loanDate', 'desc'));
    }

    const querySnapshot = await getDocs(q);

    const loans: Loan[] = [];
    querySnapshot.forEach((doc) => {
      loans.push(doc.data() as Loan);
    });

    return { loans, error: null };
  } catch (error: any) {
    console.error('Error listing loans:', error);
    return { loans: [], error: 'Kunne ikke hente utlån' };
  }
};

/**
 * Update loan
 */
export const updateLoan = async (
  householdId: string,
  loanId: string,
  data: Partial<Omit<Loan, 'id' | 'householdId' | 'createdBy' | 'createdAt' | 'updatedAt'>>
): Promise<{ error: string | null }> => {
  try {
    const loanRef = doc(db, 'households', householdId, 'loans', loanId);

    await updateDoc(loanRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error updating loan:', error);
    return { error: 'Kunne ikke oppdatere utlån' };
  }
};

/**
 * Mark loan as returned
 */
export const returnLoan = async (
  householdId: string,
  loanId: string
): Promise<{ error: string | null }> => {
  try {
    const loanRef = doc(db, 'households', householdId, 'loans', loanId);

    await updateDoc(loanRef, {
      status: 'returned',
      returnedDate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Error returning loan:', error);
    return { error: 'Kunne ikke markere utlån som returnert' };
  }
};

/**
 * Delete loan
 */
export const deleteLoan = async (
  householdId: string,
  loanId: string
): Promise<{ error: string | null }> => {
  try {
    const loanRef = doc(db, 'households', householdId, 'loans', loanId);
    await deleteDoc(loanRef);

    return { error: null };
  } catch (error: any) {
    console.error('Error deleting loan:', error);
    return { error: 'Kunne ikke slette utlån' };
  }
};

/**
 * Get overdue loans
 */
export const getOverdueLoans = async (
  householdId: string
): Promise<{ loans: Loan[]; error: string | null }> => {
  try {
    const { loans, error } = await listLoans(householdId, 'active');

    if (error) {
      return { loans: [], error };
    }

    const now = Date.now();
    const overdue = loans.filter((loan) => {
      if (!loan.dueDate) return false;
      const dueTime = loan.dueDate.seconds * 1000;
      return dueTime < now;
    });

    return { loans: overdue, error: null };
  } catch (error: any) {
    console.error('Error getting overdue loans:', error);
    return { loans: [], error: 'Kunne ikke hente forfalte utlån' };
  }
};

