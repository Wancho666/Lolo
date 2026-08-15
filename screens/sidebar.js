import React, { useEffect, useRef } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Sidebar({ visible, onClose, navigation }) {
  const slideAnim = useRef(new Animated.Value(-320)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -320,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  const handleOptionPress = async (screen) => {
    try {
      onClose();

      if (screen === "GetStarted") {
        await AsyncStorage.removeItem("hasOnboarded");
        navigation.reset({
          index: 0,
          routes: [{ name: "GetStarted" }],
        });
        return;
      }

      setTimeout(() => {
        navigation.navigate(screen);
      }, 20);
    } catch (error) {
      console.log("Sidebar navigation error:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}
        >
          <View style={styles.headerRow}>
            <Text style={styles.title}>Select Mode</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#0F172A" />
            </Pressable>
          </View>

          <Pressable
            style={styles.menuItem}
            onPress={() => handleOptionPress("Home")}
          >
            <Ionicons name="home" size={18} color="#0EA5E9" />
            <Text style={styles.menuText}>Beginner mode</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => handleOptionPress("Screen2")}
          >
            <Ionicons name="star" size={18} color="#F59E0B" />
            <Text style={styles.menuText}>Experience Mode</Text>
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.exitItem]}
            onPress={() => handleOptionPress("GetStarted")}
          >
            <Ionicons name="exit-outline" size={18} color="#EF4444" />
            <Text style={[styles.menuText, styles.exitText]}>Exit</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  panel: {
    width: "75%",
    maxWidth: 300,
    height: "100%",
    backgroundColor: "#F8FAFC",
    paddingTop: 52,
    paddingHorizontal: 18,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.18)",
  },
  exitItem: {
    backgroundColor: "#FEE2E2",
    borderColor: "rgba(239, 68, 68, 0.2)",
    marginTop: 18,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  exitText: {
    color: "#B91C1C",
  },
});
