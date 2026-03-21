import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

export type PaymentLine = { label: string; value: string };

type Props = {
  title?: string;
  lines: PaymentLine[];
};

export function PaymentDetailsSection({ title = 'Payment Details', lines }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.divider }]}>
      <Text style={[styles.heading, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
        {title}
      </Text>
      {lines.map((line) => (
        <View key={line.label} style={styles.row}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>{line.label}</Text>
          <Text style={[styles.value, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
            {line.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontSize: 14,
    marginLeft: 12,
  },
});
