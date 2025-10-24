import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Divider, Button, useTheme } from 'react-native-paper';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { signOutUser } from '@/services/firebase/auth';

const SettingsScreen = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Text variant="titleLarge" style={styles.profileName}>
          {user?.displayName || 'Bruker'}
        </Text>
        <Text variant="bodyMedium" style={styles.profileEmail}>
          {user?.email}
        </Text>
      </View>

      <Divider />

      {/* Household Section */}
      <List.Section>
        <List.Subheader>Husholdning</List.Subheader>
        <List.Item
          title="Min husholdning"
          description="Administrer husholdning og medlemmer"
          left={(props) => <List.Icon {...props} icon="home" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </List.Section>

      <Divider />

      {/* App Settings */}
      <List.Section>
        <List.Subheader>App-innstillinger</List.Subheader>
        <List.Item
          title="Varslinger"
          description="Push-varslinger og påminnelser"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch value={notifications} onValueChange={setNotifications} />
          )}
        />
        <List.Item
          title="Mørk modus"
          description="Endre tema-stil"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => <Switch value={darkMode} onValueChange={setDarkMode} />}
        />
        <List.Item
          title="Språk"
          description="Norsk (Bokmål)"
          left={(props) => <List.Icon {...props} icon="translate" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </List.Section>

      <Divider />

      {/* Account */}
      <List.Section>
        <List.Subheader>Konto</List.Subheader>
        <List.Item
          title="Profil"
          description="Rediger profil og innstillinger"
          left={(props) => <List.Icon {...props} icon="account" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        <List.Item
          title="Personvern"
          description="Datasikkerhet og personvern"
          left={(props) => <List.Icon {...props} icon="shield-check" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </List.Section>

      <Divider />

      {/* About */}
      <List.Section>
        <List.Subheader>Om</List.Subheader>
        <List.Item
          title="Versjon"
          description="1.0.0 (Beta)"
          left={(props) => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title="Hjelp & Support"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </List.Section>

      {/* Sign Out */}
      <View style={styles.signOutContainer}>
        <Button mode="outlined" onPress={handleSignOut} style={styles.signOutButton}>
          Logg ut
        </Button>
      </View>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerText}>
          HMS Inventory © 2025
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    padding: 24,
    alignItems: 'center',
  },
  profileName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    opacity: 0.7,
  },
  signOutContainer: {
    padding: 24,
    paddingTop: 32,
  },
  signOutButton: {
    borderColor: '#d32f2f',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    opacity: 0.5,
  },
});

export default SettingsScreen;

