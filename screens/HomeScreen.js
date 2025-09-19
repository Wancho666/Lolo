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
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native";

// ✅ Platform-safe Lottie import
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
  const [profileModalVisible, setProfileModalVisible] = useState(false);

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
      title: "Social Media",
      description: "Connect with family & friends online.",
      animation: require("../assets/lotties/social.json"),
      icon: "users",
      gradientColors: ['rgba(236, 72, 153, 0.15)', 'rgba(251, 146, 60, 0.15)'],
    },
    {
      id: 4,
      title: "Mini Games",
      description: "Exercise your mind with fun memory games.",
      animation: require("../assets/lotties/games.json"),
      icon: "gamepad",
      gradientColors: ['rgba(251, 191, 36, 0.15)', 'rgba(34, 197, 94, 0.15)'],
    },
    {
      id: 5,
      title: "Digital Safety",
      description: "Protect yourself from scams & threats.",
      animation: require("../assets/lotties/sec.json"),
      icon: "shield-alt",
      gradientColors: ['rgba(239, 68, 68, 0.15)', 'rgba(245, 101, 101, 0.15)'],
    },
    {
      id: 6,
      title: "Government E-Services",
      description: "Access PhilHealth, SSS, and more.",
      animation: require("../assets/lotties/government.json"),
      icon: "landmark",
      gradientColors: ['rgba(99, 102, 241, 0.15)', 'rgba(139, 92, 246, 0.15)'],
    },
    {
      id: 7,
      title: "📰 Live News",
      description: "Daily news updates with audio support in English & Filipino.",
      animation: require("../assets/lotties/news.json"),
      icon: "newspaper",
      gradientColors: ['rgba(251, 146, 60, 0.15)', 'rgba(234, 88, 12, 0.15)'],
      isNew: true,
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
        navigation.navigate("SocialMedia");
        break;
      case 4:
        navigation.navigate("MiniGames");
        break;
      case 5:
        navigation.navigate("DigitalSafety");
        break;
      case 6:
        navigation.navigate("GovernmentServices");
        break;
      case 7:
        navigation.navigate("LiveNews");
        break;
      default:
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

        {/* Profile Icon (top right, absolute) */}
        <View style={styles.profileIconContainer}>
          <TouchableOpacity onPress={() => setProfileModalVisible(true)} style={styles.profileIconButton}>
            <Icon name="user-circle" size={36} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Profile Modal */}
        <Modal
          visible={profileModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setProfileModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Profile</Text>
              <Text style={styles.modalName}>{nickname}</Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={async () => {
                  await AsyncStorage.clear();
                  setProfileModalVisible(false);
                  navigation.replace("GetStarted");
                }}
              >
                <Icon name="sign-out-alt" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)} style={styles.closeModalButton}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoFadeValue,
                transform: [{ scale: logoScaleValue }],
              },
            ]}
          >
            <View style={styles.logoShadow} />
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Welcome Section */}
          <Animated.View
            style={[
              styles.welcomeContainer,
              {
                opacity: headerFadeValue,
                transform: [{ translateY: headerSlideValue }],
              },
            ]}
          >
            <Text style={styles.welcomeText}>
              {nickname ? `Kumusta, ${nickname}!` : "Welcome, Lolo't Lola!"}
            </Text>
            <Text style={styles.subtitleText}>
              Choose what you'd like to learn today
            </Text>
          </Animated.View>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  logoShadow: {
    position: 'absolute',
    width: 220,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 200,
    height: 90,
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
    fontSize: 20,
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
    right: 24,
    zIndex: 999,
  },
  profileIconButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 4,
    elevation: 8,
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