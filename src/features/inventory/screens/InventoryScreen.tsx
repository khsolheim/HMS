import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const InventoryScreen = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="archive"
          size={80}
          color={theme.colors.onSurfaceDisabled}
        />
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          Ditt inventar er tomt
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          Legg til gjenstander for å begynne å organisere
        </Text>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => {}}
          style={styles.button}
        >
          Legg til gjenstand
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
});

export default InventoryScreen;

