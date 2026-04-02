import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';

// Medical Cross Logo Component
const MedicalLogo = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="20" stroke="white" strokeWidth="3" fill="none" />
    <Path
      d="M24 12V36M12 24H36"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Path
      d="M18 18L30 30M30 18L18 30"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
);

const {width, height} = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const handleNext = () => {
    router.push('/signup');
  };

  const handleAccessibility = () => {
    // Open accessibility options
    console.log('Accessibility pressed');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#20BEB8', '#0F172A']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={[styles.safeArea, {paddingTop: height/100 * 15}]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/icon.png')} resizeMode="contain" style={{width: 40, height: 40}} />
        </View>
        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.headline}>
            Bring Healthcare to your{'\n'}patients, wherever they are
          </Text>
          <Text style={styles.subtext}>
            Generate more sales remotely!
          </Text>
        </View>

        {/* Doctor Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/medical1.png')}
            style={styles.doctorImage}
            resizeMode="contain"
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <View style={styles.nextButtonInner}>
            <Ionicons name="arrow-forward" size={28} color="white" />
          </View>
        </TouchableOpacity>

       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 0,
  },
  logoContainer: {
   
  },
  textContainer: {
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
   gap: 12,
  },
  headline: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 36,
  },
  subtext: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    fontWeight: "400",
  },
  imageContainer: {

    width: '100%',
    justifyContent: 'flex-end',
  
  },
  doctorImage: {
    width: '100%',
    height: 600,
  },
  nextButton: {
    position: 'absolute',
    bottom: 47,
    alignSelf: 'center',
    zIndex: 10,
  },
  nextButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1a2332',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  accessibilityButton: {
    position: 'absolute',
    right: 20,
    top: '40%',
    zIndex: 10,
  },
  accessibilityInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  accessibilityText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});