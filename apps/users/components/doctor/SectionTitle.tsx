import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  children: string;
};

/** Bold section heading (no See All). */
export function SectionTitle({ children }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.text, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
    marginTop: 8,
  },
  text: {
    fontSize: 18,
  },
});
