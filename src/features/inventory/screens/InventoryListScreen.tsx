import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Searchbar, useTheme, ActivityIndicator, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useItems } from '../hooks/useItems';
import { storageHelpers } from '@/shared/utils/storage';
import { InventoryStackParamList } from '../navigation/InventoryNavigator';
import { Item } from '@/shared/types/models';

type NavigationProp = StackNavigationProp<InventoryStackParamList, 'InventoryList'>;

const InventoryListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedHouseholdId] = React.useState<string | null>(
    storageHelpers.getSelectedHousehold() || null
  );

  const { data: items, isLoading, error } = useItems(
    selectedHouseholdId || '',
    { isArchived: false }
  );

  const filteredItems = React.useMemo(() => {
    if (!items) return [];
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [items, searchQuery]);

  const renderItem = ({ item }: { item: Item }) => (
    <Card style={styles.itemCard} onPress={() => {}}>
      <Card.Content style={styles.itemContent}>
        <View style={styles.itemIcon}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={32}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.itemInfo}>
          <Text variant="titleMedium" style={styles.itemName}>
            {item.name}
          </Text>
          {item.description && (
            <Text variant="bodySmall" style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          {item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 3).map((tag) => (
                <Chip key={tag} compact style={styles.chip}>
                  {tag}
                </Chip>
              ))}
            </View>
          )}
          <View style={styles.itemMeta}>
            <Text variant="bodySmall" style={styles.metaText}>
              Antall: {item.quantity} {item.unit}
            </Text>
            {item.purchasePrice && (
              <Text variant="bodySmall" style={styles.metaText}>
                • {item.purchasePrice.toLocaleString('nb-NO')} kr
              </Text>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

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
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Laster gjenstander...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={64}
          color={theme.colors.error}
        />
        <Text variant="titleMedium" style={styles.errorTitle}>
          Kunne ikke laste gjenstander
        </Text>
        <Text variant="bodyMedium" style={styles.errorText}>
          {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Søk i gjenstander..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name={searchQuery ? 'magnify' : 'package-variant-closed'}
            size={80}
            color={theme.colors.onSurfaceDisabled}
          />
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            {searchQuery ? 'Ingen resultater' : 'Ditt inventar er tomt'}
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            {searchQuery
              ? 'Prøv et annet søkeord'
              : 'Legg til gjenstander for å begynne å organisere'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddItem')}
        label="Legg til"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  itemCard: {
    marginBottom: 12,
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'row',
    gap: 12,
  },
  itemIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    opacity: 0.7,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  chip: {
    height: 24,
  },
  itemMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  metaText: {
    opacity: 0.6,
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
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  errorTitle: {
    marginTop: 16,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default InventoryListScreen;
