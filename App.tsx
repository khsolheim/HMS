import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/services/firebase/config'; // Initialize Firebase
import { useAuthInit, useAuth } from '@/features/auth/hooks/useAuth';
import { AuthNavigator } from '@/navigation/AuthNavigator';
import { OnboardingNavigator } from '@/navigation/OnboardingNavigator';
import { storageHelpers } from '@/shared/utils/storage';
import { useState, useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  useAuthInit(); // Initialize auth listener
  const { isAuthenticated, isInitializing } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if onboarding is completed
    const completed = storageHelpers.getOnboardingCompleted();
    setOnboardingCompleted(completed);
  }, []);

  if (isInitializing || onboardingCompleted === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Laster HMS Inventory...</Text>
      </View>
    );
  }

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Show onboarding if not completed
  if (!onboardingCompleted) {
    return (
      <OnboardingNavigator
        onComplete={() => {
          setOnboardingCompleted(true);
          storageHelpers.setOnboardingCompleted(true);
        }}
      />
    );
  }

  // TODO: Replace with MainNavigator after P0-5
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HMS Inventory</Text>
      <Text style={styles.subtitle}>✅ Autentisert og Onboarding fullført!</Text>
      <Text style={styles.info}>MainNavigator kommer i P0-5</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  info: {
    color: '#666',
    marginTop: 16,
  },
});
