import { Button, Input } from '@/components';
import { ScreenHeader } from '@/components/screen-header';
import {
  METHOD_BY_ID,
  selectedMethodToRouteParam,
  type SelectedMethodProps,
} from '@/config/verification-id';
import { useVerificationProgress } from '@/context/verification-progress';
import { useTheme } from '@/config/theme';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const verificationMethods = [
  { id: 1, title: 'National ID' },
  { id: 2, title: 'International Passport' },
  { id: 3, title: "Driver's License" },
] as const;

const { height } = Dimensions.get('window');

export default function IdDocumentsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { markComplete } = useVerificationProgress();
  const [name, setName ] = useState<string>("");
  const [ninNumber, setNinNumber] = useState<number>();
  const colorScheme = useColorScheme();
  const [selectedMethod, setSelectedMethod] = useState<SelectedMethodProps | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [step, setStep] = useState<number>(1);
  const [address, setAddress] = useState<string>("");
  const [passportNumber, setPassportNumber] = useState<number | null>(null);
  const [frontUpload, setFrontUpload] = useState<{ uri: string; name?: string } | null>(null);

  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? '#334155' : '#FFFFFF';

  const selectedLabel =
    selectedId != null
      ? verificationMethods.find((m) => m.id === selectedId)?.title
      : undefined;

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
      {step === 1 && (
        <View style={[styles.root, { backgroundColor: theme.background }]}>
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
          <ScreenHeader theme={theme} title="ID Verification" />
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}>
            Choose verification method
          </Text>
  
          <View style={styles.content}>
            <View style={styles.methodList}>
              {verificationMethods.map((method) => {
                const selected = selectedId === method.id;
                return (
                  <Pressable
                    key={method.id}
                    onPress={() => {
                      setSelectedId(method.id);
                      setSelectedMethod(METHOD_BY_ID[method.id]);
                    }}
                    style={({ pressed }) => [
                      styles.methodRow,
                      {
                        backgroundColor: cardBg,
                        opacity: pressed ? 0.92 : 1,
                      },
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}>
                    <Text
                      style={[
                        styles.methodLabel,
                        { color: isDark ? '#FFFFFF' : '#0F172A' },
                      ]}>
                      {method.title}
                    </Text>
                    <View
                      style={[
                        styles.radioOuter,
                        { borderColor: theme.accent },
                      ]}>
                      {selected ? (
                        <View
                          style={[styles.radioInner, { backgroundColor: theme.accent }]}
                        />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </SafeAreaView>
  
        <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
          <View style={styles.footer}>
            <Button
              theme={theme}
              label="Continue"
              disabled={selectedId == null || selectedMethod == null}
              onPress={() => setStep(2)}
              style={{ backgroundColor: theme.accent, borderRadius: 30 }}
            />
          </View>
        </SafeAreaView>
      </View>
      )}

      {step === 2 && selectedMethod != null && (
        <View style={[styles.root, { backgroundColor: theme.background }]}>
          <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
            <ScreenHeader
              theme={theme}
              title={selectedMethod === "national_id" ? "National ID" : selectedMethod === "international_passport" ? "International Passport" : "Driver's License"}
              onBackPress={() => setStep(1)}
            />
            {selectedMethod === 'national_id' && (
              <>
              <Input
               
               theme={theme}
               label="Name"
               placeholder="Full name"
               value={name}
               onChangeText={setName}
               autoCapitalize="words"
               autoCorrect={false}
             />
             <Input
               theme={theme}
               label="NIN Number"
               placeholder="NIN Number"
               value={ninNumber?.toString() ?? ""}
               onChangeText={(text) => setNinNumber(Number(text))}
               keyboardType="numeric"
             />
               <Input
               theme={theme}
               label="Address"
               placeholder="Enter Address"
               value={address}
               onChangeText={setAddress}
               autoCapitalize="words"
               autoCorrect={false}
             />
             <View style={{ padding: 16, borderWidth: 1,  borderRadius: 8, backgroundColor: theme.card, borderColor: "transparent", flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%', minHeight: 144 }}>
              <View style={{display: "flex", flexDirection: "column", gap:4, alignItems: "flex-start"}}>
              <Text style={{color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A", fontSize: 16, fontWeight: "500"}}>Upload front of your NIN slip</Text>
              <Text style={{color: "#94A3B8", fontSize: 14, fontWeight: "400"}}>JPEG, PNG, PDF (min 4MB - max 8MB)</Text>
              </View>
              <TouchableOpacity
                onPress={handlePickFront}
                style={{width: 329, height:48, borderRadius: 30, borderWidth: 1, borderColor: "#4CCBC6", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#20BEB8", fontSize: 16, fontWeight: "500"}}>Upload Front</Text>
              </TouchableOpacity>
              {frontUpload ? (
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Selected: {frontUpload.name ?? 'file'}
                </Text>
              ) : null}
             </View>
             </>
             )}
            {selectedMethod === 'international_passport' && (
              <>
              <Input 
               theme={theme}
               label="Name"
               placeholder="Full name"
               value={name}
               onChangeText={setName}
               autoCapitalize="words"
               autoCorrect={false}
             />
             <Input
               theme={theme}
               label="Passport Number"
               placeholder="Passport Number"
               value={passportNumber?.toString() ?? ""}
               onChangeText={(text) => setPassportNumber(Number(text))}
               keyboardType="numeric"
             />
               <Input
               theme={theme}
               label="Address"
               placeholder="Enter Address"
               value={address}
               onChangeText={setAddress}
               autoCapitalize="words"
               autoCorrect={false}
             />
             <View style={{ padding: 16, borderWidth: 1,  borderRadius: 8, backgroundColor: theme.card, borderColor: "transparent", flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%', minHeight: 144 }}>
              <View style={{display: "flex", flexDirection: "column", gap:4, alignItems: "flex-start"}}>
              <Text style={{color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A", fontSize: 16, fontWeight: "500"}}>Upload front of your International Passport</Text>
              <Text style={{color: "#94A3B8", fontSize: 14, fontWeight: "400"}}>JPEG, PNG, PDF (min 4MB - max 8MB)</Text>
              </View>
              <TouchableOpacity
                onPress={handlePickFront}
                style={{width: 329, height:48, borderRadius: 30, borderWidth: 1, borderColor: "#4CCBC6", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#20BEB8", fontSize: 16, fontWeight: "500"}}>Upload Front</Text>
              </TouchableOpacity>
              {frontUpload ? (
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Selected: {frontUpload.name ?? 'file'}
                </Text>
              ) : null}
             </View>
             </>
             )}
            {selectedMethod === 'drivers_license' && (
              <>
              <Input
               
               theme={theme}
               label="Name"
               placeholder="Full name"
               value={name}
               onChangeText={setName}
               autoCapitalize="words"
               autoCorrect={false}
             />
             <Input
               theme={theme}
               label="NIN Number"
               placeholder="NIN Number"
               value={ninNumber?.toString() ?? ""}
               onChangeText={(text) => setNinNumber(Number(text))}
               keyboardType="numeric"
             />
               <Input
               theme={theme}
               label="Address"
               placeholder="Enter Address"
               value={address}
               onChangeText={setAddress}
               autoCapitalize="words"
               autoCorrect={false}
             />
             <View style={{ padding: 16, borderWidth: 1,  borderRadius: 8, backgroundColor: theme.card, borderColor: "transparent", flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%', minHeight: 144 }}>
              <View style={{display: "flex", flexDirection: "column", gap:4, alignItems: "flex-start"}}>
              <Text style={{color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A", fontSize: 16, fontWeight: "500"}}>Upload front of your NIN slip</Text>
              <Text style={{color: "#94A3B8", fontSize: 14, fontWeight: "400"}}>JPEG, PNG, PDF (min 4MB - max 8MB)</Text>
              </View>
              <TouchableOpacity
                onPress={handlePickFront}
                style={{width: 329, height:48, borderRadius: 30, borderWidth: 1, borderColor: "#4CCBC6", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#20BEB8", fontSize: 16, fontWeight: "500"}}>Upload Front</Text>
              </TouchableOpacity>
              {frontUpload ? (
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Selected: {frontUpload.name ?? 'file'}
                </Text>
              ) : null}
             </View>
             </>
             )}
          </SafeAreaView>

          <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
            <View style={styles.footer}>
              <Button
                theme={theme}
                label="Continue"
                onPress={() => {
                  void markComplete('id-documents');
                  router.push({
                    pathname: '/(verification)',
                    params: {
                      method: selectedMethodToRouteParam(selectedMethod),
                      methodLabel: selectedLabel ?? '',
                    },
                  });
                }}
                style={{ backgroundColor: theme.accent, borderRadius: 30 }}
              />
            </View>
          </SafeAreaView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: height / 100,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 20,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  content: {
    flex: 1,
  },
  methodList: {
    width: '100%',
    gap: 12,
  },
  methodRow: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    flex: 1,
    paddingRight: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  footerSafe: {
    paddingHorizontal: 16,
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  step2Block: {
    marginTop: 8,
  },
  step2Hint: {
    fontSize: 15,
    lineHeight: 22,
  },
});
