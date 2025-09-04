import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Headline,
  HelperText,
  Surface,
  useTheme,
  SegmentedButtons,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/authStore';

const RegisterScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    businessName: '',
    businessType: '' as '' | 'restaurant' | 'pub' | 'cafe' | 'food_truck',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const businessTypes = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'cafe', label: 'Café' },
    { value: 'pub', label: 'Pub' },
    { value: 'food_truck', label: 'Food Truck' },
  ];

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    
    if (validateForm()) {
      const { confirmPassword, ...registerData } = formData;
      const success = await register(registerData as any);
      if (success) {
        // Navigation will be handled by the auth state change
      }
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
    clearError();
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
              Start Your Journey
            </Text>
          </View>

          <Surface style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
            <Headline style={styles.title}>Create Account</Headline>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <TextInput
                  label="First Name"
                  value={formData.firstName}
                  onChangeText={(text) => updateFormData('firstName', text)}
                  mode="outlined"
                  error={!!errors.firstName}
                  style={styles.input}
                />
                <HelperText type="error" visible={!!errors.firstName}>
                  {errors.firstName}
                </HelperText>
              </View>
              
              <View style={styles.halfWidth}>
                <TextInput
                  label="Last Name"
                  value={formData.lastName}
                  onChangeText={(text) => updateFormData('lastName', text)}
                  mode="outlined"
                  error={!!errors.lastName}
                  style={styles.input}
                />
                <HelperText type="error" visible={!!errors.lastName}>
                  {errors.lastName}
                </HelperText>
              </View>
            </View>

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!errors.email}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              error={!!errors.password}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>

            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              mode="outlined"
              secureTextEntry={!showPassword}
              error={!!errors.confirmPassword}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>

            <Divider style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Business Information (Optional)</Text>

            <TextInput
              label="Business Name"
              value={formData.businessName}
              onChangeText={(text) => updateFormData('businessName', text)}
              mode="outlined"
              style={styles.input}
            />

            <Text style={styles.fieldLabel}>Business Type</Text>
            <SegmentedButtons
              value={formData.businessType}
              onValueChange={(value) => updateFormData('businessType', value)}
              buttons={businessTypes}
              style={styles.segmentedButtons}
            />

            {error && (
              <HelperText type="error" visible={true} style={styles.errorText}>
                {error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Create Account
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              style={styles.linkButton}
              labelStyle={{ color: theme.colors.primary }}
            >
              Already have an account? Sign In
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
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  logo: {
    fontSize: 42,
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
    marginBottom: 24,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  input: {
    marginBottom: 4,
  },
  divider: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
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

export default RegisterScreen;
