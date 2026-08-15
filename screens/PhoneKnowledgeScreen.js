import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, SafeAreaView, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function PhoneKnowledgeScreen({ navigation }) {
  const handleChoice = async (choice) => {
    try {
      await AsyncStorage.setItem("hasOnboarded", "true");
    } catch (error) {
      console.log("Error saving onboarding flag:", error);
    }

    if (choice === "experienced") {
      navigation.replace("Screen2");
    } else {
      navigation.replace("Home");
    }
  };

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

        {/* Header */}
        <View style={styles.topActionRow}>
          <View style={styles.leftTopArea}>
            <Image source={require("../assets/images/nlogo.png")} style={styles.headerLogo} resizeMode="contain" />
          </View>

          <View style={styles.pageHeaderBadge}>
            <Ionicons name="bulb" size={18} color="#38BDF8" />
            <Text style={styles.pageHeaderBadgeText}>Learn & Choose</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                <Ionicons name="sparkles" size={14} color="#0284C7" />
                <Text style={styles.heroBadgeText}>Personalized Path</Text>
              </View>
              <Text style={styles.heroTitle}>Choose Your Learning Path</Text>
              <Text style={styles.heroText}>Start with guided basics or jump straight into practical digital skills—we'll personalize your journey.</Text>
            </View>
          </View>

          {/* Choice Buttons */}
          <TouchableOpacity
            style={styles.choiceCard}
            activeOpacity={0.9}
            onPress={() => handleChoice("no-experience")}
          >
            <LinearGradient
              colors={["rgba(56, 189, 248, 0.18)", "rgba(59, 130, 246, 0.18)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.choiceGradient}
            />
            <View style={styles.choiceGlass} />
            <View style={styles.choiceRow}>
              <View style={styles.choiceIconContainer}>
                <Ionicons name="book" size={32} color="#0EA5E9" />
              </View>
              <View style={styles.choiceText}>
                <Text style={styles.choiceTitle}>Begin with Guided Basics</Text>
                <Text style={styles.choiceSubtitle}>Learn step-by-step from the fundamentals</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(15, 23, 42, 0.7)" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.choiceCard}
            activeOpacity={0.9}
            onPress={() => handleChoice("experienced")}
          >
            <LinearGradient
              colors={["rgba(251, 191, 36, 0.18)", "rgba(34, 197, 94, 0.18)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.choiceGradient}
            />
            <View style={styles.choiceGlass} />
            <View style={styles.choiceRow}>
              <View style={styles.choiceIconContainer}>
                <Ionicons name="rocket" size={32} color="#34D399" />
              </View>
              <View style={styles.choiceText}>
                <Text style={styles.choiceTitle}>Jump to Practical Skills</Text>
                <Text style={styles.choiceSubtitle}>Go straight to advanced digital expertise</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(15, 23, 42, 0.7)" />
            </View>
          </TouchableOpacity>
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
  topActionRow: {
    position: "absolute",
    top: Platform.OS === "ios" ? 34 : 22,
    left: 18,
    right: 18,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftTopArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLogo: {
    width: 70,
    height: 32,
  },
  pageHeaderBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 8,
  },
  pageHeaderBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0284C7",
  },
  scrollView: {
    flex: 1,
    marginTop: 70,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    padding: 24,
    zIndex: 1,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
    gap: 6,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0284C7",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 10,
    lineHeight: 32,
  },
  heroText: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
    fontWeight: "500",
  },
  choiceCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  choiceGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  choiceGlass: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  choiceRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    zIndex: 1,
    gap: 16,
  },
  choiceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  choiceText: {
    flex: 1,
  },
  choiceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  choiceSubtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
});