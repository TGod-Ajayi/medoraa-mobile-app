import { Button } from '@/components';
import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import {
  Types,
  useDoctor,
  useDoctorWallet,
  type WalletTransactionItem,
} from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tx = {
  id: string;
  name: string;
  subtitle: string;
  amount: string;
  positive?: boolean;
};

function formatCurrency(value?: number | null) {
  if (value == null || Number.isNaN(value)) return '$0.00';
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatTransactionDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function transactionTypeLabel(type: Types.WalletTransactionType) {
  switch (type) {
    case Types.WalletTransactionType.Credit:
      return 'Payment Received';
    case Types.WalletTransactionType.Refund:
      return 'Refund';
    case Types.WalletTransactionType.Withdrawal:
      return 'Withdrawal';
    case Types.WalletTransactionType.Debit:
    default:
      return 'Debit';
  }
}

function isPositiveTransaction(type: Types.WalletTransactionType) {
  return (
    type === Types.WalletTransactionType.Credit ||
    type === Types.WalletTransactionType.Refund
  );
}

function mapTransaction(tx: WalletTransactionItem): Tx {
  const positive = isPositiveTransaction(tx.type);
  const prefix = positive ? '+' : '-';
  const label = transactionTypeLabel(tx.type);

  const formatted = formatCurrency(Math.abs(tx.amount));

  return {
    id: tx.id,
    name: tx.description?.trim() || label,
    subtitle: `${label} • ${formatTransactionDate(tx.createdAt)}`,
    amount: `${prefix}${formatted}`,
    positive,
  };
}

export default function WalletScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { doctor, loading: doctorLoading } = useDoctor();
  const { wallet, loading: walletLoading, error } = useDoctorWallet({
    doctorId: doctor?.id,
  });

  const loading = doctorLoading || walletLoading;
  const transactions = useMemo(
    () => (wallet?.transactions ?? []).slice(0, 5).map(mapTransaction),
    [wallet?.transactions],
  );

  useEffect(() => {
    console.log(
      '[doctor-wallet] getWalletByDoctor response:\n' +
        JSON.stringify(
          {
            doctorId: doctor?.id ?? null,
            wallet,
            loading,
            error: error?.message ?? null,
          },
          null,
          2,
        ),
    );
  }, [doctor?.id, wallet, loading, error]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: theme.card }]}>
          <Ionicons name="chevron-back" size={22} color="#64748B" />
        </Pressable>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Wallet</Text>
        <View style={styles.iconBtn} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#20BEB8" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: theme.textPrimary }]}>
            Unable to load wallet. Please try again.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.balanceCard}>
            <View style={styles.cardRingTop} />
            <View style={styles.cardRing2Top} />
            <View style={styles.cardRingBottom} />
            <Text style={styles.balanceLabel}>Available balance</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(wallet?.availableBalance)}
            </Text>
          </View>

          <Button
            theme={theme}
            label="Withdraw"
            variant="secondary"
            onPress={() => router.push('/withdraw' as never)}
            style={styles.withdrawBtn}
            labelStyle={styles.withdrawLabel}
          />

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={styles.statLabel}>Total earned</Text>
              <View style={styles.statValueRow}>
                <Text style={[styles.statAmount, { color: theme.textPrimary }]}>
                  {formatCurrency(wallet?.totalEarned)}
                </Text>
              </View>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={styles.statLabel}>Pending</Text>
              <View style={styles.statValueRow}>
                <Text style={[styles.statAmount, { color: theme.textPrimary }]}>
                  {formatCurrency(wallet?.pendingBalance)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Recent Transactions
            </Text>
            {transactions.length > 0 ? (
              <Pressable>
                <Text style={styles.seeAll}>See All</Text>
              </Pressable>
            ) : null}
          </View>

          {transactions.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.emptyText, { color: theme.textPrimary }]}>
                No transactions yet
              </Text>
            </View>
          ) : (
            <View style={styles.txList}>
              {transactions.map((tx) => (
                <View key={tx.id} style={[styles.txCard, { backgroundColor: theme.card }]}>
                  <View style={[styles.txIconWrap, { backgroundColor: '#E8F6F5' }]}>
                    <Ionicons
                      name={tx.positive ? 'arrow-down' : 'arrow-up'}
                      size={16}
                      color="#20BEB8"
                    />
                  </View>
                  <View style={styles.txBody}>
                    <Text style={[styles.txName, { color: theme.textPrimary }]}>{tx.name}</Text>
                    <Text style={styles.txSub}>{tx.subtitle}</Text>
                  </View>
                  <Text style={[styles.txAmount, { color: theme.textPrimary }]}>{tx.amount}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts.semiBold,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  balanceCard: {
    borderRadius: 12,
    backgroundColor: '#1CABA5',
    minHeight: 109,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardRingTop: {
    position: 'absolute',
    right: -10,
    top: -22,
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  cardRing2Top: {
    position: 'absolute',
    right: -10,
    top: -22,
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  cardRingBottom: {
    position: 'absolute',
    left: -20,
    bottom: -22,
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  cardRing2Bottom: {
    position: 'absolute',
    left: -20,
    bottom: -22,
    width: 52,
    height: 52,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  balanceLabel: {
    color: '#E6FFFC',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    marginBottom: 3,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 40,
    lineHeight: 44,
    fontFamily: fonts.semiBold,
  },
  withdrawBtn: {
    borderColor: '#20BEB8',
    borderRadius: 30,
    backgroundColor: 'transparent',
    marginBottom: 14,
  },
  withdrawLabel: {
    color: '#20BEB8',
    fontFamily: fonts.medium,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statAmount: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.semiBold,
  },
  statDeltaPositive: {
    color: '#12B76A',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.medium,
  },
  statDeltaNegative: {
    color: '#F04438',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.semiBold,
  },
  seeAll: {
    color: '#20BEB8',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },
  emptyCard: {
    borderRadius: 10,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
    color: '#64748B',
  },
  txList: {
    gap: 10,
  },
  txCard: {
    borderRadius: 10,
    minHeight: 64,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  txIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txBody: {
    flex: 1,
  },
  txName: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
    marginBottom: 2,
  },
  txSub: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.regular,
  },
  txAmount: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
  },
});
