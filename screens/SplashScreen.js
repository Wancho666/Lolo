import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing, Image, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from "expo-linear-gradient";
import LottieViewNative from "lottie-react-native";
import LottieViewWeb from "lottie-react";
const LottieView = Platform.OS === "web" ? LottieViewWeb : LottieViewNative;
import splashAnimation from "../assets/lotties/grandparents.json";
const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoFallValue = useRef(new Animated.Value(-200)).current;
  const logoRotateValue = useRef(new Animated.Value(0)).current;
  const logoScaleValue = useRef(new Animated.Value(0.3)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const textFadeValue = useRef(new Animated.Value(0)).current;
  const textSlideValue = useRef(new Animated.Value(50)).current;
  
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;
  

  const pulseValue = useRef(new Animated.Value(0)).current;
  

  const floatValue1 = useRef(new Animated.Value(0)).current;
  const floatValue2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Background pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Floating elements
    Animated.loop(
      Animated.timing(floatValue1, {
        toValue: 1,
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(floatValue2, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    // Particles animations
    Animated.loop(
      Animated.timing(particle1, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(particle2, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(particle3, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Logo falling animation with bounce
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoFallValue, {
          toValue: 0,
          duration: 800,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(logoScaleValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Small settle animation
      Animated.spring(logoScaleValue, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Loader spin animation
    setTimeout(() => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }, 800);

    // Text fade in animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textFadeValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textSlideValue, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 1200);

    // Navigate after delay
    const timer = setTimeout(() => {
      navigation.replace('GetStarted');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  // Animation interpolations
  const logoRotate = logoRotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const particle1Y = particle1.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  const particle2Y = particle2.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  const particle3Y = particle3.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  const float1Y = floatValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const float2Y = floatValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  const pulseOpacity = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.03, 0.08],
  });

  return (
    <View style={styles.container}>
      {/* Beautiful Gradient Background - matching HomeScreen */}
      <LinearGradient
        colors={[
          '#E0F2FE', // Very light sky blue
          '#BAE6FD', // Light sky blue
          '#7DD3FC', // Sky blue
          '#38BDF8', // Bright sky blue
          '#0EA5E9', // Blue
          '#0284C7', // Darker blue
        ]}
        locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Animated background overlay */}
      <Animated.View style={[styles.backgroundOverlay, { opacity: pulseOpacity }]} />
      
      {/* Background decorative elements */}
      <View style={styles.backgroundElements}>
        {/* Floating geometric shapes */}
        <Animated.View style={[styles.floatingElement1, { transform: [{ translateY: float1Y }] }]}>
          <Icon name="heart" size={24} color="rgba(255, 255, 255, 0.15)" />
        </Animated.View>
        
        <Animated.View style={[styles.floatingElement2, { transform: [{ translateY: float2Y }] }]}>
          <Icon name="home" size={28} color="rgba(255, 255, 255, 0.15)" />
        </Animated.View>
        
        <Animated.View style={[styles.floatingElement3, { transform: [{ translateY: float1Y }] }]}>
          <Icon name="star" size={20} color="rgba(255, 255, 255, 0.15)" />
        </Animated.View>
        
        {/* Animated particles */}
        <Animated.View style={[styles.particle, styles.particle1, { transform: [{ translateY: particle1Y }] }]} />
        <Animated.View style={[styles.particle, styles.particle2, { transform: [{ translateY: particle2Y }] }]} />
        <Animated.View style={[styles.particle, styles.particle3, { transform: [{ translateY: particle3Y }] }]} />
      </View>
      
      {/* Main content container */}
      <View style={styles.contentContainer}>
        {/* Animated Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { translateY: logoFallValue },
                { rotate: logoRotate },
                { scale: logoScaleValue },
              ],
            },
          ]}
        >
          <View style={styles.logoShadow} />
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Loading indicator */}
        <Animated.View style={[styles.loaderContainer, { transform: [{ rotate: spin }] }]}>
          <View style={styles.loaderGlow} />
          <Icon name="glasses" size={50} color="#0F172A" />
        </Animated.View>

        {/* Welcome text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textFadeValue,
              transform: [{ translateY: textSlideValue }],
            },
          ]}
        >
          <Text style={styles.welcome}>
            Welcome po, <Text style={styles.lolo}>Lolo</Text> & <Text style={styles.lola}>Lola</Text>
          </Text>
          
        </Animated.View>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backgroundElements: {
    position: 'absolute',
    width: width,
    height: height,
  },
  floatingElement1: {
    position: 'absolute',
    top: '15%',
    right: '10%',
  },
  floatingElement2: {
    position: 'absolute',
    top: '25%',
    left: '15%',
  },
  floatingElement3: {
    position: 'absolute',
    bottom: '20%',
    right: '20%',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  particle1: {
    left: '20%',
  },
  particle2: {
    left: '70%',
  },
  particle3: {
    left: '45%',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoShadow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  loaderContainer: {
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  lolo: {
    color: '#0EA5E9', // Sky blue to match gradient
    fontWeight: 'bold',
  },
  lola: {
    color: '#EC4899', // Pink accent
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#334155',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});