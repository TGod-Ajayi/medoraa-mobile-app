import { Button, Input } from '@/components';
import { ScreenHeader } from '@/components/screen-header';
import {
  METHOD_BY_ID,
  selectedMethodToRouteParam,
  type SelectedMethodProps,
} from '@/config/verification-id';
import { useVerificationProgress } from '@/context/verification-progress';
import { useTheme } from '@/config/theme';
import { useApolloClient } from '@apollo/client/react';
import { Types } from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useState } from 'react';
import { Dimensions, Image, Keyboard, Linking, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const verificationMethods = [
  { id: 1, title: 'National ID' },
  { id: 2, title: 'International Passport' },
] as const;

const { height } = Dimensions.get('window');

export default function IdDocumentsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const client = useApolloClient();
  const { markComplete } = useVerificationProgress();
  const [name, setName ] = useState<string>("");
  const [ninNumber, setNinNumber] = useState<number>();
  const colorScheme = useColorScheme();
  const [selectedMethod, setSelectedMethod] = useState<SelectedMethodProps | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [step, setStep] = useState<number>(1);
  const [address, setAddress] = useState<string>("");
  const [passportNumber, setPassportNumber] = useState<number | null>(null);
  const [frontUpload, setFrontUpload] = useState<{
    uri: string;
    name?: string;
    key?: string;
    mimeType?: string;
  } | null>(null);
  const [uploadingFront, setUploadingFront] = useState(false);

  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? '#334155' : '#FFFFFF';

  const selectedLabel =
    selectedId != null
      ? verificationMethods.find((m) => m.id === selectedId)?.title
      : undefined;

  const canPreviewAsImage = useCallback((file: { uri: string; name?: string; mimeType?: string }) => {
    const normalizedMime = (file.mimeType ?? '').toLowerCase();
    if (normalizedMime.startsWith('image/')) return true;
    const lowerName = (file.name ?? '').toLowerCase();
    return /\.(jpg|jpeg|png|webp|gif|heic)$/i.test(lowerName);
  }, []);

  const handleOpenUploadedDocument = useCallback(async () => {
    if (!frontUpload?.uri) return;
    const canOpen = await Linking.canOpenURL(frontUpload.uri);
    if (!canOpen) {
      showMessage({
        message: 'Could not open uploaded document preview.',
        type: 'danger',
        duration: 4000,
      });
      return;
    }
    await Linking.openURL(frontUpload.uri);
  }, [frontUpload]);

  const renderUploadPreview = () => {
    if (!frontUpload) return null;

    return (
      <View style={styles.previewWrap}>
        {canPreviewAsImage(frontUpload) ? (
          <Image source={{ uri: frontUpload.uri }} style={styles.previewImage} />
        ) : (
          <TouchableOpacity
            onPress={handleOpenUploadedDocument}
            style={[styles.previewFileCard, { backgroundColor: theme.background }]}
          >
            <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
              Tap to preview uploaded document
            </Text>
          </TouchableOpacity>
        )}
        <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
          Selected: {frontUpload.name ?? 'file'}
        </Text>
        <TouchableOpacity onPress={() => setFrontUpload(null)} style={styles.removeUploadButton}>
          <Text style={styles.removeUploadText}>Remove document</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const uploadIdentificationDocument = useCallback(
    async (uri: string, filename: string, mimeType: string, size?: number) => {
      console.log('[ID Upload] Step 1: Initiating upload', {
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
      console.log('[ID Upload] Step 1 complete: initiateUpload response', {
        hasPresignedUrl: Boolean(presignedUrl),
        key,
        expiresAt: initResult.data?.initiateUpload?.expiresAt,
      });
      if (!presignedUrl || !key) {
        throw new Error('Unable to initiate file upload');
      }

      console.log('[ID Upload] Reading local file for PUT', { uri });
      const fileRes = await fetch(uri);
      if (!fileRes.ok) {
        throw new Error('Unable to read selected file');
      }
      const body = await fileRes.blob();
      const fileType = mimeType || body.type || 'application/octet-stream';
      console.log('[ID Upload] Step 2: Uploading file to presigned URL', {
        key,
        fileType,
        byteSize: body.size,
      });

      const putRes = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': fileType,
        },
        body,
      });

      if (!putRes.ok) {
        throw new Error(`Upload failed with status ${putRes.status}`);
      }
      console.log('[ID Upload] Step 2 complete: PUT upload successful', {
        status: putRes.status,
        key,
      });

      console.log('[ID Upload] Step 3: Confirming upload', { key });
      const confirmResult = await client.mutate({
        mutation: Types.ConfirmUploadDocument,
        variables: { key },
      });

      const confirmed = confirmResult.data?.confirmUpload;
      console.log('[ID Upload] Step 3 complete: confirmUpload response', confirmed);
      if (!confirmed) {
        throw new Error('Unable to confirm uploaded file');
      }

      console.log('[ID Upload] Step 4: Refetching user to verify file URL is live');
      await client.refetchQueries({ include: [Types.GetUserDocument] });
      console.log('[ID Upload] Step 4 complete: getUser refetched');

      console.log('[ID Upload] Flow complete', { key: confirmed.key });
      return { key: confirmed.key };
    },
    [client]
  );

  const handlePickFront = useCallback(async () => {
    if (uploadingFront) return;
    try {
      console.log('[ID Upload] Opening document picker');
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('[ID Upload] Document picker canceled');
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        console.log('[ID Upload] No picked document asset found');
        return;
      }

      const mimeType = asset.mimeType ?? 'application/octet-stream';
      const filename = asset.name ?? `document-${Date.now()}`;
      console.log('[ID Upload] Picked document', {
        uri: asset.uri,
        filename,
        mimeType,
        size: asset.size ?? null,
      });

      setUploadingFront(true);
      const uploaded = await uploadIdentificationDocument(
        asset.uri,
        filename,
        mimeType,
        asset.size ?? undefined
      );

      setFrontUpload({
        uri: asset.uri,
        name: filename,
        key: uploaded.key,
        mimeType,
      });
      console.log('[ID Upload] Stored uploaded document state', {
        filename,
        key: uploaded.key,
      });
      showMessage({
        message: 'Document uploaded successfully',
        type: 'success',
        duration: 3000,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Document upload failed';
      console.log('[ID Upload] Upload flow failed', {
        message,
        error,
      });
      showMessage({
        message,
        type: 'danger',
        duration: 5000,
      });
    } finally {
      setUploadingFront(false);
      console.log('[ID Upload] Uploading state reset');
    }
  }, [uploadIdentificationDocument, uploadingFront]);

  return (
    <>
      {step === 1 && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
      </TouchableWithoutFeedback>
      )}

      {step === 2 && selectedMethod != null && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.root, { backgroundColor: theme.background }]}>
          <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
            <ScreenHeader
              theme={theme}
              title={selectedMethod === "national_id" ? "National ID" : selectedMethod === "international_passport" ? "International Passport" : "Driver's License"}
              onBackPress={() => setStep(1)}
            />
            {selectedMethod === 'national_id' && (
              <>
              {/* <Input
               
               theme={theme}
               label="Name"
               placeholder="Full name"
               value={name}
               onChangeText={setName}
               autoCapitalize="words"
               autoCorrect={false}
             /> */}
             <Input
               theme={theme}
               label="NIN Number"
               placeholder="NIN Number"
               value={ninNumber?.toString() ?? ""}
               onChangeText={(text) => setNinNumber(Number(text))}
               keyboardType="numeric"
             />
               {/* <Input
               theme={theme}
               label="Address"
               placeholder="Enter Address"
               value={address}
               onChangeText={setAddress}
               autoCapitalize="words"
               autoCorrect={false}
             /> */}
             <View style={{ padding: 16, borderWidth: 1,  borderRadius: 8, backgroundColor: theme.card, borderColor: "transparent", flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%', minHeight: 144 }}>
              <View style={{display: "flex", flexDirection: "column", gap:4, alignItems: "flex-start"}}>
              <Text style={{color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A", fontSize: 16, fontWeight: "500"}}>Upload front of your NIN slip</Text>
              <Text style={{color: "#94A3B8", fontSize: 14, fontWeight: "400"}}>JPEG, PNG, PDF (min 4MB - max 8MB)</Text>
              </View>
              <TouchableOpacity
                onPress={handlePickFront}
                disabled={uploadingFront}
                style={{width: 329, height:48, borderRadius: 30, borderWidth: 1, borderColor: "#4CCBC6", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#20BEB8", fontSize: 16, fontWeight: "500"}}>
                  {uploadingFront ? 'Uploading...' : 'Upload Front'}
                </Text>
              </TouchableOpacity>
              {renderUploadPreview()}
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
                disabled={uploadingFront}
                style={{width: 329, height:48, borderRadius: 30, borderWidth: 1, borderColor: "#4CCBC6", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#20BEB8", fontSize: 16, fontWeight: "500"}}>
                  {uploadingFront ? 'Uploading...' : 'Upload Front'}
                </Text>
              </TouchableOpacity>
              {renderUploadPreview()}
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
                disabled={uploadingFront}
                style={{width: 329, height:48, borderRadius: 30, borderWidth: 1, borderColor: "#4CCBC6", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#20BEB8", fontSize: 16, fontWeight: "500"}}>
                  {uploadingFront ? 'Uploading...' : 'Upload Front'}
                </Text>
              </TouchableOpacity>
              {renderUploadPreview()}
             </View>
             </>
             )}
          </SafeAreaView>

          <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
            <View style={styles.footer}>
              <Button
                theme={theme}
                label="Continue"
                disabled={!frontUpload?.key || uploadingFront}
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
        </TouchableWithoutFeedback>
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
  step2Block: {
    marginTop: 8,
  },
  step2Hint: {
    fontSize: 15,
    lineHeight: 22,
  },
});
