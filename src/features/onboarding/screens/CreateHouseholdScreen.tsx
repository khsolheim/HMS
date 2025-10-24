import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createHousehold } from '@/services/firebase/household';
import { addHouseholdToUser } from '@/services/firebase/firestore';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { storageHelpers } from '@/shared/utils/storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OnboardingStackParamList = {
  Welcome: undefined;
  CreateHousehold: undefined;
  DemoData: { householdId: string };
  Tutorial: undefined;
  Complete: undefined;
};

type CreateHouseholdScreenProps = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'CreateHousehold'>;
};

const householdSchema = z.object({
  name: z.string().min(2, 'Navn må være minst 2 tegn'),
  description: z.string().optional(),
  address: z.string().optional(),
});

type HouseholdFormData = z.infer<typeof householdSchema>;

export const CreateHouseholdScreen: React.FC<CreateHouseholdScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HouseholdFormData>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
    },
  });

  const onSubmit = async (data: HouseholdFormData) => {
    if (!user) {
      setError('Bruker ikke funnet');
      return;
    }

    setLoading(true);
    setError(null);

    // Create household
    const { household, error: createError } = await createHousehold(user.uid, {
      name: data.name,
      description: data.description,
      address: data.address,
      icon: 'home',
      color: '#4CAF50',
    });

    if (createError || !household) {
      setError(createError || 'Kunne ikke opprette husholdning');
      setLoading(false);
      return;
    }

    // Add household to user
    const { error: addError } = await addHouseholdToUser(user.uid, household.id);

    if (addError) {
      setError(addError);
      setLoading(false);
      return;
    }

    // Set as selected household
    storageHelpers.setSelectedHousehold(household.id);

    setLoading(false);

    // Navigate to demo data screen
    navigation.navigate('DemoData', { householdId: household.id });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Opprett din første husholdning
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            En husholdning kan være ditt hjem, hytte, kontor, eller hvor du oppbevarer ting
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Navn *"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.name}
                disabled={loading}
                placeholder="f.eks. Mitt hjem"
                style={styles.input}
              />
            )}
          />
          {errors.name && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.name.message}
            </Text>
          )}

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Beskrivelse (valgfritt)"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                disabled={loading}
                placeholder="f.eks. Hovedbolig i Oslo"
                style={styles.input}
                multiline
                numberOfLines={2}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Adresse (valgfritt)"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                disabled={loading}
                placeholder="f.eks. Storgata 1, 0123 Oslo"
                style={styles.input}
              />
            )}
          />

          {error && (
            <Text variant="bodySmall" style={styles.errorMessage}>
              {error}
            </Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text variant="bodySmall" style={styles.infoText}>
            💡 Tips: Du kan opprette flere husholdninger senere og bytte mellom dem
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Opprett husholdning
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    color: '#666',
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 12,
  },
  errorMessage: {
    color: '#d32f2f',
    marginTop: 8,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  infoText: {
    color: '#1565c0',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    marginBottom: 8,
  },
});

