import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Divider, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmail } from '@/services/firebase/auth';
import { useAuthStore } from '../store/authStore';
import { authenticateWithBiometrics, isBiometricAvailable, getBiometricDisplayName } from '../services/biometric';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const loginSchema = z.object({
  email: z.string().email('Ugyldig e-postadresse'),
  password: z.string().min(6, 'Passord må være minst 6 tegn'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricName, setBiometricName] = useState('Biometrisk');
  const [showPassword, setShowPassword] = useState(false);
  const { setLoading: setAuthLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const available = await isBiometricAvailable();
    setBiometricAvailable(available);
    if (available) {
      const name = await getBiometricDisplayName();
      setBiometricName(name);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    setAuthLoading(true);

    const { error: authError } = await signInWithEmail(data.email, data.password);

    if (authError) {
      setError(authError);
      setAuthLoading(false);
    }

    setLoading(false);
  };

  const handleBiometricLogin = async () => {
    const { success, error: bioError } = await authenticateWithBiometrics();
    
    if (success) {
      // Here you would retrieve saved credentials and auto-login
      // For now, just show that biometric auth succeeded
      setError(null);
    } else if (bioError) {
      setError(bioError);
    }
  };

  const handleGoogleSignIn = async () => {
    // TODO: Implement Google Sign-In with expo-auth-session
    setError('Google Sign-In kommer snart');
  };

  const handleAppleSignIn = async () => {
    // TODO: Implement Apple Sign-In
    setError('Apple Sign-In kommer snart');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            Velkommen tilbake
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Logg inn på HMS Inventory
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
                autoComplete="password"
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
          {errors.password && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.password.message}
            </Text>
          )}

          {error && (
            <Text variant="bodySmall" style={styles.errorMessage}>
              {error}
            </Text>
          )}

          <Button
            mode="text"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotButton}
          >
            Glemt passord?
          </Button>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
          >
            Logg inn
          </Button>

          {biometricAvailable && (
            <Button
              mode="outlined"
              onPress={handleBiometricLogin}
              disabled={loading}
              icon="fingerprint"
              style={styles.biometricButton}
            >
              Logg inn med {biometricName}
            </Button>
          )}
        </View>

        <View style={styles.dividerContainer}>
          <Divider style={styles.divider} />
          <Text variant="bodySmall" style={styles.dividerText}>
            eller
          </Text>
          <Divider style={styles.divider} />
        </View>

        <View style={styles.socialButtons}>
          <Button
            mode="outlined"
            onPress={handleGoogleSignIn}
            disabled={loading}
            icon="google"
            style={styles.socialButton}
          >
            Fortsett med Google
          </Button>

          {Platform.OS === 'ios' && (
            <Button
              mode="outlined"
              onPress={handleAppleSignIn}
              disabled={loading}
              icon="apple"
              style={styles.socialButton}
            >
              Fortsett med Apple
            </Button>
          )}
        </View>

        <View style={styles.footer}>
          <Text variant="bodyMedium">Har du ikke konto? </Text>
          <Button mode="text" onPress={() => navigation.navigate('SignUp')}>
            Registrer deg
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
  errorMessage: {
    color: '#d32f2f',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  loginButton: {
    marginBottom: 12,
  },
  biometricButton: {
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
  },
  socialButtons: {
    marginBottom: 24,
  },
  socialButton: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
});

