import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing,
  Modal,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native";
import Sidebar from "./sidebar";

const Icon = FontAwesome5;


let LottieWrapper;
if (Platform.OS === "web") {
  const { default: Lottie } = require("lottie-react");
  LottieWrapper = ({ source, style, autoPlay = true, loop = true }) => (
    <Lottie animationData={source} style={style} autoplay={autoPlay} loop={loop} />
  );
} else {
  const Lottie = require("lottie-react-native").default;
  LottieWrapper = ({ source, style, autoPlay = true, loop = true }) => (
    <Lottie source={source} style={style} autoPlay={autoPlay} loop={loop} />
  );
}

const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [nickname, setNickname] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Animations
  const logoScaleValue = useRef(new Animated.Value(0.8)).current;
  const logoFadeValue = useRef(new Animated.Value(0)).current;
  const headerFadeValue = useRef(new Animated.Value(0)).current;
  const headerSlideValue = useRef(new Animated.Value(-30)).current;
  const cardsAnimations = useRef([]).current;

  const pulseValue = useRef(new Animated.Value(0)).current;
  const floatValue1 = useRef(new Animated.Value(0)).current;
  const floatValue2 = useRef(new Animated.Value(0)).current;
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("nickname");
        if (storedName) setNickname(storedName);
      } catch (error) {
        console.log("Error loading nickname:", error);
      }
    };
    loadName();

    initializeAnimations();
    startBackgroundAnimations();
    startContentAnimations();
  }, []);

  const features = [
    {
      id: 1,
      title: "Smartphone Basics",
      description: "Learn how to call, text, and use phone settings.",
      animation: require("../assets/lotties/phone.json"),
      icon: "mobile-alt",
      gradientColors: ['rgba(59, 130, 246, 0.15)', 'rgba(147, 51, 234, 0.15)'],
    },
    {
      id: 2,
      title: "Internet Browsing",
      description: "Search safely and explore the web.",
      animation: require("../assets/lotties/internet.json"),
      icon: "globe",
      gradientColors: ['rgba(16, 185, 129, 0.15)', 'rgba(59, 130, 246, 0.15)'],
    },
    {
      id: 3,
      title: "E-Government Services",
      description: "Government services made simple for you.",
      animation: require("../assets/lotties/government.json"),
      icon: "users",
      gradientColors: ['rgba(236, 72, 153, 0.15)', 'rgba(251, 146, 60, 0.15)'],
    },
    
    
  ];

  const initializeAnimations = () => {
    features.forEach((_, index) => {
      cardsAnimations[index] = {
        fadeValue: new Animated.Value(0),
        slideValue: new Animated.Value(50),
        scaleValue: new Animated.Value(0.9),
      };
    });
  };

  const startBackgroundAnimations = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(floatValue1, {
        toValue: 1,
        duration: 7000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(floatValue2, {
        toValue: 1,
        duration: 5000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    [particle1, particle2].forEach((particle, index) => {
      Animated.loop(
        Animated.timing(particle, {
          toValue: 1,
          duration: 12000 + index * 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    });
  };

  const startContentAnimations = () => {
    Animated.parallel([
      Animated.timing(logoScaleValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(logoFadeValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(headerFadeValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(headerSlideValue, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    features.forEach((_, index) => {
      setTimeout(() => {
        const cardAnim = cardsAnimations[index];
        if (cardAnim) {
          Animated.parallel([
            Animated.timing(cardAnim.fadeValue, {
              toValue: 1,
              duration: 500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(cardAnim.slideValue, {
              toValue: 0,
              duration: 500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.spring(cardAnim.scaleValue, {
              toValue: 1,
              friction: 8,
              tension: 100,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }, 600 + index * 100);
    });
  };

  const handleCardPress = (feature, index) => {
    const cardAnim = cardsAnimations[index];
    if (cardAnim) {
      Animated.sequence([
        Animated.timing(cardAnim.scaleValue, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnim.scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    switch (feature.id) {
      case 1:
        navigation.navigate("SmartphoneBasics");
        break;
      case 2:
        navigation.navigate("InternetBrowsing");
        break;
      case 3:
        navigation.navigate("E-Gov");
        break;
    }
  };

  const pulseOpacity = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.03, 0.08],
  });

  const float1Y = floatValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const float2Y = floatValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  const particle1Y = particle1.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -50],
  });

  const particle2Y = particle2.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -50],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E0F2FE" }}>
      <View style={styles.container}>
        {/* Beautiful Gradient Background */}
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

        {/* Subtle animated overlay */}
        <Animated.View style={[styles.backgroundOverlay, { opacity: pulseOpacity }]} />

        {/* Floating background elements */}
        <View style={styles.backgroundElements}>
          <Animated.View style={[styles.floatingElement1, { transform: [{ translateY: float1Y }] }]}>
            <Icon name="heart" size={24} color="rgba(255, 255, 255, 0.15)" />
          </Animated.View>
          <Animated.View style={[styles.floatingElement2, { transform: [{ translateY: float2Y }] }]}>
            <Icon name="home" size={28} color="rgba(255, 255, 255, 0.15)" />
          </Animated.View>
          <Animated.View style={[styles.particle, styles.particle1, { transform: [{ translateY: particle1Y }] }]} />
          <Animated.View style={[styles.particle, styles.particle2, { transform: [{ translateY: particle2Y }] }]} />
        </View>

        {/* Sidebar trigger and logo */}
        <View style={styles.topActionRow}>
          <View style={styles.leftTopArea}>
            <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.profileIconButton}>
              <LinearGradient
                colors={['#74bfe2', '#6abfe9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileIconGradient}
              >
                <Icon name="bars" size={22} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            <Image source={require("../assets/images/nlogo.png")} style={styles.headerLogo} resizeMode="contain" />
          </View>

          <View style={styles.pageHeaderBadge}>
            <Icon name="home" size={18} color="#38BDF8" />
            <Text style={styles.pageHeaderBadgeText}>Beginner Mode</Text>
          </View>
        </View>

        <Sidebar
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          navigation={navigation}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Card */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0.3)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroOverlay}
            />
            <LinearGradient
              colors={["rgba(14, 165, 233, 0.18)", "rgba(59, 130, 246, 0.16)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Icon name="star" size={14} color="#0284C7" />
                <Text style={styles.heroBadgeText}>Welcome</Text>
              </View>
              <Text style={styles.heroTitle}>Start Learning Today</Text>
              <Text style={styles.heroText}>Explore essential digital skills designed just for you. Begin your journey at your own pace.</Text>
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => {
              const cardAnim = cardsAnimations[index];
              return (
                <Animated.View
                  key={feature.id}
                  style={[
                    styles.cardWrapper,
                    cardAnim && {
                      opacity: cardAnim.fadeValue,
                      transform: [
                        { translateY: cardAnim.slideValue },
                        { scale: cardAnim.scaleValue }
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => handleCardPress(feature, index)}
                    activeOpacity={0.95}
                  >
                    {/* Card Gradient Background */}
                    <LinearGradient
                      colors={feature.gradientColors}
                      style={styles.cardGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                    {/* Glass Effect Overlay */}
                    <View style={styles.cardGlass} />

                    {/* New Badge */}
                    {feature.isNew && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                      </View>
                    )}

                    <View style={styles.cardContent}>
                      {/* Lottie Animation */}
                      <View style={styles.lottieContainer}>
                        <LottieWrapper
                          source={feature.animation}
                          autoPlay
                          loop
                          style={styles.lottie}
                        />
                      </View>

                      {/* Text Content */}
                      <View style={styles.textContent}>
                        <Text style={styles.cardTitle}>{feature.title}</Text>
                        <Text style={styles.cardDescription}>{feature.description}</Text>
                      </View>

                      {/* Arrow Icon */}
                      <View style={styles.arrowContainer}>
                        <Icon
                          name="chevron-right"
                          size={20}
                          color="rgba(15, 23, 42, 0.7)"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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
    top: '70%',
    left: '8%',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(92, 141, 182, 0.6)',
  },
  particle1: {
    left: '20%',
  },
  particle2: {
    left: '80%',
  },
  pageHeaderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pageHeaderBadgeText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 13,
  },
  headerLogo: {
    width: 70,
    height: 32,
  },
  scrollView: {
    flex: 1,
    marginTop: 70,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 50,
  },
  heroCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    backgroundColor: "#ffffff",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
    position: "relative",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    padding: 24,
    zIndex: 2,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 6,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0369A1",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitleText: {
    fontSize: 18,
    color: '#334155',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  featuresContainer: {
    gap: 18,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    elevation: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  cardGlass: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    // For web, you can use backdropFilter, but it's ignored on native
    // backdropFilter: 'blur(10px)',
  },
  newBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#f83f3fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 5,
  },
  lottieContainer: {
    width: 80,
    height: 80,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 80,
    height: 80,
  },
  textContent: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  cardDescription: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
    fontWeight: '400',
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconContainer: {
    position: 'absolute',
    top: 38,
    left: 24,
    zIndex: 999,
  },
  topActionRow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 34 : 22,
    left: 18,
    right: 18,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftTopArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileIconButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  profileIconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    width: 280,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  modalName: {
    fontSize: 18,
    color: '#475569',
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeModalButton: {
    padding: 8,
  },
  closeModalText: {
    color: '#38BDF8',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
