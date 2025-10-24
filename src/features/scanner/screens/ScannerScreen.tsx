import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ScannerScreen = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="qrcode-scan"
          size={100}
          color={theme.colors.primary}
        />
        <Text variant="headlineSmall" style={styles.title}>
          QR & Strekkode-skanner
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Skann QR-koder på gjenstander eller strekkoder på produkter
        </Text>
        <Button
          mode="contained"
          icon="camera"
          onPress={() => {}}
          style={styles.button}
        >
          Start skanning
        </Button>
        <Text variant="bodySmall" style={styles.note}>
          Kameratillatelse vil bli forespurt
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginTop: 24,
    marginBottom: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 32,
  },
  button: {
    marginBottom: 16,
  },
  note: {
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default ScannerScreen;

