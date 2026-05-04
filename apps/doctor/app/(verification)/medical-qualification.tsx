import { Button, Input } from '@/components';
import { ScreenHeader } from '@/components/screen-header';
import { useVerificationProgress } from '@/context/verification-progress';
import { useTheme } from '@/config/theme';
import * as DocumentPicker from 'expo-document-picker';
import { useApolloClient } from '@apollo/client/react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
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
import { Types } from '@repo/ui/graphql';
import { showMessage } from 'react-native-flash-message';

const MIN_YEAR = 1970;
const YEAR_COLUMNS = 4;

const {height} = Dimensions.get("window");
/** Picked file from `expo-document-picker` (not the browser `File` API). */
type PickedDocument = { uri: string; name?: string; mimeType?: string; key?: string };

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
  const client = useApolloClient();
  const { markComplete } = useVerificationProgress();
  const [institution, setInstitution] = useState('');
  const [year, setYear] = useState('');
  const [medicalCertificateUpload, setMedicalCertificateUpload] =
    useState<PickedDocument | null>(null);
  const [medicalLicenseUpload, setMedicalLicenseUpload] =
    useState<PickedDocument | null>(null);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
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



  const canPreviewAsImage = useCallback((file: PickedDocument) => {
    const normalizedMime = (file.mimeType ?? '').toLowerCase();
    if (normalizedMime.startsWith('image/')) return true;
    const lowerName = (file.name ?? '').toLowerCase();
    return /\.(jpg|jpeg|png|webp|gif|heic)$/i.test(lowerName);
  }, []);

  const uploadDocument = useCallback(
    async (
      uri: string,
      filename: string,
      mimeType: string,
      size: number | undefined,
      kind: 'certificate' | 'license'
    ) => {
      console.log(`[Medical Upload:${kind}] Step 1: Initiating upload`, {
        filename,
        mimeType,
        size,
        type: Types.FileTypeEnum.Identification,
      });
      const initResult = await client.mutate({
        mutation: Types.InitiateUploadDocument,
        variables: {
          input: {
            type: Types.FileTypeEnum.Identification,
            filename,
            size,
          },
        },
      });

      const presignedUrl = initResult.data?.initiateUpload?.presignedUrl;
      const key = initResult.data?.initiateUpload?.key;
      console.log(`[Medical Upload:${kind}] Step 1 complete`, {
        hasPresignedUrl: Boolean(presignedUrl),
        key,
        expiresAt: initResult.data?.initiateUpload?.expiresAt,
      });
      if (!presignedUrl || !key) {
        throw new Error('Unable to initiate file upload');
      }

      console.log(`[Medical Upload:${kind}] Reading local file`, { uri });
      const fileRes = await fetch(uri);
      if (!fileRes.ok) throw new Error('Unable to read selected file');
      const body = await fileRes.blob();
      const fileType = mimeType || body.type || 'application/octet-stream';

      console.log(`[Medical Upload:${kind}] Step 2: PUT upload`, {
        key,
        fileType,
        byteSize: body.size,
      });
      const putRes = await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': fileType },
        body,
      });
      if (!putRes.ok) throw new Error(`Upload failed with status ${putRes.status}`);
      console.log(`[Medical Upload:${kind}] Step 2 complete`, { status: putRes.status, key });

      console.log(`[Medical Upload:${kind}] Step 3: Confirm upload`, { key });
      const confirmResult = await client.mutate({
        mutation: Types.ConfirmUploadDocument,
        variables: { key },
      });
      const confirmed = confirmResult.data?.confirmUpload;
      console.log(`[Medical Upload:${kind}] Step 3 complete`, confirmed);
      if (!confirmed) throw new Error('Unable to confirm uploaded file');

      console.log(`[Medical Upload:${kind}] Step 4: Refetch user`);
      await client.refetchQueries({ include: [Types.GetUserDocument] });
      console.log(`[Medical Upload:${kind}] Flow complete`, { key: confirmed.key });
      return { key: confirmed.key };
    },
    [client]
  );

  const pickAndUploadDocument = useCallback(async (kind: 'certificate' | 'license') => {
    const setLoading = kind === 'certificate' ? setUploadingCertificate : setUploadingLicense;
    const setUpload =
      kind === 'certificate' ? setMedicalCertificateUpload : setMedicalLicenseUpload;
    const isUploading = kind === 'certificate' ? uploadingCertificate : uploadingLicense;
    if (isUploading) return;

    try {
      console.log(`[Medical Upload:${kind}] Opening document picker`);
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log(`[Medical Upload:${kind}] Document picker canceled`);
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        console.log(`[Medical Upload:${kind}] No picked document asset found`);
        return;
      }

      const mimeType = asset.mimeType ?? 'application/octet-stream';
      const filename = asset.name ?? `${kind}-document-${Date.now()}`;
      console.log(`[Medical Upload:${kind}] Picked document`, {
        uri: asset.uri,
        filename,
        mimeType,
        size: asset.size ?? null,
      });

      setLoading(true);
      const uploaded = await uploadDocument(
        asset.uri,
        filename,
        mimeType,
        asset.size ?? undefined,
        kind
      );
      setUpload({
        uri: asset.uri,
        name: filename,
        mimeType,
        key: uploaded.key,
      });
      showMessage({
        message:
          kind === 'certificate'
            ? 'Medical certificate uploaded successfully'
            : 'Medical license uploaded successfully',
        type: 'success',
        duration: 3000,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Document upload failed';
      console.log(`[Medical Upload:${kind}] Upload flow failed`, { message, error });
      showMessage({
        message,
        type: 'danger',
        duration: 5000,
      });
    } finally {
      setLoading(false);
      console.log(`[Medical Upload:${kind}] Uploading state reset`);
    }
  }, [uploadDocument, uploadingCertificate, uploadingLicense]);

  const handleOpenUploadedDocument = useCallback(async (file: PickedDocument | null) => {
    if (!file?.uri) return;
    const canOpen = await Linking.canOpenURL(file.uri);
    if (!canOpen) {
      showMessage({
        message: 'Could not open uploaded document preview.',
        type: 'danger',
        duration: 4000,
      });
      return;
    }
    await Linking.openURL(file.uri);
  }, []);

  const renderUploadPreview = (
    upload: PickedDocument | null,
    onRemove: () => void
  ) => {
    if (!upload) return null;
    return (
      <View style={styles.previewWrap}>
        {canPreviewAsImage(upload) ? (
          <Image source={{ uri: upload.uri }} style={styles.previewImage} />
        ) : (
          <TouchableOpacity
            onPress={() => void handleOpenUploadedDocument(upload)}
            style={[styles.previewFileCard, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              Tap to preview uploaded document
            </Text>
          </TouchableOpacity>
        )}
        <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
          Selected: {upload.name ?? 'file'}
        </Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeUploadButton}>
          <Text style={styles.removeUploadText}>Remove document</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // const handleUpdateDoctor = async() => {
  //   if(!institution || !degree || !year || !frontUpload){
  //     showMessage({
  //       message: "Please fill all the fields",
  //       type: "danger",
  //       duration: 4000,
  //     })
  //     return;
  //   }
  //   try{
  //     const {data} = await updateDoctor({
  //       variables: {
  //         updateDoctorInput: {
  //           medicalSchool: institution as string,
  //           graduationYear: Number(year),
  //           medicalCertificate: frontUpload?.uri,
  //         }
  //       }
  //     })
  //   }
  //   catch(err: any){
  //     showMessage({
  //       message: err?.message,
  //       type: "danger",
  //       duration: 4000,
  //     })
  //     return;
  //   }
  // }

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
            {/* <Input
              theme={theme}
              label="Degree"
              placeholder="e.g. MBBS"
              value={degree}
              onChangeText={setDegree}
            /> */}

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
                onPress={() => void pickAndUploadDocument('certificate')}
                disabled={uploadingCertificate}
                style={{width: "100%", height:48, borderRadius: 30, borderWidth: 1, borderColor: "#4CCBC6", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#20BEB8", fontSize: 16, fontWeight: "500"}}>
                  {uploadingCertificate ? 'Uploading...' : 'Upload Front'}
                </Text>
              </TouchableOpacity>
              {renderUploadPreview(medicalCertificateUpload, () => setMedicalCertificateUpload(null))}
             </View>
            <View style={{ padding: 16, borderWidth: 1,  borderRadius: 8, backgroundColor: theme.card, borderColor: "transparent", flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%', minHeight: 144 }}>
              <View style={{display: "flex", flexDirection: "column", gap:4, alignItems: "flex-start"}}>
              <Text style={{color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A", fontSize: 16, fontWeight: "500"}}>Upload current medical License</Text>
              <Text style={{color: "#94A3B8", fontSize: 14, fontWeight: "400"}}>JPEG, PNG, PDF (max 8MB)</Text>
              </View>
              <TouchableOpacity
                onPress={() => void pickAndUploadDocument('license')}
                disabled={uploadingLicense}
                style={{width: "100%", height:48, borderRadius: 30, borderWidth: 1, borderColor: "#4CCBC6", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#20BEB8", fontSize: 16, fontWeight: "500"}}>
                  {uploadingLicense ? 'Uploading...' : 'Upload Front'}
                </Text>
              </TouchableOpacity>
              {renderUploadPreview(medicalLicenseUpload, () => setMedicalLicenseUpload(null))}
             </View>
             </View>
           
            <Button
              theme={theme}
              label="Continue"
              disabled={
                !medicalCertificateUpload?.key ||
                !medicalLicenseUpload?.key ||
                uploadingCertificate ||
                uploadingLicense
              }
              style={{ borderRadius: 30, position:"fixed", bottom: height/100 * -8,}}
              onPress={() => {
                void markComplete('medical-qualification');
                router.push({pathname:"/(verification)/physical-clinic", params: {
                  medicalSchool: institution,
                  graduationYear: Number(year),
                  medicalCertificate: medicalCertificateUpload?.uri,
                }});
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
  previewWrap: {
    width: '100%',
    gap: 8,
  },
  previewImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
  },
  previewFileCard: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  removeUploadButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  removeUploadText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
  },
});
