import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText, Chip } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCreateItem } from '@/features/inventory/hooks/useItems';
import { storageHelpers } from '@/shared/utils/storage';

// Validation schema
const itemSchema = z.object({
  name: z.string().min(1, 'Navn er påkrevd').max(100, 'Navnet er for langt'),
  description: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  barcode: z.string().optional(),
  purchasePrice: z.string().optional(),
  purchaseDate: z.string().optional(),
  quantity: z.string().min(1, 'Antall må være minst 1'),
  unit: z.string(),
});

type ItemFormData = z.infer<typeof itemSchema>;

const AddItemScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const createItemMutation = useCreateItem();
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      quantity: '1',
      unit: 'stk',
    },
  });

  const onSubmit = async (data: ItemFormData) => {
    const householdId = storageHelpers.getSelectedHousehold();
    if (!householdId || !user) {
      alert('Ingen husholdning valgt');
      return;
    }

    try {
      await createItemMutation.mutateAsync({
        householdId,
        userId: user.uid,
        data: {
          name: data.name,
          description: data.description || '',
          categoryId: undefined,
          locationId: undefined,
          brand: data.brand,
          model: data.model,
          serialNumber: data.serialNumber,
          barcode: data.barcode,
          purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : undefined,
          purchaseDate: data.purchaseDate
            ? { seconds: new Date(data.purchaseDate).getTime() / 1000 } as any
            : undefined,
          quantity: parseInt(data.quantity),
          unit: data.unit,
          minStock: undefined,
          tags,
          images: [],
          attachments: [],
          customFields: {},
          qrCode: undefined,
          isArchived: false,
        },
      });

      navigation.goBack();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke legge til gjenstand');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          Legg til gjenstand
        </Text>

        {/* Name */}
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
              style={styles.input}
            />
          )}
        />
        {errors.name && (
          <HelperText type="error">{errors.name.message}</HelperText>
        )}

        {/* Description */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Beskrivelse"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          )}
        />

        {/* Brand & Model */}
        <View style={styles.row}>
          <Controller
            control={control}
            name="brand"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Merke"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[styles.input, styles.halfWidth]}
              />
            )}
          />
          <Controller
            control={control}
            name="model"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Modell"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[styles.input, styles.halfWidth]}
              />
            )}
          />
        </View>

        {/* Serial Number & Barcode */}
        <Controller
          control={control}
          name="serialNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Serienummer"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="barcode"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Strekkode"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              right={<TextInput.Icon icon="barcode-scan" />}
            />
          )}
        />

        {/* Quantity & Unit */}
        <View style={styles.row}>
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Antall *"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                error={!!errors.quantity}
                style={[styles.input, styles.halfWidth]}
              />
            )}
          />
          <Controller
            control={control}
            name="unit"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Enhet"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[styles.input, styles.halfWidth]}
              />
            )}
          />
        </View>

        {/* Purchase Price */}
        <Controller
          control={control}
          name="purchasePrice"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Kjøpspris (kr)"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              style={styles.input}
              left={<TextInput.Affix text="kr" />}
            />
          )}
        />

        {/* Tags */}
        <Text variant="labelLarge" style={styles.tagLabel}>
          Tagger
        </Text>
        <View style={styles.tagInputContainer}>
          <TextInput
            mode="outlined"
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={addTag}
            placeholder="Legg til tag"
            style={styles.tagInput}
            right={<TextInput.Icon icon="plus" onPress={addTag} />}
          />
        </View>
        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                onClose={() => removeTag(tag)}
                style={styles.chip}
              >
                {tag}
              </Chip>
            ))}
          </View>
        )}

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting || createItemMutation.isPending}
          disabled={isSubmitting || createItemMutation.isPending}
          style={styles.submitButton}
        >
          Legg til gjenstand
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          disabled={isSubmitting || createItemMutation.isPending}
        >
          Avbryt
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  tagLabel: {
    marginBottom: 8,
  },
  tagInputContainer: {
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 12,
  },
});

export default AddItemScreen;

