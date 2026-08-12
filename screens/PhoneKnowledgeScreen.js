import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome5";
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
    <View style={styles.container}>
      <LinearGradient
        colors={["#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <View style={styles.decorativeTop}>
        <View style={styles.circleLight} />
        <View style={styles.squareLight} />
      </View>

      <View style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0.45)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGlow}
        />
        <View style={styles.iconWrapper}>
          <Icon name="mobile-alt" size={38} color="#0F172A" />
        </View>
        <View style={styles.badge}>
          <Icon name="sparkles" size={12} color="#0EA5E9" />
          <Text style={styles.badgeText}>Personalized learning path</Text>
        </View>
        <Text style={styles.heading}>Choose the learning path that fits you best</Text>
        <Text style={styles.subtitle}>
          Start with guided basics or jump straight into practical digital skills.
        </Text>

        <TouchableOpacity
          style={[styles.choiceButton, styles.primaryButton]}
          activeOpacity={0.8}
          onPress={() => handleChoice("no-experience")}
        >
          <Text style={styles.choiceText}>Begin with guided basics</Text>
          <Icon name="arrow-right" size={16} color="#FFFFFF" style={styles.choiceIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.choiceButton, styles.secondaryButton]}
          activeOpacity={0.8}
          onPress={() => handleChoice("experienced")}
        >
          <Text style={[styles.choiceText, styles.secondaryText]}>Jump to practical skills</Text>
          <Icon name="check" size={16} color="#0F172A" style={styles.choiceIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Your choice helps us personalize the learning track.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeTop: {
    position: "absolute",
    top: Platform.OS === "ios" ? 70 : 40,
    left: 20,
    right: 20,
    height: 120,
  },
  circleLight: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    top: 0,
    left: 0,
  },
  squareLight: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: "rgba(248, 250, 252, 0.5)",
    top: 30,
    right: 0,
  },
  card: {
    marginTop: 140,
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
    minHeight: 420,
    justifyContent: "space-between",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  iconWrapper: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#0369A1",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 14,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
    marginBottom: 30,
  },
  choiceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginBottom: 14,
    minWidth: width - 80,
  },
  primaryButton: {
    backgroundColor: "#0EA5E9",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  choiceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#0F172A",
  },
  choiceIcon: {
    marginLeft: 10,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 18,
  },
  footerText: {
    textAlign: "center",
    color: "#334155",
    fontSize: 14,
    lineHeight: 20,
  },
});