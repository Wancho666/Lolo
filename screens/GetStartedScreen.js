// --- inside GetStartedScreen.js ---
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  FlatList,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";

// 👇 Conditional Lottie import
import LottieViewNative from "lottie-react-native";
import LottieViewWeb from "lottie-react";
const LottieView = Platform.OS === "web" ? LottieViewWeb : LottieViewNative;

const { width, height } = Dimensions.get("window");

export default function GetStartedScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Animations you already had
  const lottieScaleValue = useRef(new Animated.Value(0.3)).current;
  const lottieFadeValue = useRef(new Animated.Value(0)).current;
  const titleSlideValue = useRef(new Animated.Value(50)).current;
  const titleFadeValue = useRef(new Animated.Value(0)).current;
  const subtitleSlideValue = useRef(new Animated.Value(50)).current;
  const subtitleFadeValue = useRef(new Animated.Value(0)).current;
  const buttonSlideValue = useRef(new Animated.Value(50)).current;
  const buttonFadeValue = useRef(new Animated.Value(0)).current;
  const buttonScaleValue = useRef(new Animated.Value(0.8)).current;

  // Background animations
  const pulseValue = useRef(new Animated.Value(0)).current;
  const floatValue1 = useRef(new Animated.Value(0)).current;
  const floatValue2 = useRef(new Animated.Value(0)).current;
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  // Slides data
  const slides = [
    {
      key: "1",
      title: "Smartphone Basics",
      description: "Learn calling, texting, and navigating your phone step by step.",
      animation: require("../assets/lotties/phone.json"),
    },
    {
      key: "2",
      title: "Safe Internet Browsing",
      description: "Discover tips to stay safe online and protect your privacy.",
      animation: require("../assets/lotties/internet.json"),
    },
    {
      key: "3",
      title: "Mini Games",
      description: "Exercise your brain and have fun with simple games.",
      animation: require("../assets/lotties/games.json"),
    },
    {
      key: "4",
      title: "Live News",
      description: "Stay updated with the latest headlines anytime, anywhere.",
      animation: require("../assets/lotties/news.json"),
    },
  ];

  useEffect(() => {
  const checkReturningUser = async () => {
    try {
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      const nickname = await AsyncStorage.getItem("nickname");
      if (hasOnboarded && nickname) {
        navigation.replace("Home");
      }
    } catch (error) {
      console.log("Error checking onboarding:", error);
    }
  };
  checkReturningUser();

  startBackgroundAnimations();
  startContentAnimations();
}, []);

  const startBackgroundAnimations = () => {
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

    [particle1, particle2, particle3].forEach((particle, index) => {
      Animated.loop(
        Animated.timing(particle, {
          toValue: 1,
          duration: 8000 + index * 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    });
  };

  const startContentAnimations = () => {
    Animated.parallel([
      Animated.timing(lottieScaleValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(lottieFadeValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleFadeValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(titleSlideValue, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(subtitleFadeValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(subtitleSlideValue, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 700);

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(buttonFadeValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(buttonSlideValue, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(buttonScaleValue, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = async () => {
    Animated.sequence([
      Animated.timing(buttonScaleValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScaleValue, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    try {
      await AsyncStorage.setItem("hasOnboarded", "true");
      navigation.replace("NameInput");
    } catch (error) {
      console.log("Error saving onboarding flag:", error);
    }
  };

  // Background animation values
  const pulseOpacity = pulseValue.interpolate({ inputRange: [0, 1], outputRange: [0.03, 0.08] });
  const float1Y = floatValue1.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const float2Y = floatValue2.interpolate({ inputRange: [0, 1], outputRange: [0, 15] });
  const particle1Y = particle1.interpolate({ inputRange: [0, 1], outputRange: [height, -100] });
  const particle2Y = particle2.interpolate({ inputRange: [0, 1], outputRange: [height, -100] });
  const particle3Y = particle3.interpolate({ inputRange: [0, 1], outputRange: [height, -100] });

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        <Animated.View
          style={[
            styles.lottieContainer,
            {
              opacity: lottieFadeValue,
              transform: [{ scale: lottieScaleValue }],
            },
          ]}
        >
          <LottieView source={item.animation} autoPlay loop style={styles.lottie} />
        </Animated.View>
        
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: titleFadeValue,
              transform: [{ translateY: titleSlideValue }],
            },
          ]}
        >
          <Text style={styles.title}>{item.title}</Text>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              opacity: subtitleFadeValue,
              transform: [{ translateY: subtitleSlideValue }],
            },
          ]}
        >
          <Text style={styles.subtitle}>{item.description}</Text>
        </Animated.View>
      </View>
    </View>
  );

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

      {/* Background overlay */}
      <Animated.View style={[styles.backgroundOverlay, { opacity: pulseOpacity }]} />

      {/* Decorative elements */}
      <View style={styles.backgroundElements}>
        <Animated.View style={[styles.floatingElement1, { transform: [{ translateY: float1Y }] }]}>
          <Icon name="heart" size={25} color="rgba(255, 255, 255, 0.15)" />
        </Animated.View>
        <Animated.View style={[styles.floatingElement2, { transform: [{ translateY: float2Y }] }]}>
          <Icon name="home" size={30} color="rgba(255, 255, 255, 0.15)" />
        </Animated.View>
        <Animated.View style={[styles.floatingElement3, { transform: [{ translateY: float1Y }] }]}>
          <Icon name="users" size={20} color="rgba(255, 255, 255, 0.15)" />
        </Animated.View>

        {/* Particles */}
        <Animated.View style={[styles.particle, styles.particle1, { transform: [{ translateY: particle1Y }] }]} />
        <Animated.View style={[styles.particle, styles.particle2, { transform: [{ translateY: particle2Y }] }]} />
        <Animated.View style={[styles.particle, styles.particle3, { transform: [{ translateY: particle3Y }] }]} />
      </View>

      {/* Main content */}
      <View style={styles.contentContainer}>
        <View style={styles.slidesContainer}>
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderSlide}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
            style={styles.flatList}
          />
        </View>

        {/* Bottom section with indicators and button */}
        <View style={styles.bottomSection}>
          {/* Dots indicator */}
          <View style={styles.indicatorContainer}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.indicator,
                  { opacity: i === currentIndex ? 1 : 0.3 },
                ]}
              />
            ))}
          </View>

          {/* Button */}
          <Animated.View 
            style={[
              styles.buttonContainer, 
              { 
                opacity: buttonFadeValue, 
                transform: [
                  { translateY: buttonSlideValue }, 
                  { scale: buttonScaleValue }
                ] 
              }
            ]}
          >
            <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.buttonText}>
                {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
              </Text>
              <Icon name="arrow-right" size={18} color="#FFFFFF" style={styles.buttonIcon} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    bottom: '25%',
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
    flex: 1,
    zIndex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  slidesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  flatList: {
    flexGrow: 0,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: width - 60,
  },
  lottieContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  textContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0F172A",
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#334155",
    fontWeight: '400',
    letterSpacing: 0.3,
    lineHeight: 24,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: "row",
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0F172A",
    marginHorizontal: 5,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});