import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DashboardScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Stats */}
      <View style={styles.statsRow}>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons
              name="package-variant"
              size={32}
              color={theme.colors.primary}
            />
            <Text variant="headlineMedium" style={styles.statNumber}>
              0
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Gjenstander
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons
              name="cash"
              size={32}
              color={theme.colors.secondary}
            />
            <Text variant="headlineMedium" style={styles.statNumber}>
              0 kr
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Total verdi
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Hurtigvalg
        </Text>
        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => {}}
              style={styles.actionButton}
            >
              Legg til gjenstand
            </Button>
            <Button
              mode="outlined"
              icon="qrcode-scan"
              onPress={() => {}}
              style={styles.actionButton}
            >
              Skann QR-kode
            </Button>
          </Card.Content>
        </Card>
      </View>

      {/* Empty State */}
      <Card style={styles.emptyCard}>
        <Card.Content style={styles.emptyContent}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={64}
            color={theme.colors.onSurfaceDisabled}
          />
          <Text variant="titleMedium" style={styles.emptyTitle}>
            Ingen gjenstander ennå
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Kom i gang ved å legge til din første gjenstand
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    marginTop: 8,
    fontWeight: '600',
  },
  statLabel: {
    marginTop: 4,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  card: {
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
  emptyCard: {
    marginTop: 16,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    marginTop: 16,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default DashboardScreen;

