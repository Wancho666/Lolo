import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";

export default function NameInputScreen({ navigation }) {
  const [name, setName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const handleSave = async () => {
    if (name.trim().length === 0 || !selectedGender) return;
    await AsyncStorage.setItem("nickname", name.trim());
    await AsyncStorage.setItem("gender", selectedGender);
    await AsyncStorage.setItem("hasOnboarded", "true");
    navigation.replace("Home");
  };

  const selectGender = (gender) => {
    setSelectedGender(gender);
  };

  const isFormValid = name.trim().length > 0 && selectedGender;

  return (
    <View style={styles.container}>
      {/* Beautiful Gradient Background - matching GetStartedScreen */}
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

      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>Please enter your Name & Gender</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
                autoFocus
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
            </View>

            <View style={styles.genderContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderOptions}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    selectedGender === 'male' && styles.genderOptionSelected,
                    selectedGender === 'male' && styles.maleSelected
                  ]}
                  onPress={() => selectGender('male')}
                  activeOpacity={0.7}
                >
                  <Icon 
                    name="mars" 
                    size={24} 
                    color={selectedGender === 'male' ? '#FFFFFF' : '#3B82F6'} 
                  />
                  <Text style={[
                    styles.genderText,
                    selectedGender === 'male' && styles.genderTextSelected
                  ]}>
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    selectedGender === 'female' && styles.genderOptionSelected,
                    selectedGender === 'female' && styles.femaleSelected
                  ]}
                  onPress={() => selectGender('female')}
                  activeOpacity={0.7}
                >
                  <Icon 
                    name="venus" 
                    size={24} 
                    color={selectedGender === 'female' ? '#FFFFFF' : '#EC4899'} 
                  />
                  <Text style={[
                    styles.genderText,
                    selectedGender === 'female' && styles.genderTextSelected
                  ]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity 
              style={[
                styles.button, 
                !isFormValid && styles.buttonDisabled
              ]} 
              onPress={handleSave} 
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.buttonText,
                !isFormValid && styles.buttonTextDisabled
              ]}>
                Continue
              </Text>
              <Icon name="arrow-right" size={18} color={isFormValid ? "#FFFFFF" : "#9CA3AF"} style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  keyboardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: "#334155",
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  formSection: {
    width: '100%',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 18,
    fontSize: 18,
    borderWidth: 2,
    borderColor: "rgba(186, 230, 253, 0.8)",
    color: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  genderContainer: {
    marginBottom: 8,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  genderOption: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "rgba(186, 230, 253, 0.8)",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80,
  },
  genderOptionSelected: {
    borderWidth: 2,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  maleSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  femaleSelected: {
    backgroundColor: '#EC4899',
    borderColor: '#DB2777',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginTop: 8,
  },
  genderTextSelected: {
    color: '#FFFFFF',
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#0EA5E9",
    paddingHorizontal: 40,
    paddingVertical: 18,
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
  buttonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
  },
  buttonTextDisabled: {
    color: "#64748B",
  },
  buttonIcon: {
    marginLeft: 5,
  },
});