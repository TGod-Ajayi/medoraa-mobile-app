import { useViewUrl } from '@repo/ui/graphql';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type Props = {
  coverKey?: string | null;
  fallbackSource: ImageSourcePropType;
  containerStyle?: StyleProp<ViewStyle>;
  coverImageStyle?: StyleProp<ImageStyle>;
  fallbackImageStyle?: StyleProp<ImageStyle>;
  loaderColor?: string;
};

export function WellnessProgramCoverImage({
  coverKey,
  fallbackSource,
  containerStyle,
  coverImageStyle,
  fallbackImageStyle,
  loaderColor = '#64748B',
}: Props) {
  const { url, loading } = useViewUrl(coverKey);

  if (url) {
    return (
      <View style={[styles.container, containerStyle]}>
        <Image
          source={{ uri: url }}
          style={[styles.cover, coverImageStyle]}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {loading ? (
        <ActivityIndicator size="small" color={loaderColor} />
      ) : (
        <Image
          source={fallbackSource}
          style={fallbackImageStyle}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
});
