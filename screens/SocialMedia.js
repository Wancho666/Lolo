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
    title: "Social Media",
    subtitle: "Choose from Facebook, YouTube, and Messenger to learn the basics.",
    animation: require("../assets/lotties/social.json"),
    icon: "share-social",
    gradientColors: ["rgba(56, 189, 248, 0.18)", "rgba(59, 130, 246, 0.18)"],
  },
  {
    id: 2,
    title: "Facebook",
    subtitle: "Learn how to create and use Facebook safely.",
    animation: require("../assets/lotties/internet.json"),
    icon: "globe",
    gradientColors: ["rgba(16, 185, 129, 0.18)", "rgba(59, 130, 246, 0.18)"],
  },
  {
    id: 3,
    title: "YouTube",
    subtitle: "Learn the basics of creating and using YouTube.",
    animation: require("../assets/lotties/phone.json"),
    icon: "phone",
    gradientColors: ["rgba(236, 72, 153, 0.18)", "rgba(251, 146, 60, 0.18)"],
  },
  {
    id: 4,
    title: "Messenger",
    subtitle: "Learn how to chat and stay safe in Messenger.",
    animation: require("../assets/lotties/security.json"),
    icon: "chatbubble",
    gradientColors: ["rgba(251, 191, 36, 0.18)", "rgba(249, 115, 22, 0.18)"],
  },
];

const SOCIAL_OPTIONS = [
  {
    id: 1,
    title: "How To Create A Facebook Account",
    description: "Learn how to create an account and use Facebook safely.",
    animation: require("../assets/lotties/fb.json"),
    gradientColors: ["rgba(59, 130, 246, 0.15)", "rgba(147, 51, 234, 0.15)"],
    tutorialTitle: "How to create a Facebook account",
    videoSource: require("../assets/vids/fb.mp4"),
    placeholders: [
      "Create your profile picture and bio",
      "Set your privacy settings",
      "Add friends and follow pages",
      "Learn safe posting habits",
    ],
  },
  {
    id: 2,
    title: "How To Create A Gmail Account",
    description: "Learn how to create a Gmail account and use email basics.",
    animation: require("../assets/lotties/meil.json"),
    gradientColors: ["rgba(16, 185, 129, 0.15)", "rgba(59, 130, 246, 0.15)"],
    tutorialTitle: "How to create a Gmail account",
    videoSource: require("../assets/vids/mail.mp4"),
    placeholders: [
      "Create or customize your channel",
      "Turn on subscriptions and notifications",
      "Learn how to search and save videos",
      "Use comments and playlists safely",
    ],
  },
  {
    id: 3,
    title: "How To Create A Messenger Account",
    description: "Learn how to create an account and use Messenger safely.",
    animation: require("../assets/lotties/mg.json"),
    gradientColors: ["rgba(236, 72, 153, 0.15)", "rgba(251, 146, 60, 0.15)"],
    tutorialTitle: "How to create a Messenger account",
    videoSource: require("../assets/vids/mess.mp4"),
    placeholders: [
      "Start a chat with a contact",
      "Send photos, voice notes, or stickers",
      "Create a group chat",
      "Block or report unwanted messages",
    ],
  },
];

export default function SocialMedia({ navigation }) {
  const [nickname, setNickname] = useState("");
  const [currentPage, setCurrentPage] = useState("social");
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
          setCurrentPage("social");
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
    const title = currentPage === "social"
      ? "Choose a Social Media App"
      : selectedOption?.title || "Social Media Tutorial";

    const subtitle = currentPage === "social"
      ? "Tap Facebook, YouTube, or Messenger to start the tutorial."
      : "Start with account creation and learn the basics.";

    return (
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderTop}>
          <BackBtn />
          <View style={styles.pageHeaderBadge}>
            <Ionicons name="globe" size={18} color="#38BDF8" />
            <Text style={styles.pageHeaderBadgeText}>Social Media</Text>
          </View>
        </View>
        <Text style={styles.pageHeaderTitle}>{title}</Text>
        <Text style={styles.pageHeaderSub}>{subtitle}</Text>
      </View>
    );
  };

  const handleFeaturePress = (feature) => {
    if (feature.id === 1) {
      setCurrentPage("social");
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setCurrentPage("detail");
  };

  const renderMainContent = () => (
    <View>
      <TouchableOpacity
        style={styles.featureCard}
        activeOpacity={0.9}
        onPress={() => setCurrentPage("social")}
      >
        <LinearGradient
          colors={["rgba(56, 189, 248, 0.18)", "rgba(59, 130, 246, 0.18)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featureGradient}
        />
        <View style={styles.featureGlass} />
        <View style={styles.featureRow}>
          <View style={styles.lottieContainer}>
            <LottieWrapper source={require("../assets/lotties/social.json")} autoPlay loop style={styles.lottie} />
          </View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Facebook, YouTube & Messenger</Text>
            <Text style={styles.featureSubtitle}>Tap to open the Facebook, YouTube, and Messenger options.</Text>
          </View>
          <View style={styles.featureIcon}>
            <Ionicons name="chevron-forward" size={20} color="rgba(15, 23, 42, 0.7)" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderSocialPage = () => (
    <View>
      <View style={styles.heroSummaryCard}>
        <LinearGradient
          colors={["rgba(14, 165, 233, 0.16)", "rgba(59, 130, 246, 0.12)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSummaryGradient}
        />
        <View style={styles.heroSummaryContent}>
          <Text style={styles.heroSummaryTitle}>Learn at your own pace</Text>
          <Text style={styles.heroSummaryText}>Choose a platform to explore core steps, safety tips, and everyday digital confidence.</Text>
        </View>
      </View>
      {SOCIAL_OPTIONS.map((option) => (
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
        <TouchableOpacity style={styles.optionDetailBack} onPress={() => setCurrentPage("social")}>
          <Ionicons name="chevron-back" size={16} color="#0F172A" />
          <Text style={styles.optionDetailBackText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.optionDetailTitle}>{selectedOption?.tutorialTitle || selectedOption?.title}</Text>
      </View>
      <Text style={styles.optionDetailDescription}>{selectedOption?.description}</Text>

      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>Tutorial: Create an account</Text>
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
        <Text style={styles.detailSectionTitle}>More things to cover</Text>
        {selectedOption?.placeholders?.map((item, index) => (
          <View key={`${selectedOption.id}-${index}`} style={styles.detailBullet}>
            <Text style={styles.detailBulletText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#F0F9FF", "#E0F2FE", "#BAE6FD", "#7DD3FC", "#38BDF8", "#0EA5E9"]}
          locations={[0, 0.15, 0.35, 0.55, 0.75, 1]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <PageHeader />

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {currentPage === "social" && renderSocialPage()}
          {currentPage === "detail" && renderDetailPage()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E0F2FE",
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
  featureCard: {
    borderRadius: 24,
    padding: 0,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    backgroundColor: "#ffffff",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  featureGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  featureGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
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
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
  },
  featureSubtitle: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    justifyContent: "flex-end",
  },
  popupContainer: {
    maxHeight: "85%",
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 6,
  },
  popupSubtitle: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    maxWidth: "78%",
  },
  popupCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.12)",
  },
  popupScroll: {
    flex: 1,
  },
  popupContent: {
    paddingBottom: 24,
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
    borderColor: "rgba(56, 189, 248, 0.24)",
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
  detailSectionText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
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