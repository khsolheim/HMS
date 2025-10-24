import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useItems } from '@/features/inventory/hooks/useItems';
import { storageHelpers } from '@/shared/utils/storage';

const DashboardScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [selectedHouseholdId, setSelectedHouseholdId] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Get selected household from storage
  React.useEffect(() => {
    const householdId = storageHelpers.getSelectedHousehold();
    setSelectedHouseholdId(householdId || null);
  }, []);

  // Fetch items for selected household
  const { data: items, isLoading, refetch } = useItems(
    selectedHouseholdId || '',
    { isArchived: false }
  );

  // Calculate total value
  const totalValue = React.useMemo(() => {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + (item.purchasePrice || 0), 0);
  }, [items]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (!selectedHouseholdId) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons
          name="home-alert"
          size={64}
          color={theme.colors.onSurfaceDisabled}
        />
        <Text variant="titleMedium" style={styles.emptyTitle}>
          Ingen husholdning valgt
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          Fullfør onboarding for å opprette din første husholdning
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text variant="headlineSmall" style={styles.welcomeText}>
          Hei, {user?.displayName?.split(' ')[0] || 'der'}! 👋
        </Text>
        <Text variant="bodyMedium" style={styles.welcomeSubtext}>
          {items && items.length > 0
            ? `Du har ${items.length} gjenstand${items.length !== 1 ? 'er' : ''} registrert`
            : 'Kom i gang med å legge til gjenstander'}
        </Text>
      </View>

      {/* Hero Stats */}
      <View style={styles.statsRow}>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons
              name="package-variant"
              size={32}
              color={theme.colors.primary}
            />
            {isLoading ? (
              <ActivityIndicator size="small" style={{ marginTop: 8 }} />
            ) : (
              <>
                <Text variant="headlineMedium" style={styles.statNumber}>
                  {items?.length || 0}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Gjenstander
                </Text>
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons
              name="cash"
              size={32}
              color={theme.colors.secondary}
            />
            {isLoading ? (
              <ActivityIndicator size="small" style={{ marginTop: 8 }} />
            ) : (
              <>
                <Text variant="headlineMedium" style={styles.statNumber}>
                  {totalValue.toLocaleString('nb-NO')} kr
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total verdi
                </Text>
              </>
            )}
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

      {/* Recent Items */}
      {items && items.length > 0 ? (
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Nylig lagt til
          </Text>
          {items.slice(0, 5).map((item) => (
            <Card key={item.id} style={styles.itemCard}>
              <Card.Content style={styles.itemContent}>
                <MaterialCommunityIcons
                  name="package-variant-closed"
                  size={24}
                  color={theme.colors.primary}
                />
                <View style={styles.itemInfo}>
                  <Text variant="titleMedium" style={styles.itemName}>
                    {item.name}
                  </Text>
                  {item.description && (
                    <Text variant="bodySmall" style={styles.itemDescription} numberOfLines={1}>
                      {item.description}
                    </Text>
                  )}
                </View>
                {item.purchasePrice && (
                  <Text variant="bodyMedium" style={styles.itemPrice}>
                    {item.purchasePrice.toLocaleString('nb-NO')} kr
                  </Text>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>
      ) : (
        !isLoading && (
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
        )
      )}
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontWeight: '600',
    marginBottom: 4,
  },
  welcomeSubtext: {
    opacity: 0.7,
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
  itemCard: {
    marginBottom: 8,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '500',
  },
  itemDescription: {
    opacity: 0.7,
    marginTop: 2,
  },
  itemPrice: {
    fontWeight: '500',
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
