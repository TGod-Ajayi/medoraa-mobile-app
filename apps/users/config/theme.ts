/**
 * App theme: light and dark color palettes.
 * Dark mode background: #0F172A (from design).
 */

import { useColorScheme } from '@repo/ui/hooks';

export type AppTheme = {
  background: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentFocus: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  inputLabel: string;
  checkboxBorder: string;
  checkboxChecked: string;
  divider: string;
  dividerText: string;
  socialButtonBg: string;
  socialButtonBorder: string;
  socialButtonText: string;
  link: string;
  error: string;
};

export const lightTheme: AppTheme = {
  background: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  accent: '#2DC2B1',
  accentFocus: '#4CCBC6',
  inputBg: '#FFFFFF',
  inputBorder: '#E2E8F0',
  inputText: '#2D3748',
  inputPlaceholder: '#A0AEC0',
  inputLabel: '#2D3748',
  checkboxBorder: '#E2E8F0',
  checkboxChecked: '#2DC2B1',
  divider: '#E2E8F0',
  dividerText: '#718096',
  socialButtonBg: '#FFFFFF',
  socialButtonBorder: '#E2E8F0',
  socialButtonText: '#0F172A',
  link: '#2DC2B1',
  error: '#E53E3E',
};

export const darkTheme: AppTheme = {
  background: '#0F172A',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#94A3B8',
  accent: '#2DC2B1',
  accentFocus: '#4CCBC6',
  inputBg: 'transparent',
  inputBorder: 'rgba(255,255,255,0.3)',
  inputText: '#FFFFFF',
  inputPlaceholder: '#94A3B8',
  inputLabel: '#94A3B8',
  checkboxBorder: 'rgba(255,255,255,0.5)',
  checkboxChecked: '#2DC2B1',
  divider: 'rgba(255,255,255,0.2)',
  dividerText: '#94A3B8',
  socialButtonBg: 'transparent',
  socialButtonBorder: 'rgba(255,255,255,0.3)',
  socialButtonText: '#FFFFFF',
  link: '#2DC2B1',
  error: '#E53E3E',
};

export function getTheme(isDark: boolean): AppTheme {
  return isDark ? darkTheme : lightTheme;
}

/** Hook to use in components. Uses system color scheme (light/dark). */
export function useTheme(): AppTheme {
  const colorScheme = useColorScheme();
  return getTheme(colorScheme === 'dark');
}
