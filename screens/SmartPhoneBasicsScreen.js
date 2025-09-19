import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Alert,
  Dimensions,
  Modal,
  TextInput,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  Vibration,
} from "react-native";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get("window");
// Responsive phone shell sizing so all simulators fit nicely on screen
const SIM_PHONE_WIDTH = Math.min(180, Math.floor(width * 0.42));
const SIM_PHONE_HEIGHT = Math.floor(SIM_PHONE_WIDTH * 1.75);
const BASE_PHONE_WIDTH = 160;
const BASE_PHONE_HEIGHT = 280;
const SCREEN_SCALE = Math.min(
  SIM_PHONE_WIDTH / BASE_PHONE_WIDTH,
  SIM_PHONE_HEIGHT / BASE_PHONE_HEIGHT
);

// Fixed TTS Wrapper
const TTSWrapper = {
  speak: (text, options = {}) => {
    const { onStart, onDone, onError } = options;
    
    try {
      if (typeof onStart === 'function') onStart();
      
      Speech.speak(text, {
        language: 'en',
        pitch: 1,
        rate: 0.8,
        onStart: typeof onStart === 'function' ? onStart : undefined,
        onDone: typeof onDone === 'function' ? onDone : undefined,
        onStopped: typeof onDone === 'function' ? onDone : undefined,
        onError: typeof onError === 'function' ? onError : undefined,
      });
    } catch (error) {
      console.warn('TTS Error:', error);
      if (typeof onError === 'function') onError(error);
    }
  },
  
  stop: () => {
    try {
      Speech.stop();
    } catch (error) {
      console.warn('TTS Stop Error:', error);
    }
  }
};

// --- Phone Anatomy Simulator ---
const PhoneAnatomySimulator = ({ onSuccess }) => {
  const [highlightedPart, setHighlightedPart] = useState(null);
  const [identifiedParts, setIdentifiedParts] = useState(new Set());

  const parts = [
    { id: "power", name: "Power Button" },
    { id: "volume", name: "Volume Buttons" },
    { id: "screen", name: "Screen" },
    { id: "home", name: "Home Button" },
    { id: "speaker", name: "Speaker" },
  ];

  const handlePartPress = (part) => {
    if (identifiedParts.has(part.id)) return;
    Vibration.vibrate(10);
    setHighlightedPart(part.id);
    setIdentifiedParts((prev) => new Set([...prev, part.id]));
    TTSWrapper.speak(`This is the ${part.name}`);
    if (identifiedParts.size + 1 >= 5) {
      setTimeout(() => onSuccess(), 1000);
    }
    setTimeout(() => setHighlightedPart(null), 800);
  };

  return (
    <View style={styles.simulatorContainer}>
      <Text style={styles.simulatorTitle}>Tap each part to learn about it</Text>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneBody}>
          {/* Power Button */}
          <TouchableOpacity
            style={[
              styles.powerButton,
              highlightedPart === "power" && styles.highlighted,
              identifiedParts.has("power") && { backgroundColor: "#10B981" },
            ]}
            onPress={() => handlePartPress(parts[0])}
            accessibilityLabel="Power Button"
          />

          {/* Volume Buttons */}
          <View style={styles.volumeButtons}>
            <TouchableOpacity
              style={[
                styles.volumeUp,
                highlightedPart === "volume" && styles.highlighted,
                identifiedParts.has("volume") && { backgroundColor: "#10B981" },
              ]}
              onPress={() => handlePartPress(parts[1])}
              accessibilityLabel="Volume Up"
            />
            <TouchableOpacity
              style={[
                styles.volumeDown,
                highlightedPart === "volume" && styles.highlighted,
                identifiedParts.has("volume") && { backgroundColor: "#10B981" },
              ]}
              onPress={() => handlePartPress(parts[1])}
              accessibilityLabel="Volume Down"
            />
          </View>

          {/* Screen */}
          <TouchableOpacity
            style={[
              styles.phoneScreen,
              highlightedPart === "screen" && styles.highlighted,
              identifiedParts.has("screen") && {
                borderColor: "#10B981",
                borderWidth: 2,
              },
            ]}
            onPress={() => handlePartPress(parts[2])}
            activeOpacity={0.8}
            accessibilityLabel="Screen"
          >
            <View style={styles.statusBar}>
              <Text style={styles.time}>9:41</Text>
              <View style={styles.statusIcons}>
                <Icon name="signal" size={12} color="#fff" />
                <Icon name="wifi" size={12} color="#fff" />
                <Icon name="battery-full" size={12} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Speaker */}
          <TouchableOpacity
            style={[
              styles.speaker,
              highlightedPart === "speaker" && styles.highlighted,
              identifiedParts.has("speaker") && { backgroundColor: "#10B981" },
            ]}
            onPress={() => handlePartPress(parts[4])}
            accessibilityLabel="Speaker"
          />

          {/* Home Button */}
          <TouchableOpacity
            style={[
              styles.homeButton,
              highlightedPart === "home" && styles.highlighted,
              identifiedParts.has("home") && {
                backgroundColor: "#10B981",
                borderColor: "#10B981",
              },
            ]}
            onPress={() => handlePartPress(parts[3])}
            accessibilityLabel="Home Button"
          />
        </View>
      </View>
      <View style={styles.progressIndicator}>
        <Text style={styles.progressText}>
          {identifiedParts.size}/5 parts identified
        </Text>
      </View>
    </View>
  );
};

// --- Power On/Off Simulator ---
const PowerSimulator = ({ onSuccess }) => {
  const [phoneState, setPhoneState] = useState("off");
  const [pressTime, setPressTime] = useState(0);
  const pressInterval = useRef(null);

  const handlePowerPress = () => {
    if (phoneState === "off") {
      pressInterval.current = setInterval(() => {
        setPressTime((prev) => prev + 100);
      }, 100);
    }
  };

  const handlePowerRelease = () => {
    if (pressInterval.current) {
      clearInterval(pressInterval.current);
    }
    if (pressTime >= 1000 && phoneState === "off") {
      Vibration.vibrate(20);
      setPhoneState("booting");
      setTimeout(() => {
        setPhoneState("on");
        onSuccess();
        TTSWrapper.speak("Phone turned on!");
      }, 1200);
    } else if (phoneState === "on") {
      Vibration.vibrate(10);
      setPhoneState("off");
      TTSWrapper.speak("Phone turned off!");
    }
    setPressTime(0);
  };

  return (
    <View style={styles.simulatorContainer}>
      <Text style={styles.simulatorTitle}>
        {phoneState === "off"
          ? "Hold power button for 1 second"
          : "Tap power to turn off"}
      </Text>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneBody}>
          <TouchableOpacity
            style={[
              styles.powerButton,
              pressTime > 0 && styles.pressing,
              phoneState === "on" && { backgroundColor: "#10B981" },
            ]}
            onPressIn={handlePowerPress}
            onPressOut={handlePowerRelease}
            accessibilityLabel="Power Button"
          />
          <View
            style={[
              styles.phoneScreen,
              phoneState === "off" && styles.screenOff,
              phoneState === "booting" && styles.screenBooting,
            ]}
          >
            {phoneState === "off" && <View style={styles.blackScreen} />}
            {phoneState === "booting" && (
              <View style={styles.bootScreen}>
                <Icon name="mobile-alt" size={40} color="#fff" />
                <Text style={styles.bootText}>Starting...</Text>
              </View>
            )}
            {phoneState === "on" && (
              <View style={styles.homeScreen}>
                <View style={styles.statusBar}>
                  <Text style={styles.time}>9:41</Text>
                  <View style={styles.statusIcons}>
                    <Icon name="signal" size={12} color="#fff" />
                    <Icon name="wifi" size={12} color="#fff" />
                    <Icon name="battery-full" size={12} color="#fff" />
                  </View>
                </View>
                <Text style={styles.welcomeText}>Welcome!</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      {pressTime > 0 && phoneState === "off" && (
        <View style={styles.pressIndicator}>
          <View
            style={[
              styles.pressBar,
              { width: `${Math.min(pressTime / 10, 100)}%` },
            ]}
          />
          <Text style={styles.pressText}>Hold to power on...</Text>
        </View>
      )}
    </View>
  );
};

// --- Unlock Simulator (swipe right to unlock) ---
const UnlockSimulator = ({ onSuccess }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [swipeStarted, setSwipeStarted] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const swipeX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isLocked,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        isLocked && Math.abs(gestureState.dx) > 10,
      onPanResponderGrant: () => {
        setSwipeStarted(true);
      },
      onPanResponderMove: Animated.event([null, { dx: swipeX }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 60) {
          Vibration.vibrate(15);
          setIsLocked(false);
          TTSWrapper.speak("Phone unlocked!");
          onSuccess();
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(swipeX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
        setSwipeStarted(false);
      },
    })
  ).current;

  useEffect(() => {
    if (!isLocked) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isLocked, slideAnim]);

  return (
    <View style={styles.simulatorContainer}>
      <Text style={styles.simulatorTitle}>
        {isLocked ? "Swipe right to unlock" : "Phone unlocked!"}
      </Text>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneBody}>
          <View style={styles.phoneScreen}>
            {isLocked ? (
              <View style={styles.lockScreen}>
                <View style={styles.statusBar}>
                  <Text style={styles.time}>9:41</Text>
                  <View style={styles.statusIcons}>
                    <Icon name="lock" size={12} color="#fff" />
                    <Icon name="battery-full" size={12} color="#fff" />
                  </View>
                </View>
                <View style={styles.clockDisplay}>
                  <Text style={styles.clockTime}>9:41</Text>
                  <Text style={styles.clockDate}>Tuesday, September 10</Text>
                </View>
                <View style={styles.swipeArea} {...panResponder.panHandlers}>
  <Animated.View
    style={[
      styles.swipeIndicator,
      { transform: [{ translateX: swipeX }] }
    ]}
  >
    <Icon name="chevron-right" size={16} color="#9CA3AF" />
    <Text style={styles.swipeText}>Swipe to unlock</Text>
  </Animated.View>
</View>
              </View>
            ) : (
              <Animated.View
                style={[
                  styles.homeScreen,
                  {
                    transform: [
                      {
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [width, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.statusBar}>
                  <Text style={styles.time}>9:41</Text>
                  <View style={styles.statusIcons}>
                    <Icon name="signal" size={12} color="#fff" />
                    <Icon name="wifi" size={12} color="#fff" />
                    <Icon name="battery-full" size={12} color="#fff" />
                  </View>
                </View>
                <View style={styles.appGrid}>
                  {["phone", "comment", "camera", "cog"].map((icon, idx) => (
                    <View key={idx} style={styles.appIcon}>
                      <Icon name={icon} size={24} color="#38BDF8" />
                    </View>
                  ))}
                </View>
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// --- Touch Gesture Simulator (tap, swipe, pinch) ---
const TouchSimulator = ({ onSuccess }) => {
  const [gestures, setGestures] = useState({
    tap: false,
    swipe: false,
    pinch: false,
  });
  const [currentGesture, setCurrentGesture] = useState(null);

  // Swipe gesture
  const swipeX = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !gestures.swipe,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        !gestures.swipe && Math.abs(gestureState.dx) > 10,
      onPanResponderMove: Animated.event([null, { dx: swipeX }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 80 && !gestures.swipe) {
          setCurrentGesture("swipe");
          setGestures((prev) => ({ ...prev, swipe: true }));
          TTSWrapper.speak("Nice swipe!");
          setTimeout(() => setCurrentGesture(null), 500);
          swipeX.setValue(0);
          if (gestures.tap && gestures.pinch) onSuccess();
        } else {
          Animated.spring(swipeX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Pinch gesture (simulate with long press)
  const handlePinch = () => {
    if (!gestures.pinch) {
      Vibration.vibrate(10);
      setCurrentGesture("pinch");
      setGestures((prev) => ({ ...prev, pinch: true }));
      TTSWrapper.speak("Good pinch!");
      setTimeout(() => setCurrentGesture(null), 500);
      if (gestures.tap && gestures.swipe) onSuccess();
    }
  };

  // Tap gesture
  const handleTap = () => {
    if (!gestures.tap) {
      Vibration.vibrate(8);
      setCurrentGesture("tap");
      setGestures((prev) => ({ ...prev, tap: true }));
      TTSWrapper.speak("Great tap!");
      setTimeout(() => setCurrentGesture(null), 500);
      if (gestures.swipe && gestures.pinch) onSuccess();
    }
  };

  return (
    <View style={styles.simulatorContainer}>
      <Text style={styles.simulatorTitle}>Try all three gestures</Text>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneBody}>
          <View style={styles.phoneScreen}>
            <View style={styles.gestureArea}>
              {/* Tap */}
              <TouchableOpacity
                style={[
                  styles.gestureButton,
                  currentGesture === "tap" && styles.gestureActive,
                  gestures.tap && styles.gestureCompleted,
                ]}
                onPress={handleTap}
                activeOpacity={0.7}
                accessibilityLabel="Tap"
              >
                <Icon
                  name="hand-point-up"
                  size={30}
                  color={gestures.tap ? "#10B981" : "#38BDF8"}
                />
                <Text style={styles.gestureLabel}>Tap</Text>
              </TouchableOpacity>
              {/* Swipe */}
              <Animated.View
                style={[
                  styles.gestureButton,
                  {
                    marginTop: 16,
                    marginBottom: 16,
                    transform: [{ translateX: swipeX }],
                  },
                  currentGesture === "swipe" && styles.gestureActive,
                  gestures.swipe && styles.gestureCompleted,
                ]}
                {...panResponder.panHandlers}
                accessibilityLabel="Swipe"
              >
                <Icon
                  name="hand-paper"
                  size={30}
                  color={gestures.swipe ? "#10B981" : "#38BDF8"}
                />
                <Text style={styles.gestureLabel}>Swipe</Text>
                <Text
                  style={{
                    color: "#94A3B8",
                    fontSize: 10,
                    marginTop: 2,
                  }}
                >
                  Drag right
                </Text>
              </Animated.View>
              {/* Pinch (simulate with long press) */}
              <TouchableOpacity
                style={[
                  styles.gestureButton,
                  currentGesture === "pinch" && styles.gestureActive,
                  gestures.pinch && styles.gestureCompleted,
                ]}
                onLongPress={handlePinch}
                delayLongPress={200}
                activeOpacity={0.7}
                accessibilityLabel="Pinch"
              >
                <Icon
                  name="compress-arrows-alt"
                  size={30}
                  color={gestures.pinch ? "#10B981" : "#38BDF8"}
                />
                <Text style={styles.gestureLabel}>Pinch</Text>
                <Text
                  style={{
                    color: "#94A3B8",
                    fontSize: 10,
                    marginTop: 2,
                  }}
                >
                  Long press
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.progressIndicator}>
        <Text style={styles.progressText}>
          {Object.values(gestures).filter(Boolean).length}/3 gestures completed
        </Text>
      </View>
    </View>
  );
};

// --- Volume & Brightness Simulator ---
const VolumeSimulator = ({ onSuccess }) => {
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(50);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const handleVolumeChange = (value) => {
    Vibration.vibrate(5);
    setVolume(value);
    if (value >= 80 && brightness >= 80) {
      onSuccess();
    }
  };

  const handleBrightnessChange = (value) => {
    Vibration.vibrate(5);
    setBrightness(value);
    if (value >= 80 && volume >= 80) {
      onSuccess();
    }
  };

  const handleVolumeButtonPress = (direction) => {
    setShowVolumeControl(true);
    Vibration.vibrate(8);
    const newVolume =
      direction === "up"
        ? Math.min(100, volume + 10)
        : Math.max(0, volume - 10);
    setVolume(newVolume);
    setTimeout(() => setShowVolumeControl(false), 1200);
    if (newVolume >= 80 && brightness >= 80) {
      onSuccess();
    }
  };

  return (
    <View style={styles.simulatorContainer}>
      <Text style={styles.simulatorTitle}>
        Adjust volume and brightness to 80%
      </Text>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneBody}>
          {/* Volume Buttons */}
          <View style={styles.volumeButtons}>
            <TouchableOpacity
              style={styles.volumeUp}
              onPress={() => handleVolumeButtonPress("up")}
              accessibilityLabel="Volume Up"
            />
            <TouchableOpacity
              style={styles.volumeDown}
              onPress={() => handleVolumeButtonPress("down")}
              accessibilityLabel="Volume Down"
            />
          </View>
          {/* Phone screen with brightness */}
          <View
            style={[
              styles.phoneScreen,
              { opacity: Math.min(1, Math.max(brightness / 100, 0.3) + 0.3) },
            ]}
          >
            {/* Volume Overlay */}
            {showVolumeControl && (
              <View style={styles.volumeOverlay}>
                <Icon name="volume-up" size={20} color="#fff" />
                <View style={styles.volumeBar}>
                  <View style={[styles.volumeFill, { width: `${volume}%` }]} />
                </View>
                <Text style={styles.volumeText}>{volume}%</Text>
              </View>
            )}
            {/* Settings Screen */}
            <View style={styles.settingsScreen}>
              <View style={styles.statusBar}>
                <Text style={styles.time}>9:41</Text>
                <View style={styles.statusIcons}>
                  <Icon name="signal" size={12} color="#fff" />
                  <Icon name="wifi" size={12} color="#fff" />
                  <Icon name="battery-full" size={12} color="#fff" />
                </View>
              </View>
              <Text style={styles.settingsTitle}>Settings</Text>
              {/* Volume Setting */}
              <View style={styles.settingItem}>
                <Icon name="volume-up" size={20} color="#38BDF8" />
                <Text style={styles.settingLabel}>Volume: {volume}%</Text>
                <Slider
                  style={styles.settingSlider}
                  value={volume}
                  onValueChange={handleVolumeChange}
                  minimumValue={0}
                  maximumValue={100}
                  step={10}
                  minimumTrackTintColor="#38BDF8"
                  maximumTrackTintColor="#CBD5E1"
                />
                <Text style={styles.settingValue}>{volume}%</Text>
              </View>
              {/* Brightness Setting */}
              <View style={styles.settingItem}>
                <Icon name="sun" size={20} color="#38BDF8" />
                <Text style={styles.settingLabel}>Brightness</Text>
              <Slider
                  style={styles.settingSlider}
                  value={brightness}
                  onValueChange={handleBrightnessChange}
                minimumValue={0}
                  maximumValue={100}
                  step={10}
                  minimumTrackTintColor="#38BDF8"
                  maximumTrackTintColor="#CBD5E1"
                />
                <Text style={styles.settingValue}>{brightness}%</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// --- Call Simulator ---
const CallSimulator = ({ onSuccess }) => {
  const [callState, setCallState] = useState("incoming");
  const [callDuration, setCallDuration] = useState(0);
  const durationInterval = useRef(null);

  useEffect(() => {
    if (callState === "answered") {
      durationInterval.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationInterval.current) clearInterval(durationInterval.current);
    }
    return () => {
      if (durationInterval.current) clearInterval(durationInterval.current);
    };
  }, [callState]);

  const handleAnswer = () => {
    Vibration.vibrate(15);
    setCallState("answered");
    TTSWrapper.speak("Call answered!");
    onSuccess();
  };

  const handleDecline = () => {
    Vibration.vibrate(15);
    setCallState("ended");
    TTSWrapper.speak("Call declined!");
    onSuccess();
  };

  const handleEndCall = () => {
    Vibration.vibrate(10);
    setCallState("ended");
    TTSWrapper.speak("Call ended!");
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.simulatorContainer}>
      <Text style={styles.simulatorTitle}>
        {callState === "incoming"
          ? "Answer or decline the call"
          : callState === "answered"
          ? "You are in a call"
          : "Call ended"}
      </Text>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneBody}>
          <View style={styles.phoneScreen}>
            {callState === "incoming" && (
              <View style={styles.incomingCall}>
                <View style={styles.callerInfo}>
                  <View style={styles.callerAvatar}>
                    <Icon name="user" size={40} color="#fff" />
                  </View>
                  <Text style={styles.callerName}>Mom</Text>
                  <Text style={styles.callerNumber}>+1 (555) 123-4567</Text>
                  <Text style={styles.callStatus}>Incoming call...</Text>
                </View>
                <View style={styles.callControls}>
                  <TouchableOpacity
                    style={[styles.callButton, styles.declineButton]}
                    onPress={handleDecline}
                    accessibilityLabel="Decline"
                  >
                    <Icon name="phone-slash" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.callButton, styles.answerButton]}
                    onPress={handleAnswer}
                    accessibilityLabel="Answer"
                  >
                    <Icon name="phone" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {callState === "answered" && (
              <View style={styles.activeCall}>
                <View style={styles.callerInfo}>
                  <View style={styles.callerAvatar}>
                    <Icon name="user" size={40} color="#fff" />
                  </View>
                  <Text style={styles.callerName}>Mom</Text>
                  <Text style={styles.callDuration}>
                    {formatDuration(callDuration)}
                  </Text>
                </View>
                <View style={styles.callControls}>
                  <TouchableOpacity
                    style={[styles.callButton, styles.endButton]}
                    onPress={handleEndCall}
                    accessibilityLabel="End Call"
                  >
                    <Icon name="phone-slash" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {callState === "ended" && (
              <View style={styles.callEnded}>
                <Icon name="phone" size={60} color="#64748B" />
                <Text style={styles.callEndedText}>Call ended</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// --- Message Simulator ---
const MessageSimulator = ({ onSuccess }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! How are you?", sender: "contact", time: "9:30 AM" },
  ]);

  const handleSendMessage = () => {
    if (message.trim().toLowerCase() === "hello") {
      Vibration.vibrate(10);
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: "user",
        time: "9:41 AM",
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      TTSWrapper.speak("Message sent!");
      setTimeout(() => onSuccess(), 500);
    }
  };

  return (
    <View style={styles.simulatorContainer}>
      <Text style={styles.simulatorTitle}>Type "hello" and send it</Text>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneBody}>
          <View style={styles.phoneScreen}>
            <View style={styles.messageApp}>
              <View style={styles.messageHeader}>
                <View style={styles.contactInfo}>
                  <View style={styles.contactAvatar}>
                    <Icon name="user" size={16} color="#fff" />
                  </View>
                  <Text style={styles.contactName}>John</Text>
                </View>
              </View>
              <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
                {messages.map((msg) => (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageBubble,
                      msg.sender === "user"
                        ? styles.userMessage
                        : styles.contactMessage,
                    ]}
                  >
                    <Text style={styles.messageText}>{msg.text}</Text>
                    <Text style={styles.messageTime}>{msg.time}</Text>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.messageInput}>
                <TextInput
                  style={styles.messageTextInput}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Type hello..."
                  placeholderTextColor="#94A3B8"
                  accessibilityLabel="Message Input"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="send"
                  onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    message.trim().toLowerCase() === "hello" &&
                      styles.sendButtonActive,
                  ]}
                  onPress={handleSendMessage}
                  disabled={message.trim().toLowerCase() !== "hello"}
                  accessibilityLabel="Send"
                >
                  <Icon name="paper-plane" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.instructionText}>
  <Text style={styles.hintText}>Hint: Type exactly "hello" (lowercase)</Text>
</View>
    </View>
  );
};

// --- App Launcher Simulator ---
const AppSimulator = ({ onSuccess }) => {
  const [openApp, setOpenApp] = useState(null);

  const apps = [
    { id: "camera", name: "Camera", icon: "camera", color: "#10B981" },
    { id: "phone", name: "Phone", icon: "phone", color: "#38BDF8" },
    { id: "messages", name: "Messages", icon: "comment", color: "#EF4444" },
    { id: "settings", name: "Settings", icon: "cog", color: "#64748B" },
  ];

  const handleAppPress = (app) => {
    if (app.id === "camera") {
      setOpenApp(app);
      TTSWrapper.speak("Camera app opened!");
      onSuccess();
    }
  };

  return (
    <View style={styles.simulatorContainer}>
      <Text style={styles.simulatorTitle}>Tap the Camera app to open it</Text>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneBody}>
          <View style={styles.phoneScreen}>
            {!openApp ? (
              <View style={styles.homeScreen}>
                <View style={styles.statusBar}>
                  <Text style={styles.time}>9:41</Text>
                  <View style={styles.statusIcons}>
                    <Icon name="signal" size={12} color="#fff" />
                    <Icon name="wifi" size={12} color="#fff" />
                    <Icon name="battery-full" size={12} color="#fff" />
                  </View>
                </View>
                <View style={styles.appGrid}>
                  {apps.map((app) => (
                    <TouchableOpacity
                      key={app.id}
                      style={styles.appIcon}
                      onPress={() => handleAppPress(app)}
                      accessibilityLabel={app.name}
                    >
                      <View
                        style={[
                          styles.appIconBg,
                          { backgroundColor: app.color },
                        ]}
                      >
                        <Icon name={app.icon} size={24} color="#fff" />
                      </View>
                      <Text style={styles.appName}>{app.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.cameraApp}>
                <View style={styles.cameraViewfinder}>
                  <Icon name="camera" size={60} color="#fff" />
                  <Text style={styles.cameraText}>Camera Ready</Text>
                </View>
                <TouchableOpacity style={styles.captureButton}>
                  <View style={styles.captureInner} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// --- WiFi Simulator ---
const WiFiSimulator = ({ onSuccess }) => {
  const [wifiState, setWifiState] = useState("scanning");
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [password, setPassword] = useState("");

  const networks = [
    { name: "Home WiFi", strength: 3, secured: true },
    { name: "Guest Network", strength: 2, secured: false },
    { name: "Neighbor WiFi", strength: 1, secured: true },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setWifiState("networks"), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNetworkSelect = (network) => {
    if (network.name === "Home WiFi") {
      setSelectedNetwork(network);
    } else {
      TTSWrapper.speak("Please select Home WiFi network");
    }
  };

  const handleConnect = () => {
    if (!selectedNetwork || selectedNetwork.name !== "Home WiFi") {
      TTSWrapper.speak("Please select Home WiFi first");
      return;
    }
    if (password.trim() === "password123") {
      setWifiState("connected");
      TTSWrapper.speak("Connected to Home WiFi!");
      setTimeout(() => onSuccess(), 500);
    } else {
      TTSWrapper.speak("Incorrect password. Try password123");
    }
  };

  return (
    <View style={styles.simulatorContainer}>
      <Text style={styles.simulatorTitle}>
  Connect to "Home WiFi" with password "password123"
</Text>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneBody}>
          <View style={styles.phoneScreen}>
            <View style={styles.wifiSettings}>
              <View style={styles.settingsHeader}>
                <Text style={styles.settingsTitle}>WiFi Settings</Text>
              </View>
              {wifiState === "scanning" && (
                <View style={styles.scanningView}>
                  <Icon name="wifi" size={30} color="#38BDF8" />
                  <Text style={styles.scanningText}>Scanning for networks...</Text>
                </View>
              )}
              {wifiState === "networks" && (
                <ScrollView style={styles.networksList} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  {networks.map((network, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.networkItem,
                        selectedNetwork?.name === network.name && styles.networkItemSelected
                      ]}
                      onPress={() => handleNetworkSelect(network)}
                      accessibilityLabel={network.name}
                    >
                      <Icon name="wifi" size={14} color="#38BDF8" />
                      <Text style={styles.networkName}>{network.name}</Text>
                      <View style={styles.networkInfo}>
                        {network.secured && (
                          <Icon name="lock" size={10} color="#64748B" />
                        )}
                        <View style={styles.signalStrength}>
                          {[1, 2, 3].map((bar) => (
                            <View
                              key={bar}
                              style={[
                                styles.signalBar,
                                bar <= network.strength && styles.signalBarActive,
                              ]}
                            />
                          ))}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                  {selectedNetwork && (
                    <View style={styles.passwordDialog}>
                      <Text style={styles.passwordLabel}>
                        Password for {selectedNetwork.name}:
                      </Text>
                      <TextInput
                        style={styles.passwordInput}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="password123"
                        secureTextEntry
                        placeholderTextColor="#94A3B8"
                        accessibilityLabel="WiFi Password"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                        onSubmitEditing={handleConnect}
                      />
                      <TouchableOpacity
                        style={[
                          styles.connectButton,
                          password.length > 0 && styles.connectButtonActive,
                        ]}
                        onPress={handleConnect}
                        accessibilityLabel="Connect"
                      >
                        <Text style={styles.connectButtonText}>Connect</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </ScrollView>
              )}
              {wifiState === "connected" && (
                <View style={styles.connectedView}>
                  <Icon name="check-circle" size={30} color="#10B981" />
                  <Text style={styles.connectedText}>
                    Connected to Home WiFi
                  </Text>
                  <View style={styles.connectionDetails}>
                    <Icon name="wifi" size={14} color="#10B981" />
                    <Text style={styles.ipAddress}>192.168.1.105</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      {selectedNetwork && wifiState === "networks" && (
        <View style={styles.instructionText}>
          <Text style={styles.hintText}>Password: password123</Text>
        </View>
      )}
    </View>
  );
};

// --- Charging Simulator ---
const ChargingSimulator = ({ onSuccess }) => {
  const [batteryLevel, setBatteryLevel] = useState(25);
  const [isCharging, setIsCharging] = useState(false);
  const chargingInterval = useRef(null);

  const handlePlugCharger = () => {
    setIsCharging(true);
    Vibration.vibrate(20);
    TTSWrapper.speak("Phone is charging!");
    onSuccess();
    chargingInterval.current = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev >= 100) {
          if (chargingInterval.current) {
            clearInterval(chargingInterval.current);
          }
          return 100;
        }
        return prev + 1;
      });
    }, 60);
  };

  useEffect(() => {
    return () => {
      if (chargingInterval.current) clearInterval(chargingInterval.current);
    };
  }, []);

  return (
    <View style={styles.simulatorContainer}>
      <Text style={styles.simulatorTitle}>Plug in the charger</Text>
      <View style={styles.phoneFrame}>
        <View style={styles.phoneBody}>
          <View style={styles.phoneScreen}>
            <View style={styles.chargingScreen}>
              <View style={styles.statusBar}>
                <Text style={styles.time}>9:41</Text>
                <View style={styles.statusIcons}>
                  <Icon name="signal" size={12} color="#fff" />
                  <Icon name="wifi" size={12} color="#fff" />
                  <Icon
                    name={isCharging ? "plug" : "battery-quarter"}
                    size={12}
                    color={isCharging ? "#10B981" : "#fff"}
                  />
                </View>
              </View>
              <View style={styles.batteryDisplay}>
                <View style={styles.batteryIcon}>
                  <View style={styles.batteryBody}>
                    <View
                      style={[
                        styles.batteryFill,
                        {
                          width: `${batteryLevel}%`,
                          backgroundColor:
                            batteryLevel < 20
                              ? "#EF4444"
                              : batteryLevel < 50
                              ? "#F59E0B"
                              : "#10B981",
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.batteryTip} />
                  {isCharging && (
                    <View style={styles.chargingBolt}>
                      <Icon name="bolt" size={24} color="#10B981" />
                    </View>
                  )}
                </View>
                <Text style={styles.batteryPercentage}>{batteryLevel}%</Text>
                <Text style={styles.batteryStatus}>
                  {isCharging ? "Charging..." : "Battery Low"}
                </Text>
              </View>
              {!isCharging && (
               <TouchableOpacity
  style={styles.chargerButton}
  onPress={handlePlugCharger}
  accessibilityLabel="Plug Charger"
>
  <Icon name="plug" size={24} color="#fff" />
  <Text style={styles.chargerButtonText}>Plug Charger</Text>
</TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const lessons = [
  {
    title: "Getting to Know the Phone",
    content:
      "Learn the parts of your smartphone: power button, volume, battery, and signal.",
    simulator: PhoneAnatomySimulator,
    icon: "mobile-alt",
  },
  {
    title: "Turning the Phone On and Off",
    content: "Press and hold the power button to turn your phone on or off.",
    simulator: PowerSimulator,
    icon: "power-off",
  },
  {
    title: "Unlocking the Phone",
    content: "Swipe the screen or enter a PIN to unlock your phone.",
    simulator: UnlockSimulator,
    icon: "unlock-alt",
  },
  {
    title: "Using the Touchscreen",
    content: "Tap, swipe, and pinch to use your phone.",
    simulator: TouchSimulator,
    icon: "hand-point-up",
  },
  {
    title: "Adjusting Volume & Brightness",
    content: "Use the volume buttons and brightness slider to adjust settings.",
    simulator: VolumeSimulator,
    icon: "volume-up",
  },
  {
    title: "Making and Receiving Calls",
    content: "Dial a number to call. Tap green to answer, red to decline.",
    simulator: CallSimulator,
    icon: "phone",
  },
  {
    title: "Sending and Reading Text Messages",
    content: "Use the Messages app to type and read SMS.",
    simulator: MessageSimulator,
    icon: "comment",
  },
  {
    title: "Opening Apps",
    content: "Tap an app icon to open it, like the Camera app.",
    simulator: AppSimulator,
    icon: "camera",
  },
  {
    title: "Connecting to WiFi",
    content: "WiFi lets you connect to the internet without mobile data.",
    simulator: WiFiSimulator,
    icon: "wifi",
  },
  {
    title: "Charging the Phone",
    content: "Plug your charger to recharge your phone safely.",
    simulator: ChargingSimulator,
    icon: "battery-three-quarters",
  },
];

export default function SmartPhoneBasicsScreen() {
  const navigation = useNavigation();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [textSize, setTextSize] = useState("medium");
  const [practiceCompleted, setPracticeCompleted] = useState({});

  // Animations for header
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Animations for background
  const pulseValue = useRef(new Animated.Value(0)).current;
  const floatValue1 = useRef(new Animated.Value(0)).current;
  const floatValue2 = useRef(new Animated.Value(0)).current;
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate header
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Background animations
    const startBackgroundAnimations = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: false,
          }),
          Animated.timing(pulseValue, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatValue1, {
            toValue: 1,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(floatValue1, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatValue2, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(floatValue2, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      [particle1, particle2].forEach((particle, idx) => {
        Animated.loop(
          Animated.timing(particle, {
            toValue: 1,
            duration: 8000 + idx * 2000,
            useNativeDriver: true,
          })
        ).start();
      });
    };

    startBackgroundAnimations();

    return () => {
      TTSWrapper.stop();
    };
  }, [fadeAnim, slideAnim, pulseValue, floatValue1, floatValue2, particle1, particle2]);

  // Interpolations for background
  const pulseOpacity = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.02, 0.06],
  });

  const float1Y = floatValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const float2Y = floatValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });

  const particle1Y = particle1.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  const particle2Y = particle2.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  // Text size helpers
  const getTextSizeStyle = () => {
    switch (textSize) {
      case "small":
        return { fontSize: 14, lineHeight: 20 };
      case "large":
        return { fontSize: 20, lineHeight: 28 };
      default:
        return { fontSize: 16, lineHeight: 24 };
    }
  };

  const getTitleSizeStyle = () => {
    switch (textSize) {
      case "small":
        return { fontSize: 18, lineHeight: 24 };
      case "large":
        return { fontSize: 24, lineHeight: 32 };
      default:
        return { fontSize: 20, lineHeight: 28 };
    }
  };

  // TTS functionality
  const handleReadLesson = (lesson) => {
    if (isReading) {
      TTSWrapper.stop();
      setIsReading(false);
      return;
    }
    TTSWrapper.speak(`${lesson.title}. ${lesson.content}`, {
      onStart: () => setIsReading(true),
      onDone: () => setIsReading(false),
      onStopped: () => setIsReading(false),
      onError: () => setIsReading(false),
    });
  };

  // Modal controls
  const openLessonModal = (lesson) => {
    setSelectedLesson(lesson);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    if (isReading) {
      TTSWrapper.stop();
      setIsReading(false);
    }
    setIsModalVisible(false);
    setSelectedLesson(null);
  };

  const handlePracticeSuccess = (lessonTitle) => {
  setPracticeCompleted((prev) => ({
    ...prev,
    [lessonTitle]: true,
  }));
  Alert.alert("Well done!", "You completed the practice!", [
    { text: "Continue", style: "default" },
  ]);
};

  return (
    <View style={styles.container}>
      {/* Enhanced Gradient Background */}
      <LinearGradient
        colors={[
          "#F0F9FF",
          "#E0F2FE",
          "#BAE6FD",
          "#7DD3FC",
          "#38BDF8",
          "#0EA5E9",
        ]}
        locations={[0, 0.15, 0.35, 0.55, 0.75, 1]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Subtle animated overlay */}
      <Animated.View
        style={[styles.backgroundOverlay, { opacity: pulseOpacity }]}
      />

      {/* Enhanced floating background elements */}
      <View style={styles.backgroundElements}>
        <Animated.View
          style={[
            styles.floatingElement1,
            { transform: [{ translateY: float1Y }] },
          ]}
        >
          <Icon name="heart" size={28} color="rgba(255, 255, 255, 0.12)" />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingElement2,
            { transform: [{ translateY: float2Y }] },
          ]}
        >
          <Icon name="mobile-alt" size={32} color="rgba(255, 255, 255, 0.12)" />
        </Animated.View>
        <Animated.View
          style={[
            styles.particle,
            styles.particle1,
            { transform: [{ translateY: particle1Y }] },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle2,
            { transform: [{ translateY: particle2Y }] },
          ]}
        />
      </View>

      {/* Enhanced Header */}
      <Animated.View
  style={[
    styles.header,
    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
  ]}
>
  <View style={styles.headerIconContainer}>
    <Icon name="mobile-alt" size={32} color="#0F172A" />
  </View>
  <Text style={styles.headerTitle}>
    Smartphone Basics
  </Text>
  <Text style={styles.headerSubtitle}>
    Interactive lessons for seniors
  </Text>
  <View style={styles.headerDivider} />
</Animated.View>

      {/* Enhanced Lessons List */}
      <ScrollView
        style={styles.lessonScroll}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
       {lessons.map((lesson, idx) => (
  <TouchableOpacity
    key={idx}
    style={[
      styles.lessonCard,
      practiceCompleted[lesson.title] && styles.lessonCardCompleted,
    ]}
    onPress={() => openLessonModal(lesson)}
    activeOpacity={0.92}
    accessibilityLabel={lesson.title}
  >
    <View style={styles.lessonImageContainer}>
      <View style={styles.lessonIconBg}>
        <Icon name={lesson.icon} size={32} color="#38BDF8" />
      </View>
      {practiceCompleted[lesson.title] && (
        <View style={styles.completedBadge}>
          <Icon name="check" size={12} color="#fff" />
        </View>
      )}
    </View>
    <View style={styles.lessonContent}>
      <Text style={[styles.lessonTitle, getTitleSizeStyle()]}>
        {lesson.title}
      </Text>
      <Text
        style={[styles.lessonSummary, getTextSizeStyle()]}
        numberOfLines={2}
      >
        {lesson.content}
      </Text>
      <View style={styles.lessonProgress}>
        <Text style={styles.progressText}>
          {practiceCompleted[lesson.title] ? "Completed" : "Ready to learn"}
        </Text>
      </View>
    </View>
    <View style={styles.arrowIcon}>
      <Icon name="chevron-right" size={18} color="#38BDF8" />
    </View>
  </TouchableOpacity>
))}
      </ScrollView>

      {/* Enhanced Lesson Modal */}
      

<Modal
  visible={isModalVisible}
  animationType="slide"
  transparent
  onRequestClose={closeModal}
  statusBarTranslucent
>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {selectedLesson && (
          <>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Icon
                  name={selectedLesson.icon}
                  size={40}
                  color="#38BDF8"
                />
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeModal}
                accessibilityLabel="Close"
              >
                <Icon name="times" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={true}
            >
              <Text
                style={[styles.modalHeadline, getTitleSizeStyle()]}
                accessibilityRole="header"
              >
                {selectedLesson.title}
              </Text>
              <Text style={[styles.modalBody, getTextSizeStyle()]}>
                {selectedLesson.content}
              </Text>

              {/* Enhanced Controls Section */}
              <View style={styles.controlsSection}>
                {/* TTS and Text Size Controls */}
                <View style={styles.primaryControls}>
                  <TouchableOpacity
                    style={[
                      styles.ttsButton,
                      isReading && styles.ttsButtonActive,
                    ]}
                    onPress={() => handleReadLesson(selectedLesson)}
                    activeOpacity={0.8}
                    accessibilityLabel={
                      isReading ? "Stop Reading" : "Read Aloud"
                    }
                  >
                    <Icon
                      name={isReading ? "stop" : "volume-up"}
                      size={18}
                      color={isReading ? "#fff" : "#38BDF8"}
                    />
                    <Text
                      style={[
                        styles.ttsButtonText,
                        isReading && styles.ttsButtonTextActive,
                      ]}
                    >
                      {isReading ? "Stop" : "Read"}
                    </Text>
                  </TouchableOpacity>

                  {/* Text Size Controls */}
                  <View style={styles.textSizeControls}>
                    <Text style={styles.textSizeLabel}>Text:</Text>
                    {["small", "medium", "large"].map((size, idx) => (
                      <TouchableOpacity
                        key={size}
                        style={[
                          styles.textSizeButton,
                          textSize === size && styles.textSizeButtonActive,
                        ]}
                        onPress={() => setTextSize(size)}
                        activeOpacity={0.7}
                        accessibilityLabel={`Text size ${size}`}
                      >
                        <Text
                          style={[
                            styles.textSizeButtonText,
                            textSize === size &&
                              styles.textSizeButtonTextActive,
                          ]}
                        >
                          {["A-", "A", "A+"][idx]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Interactive Simulator Section */}
              <View style={styles.practiceSection}>
                <Text style={styles.practiceSectionTitle}>
                  Interactive Practice
                  </Text>
                <View style={styles.practiceContent}>
                  {React.createElement(selectedLesson.simulator, {
                    onSuccess: () =>
                      handlePracticeSuccess(selectedLesson.title),
                  })}
                </View>
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </View>
  </KeyboardAvoidingView>
</Modal>

      {/* Enhanced Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
        accessibilityLabel="Back"
      >
        <Icon name="arrow-left" size={18} color="#0F172A" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

// Add the required StyleSheet
const styles = StyleSheet.create({
  // Add these new styles to your StyleSheet:

// Helper text and instructions
instructionText: {
  marginTop: 12,
  paddingHorizontal: 20,
  alignItems: 'center',
},
hintText: {
  fontSize: 12,
  color: '#64748B',
  fontStyle: 'italic',
  textAlign: 'center',
},

// Enhanced message app styles
messageApp: {
  flex: 1,
  backgroundColor: '#1F2937',
},
messageHeader: {
  backgroundColor: '#374151',
  paddingHorizontal: 12,
  paddingVertical: 8,
},
contactInfo: {
  flexDirection: 'row',
  alignItems: 'center',
},
contactAvatar: {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: '#6B7280',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 8,
},
contactName: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '600',
},
messagesContainer: {
  flex: 1,
  paddingHorizontal: 12,
  paddingVertical: 8,
},
messageBubble: {
  maxWidth: '75%',
  padding: 8,
  borderRadius: 12,
  marginBottom: 6,
},
contactMessage: {
  backgroundColor: '#374151',
  alignSelf: 'flex-start',
},
userMessage: {
  backgroundColor: '#38BDF8',
  alignSelf: 'flex-end',
},
messageText: {
  color: '#fff',
  fontSize: 13,
},
messageTime: {
  color: '#9CA3AF',
  fontSize: 8,
  marginTop: 2,
},
messageInput: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 8,
  backgroundColor: '#374151',
},
messageTextInput: {
  flex: 1,
  backgroundColor: '#1F2937',
  borderRadius: 16,
  paddingHorizontal: 12,
  paddingVertical: 6,
  color: '#fff',
  fontSize: 11,
  marginRight: 8,
  minHeight: 28,
},
sendButton: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: '#6B7280',
  justifyContent: 'center',
  alignItems: 'center',
},
sendButtonActive: {
  backgroundColor: '#38BDF8',
},

// Enhanced WiFi styles
wifiSettings: {
  flex: 1,
  backgroundColor: '#1F2937',
  paddingHorizontal: 12,
},
settingsHeader: {
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#374151',
},
settingsTitle: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'center',
},
scanningView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
scanningText: {
  color: '#9CA3AF',
  fontSize: 12,
  marginTop: 12,
},
networksList: {
  flex: 1,
  paddingTop: 8,
},
networkItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#374151',
  borderRadius: 8,
  marginBottom: 2,
},
networkItemSelected: {
  backgroundColor: 'rgba(56, 189, 248, 0.1)',
  borderColor: '#38BDF8',
},
networkName: {
  color: '#fff',
  fontSize: 12,
  marginLeft: 8,
  flex: 1,
},
networkInfo: {
  flexDirection: 'row',
  alignItems: 'center',
},
signalStrength: {
  flexDirection: 'row',
  marginLeft: 6,
},
signalBar: {
  width: 3,
  height: 6,
  backgroundColor: '#6B7280',
  marginLeft: 1,
  borderRadius: 1,
},
signalBarActive: {
  backgroundColor: '#38BDF8',
},
passwordDialog: {
  backgroundColor: '#374151',
  borderRadius: 8,
  padding: 12,
  marginTop: 8,
  marginHorizontal: 4,
},
passwordLabel: {
  color: '#fff',
  fontSize: 11,
  marginBottom: 8,
},
passwordInput: {
  backgroundColor: '#1F2937',
  borderRadius: 6,
  paddingHorizontal: 8,
  paddingVertical: 6,
  color: '#fff',
  fontSize: 11,
  marginBottom: 12,
  minHeight: 28,
},
connectButton: {
  backgroundColor: '#6B7280',
  borderRadius: 6,
  paddingVertical: 8,
  alignItems: 'center',
},
connectButtonActive: {
  backgroundColor: '#38BDF8',
},
connectButtonText: {
  color: '#fff',
  fontSize: 11,
  fontWeight: '600',
},
connectedView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
connectedText: {
  color: '#10B981',
  fontSize: 14,
  fontWeight: '600',
  marginTop: 12,
  textAlign: 'center',
},
connectionDetails: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 8,
},
ipAddress: {
  color: '#9CA3AF',
  fontSize: 10,
  marginLeft: 6,
},
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backgroundOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#38BDF8',
  },
  backgroundElements: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  floatingElement1: {
    position: 'absolute',
    top: 100,
    left: 50,
  },
  floatingElement2: {
    position: 'absolute',
    top: 200,
    right: 80,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  particle1: {
    left: '20%',
  },
  particle2: {
    left: '80%',
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  headerDivider: {
    width: 60,
    height: 4,
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  lessonScroll: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
  },
  lessonCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lessonCardCompleted: {
    borderColor: '#10B981',
    borderWidth: 2,
  },
  lessonImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  lessonIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  lessonSummary: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 8,
  },
  lessonProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  arrowIcon: {
    marginLeft: 12,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'flex-end',
},
modalScrollView: {
  flex: 1,
},
  modalScrollContainer: {
  padding: 24,
  paddingTop: 0,
  paddingBottom: 40,
},
  modalContent: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  height: '92%',
  maxHeight: height * 0.92,
  flexDirection: 'column',
},
  modalHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 24,
  paddingBottom: 0,
  borderBottomWidth: 1,
  borderBottomColor: '#F1F5F9',
},
  modalIconContainer: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#F0F9FF',
  justifyContent: 'center',
  alignItems: 'center',
},
  modalCloseButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#F1F5F9',
  justifyContent: 'center',
  alignItems: 'center',
},
  modalHeadline: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#0F172A',
  marginBottom: 16,
  lineHeight: 32,
  marginTop: 20,
},
  modalBody: {
  fontSize: 16,
  color: '#475569',
  lineHeight: 24,
  marginBottom: 24,
},
  controlsSection: {
    marginBottom: 24,
  },
  primaryControls: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
  flexWrap: 'wrap',
},
  ttsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  ttsButtonActive: {
    backgroundColor: '#38BDF8',
  },
  ttsButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#38BDF8',
  },
  ttsButtonTextActive: {
    color: '#fff',
  },
  textSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSizeLabel: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
  },
  textSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  textSizeButtonActive: {
    backgroundColor: '#38BDF8',
  },
  textSizeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  textSizeButtonTextActive: {
    color: '#fff',
  },
   practiceSectionScrollable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    maxHeight: 340,
    marginBottom: 10,
    flex: 1,
    width: '100%',
  },
  practiceSection: {
  backgroundColor: '#F8FAFC',
  borderRadius: 16,
  padding: 20,
  marginBottom: 20,
},
  practiceSectionTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#0F172A',
  marginBottom: 16,
  textAlign: 'center',
},
  practiceContent: {
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  // Simulator styles
  simulatorContainer: {
  alignItems: 'center',
  paddingVertical: 10,
  width: '100%',
},
  simulatorTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#0F172A',
  marginBottom: 20,
  textAlign: 'center',
  paddingHorizontal: 20,
},
  phoneFrame: {
  padding: 6,
  backgroundColor: '#1F2937',
  borderRadius: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
  alignSelf: 'center',
  maxWidth: '100%',
  transform: [{ scale: SCREEN_SCALE }],
},
  phoneBody: {
  width: SIM_PHONE_WIDTH,
  height: SIM_PHONE_HEIGHT,
  backgroundColor: '#374151',
  borderRadius: 16,
  position: 'relative',
},
 phoneScreen: {
  position: 'absolute',
  top: 16,
  left: 10,
  right: 10,
  bottom: 16,
  backgroundColor: '#000',
  borderRadius: 12,
  overflow: 'hidden',
  maxWidth: '100%',
},
  powerButton: {
    position: 'absolute',
    right: -4,
    top: 60,
    width: 8,
    height: 40,
    backgroundColor: '#6B7280',
    borderRadius: 4,
  },
  volumeButtons: {
    position: 'absolute',
    left: -4,
    top: 50,
  },
  volumeUp: {
    width: 8,
    height: 30,
    backgroundColor: '#6B7280',
    borderRadius: 4,
    marginBottom: 8,
  },
  volumeDown: {
    width: 8,
    height: 30,
    backgroundColor: '#6B7280',
    borderRadius: 4,
  },
  speaker: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    backgroundColor: '#6B7280',
    borderRadius: 2,
  },
  homeButton: {
    position: 'absolute',
    bottom: 4,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 30,
    backgroundColor: '#6B7280',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#4B5563',
  },
  highlighted: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  pressing: {
    backgroundColor: '#38BDF8',
  },
  screenOff: {
    backgroundColor: '#000',
  },
  screenBooting: {
    backgroundColor: '#1F2937',
  },
  blackScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  bootScreen: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bootText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  homeScreen: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  time: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 6,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
  },
  progressIndicator: {
  backgroundColor: 'rgba(56, 189, 248, 0.1)',
  borderRadius: 20,
  paddingHorizontal: 16,
  paddingVertical: 8,
  marginTop: 15,
  alignSelf: 'center',
},
  progressText: {
  color: '#38BDF8',
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'center',
},
  pressIndicator: {
    marginTop: 16,
    alignItems: 'center',
    width: '100%',
  },
  pressBar: {
    height: 4,
    backgroundColor: '#38BDF8',
    borderRadius: 2,
    marginBottom: 8,
  },
  pressText: {
    fontSize: 12,
    color: '#64748B',
  },
  lockScreen: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  clockDisplay: {
    alignItems: 'center',
    marginTop: 40,
  },
  clockTime: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '200',
  },
  clockDate: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 4,
  },
  swipeArea: {
    alignSelf: 'center',
    marginBottom: 40,
  },
  swipeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  swipeText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  appGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 40,
    gap: 20,
  },
  appIcon: {
    alignItems: 'center',
    width: 60,
  },
  appIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
  gestureArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gestureButton: {
    width: 100,
    height: 80,
    backgroundColor: '#374151',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gestureActive: {
    backgroundColor: '#38BDF8',
    transform: [{ scale: 1.1 }],
  },
  gestureCompleted: {
    backgroundColor: '#10B981',
  },
  gestureLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  settingsScreen: {
    flex: 1,
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
  },
  settingsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingLabel: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  settingSlider: {
    width: 100,
    height: 20,
    marginHorizontal: 12,
  },
  settingValue: {
    color: '#9CA3AF',
    fontSize: 12,
    width: 30,
    textAlign: 'right',
  },
  volumeOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  volumeBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    marginHorizontal: 12,
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  volumeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  incomingCall: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'space-between',
    paddingVertical: 40,
    alignItems: 'center',
  },
  callerInfo: {
    alignItems: 'center',
  },
  callerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  callerName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  callerNumber: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 8,
  },
  callStatus: {
    color: '#38BDF8',
    fontSize: 14,
  },
  callDuration: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '600',
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerButton: {
    backgroundColor: '#10B981',
  },
  declineButton: {
    backgroundColor: '#EF4444',
  },
  endButton: {
    backgroundColor: '#EF4444',
  },
  activeCall: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'space-between',
    paddingVertical: 40,
    alignItems: 'center',
  },
  callEnded: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callEndedText: {
    color: '#9CA3AF',
    fontSize: 18,
    marginTop: 16,
  },
  
  chargingScreen: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  batteryDisplay: {
    alignItems: 'center',
    marginTop: 60,
  },
  batteryIcon: {
    position: 'relative',
    alignItems: 'center',
  },
  batteryBody: {
    width: 80,
    height: 40,
    borderWidth: 3,
    borderColor: '#6B7280',
    borderRadius: 8,
    backgroundColor: '#374151',
    position: 'relative',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  batteryTip: {
    position: 'absolute',
    right: -8,
    top: 12,
    width: 6,
    height: 16,
    backgroundColor: '#6B7280',
    borderRadius: 2,
  },
  chargingBolt: {
    position: 'absolute',
    top: 8,
    left: 28,
  },
  batteryPercentage: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    marginTop: 20,
  },
  batteryStatus: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 8,
  },
  chargerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38BDF8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 40,
  },
  chargerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
});