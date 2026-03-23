import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

export type UploadFile = {
  id: string;
  name: string;
  /** bytes */
  size: number;
  /** 0–1 */
  progress: number;
  status: 'uploading' | 'done' | 'error';
};

type Props = {
  file: UploadFile;
  onRemove?: (id: string) => void;
};

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${bytes}B`;
}

function estimatedTimeLeft(progress: number, totalBytes: number) {
  if (progress <= 0) return '—';
  const remainingBytes = totalBytes * (1 - progress);
  // Simulate ~100 KB/s upload speed
  const seconds = remainingBytes / (100 * 1024);
  if (seconds >= 60) return `${Math.ceil(seconds / 60)} min left`;
  return `${Math.ceil(seconds)}s left`;
}

export function FileUploadCard({ file, onRemove }: Props) {
  const theme = useTheme();
  const animatedWidth = useRef(new Animated.Value(file.progress)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: file.progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [file.progress, animatedWidth]);

  const uploadedBytes = file.size * file.progress;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.divider },
      ]}>
      {/* file icon */}
      <View style={[styles.iconWrap, { backgroundColor: theme.surfaceMuted }]}>
        <Ionicons name='document-text-outline' size={24} color={theme.textSecondary} />
      </View>

      {/* middle content */}
      <View style={styles.content}>
        <Text
          style={[styles.filename, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}
          numberOfLines={1}>
          {file.name}
        </Text>

        {file.status === 'uploading' ? (
          <>
            {/* progress bar track */}
            <View style={[styles.track, { backgroundColor: theme.surfaceMuted }]}>
              <Animated.View
                style={[
                  styles.fill,
                  {
                    width: animatedWidth.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: '#3B82F6',
                  },
                ]}
              />
            </View>
            <View style={styles.progressRow}>
              <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                Uploading {formatBytes(uploadedBytes)} of {formatBytes(file.size)}
              </Text>
              <Text style={[styles.timeText, { color: theme.textSecondary }]}>
                {estimatedTimeLeft(file.progress, file.size)}
              </Text>
            </View>
          </>
        ) : file.status === 'done' ? (
          <Text style={[styles.sizeText, { color: theme.textSecondary }]}>
            {formatBytes(file.size)}
          </Text>
        ) : (
          <Text style={[styles.errorText]}>Upload failed</Text>
        )}
      </View>

      {/* right badge */}
      {file.status === 'done' ? (
        <View style={styles.doneRight}>
          <Text style={[styles.uploadedLabel, { color: theme.textSecondary }]}>Uploaded</Text>
          <View style={[styles.checkCircle, { borderColor: '#22C55E' }]}>
            <Ionicons name='checkmark' size={14} color='#22C55E' />
          </View>
        </View>
      ) : (
        onRemove && (
          <Pressable
            onPress={() => onRemove(file.id)}
            hitSlop={8}
            accessibilityRole='button'
            accessibilityLabel='Remove file'>
            <Ionicons name='close-circle-outline' size={22} color={theme.textSecondary} />
          </Pressable>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginTop: 12,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  filename: {
    fontSize: 14,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 11,
  },
  timeText: {
    fontSize: 11,
  },
  sizeText: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
  doneRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  uploadedLabel: {
    fontSize: 13,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
