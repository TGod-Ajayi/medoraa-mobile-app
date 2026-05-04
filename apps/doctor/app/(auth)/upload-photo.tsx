import { Button } from '@/components';
import { ScreenHeader } from '@/components/screen-header';
import { useTheme } from '@/config/theme';
import { useApolloClient } from '@apollo/client/react';
import { uploadProfilePicture } from '@repo/ui/graphql';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';

function filenameFromUri(uri: string, mimeType: string): string {
  const segment = uri.split('/').pop()?.split('?')[0];
  if (segment && /\.[a-z0-9]+$/i.test(segment)) return segment.slice(0, 120);
  if (mimeType.includes('png')) return 'profile.png';
  return 'profile.jpg';
}

export default function UploadPhotoScreen() {
  const theme = useTheme();
  const router = useRouter();
  const client = useApolloClient();
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePickAndUpload = async () => {
    if (uploading) return;

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showMessage({
        message: 'Photo library access is needed to upload a profile picture.',
        type: 'danger',
        duration: 4000,
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const uri = asset.uri;
    const mimeType = asset.mimeType ?? 'image/jpeg';
    const filename = asset.fileName ?? filenameFromUri(uri, mimeType);

    setPreviewUri(uri);
    setUploading(true);
    try {
      await uploadProfilePicture(client, {
        uri,
        mimeType,
        filename,
      });
      showMessage({
        message: 'Profile photo uploaded',
        type: 'success',
        duration: 3000,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Upload failed';
      showMessage({
        message,
        type: 'danger',
        duration: 5000,
      });
      setPreviewUri(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe}>
        <ScreenHeader theme={theme} title="Upload your picture" />
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          A clear photo helps patients recognize you.
        </Text>

        <View style={styles.avatarWrap}>
          <View
            style={[
              styles.avatarRing,
              {
                borderColor: theme.inputBorder,
                backgroundColor: theme.surfaceMuted,
              },
            ]}>
            {previewUri ? (
              <Image source={{ uri: previewUri }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={56} color={theme.textMuted} />
            )}
          </View>
        </View>

        <Button
          theme={theme}
          label={uploading ? 'Uploading…' : 'Upload picture'}
          variant="secondary"
          disabled={uploading}
          onPress={handlePickAndUpload}
        />
        <View style={styles.spacer} />
        <Button
          theme={theme}
          label="Save and continue"
          onPress={() => router.push('/(auth)/create-password')}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 32,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  spacer: {
    height: 12,
  },
});
