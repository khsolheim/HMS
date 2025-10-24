import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

type CompleteScreenProps = {
  onComplete: () => void;
};

export const CompleteScreen: React.FC<CompleteScreenProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>

        <Text variant="displaySmall" style={styles.title}>
          Alt er klart!
        </Text>

        <Text variant="bodyLarge" style={styles.subtitle}>
          Du er nå klar til å begynne å organisere dine ting
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text variant="bodyMedium">Scann QR-koder for rask tilgang</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📦</Text>
            <Text variant="bodyMedium">Legg til gjenstander manuelt</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📍</Text>
            <Text variant="bodyMedium">Organiser etter lokasjon</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🏗️</Text>
            <Text variant="bodyMedium">Håndter prosjekter og utlån</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={onComplete}
          style={styles.button}
        >
          Start å bruke HMS
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
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
    fontSize: 24,
    marginRight: 16,
  },
  footer: {
    padding: 24,
  },
  button: {
    marginBottom: 8,
  },
});

