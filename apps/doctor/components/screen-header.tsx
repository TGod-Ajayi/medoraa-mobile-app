import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import type { AppTheme } from '../config/theme';
import { SvgXml } from 'react-native-svg';
import { backArrow } from '@/config/svg';

type Props = {
  theme: AppTheme;
  title: string;
  showBack?: boolean;
  /** When set, called instead of `router.back()` (e.g. multi-step flows). */
  onBackPress?: () => void;
};

export function ScreenHeader({ theme, title, showBack = true, onBackPress }: Props) {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleBack = () => {
    if (onBackPress) onBackPress();
    else router.back();
  };

  return (
    <View style={styles.row}>
      {showBack ? (
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back">
         <SvgXml xml={backArrow} width={24} height={24} />
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <Text style={[styles.title, { color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A" }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.backPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    minHeight: 44,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"
  },
  backPlaceholder: {
    width: 44,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});
