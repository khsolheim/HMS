import { MMKV } from 'react-native-mmkv';

// Initialize storage
// @ts-ignore - MMKV type issue with React Native
export const storage = new MMKV();

// Storage keys
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
  SELECTED_HOUSEHOLD: 'selected_household',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  THEME: 'theme',
  LANGUAGE: 'language',
  LAST_SYNC: 'last_sync',
} as const;

// Type-safe storage helpers
export const storageHelpers = {
  // Onboarding
  setOnboardingCompleted: (completed: boolean) => {
    storage.set(STORAGE_KEYS.ONBOARDING_COMPLETED, completed);
  },
  getOnboardingCompleted: (): boolean => {
    return storage.getBoolean(STORAGE_KEYS.ONBOARDING_COMPLETED) ?? false;
  },

  // Selected Household
  setSelectedHousehold: (householdId: string) => {
    storage.set(STORAGE_KEYS.SELECTED_HOUSEHOLD, householdId);
  },
  getSelectedHousehold: (): string | undefined => {
    return storage.getString(STORAGE_KEYS.SELECTED_HOUSEHOLD);
  },

  // Biometric
  setBiometricEnabled: (enabled: boolean) => {
    storage.set(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled);
  },
  getBiometricEnabled: (): boolean => {
    return storage.getBoolean(STORAGE_KEYS.BIOMETRIC_ENABLED) ?? false;
  },

  // Theme
  setTheme: (theme: 'light' | 'dark' | 'auto') => {
    storage.set(STORAGE_KEYS.THEME, theme);
  },
  getTheme: (): 'light' | 'dark' | 'auto' => {
    return (storage.getString(STORAGE_KEYS.THEME) as 'light' | 'dark' | 'auto') ?? 'auto';
  },

  // Language
  setLanguage: (language: string) => {
    storage.set(STORAGE_KEYS.LANGUAGE, language);
  },
  getLanguage: (): string => {
    return storage.getString(STORAGE_KEYS.LANGUAGE) ?? 'nb-NO';
  },

  // Last Sync
  setLastSync: (timestamp: number) => {
    storage.set(STORAGE_KEYS.LAST_SYNC, timestamp);
  },
  getLastSync: (): number => {
    return storage.getNumber(STORAGE_KEYS.LAST_SYNC) ?? 0;
  },

  // Clear all storage
  clearAll: () => {
    storage.clearAll();
  },
};

