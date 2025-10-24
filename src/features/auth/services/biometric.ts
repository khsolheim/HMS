import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

/**
 * Check if device supports biometric authentication
 */
export const isBiometricAvailable = async (): Promise<boolean> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return false;

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return enrolled;
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return false;
  }
};

/**
 * Get supported authentication types
 */
export const getSupportedAuthTypes = async (): Promise<string[]> => {
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const typeNames: string[] = [];

    types.forEach((type) => {
      switch (type) {
        case LocalAuthentication.AuthenticationType.FINGERPRINT:
          typeNames.push('Fingeravtrykk');
          break;
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
          typeNames.push(Platform.OS === 'ios' ? 'Face ID' : 'Ansiktsgjenkjenning');
          break;
        case LocalAuthentication.AuthenticationType.IRIS:
          typeNames.push('Iris');
          break;
      }
    });

    return typeNames;
  } catch (error) {
    console.error('Error getting supported auth types:', error);
    return [];
  }
};

/**
 * Authenticate user with biometrics
 */
export const authenticateWithBiometrics = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const available = await isBiometricAvailable();
    
    if (!available) {
      return {
        success: false,
        error: 'Biometrisk autentisering er ikke tilgjengelig på denne enheten',
      };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentiser for å logge inn',
      cancelLabel: 'Avbryt',
      disableDeviceFallback: false,
      requireConfirmation: false,
    });

    if (result.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: result.error === 'user_cancel' ? 'Autentisering avbrutt' : 'Autentisering feilet',
      };
    }
  } catch (error) {
    console.error('Error authenticating with biometrics:', error);
    return {
      success: false,
      error: 'En feil oppstod under autentisering',
    };
  }
};

/**
 * Get biometric display name for UI
 */
export const getBiometricDisplayName = async (): Promise<string> => {
  const types = await getSupportedAuthTypes();
  
  if (types.length === 0) {
    return 'Biometrisk';
  }

  if (Platform.OS === 'ios') {
    if (types.includes('Face ID')) return 'Face ID';
    if (types.includes('Fingeravtrykk')) return 'Touch ID';
  }

  return types[0] || 'Biometrisk';
};

