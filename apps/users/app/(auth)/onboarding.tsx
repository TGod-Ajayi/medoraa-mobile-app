import { useTheme } from '../../config/theme';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** #FFFFFF at 15% opacity - overlay over background image */
const OVERLAY_BG = 'rgba(255, 255, 255, 0.15)';

const SLIDES = [
  {
    background: require('../../assets/images/splashone.png'),
    title: 'Book Appointment',
    description:
      'For any health questions, our doctors are ready to help you.',
    extraImage: undefined,
  },
  {
    background: require('../../assets/images/splashtwo.png'),
    title: 'Online Health Check',
    description: 'For any health questions, our doctors are Ready to help you.',
    extraImage: require('../../assets/images/splashthree.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const isLastSlide = slideIndex === SLIDES.length - 1;

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);
    setSlideIndex(index);
  };

  const handleArrowPress = () => {
    if (isLastSlide) {
      router.replace('/(auth)/login');
    } else {
      const next = slideIndex + 1;
      setSlideIndex(next);
      scrollRef.current?.scrollTo({
        x: next * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        bounces={false}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={styles.slidePage}>
            <ImageBackground
              source={slide.background}
              style={styles.background}
              resizeMode="cover"
            >
              <View style={styles.gradientOverlay} />
              {slide.extraImage != null && (
                <View style={styles.extraImageWrap}>
                  <Image
                    source={slide.extraImage}
                    resizeMode="cover"
                  />
          
                </View>
              )}
              <View style={styles.content}>
                <View style={styles.imageContainer}>
                  
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{slide.title}</Text>
                  <Text style={styles.cardDescription}>{slide.description}</Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.arrowButton,
            { backgroundColor: theme.accent },
            pressed && styles.arrowButtonPressed,
          ]}
          onPress={handleArrowPress}
        >
          <Text style={styles.arrowIcon}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slidePage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  background: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: OVERLAY_BG,
  },
  extraImageWrap: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
  },
 

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    paddingBottom: 120,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  slideImage: {
    width: SCREEN_WIDTH * 0.6,
    height: 240,
  },
  card: {
    backgroundColor: OVERLAY_BG,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  arrowButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2DC5B7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  arrowButtonPressed: {
    opacity: 0.9,
  },
  arrowIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

});
