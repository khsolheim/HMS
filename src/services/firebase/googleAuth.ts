import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './config';

// Complete web browser auth session
WebBrowser.maybeCompleteAuthSession();

/**
 * Google Sign-In for Expo (Web + Mobile)
 */
export const useGoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      
      if (result?.type === 'success') {
        const { id_token } = result.params;
        
        // Sign in to Firebase with Google credential
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        
        return { user: userCredential.user, error: null };
      } else {
        return { user: null, error: 'Google sign-in cancelled' };
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return { user: null, error: error.message || 'Google sign-in failed' };
    }
  };

  return {
    signInWithGoogle,
    isReady: !!request,
  };
};

/**
 * Get user info from Google (optional - for additional user data)
 */
export const getGoogleUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    const user = await response.json();
    return { user, error: null };
  } catch (error: any) {
    console.error('Error fetching Google user info:', error);
    return { user: null, error: error.message };
  }
};

