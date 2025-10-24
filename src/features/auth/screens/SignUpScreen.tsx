import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Checkbox } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUpWithEmail } from '@/services/firebase/auth';
import { useAuthStore } from '../store/authStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
};

const signUpSchema = z.object({
  email: z.string().email('Ugyldig e-postadresse'),
  password: z.string().min(8, 'Passord må være minst 8 tegn'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Du må akseptere vilkårene',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passordene matcher ikke',
  path: ['confirmPassword'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setLoading: setAuthLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const getPasswordStrength = (pwd: string): string => {
    if (pwd.length === 0) return '';
    if (pwd.length < 8) return 'Svakt';
    if (pwd.length < 12 && !/\d/.test(pwd)) return 'Middels';
    if (pwd.length >= 12 && /\d/.test(pwd) && /[A-Z]/.test(pwd)) return 'Sterkt';
    return 'Bra';
  };

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setError(null);
    setAuthLoading(true);

    const { error: authError } = await signUpWithEmail(data.email, data.password);

    if (authError) {
      setError(authError);
      setAuthLoading(false);
    }
    // If successful, auth listener will handle navigation

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            Opprett konto
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Kom i gang med HMS Inventory
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="E-post"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                disabled={loading}
                style={styles.input}
              />
            )}
          />
          {errors.email && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.email.message}
            </Text>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Passord"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.password}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                disabled={loading}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            )}
          />
          {password && (
            <Text variant="bodySmall" style={styles.passwordStrength}>
              Passordstyrke: {getPasswordStrength(password)}
            </Text>
          )}
          {errors.password && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.password.message}
            </Text>
          )}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Bekreft passord"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.confirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                disabled={loading}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
            )}
          />
          {errors.confirmPassword && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.confirmPassword.message}
            </Text>
          )}

          <Controller
            control={control}
            name="acceptTerms"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={value ? 'checked' : 'unchecked'}
                  onPress={() => onChange(!value)}
                  disabled={loading}
                />
                <Text variant="bodyMedium" style={styles.checkboxLabel}>
                  Jeg aksepterer{' '}
                  <Text style={styles.link}>vilkårene</Text> og{' '}
                  <Text style={styles.link}>personvernreglene</Text>
                </Text>
              </View>
            )}
          />
          {errors.acceptTerms && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.acceptTerms.message}
            </Text>
          )}

          {error && (
            <Text variant="bodySmall" style={styles.errorMessage}>
              {error}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.signUpButton}
          >
            Opprett konto
          </Button>
        </View>

        <View style={styles.footer}>
          <Text variant="bodyMedium">Har du allerede konto? </Text>
          <Button mode="text" onPress={() => navigation.navigate('Login')}>
            Logg inn
          </Button>
        </View>
      </ScrollView>
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
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
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
  passwordStrength: {
    color: '#666',
    marginBottom: 12,
  },
  errorMessage: {
    color: '#d32f2f',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
  },
  link: {
    color: '#1976d2',
    textDecorationLine: 'underline',
  },
  signUpButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
});

