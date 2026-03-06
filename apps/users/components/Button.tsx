import { ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { fonts } from '../config/fonts';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  leftIcon?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Override or extend the label text style (e.g. fontSize, fontFamily, color). */
  labelStyle?: StyleProp<TextStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  leftIcon,
  disabled = false,
  style,
  labelStyle,
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {leftIcon != null && <View style={styles.iconWrap}>{leftIcon}</View>}
      <Text
        style={[
          styles.label,
          variant === 'primary' ? styles.labelPrimary : styles.labelSecondary,
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 9999,
    gap: 10,
  },
  primary: {
    backgroundColor: '#2DC2B1',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.6,
  },
  iconWrap: {},
  label: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  labelPrimary: {
    color: '#fff',
  },
  labelSecondary: {
    color: '#2D3748',
  },
});
