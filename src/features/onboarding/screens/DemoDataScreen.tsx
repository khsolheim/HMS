import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, RadioButton } from 'react-native-paper';
import { generateDemoData } from '../services/demoData';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { storageHelpers } from '@/shared/utils/storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

type OnboardingStackParamList = {
  Welcome: undefined;
  CreateHousehold: undefined;
  DemoData: { householdId: string };
  Tutorial: undefined;
  Complete: undefined;
};

type DemoDataScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'DemoData'>;
  route: RouteProp<OnboardingStackParamList, 'DemoData'>;
};

export const DemoDataScreen: React.FC<DemoDataScreenProps> = ({ navigation, route }) => {
  const { householdId } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [choice, setChoice] = useState<'demo' | 'empty'>('demo');

  const handleContinue = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    if (choice === 'demo') {
      const { success, error: demoError } = await generateDemoData(householdId, user.uid);
      
      if (!success || demoError) {
        setError(demoError || 'Kunne ikke generere demo-data');
        setLoading(false);
        return;
      }
    }

    // Mark onboarding as completed
    storageHelpers.setOnboardingCompleted(true);

    setLoading(false);
    navigation.navigate('Complete');
  };

  const handleSkip = () => {
    storageHelpers.setOnboardingCompleted(true);
    navigation.navigate('Complete');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Vil du ha demo-data?
        </Text>

        <Text variant="bodyLarge" style={styles.subtitle}>
          Vi kan legge til eksempeldata så du kan se hvordan appen fungerer
        </Text>

        <View style={styles.choices}>
          <View style={styles.choice}>
            <RadioButton
              value="demo"
              status={choice === 'demo' ? 'checked' : 'unchecked'}
              onPress={() => setChoice('demo')}
            />
            <View style={styles.choiceContent}>
              <Text variant="titleMedium" style={styles.choiceTitle}>
                Ja, legg til demo-data
              </Text>
              <Text variant="bodyMedium" style={styles.choiceDescription}>
                Vi legger til 5 eksempel-gjenstander, 3 lokasjoner og 1 prosjekt
              </Text>
            </View>
          </View>

          <View style={styles.choice}>
            <RadioButton
              value="empty"
              status={choice === 'empty' ? 'checked' : 'unchecked'}
              onPress={() => setChoice('empty')}
            />
            <View style={styles.choiceContent}>
              <Text variant="titleMedium" style={styles.choiceTitle}>
                Nei, start fra scratch
              </Text>
              <Text variant="bodyMedium" style={styles.choiceDescription}>
                Start med en tom husholdning
              </Text>
            </View>
          </View>
        </View>

        {error && (
          <Text variant="bodySmall" style={styles.errorMessage}>
            {error}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleContinue}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Fortsett
        </Button>

        <Button
          mode="text"
          onPress={handleSkip}
          disabled={loading}
          style={styles.skipButton}
        >
          Hopp over
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
  },
  choices: {
    marginBottom: 24,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 16,
  },
  choiceContent: {
    flex: 1,
    marginLeft: 12,
  },
  choiceTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  choiceDescription: {
    color: '#666',
  },
  errorMessage: {
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    marginBottom: 12,
  },
  skipButton: {
    marginBottom: 8,
  },
});

