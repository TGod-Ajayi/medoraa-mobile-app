import { Button, Input } from '@/components';
import { ScreenHeader } from '@/components/screen-header';
import { useVerificationProgress } from '@/context/verification-progress';
import { useTheme } from '@/config/theme';
import * as DocumentPicker from 'expo-document-picker';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MIN_YEAR = 1980;
const YEAR_COLUMNS = 4;

const {height} = Dimensions.get("window");
/** Picked file from `expo-document-picker` (not the browser `File` API). */
type PickedDocument = { uri: string; name?: string };

function buildYearOptions(): string[] {
  const max = new Date().getFullYear();
  const years: string[] = [];
  for (let y = max; y >= MIN_YEAR; y--) {
    years.push(String(y));
  }
  return years;
}

export default function MedicalQualificationScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { markComplete } = useVerificationProgress();
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('');
  const [frontUpload, setFrontUpload] = useState<PickedDocument | null>(null);
  const colorScheme = useColorScheme();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const yearOptions = useMemo(() => buildYearOptions(), []);
  const snapPoints = useMemo(() => ['52%', '72%'], []);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
      />
    ),
    []
  );

  const openYearSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const renderYearItem = useCallback(
    ({ item }: { item: string }) => {
      const selected = year === item;
      return (
        <View style={styles.yearCell}>
          <Pressable
            onPress={() => {
              setYear(item);
              bottomSheetRef.current?.close();
            }}
            style={({ pressed }) => [
              styles.yearChip,
              {
                borderColor: selected ? theme.accent : theme.divider,
                backgroundColor: selected
                  ? theme.surfaceMuted
                  : pressed
                    ? theme.surfaceMuted
                    : 'transparent',
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Year ${item}`}
            accessibilityState={{ selected }}>
            <Text
              style={[
                styles.yearChipText,
                { color: selected ? theme.accent : theme.textPrimary },
              ]}
              numberOfLines={1}>
              {item}
            </Text>
          </Pressable>
        </View>
      );
    },
    [theme.accent, theme.divider, theme.surfaceMuted, theme.textPrimary, year]
  );

  const handlePickFront = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
        copyToCacheDirectory: false,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      setFrontUpload({ uri: asset.uri, name: asset.name ?? undefined });
    } catch {
      // no-op: user cancelled or platform denied access
    }
  }, []);
  return (
    <>
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.safe}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}>
            <ScreenHeader theme={theme} title="Medical qualification" />

            <Input
              theme={theme}
              label="Institution name"
              placeholder="Institution"
              value={institution}
              onChangeText={setInstitution}
            />
            <Input
              theme={theme}
              label="Degree"
              placeholder="e.g. MBBS"
              value={degree}
              onChangeText={setDegree}
            />

            <Pressable
              onPress={openYearSheet}
              accessibilityRole="button"
              style={styles.yearFieldPress}>
              <Input
                theme={theme}
                label="Graduation year"
                placeholder="Select year"
                value={year}
                editable={false}
                showSoftInputOnFocus={false}
                pointerEvents="none"
                rightContent={
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={theme.textMuted}
                  />
                }
              />
            </Pressable>
              <View style={{ flexDirection: 'column', gap: 16 }}>

             
            <View style={{ padding: 16, borderWidth: 1,  borderRadius: 8, backgroundColor: theme.card, borderColor: "transparent", flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%', minHeight: 144 }}>
              <View style={{display: "flex", flexDirection: "column", gap:4, alignItems: "flex-start"}}>
              <Text style={{color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A", fontSize: 16, fontWeight: "500"}}>Upload medical certificate</Text>
              <Text style={{color: "#94A3B8", fontSize: 14, fontWeight: "400"}}>JPEG, PNG, PDF (min 4MB - max 8MB)</Text>
              </View>
              <TouchableOpacity
                onPress={handlePickFront}
                style={{width: "100%", height:48, borderRadius: 30, borderWidth: 1, borderColor: "#4CCBC6", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#20BEB8", fontSize: 16, fontWeight: "500"}}>Upload Front</Text>
              </TouchableOpacity>
              {frontUpload ? (
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Selected: {frontUpload.name ?? 'file'}
                </Text>
              ) : null}
             </View>
            <View style={{ padding: 16, borderWidth: 1,  borderRadius: 8, backgroundColor: theme.card, borderColor: "transparent", flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%', minHeight: 144 }}>
              <View style={{display: "flex", flexDirection: "column", gap:4, alignItems: "flex-start"}}>
              <Text style={{color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A", fontSize: 16, fontWeight: "500"}}>Upload current medical License</Text>
              <Text style={{color: "#94A3B8", fontSize: 14, fontWeight: "400"}}>JPEG, PNG, PDF (min 4MB - max 8MB)</Text>
              </View>
              <TouchableOpacity
                onPress={handlePickFront}
                style={{width: "100%", height:48, borderRadius: 30, borderWidth: 1, borderColor: "#4CCBC6", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#20BEB8", fontSize: 16, fontWeight: "500"}}>Upload Front</Text>
              </TouchableOpacity>
              {frontUpload ? (
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Selected: {frontUpload.name ?? 'file'}
                </Text>
              ) : null}
             </View>
             </View>
           
            <Button
              theme={theme}
              label="Continue"
              style={{ borderRadius: 30, position:"fixed", bottom: height/100 * -8,}}
              onPress={() => {
                void markComplete('medical-qualification');
                router.push('/(verification)');
              }}
            />
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.card }}
        handleIndicatorStyle={{ backgroundColor: theme.divider }}>
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>
            Graduation year
          </Text>
          <Text style={[styles.sheetHint, { color: theme.textSecondary }]}>
            {MIN_YEAR} – {new Date().getFullYear()}
          </Text>
        </View>
        <BottomSheetFlatList
          data={yearOptions}
          keyExtractor={(item: string) => item}
          renderItem={renderYearItem}
          numColumns={YEAR_COLUMNS}
          columnWrapperStyle={styles.yearGridRow}
          bounces={false}
          contentContainerStyle={styles.yearListContent}
          style={styles.yearList}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 12,
  },
  scroll: {
    paddingBottom: 32,
  },
  spacer: {
    height: 12,
  },
  yearFieldPress: {
    alignSelf: 'stretch',
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sheetHint: {
    fontSize: 13,
    marginTop: 4,
  },
  yearList: {
    flex: 1,
  },
  yearListContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 28,
  },
  yearGridRow: {
    marginBottom: 10,
    paddingHorizontal: 4,
    justifyContent: 'space-between',
  },
  yearCell: {
    flex: 1,
    maxWidth: `${100 / YEAR_COLUMNS}%`,
    paddingHorizontal: 4,
  },
  yearChip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
  },
  yearChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
