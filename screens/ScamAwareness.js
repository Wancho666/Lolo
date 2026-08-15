import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Video, ResizeMode } from "expo-av";

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

const { width } = Dimensions.get("window");

const FEATURES = [
  {
    id: 1,
    title: "Scam Awareness",
    subtitle: "Learn about common scams and how to protect yourself.",
    animation: require("../assets/lotties/Alert.json"),
    icon: "alert-circle",
    gradientColors: ["rgba(236, 72, 153, 0.18)", "rgba(251, 146, 60, 0.18)"],
  },
];

const SCAM_OPTIONS = [
  {
    id: 1,
    title: "Common Online Scams",
    description: "Learn about the most common scams targeting seniors online.",
    animation: require("../assets/lotties/Alert.json"),
    gradientColors: ["rgba(236, 72, 153, 0.15)", "rgba(251, 146, 60, 0.15)"],
    tutorialTitle: "Common Online Scams",
    videoSource: require("../assets/vids/0327.mp4"),
    placeholders: [
      "Phishing emails and fake websites",
      "Tech support scams and pop-ups",
      "Prize and lottery scams",
      "Romance and catfishing scams",
    ],
  },
  {
    id: 2,
    title: "Money Transfer Fraud",
    description: "Understand how fraudsters trick you into transferring money.",
    animation: require("../assets/lotties/meil.json"),
    gradientColors: ["rgba(59, 130, 246, 0.15)", "rgba(147, 51, 234, 0.15)"],
    tutorialTitle: "Money Transfer Fraud",
    videoSource: require("../assets/vids/0327.mp4"),
    placeholders: [
      "Impersonation of family or friends",
      "Fake bank and payment app alerts",
      "Wire transfer and crypto scams",
      "What to do if you've been scammed",
    ],
  },
  {
    id: 3,
    title: "Personal Information Safety",
    description: "Learn how to protect your personal and financial information.",
    animation: require("../assets/lotties/security.json"),
    gradientColors: ["rgba(16, 185, 129, 0.15)", "rgba(59, 130, 246, 0.15)"],
    tutorialTitle: "Personal Information Safety",
    videoSource: require("../assets/vids/0327.mp4"),
    placeholders: [
      "Never share passwords or PINs",
      "Be careful with social media information",
      "Protect your identity documents",
      "Report suspicious activity immediately",
    ],
  },
];

export default function ScamAwareness({ navigation }) {
  const [nickname, setNickname] = useState("");
  const [currentPage, setCurrentPage] = useState("scam");
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const loadNickname = async () => {
      try {
        const storedName = await AsyncStorage.getItem("nickname");
        if (storedName) setNickname(storedName);
      } catch (error) {
        console.log("Error loading nickname:", error);
      }
    };
    loadNickname();
  }, []);

  const BackBtn = () => (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => {
        if (currentPage === "detail") {
          setCurrentPage("scam");
          setSelectedOption(null);
        } else {
          navigation.navigate("Screen2");
        }
      }}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={["#74bfe2", "#6abfe9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backButtonGradient}
      >
        <Ionicons name="arrow-back" size={18} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );

  const PageHeader = () => {
    const title = currentPage === "scam"
      ? "Scam Awareness & Protection"
      : selectedOption?.title || "Scam Awareness Tutorial";

    const subtitle = currentPage === "scam"
      ? "Tap a topic to learn how to identify and avoid common scams."
      : "Learn the warning signs and protect your information.";

    return (
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderTop}>
          <BackBtn />
          <View style={styles.pageHeaderBadge}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" />
            <Text style={styles.pageHeaderBadgeText}>Security</Text>
          </View>
        </View>
        <Text style={styles.pageHeaderTitle}>{title}</Text>
        <Text style={styles.pageHeaderSub}>{subtitle}</Text>
      </View>
    );
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setCurrentPage("detail");
  };

  const renderScamPage = () => (
    <View>
      <View style={styles.heroSummaryCard}>
        <LinearGradient
          colors={["rgba(220, 38, 38, 0.16)", "rgba(239, 68, 68, 0.12)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSummaryGradient}
        />
        <View style={styles.heroSummaryContent}>
          <Text style={styles.heroSummaryTitle}>Stay Safe Online</Text>
          <Text style={styles.heroSummaryText}>Learn to recognize scams and protect yourself. Choose a topic to explore real-world examples and safety tips.</Text>
        </View>
      </View>
      {SCAM_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.optionCard}
          activeOpacity={0.95}
          onPress={() => handleOptionSelect(option)}
        >
          <LinearGradient
            colors={option.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.optionGradient}
          />
          <View style={styles.optionGlass} />
          <View style={styles.optionRow}>
            <View style={styles.lottieContainer}>
              <LottieWrapper source={option.animation} autoPlay loop style={styles.lottie} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <View style={styles.featureIcon}>
              <Ionicons name="chevron-forward" size={20} color="rgba(15, 23, 42, 0.7)" />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDetailPage = () => (
    <View style={styles.optionDetailCard}>
      <View style={styles.optionDetailHeader}>
        <TouchableOpacity style={styles.optionDetailBack} onPress={() => setCurrentPage("scam")}>
          <Ionicons name="chevron-back" size={16} color="#0F172A" />
          <Text style={styles.optionDetailBackText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.optionDetailTitle}>{selectedOption?.tutorialTitle || selectedOption?.title}</Text>
      </View>
      <Text style={styles.optionDetailDescription}>{selectedOption?.description}</Text>

      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>Tutorial: Learn & Protect</Text>
        <View style={styles.videoFrame}>
          <Video
            source={selectedOption?.videoSource || require("../assets/vids/0327.mp4")}
            style={styles.videoPlayer}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={false}
            useNativeControls
            isLooping={false}
          />
        </View>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>Warning Signs & Protection</Text>
        {selectedOption?.placeholders?.map((item, index) => (
          <View key={`${selectedOption.id}-${index}`} style={styles.detailBullet}>
            <Text style={styles.detailBulletText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>Remember</Text>
        <View style={[styles.detailBullet, { backgroundColor: "rgba(220, 38, 38, 0.1)" }]}>
          <Text style={styles.detailBulletText}>🚨 If something feels wrong, it probably is. Trust your instincts.</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#FEF2F2", "#FEE2E2", "#FECACA", "#FC8181", "#F87171", "#EF4444"]}
          locations={[0, 0.15, 0.35, 0.55, 0.75, 1]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <PageHeader />

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {currentPage === "scam" && renderScamPage()}
          {currentPage === "detail" && renderDetailPage()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FEE2E2",
  },
  container: {
    flex: 1,
    position: "relative",
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  pageHeader: {
    paddingTop: Platform.OS === "ios" ? 24 : 18,
    paddingHorizontal: 24,
    paddingBottom: 18,
  },
  pageHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },
  pageHeaderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(220, 38, 38, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pageHeaderBadgeText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 13,
  },
  pageHeaderTitle: {
    color: "#0F172A",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  pageHeaderSub: {
    color: "#475569",
    fontSize: 16,
    lineHeight: 24,
  },
  heroSummaryCard: {
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    backgroundColor: "#FFFFFF",
  },
  heroSummaryGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroSummaryContent: {
    padding: 18,
  },
  heroSummaryTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  heroSummaryText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  optionCard: {
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    backgroundColor: "#FFFFFF",
    minHeight: 120,
  },
  optionGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  optionGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    position: "relative",
    zIndex: 5,
  },
  lottieContainer: {
    width: 80,
    height: 80,
    marginRight: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 80,
    height: 80,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "rgba(220, 38, 38, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionDetailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },
  optionDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionDetailBack: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },
  optionDetailBackText: {
    marginLeft: 6,
    color: "#0F172A",
    fontWeight: "700",
  },
  optionDetailTitle: {
    flex: 1,
    marginLeft: 16,
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "bold",
  },
  optionDetailDescription: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  videoFrame: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.24)",
    overflow: "hidden",
    minHeight: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayer: {
    width: "100%",
    height: 220,
    backgroundColor: "#0F172A",
  },
  detailSection: {
    marginBottom: 18,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  detailBullet: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  detailBulletText: {
    color: "#0F172A",
    fontSize: 14,
    lineHeight: 20,
  },
});
