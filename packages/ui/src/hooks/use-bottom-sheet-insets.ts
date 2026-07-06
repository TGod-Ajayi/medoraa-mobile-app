import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ANDROID_MIN_CONTENT_PADDING = 32;
const IOS_MIN_CONTENT_PADDING = 16;
const ANDROID_MIN_BOTTOM_INSET = 24;
const IOS_MIN_BOTTOM_INSET = 12;

/**
 * Safe-area padding for @gorhom/bottom-sheet content on Android nav bars.
 */
export function useBottomSheetInsets() {
  const insets = useSafeAreaInsets();
  const minContentPadding =
    Platform.OS === 'android' ? ANDROID_MIN_CONTENT_PADDING : IOS_MIN_CONTENT_PADDING;
  const minBottomInset =
    Platform.OS === 'android' ? ANDROID_MIN_BOTTOM_INSET : IOS_MIN_BOTTOM_INSET;

  const contentPaddingBottom = Math.max(insets.bottom, minContentPadding);
  const bottomInset = Math.max(insets.bottom, minBottomInset);

  return { contentPaddingBottom, bottomInset };
}
