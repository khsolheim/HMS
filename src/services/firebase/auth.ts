import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Create new user with email and password
 */
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Sign in with Google (requires expo-auth-session for web, native for mobile)
 */
export const signInWithGoogle = async (idToken: string) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Sign in with Apple (iOS only)
 */
export const signInWithApple = async (identityToken: string) => {
  try {
    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({
      idToken: identityToken,
    });
    const userCredential = await signInWithCredential(auth, credential);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: getAuthErrorMessage(error.code) };
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Ugyldig e-postadresse';
    case 'auth/user-disabled':
      return 'Denne kontoen er deaktivert';
    case 'auth/user-not-found':
      return 'Ingen bruker funnet med denne e-posten';
    case 'auth/wrong-password':
      return 'Feil passord';
    case 'auth/email-already-in-use':
      return 'E-postadressen er allerede i bruk';
    case 'auth/weak-password':
      return 'Passordet er for svakt (minimum 6 tegn)';
    case 'auth/operation-not-allowed':
      return 'Denne påloggingsmetoden er ikke aktivert';
    case 'auth/too-many-requests':
      return 'For mange forsøk. Prøv igjen senere';
    case 'auth/network-request-failed':
      return 'Nettverksfeil. Sjekk internettforbindelsen';
    default:
      return 'En feil oppstod. Prøv igjen';
  }
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Passordet må være minst 6 tegn' };
  }
  if (password.length < 8) {
    return { valid: true, message: 'Passordet er svakt. Bruk minst 8 tegn' };
  }
  if (!/\d/.test(password)) {
    return { valid: true, message: 'Passord med tall er sikrere' };
  }
  return { valid: true };
};

