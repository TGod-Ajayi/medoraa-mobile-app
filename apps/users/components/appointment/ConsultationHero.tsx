import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  title: string;
  description: string;
};

export function ConsultationHero({ title, description }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
        {title}
      </Text>
      <Text style={[styles.desc, { color: theme.textSecondary }]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
  },
});
