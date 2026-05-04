import { Button } from '@/components';
import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FieldProps = {
  label: string;
  value: string;
  rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
};

function Field({ label, value, rightIcon }: FieldProps) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.fieldBox}>
        <Text style={styles.fieldValue}>{value}</Text>
        {rightIcon ? <Ionicons name={rightIcon} size={20} color="#667085" /> : null}
      </Pressable>
    </View>
  );
}

export default function AccountSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <Ionicons name="chevron-back" size={22} color="#667085" />
        </Pressable>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Account Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Field label="Name" value="Zenifer Aniston" />
        <Field label="Email" value="amiliejacson@gmail.com" />
        <Field label="Date of Birth" value="22 November 1998" rightIcon="calendar-outline" />
        <Field label="Country" value="Nigeria" rightIcon="chevron-down-outline" />
        <Field label="Contact Number" value="+234 8164499626" />
        <Field label="Gender" value="Female" rightIcon="chevron-down-outline" />
        <Field label="Specialization" value="O & G" rightIcon="chevron-down-outline" />
      </ScrollView>

      <View style={[styles.footerWrap, { backgroundColor: theme.background }]}>
        <Button
          theme={theme}
          label="Save Changes"
          style={{
            backgroundColor: '#20BEB8',
            borderColor: '#20BEB8',
            borderRadius: 30,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: '#475467',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
    marginBottom: 8,
  },
  fieldBox: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  fieldValue: {
    color: '#101828',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.regular,
  },
  footerWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
});
