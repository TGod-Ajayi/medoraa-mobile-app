import { ReactNode, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { fonts } from '../config/fonts';
import type { AppTheme } from '../config/theme';

const FOCUSED_BORDER_COLOR = '#4CCBC6';

export type InputProps = TextInputProps & {
  label?: string;
  leftIcon?: ReactNode;
  rightContent?: ReactNode;
  error?: string;
  /** When provided, input uses theme colors (e.g. for dark mode). */
  theme?: AppTheme;
};

export function Input({
  label,
  leftIcon,
  rightContent,
  error,
  style,
  onFocus,
  onBlur,
  theme: themeColors,
  placeholderTextColor,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const isThemed = themeColors != null;

  return (
    <View style={styles.wrap}>
      {label != null && (
        <Text
          style={[
            styles.label,
            isThemed && { color: themeColors!.inputLabel },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrap,
          isThemed && {
            backgroundColor: themeColors!.inputBg,
            borderColor: themeColors!.inputBorder,
          },
          focused && { borderColor: FOCUSED_BORDER_COLOR },
          error != null && styles.inputWrapError,
        ]}
      >
        {leftIcon != null && <View style={styles.iconWrap}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            isThemed && {
              color: themeColors!.inputText,
            },
            leftIcon != null && styles.inputWithIcon,
            rightContent != null && styles.inputWithRight,
          ]}
          placeholderTextColor={
            placeholderTextColor ??
            (isThemed ? themeColors!.inputPlaceholder : '#A0AEC0')
          }
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightContent != null && (
          <View style={styles.rightWrap}>{rightContent}</View>
        )}
      </View>
      {error != null && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: '#2D3748',
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 52,
  },
  inputWrapError: {
    borderColor: '#E53E3E',
  },
  iconWrap: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#2D3748',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  inputWithRight: {
    paddingRight: 8,
  },
  rightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    gap: 4,
  },
  error: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: '#E53E3E',
    marginTop: 4,
  },
});
