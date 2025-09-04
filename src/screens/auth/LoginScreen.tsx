import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Headline,
  HelperText,
  Surface,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/authStore';

const LoginScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    clearError();
    let hasError = false;

    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!hasError) {
      const success = await login({ email, password });
      if (success) {
        // Navigation will be handled by the auth state change
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Text style={[styles.logo, { color: theme.colors.primary }]}>
              PrepFlow
            </Text>
            <Text style={[styles.tagline, { color: theme.colors.onBackground }]}>
              Restaurant Management Made Simple
            </Text>
          </View>

          <Surface style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
            <Headline style={styles.title}>Welcome Back</Headline>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Sign in to your account
            </Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
                clearError();
              }}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!emailError}
              style={styles.input}
            />
            <HelperText type="error" visible={!!emailError}>
              {emailError}
            </HelperText>

            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
                clearError();
              }}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              error={!!passwordError}
              style={styles.input}
            />
            <HelperText type="error" visible={!!passwordError}>
              {passwordError}
            </HelperText>

            {error && (
              <HelperText type="error" visible={true} style={styles.errorText}>
                {error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Sign In
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              style={styles.linkButton}
              labelStyle={{ color: theme.colors.primary }}
            >
              Don't have an account? Sign Up
            </Button>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default LoginScreen;
