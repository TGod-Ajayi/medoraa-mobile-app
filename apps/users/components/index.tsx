import { ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import type { AppTheme } from '../config/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  leftIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

type InputProps = Omit<TextInputProps, 'style'> & {
  theme: AppTheme;
  label: string;
  leftIcon?: ReactNode;
  rightContent?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  leftIcon,
  style,
  labelStyle,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonBase,
        variant === 'secondary' && styles.buttonSecondary,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      <View style={styles.buttonContent}>
        {leftIcon ? <View style={styles.leftIconWrap}>{leftIcon}</View> : null}
        <Text style={[styles.buttonLabel, labelStyle]}>{label}</Text>
      </View>
    </Pressable>
  );
}

export function Input({
  theme,
  label,
  leftIcon,
  rightContent,
  containerStyle,
  ...textInputProps
}: InputProps) {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <Text style={[styles.inputLabel, { color: theme.inputLabel }]}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
        ]}
      >
        {leftIcon ? <View style={styles.iconWrap}>{leftIcon}</View> : null}
        <TextInput
          {...textInputProps}
          style={[styles.input, { color: theme.inputText }]}
          placeholderTextColor={theme.inputPlaceholder}
        />
        {rightContent ? <View style={styles.rightWrap}>{rightContent}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    minHeight: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  leftIconWrap: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrap: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  rightWrap: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
