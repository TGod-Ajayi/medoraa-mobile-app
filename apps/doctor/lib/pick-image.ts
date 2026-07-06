import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
  type ImagePickerOptions,
} from 'expo-image-picker';

export type PickedImage = {
  uri: string;
  mimeType: string;
  filename: string;
};

function filenameFromUri(uri: string, mimeType: string): string {
  const segment = uri.split('/').pop()?.split('?')[0];
  if (segment && /\.[a-z0-9]+$/i.test(segment)) return segment.slice(0, 120);
  if (mimeType.includes('png')) return 'image.png';
  return 'image.jpg';
}

/**
 * Opens the device photo library and returns the first selected image, or null if cancelled.
 */
export async function pickImageFromLibrary(
  options: ImagePickerOptions,
): Promise<PickedImage | null> {
  const permission = await requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Photo library permission is required');
  }

  const result = await launchImageLibraryAsync(options);
  if (result.canceled || !result.assets.length) return null;

  const asset = result.assets[0];
  const mimeType = asset.mimeType ?? 'image/jpeg';

  return {
    uri: asset.uri,
    mimeType,
    filename: filenameFromUri(asset.uri, mimeType),
  };
}
