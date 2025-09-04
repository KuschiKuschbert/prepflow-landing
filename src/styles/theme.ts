import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

// PrepFlow brand colors
const brandColors = {
  primary: '#29E7CD', // Electric Cyan
  secondary: '#3B82F6', // Blue
  accent: '#D925C7', // Vibrant Magenta
  background: '#0a0a0a', // Dark background
  surface: '#1f1f1f', // Dark gray
  text: '#ffffff', // White text
  border: '#2a2a2a', // Border gray
  error: '#FF5252',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3'
};

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
};

// Dark theme (default)
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    tertiary: brandColors.accent,
    background: brandColors.background,
    surface: brandColors.surface,
    surfaceVariant: brandColors.border,
    onBackground: brandColors.text,
    onSurface: brandColors.text,
    outline: brandColors.border,
    error: brandColors.error,
    onError: brandColors.text,
    primaryContainer: brandColors.primary,
    onPrimaryContainer: brandColors.background,
    secondaryContainer: brandColors.secondary,
    onSecondaryContainer: brandColors.text,
    tertiaryContainer: brandColors.accent,
    onTertiaryContainer: brandColors.text,
  },
  fonts: configureFonts({ config: fontConfig }),
};

// Light theme (optional)
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    tertiary: brandColors.accent,
    primaryContainer: brandColors.primary,
    onPrimaryContainer: brandColors.text,
    secondaryContainer: brandColors.secondary,
    onSecondaryContainer: brandColors.text,
    tertiaryContainer: brandColors.accent,
    onTertiaryContainer: brandColors.text,
  },
  fonts: configureFonts({ config: fontConfig }),
};

export default darkTheme;
