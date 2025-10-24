import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OnboardingStackParamList = {
  Welcome: undefined;
  CreateHousehold: undefined;
  DemoData: undefined;
  Tutorial: undefined;
  Complete: undefined;
};

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>📦</Text>
        </View>

        <Text variant="displayMedium" style={styles.title}>
          Velkommen til HMS Inventory
        </Text>

        <Text variant="bodyLarge" style={styles.subtitle}>
          Organiser alt du eier på ett sted
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text variant="bodyMedium">Scann QR-koder og strekkoder</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text variant="bodyMedium">Del med familie og venner</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text variant="bodyMedium">Håndter prosjekter og utlån</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text variant="bodyMedium">Generer rapporter og etiketter</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateHousehold')}
          style={styles.button}
        >
          Kom i gang
        </Button>

        <Text variant="bodySmall" style={styles.skipText}>
          La oss sette opp din første husholdning
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoText: {
    fontSize: 80,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 48,
  },
  features: {
    width: '100%',
    maxWidth: 400,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureIcon: {
    fontSize: 20,
    color: '#4CAF50',
    marginRight: 16,
    fontWeight: 'bold',
  },
  actions: {
    padding: 24,
  },
  button: {
    marginBottom: 16,
  },
  skipText: {
    textAlign: 'center',
    color: '#666',
  },
});

