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
import * as Speech from "expo-speech";

const { width, height } = Dimensions.get("window");

// ─── Phone shell sizing ───────────────────────────────────────────────────────
const PHONE_W = 220;
const PHONE_H = 430;
const SCREEN_W = PHONE_W - 20;
const SCREEN_H = PHONE_H - 80;

// ─── TTS ──────────────────────────────────────────────────────────────────────
const TTS = {
  speak: (text, opts = {}) => {
    const { onStart, onDone, onError } = opts;
    try {
      if (onStart) onStart();
      Speech.speak(text, {
        language: "fil",
        pitch: 1,
        rate: 0.85,
        onStart,
        onDone,
        onStopped: onDone,
        onError,
      });
    } catch (e) {
      console.warn("TTS:", e);
      if (onError) onError(e);
    }
  },
  stop: () => {
    try { Speech.stop(); } catch (_) {}
  },
};

// ─── Shared Phone Shell ───────────────────────────────────────────────────────
const PhoneShell = ({ children, onVolumeUp, onVolumeDown, onPowerPressIn, onPowerPressOut, powerHighlight }) => (
  <View style={phoneStyles.shell}>
    {/* Left side volume buttons */}
    <View style={phoneStyles.leftSide}>
      <TouchableOpacity
        style={phoneStyles.volBtn}
        onPress={onVolumeUp}
        accessibilityLabel="Volume Up"
      >
        <View style={phoneStyles.volBtnInner} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[phoneStyles.volBtn, { marginTop: 6 }]}
        onPress={onVolumeDown}
        accessibilityLabel="Volume Down"
      >
        <View style={phoneStyles.volBtnInner} />
      </TouchableOpacity>
    </View>

    {/* Phone body */}
    <View style={phoneStyles.body}>
      {/* Notch / dynamic island style */}
      <View style={phoneStyles.notch}>
        <View style={phoneStyles.camera} />
        <View style={phoneStyles.speaker} />
      </View>

      {/* Screen */}
      <View style={phoneStyles.screen}>
        {children}
      </View>

      {/* Home indicator */}
      <View style={phoneStyles.homeIndicatorWrap}>
        <View style={phoneStyles.homeIndicator} />
      </View>
    </View>

    {/* Right side power button */}
    <View style={phoneStyles.rightSide}>
      <TouchableOpacity
        style={[phoneStyles.powerBtn, powerHighlight && phoneStyles.powerBtnActive]}
        onPressIn={onPowerPressIn}
        onPressOut={onPowerPressOut}
        accessibilityLabel="Power Button"
      >
        <View style={phoneStyles.powerBtnInner} />
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Status Bar ───────────────────────────────────────────────────────────────
const StatusBar = ({ dark = false, charging = false, batteryLevel = 80 }) => (
  <View style={[simStyles.statusBar, dark && simStyles.statusBarDark]}>
    <Text style={[simStyles.statusTime, dark && { color: "#111" }]}>9:41</Text>
    <View style={simStyles.statusRight}>
      <Icon name="signal" size={10} color={dark ? "#111" : "#fff"} />
      <Icon name="wifi" size={10} color={dark ? "#111" : "#fff"} style={{ marginHorizontal: 3 }} />
      <View style={simStyles.batteryContainer}>
        <View style={[simStyles.batteryFillSmall, {
          width: `${batteryLevel}%`,
          backgroundColor: batteryLevel < 20 ? "#ef4444" : dark ? "#111" : "#fff"
        }]} />
      </View>
    </View>
  </View>
);

// ─── 1. Phone Anatomy Simulator ───────────────────────────────────────────────
const PhoneAnatomySimulator = ({ onSuccess }) => {
  const [identified, setIdentified] = useState(new Set());
  const [highlighted, setHighlighted] = useState(null);

  const parts = [
    { id: "notch", name: "Notch / Camera", desc: "Ito ang harap na kamera at sensor." },
    { id: "screen", name: "Screen", desc: "Ito ang touch screen – dito ka nag-ta-tap at nag-si-swipe." },
    { id: "volume", name: "Volume Buttons", desc: "Pataas o pababa ang volume gamit ang mga button na ito." },
    { id: "power", name: "Power Button", desc: "Pindutin ito para i-on o i-off ang phone." },
    { id: "home", name: "Home Indicator", desc: "I-swipe pataas para bumalik sa Home Screen." },
  ];

  const tap = (part) => {
    if (identified.has(part.id)) return;
    Vibration.vibrate(15);
    setHighlighted(part.id);
    const updated = new Set([...identified, part.id]);
    setIdentified(updated);
    TTS.speak(part.desc);
    setTimeout(() => setHighlighted(null), 1000);
    if (updated.size >= 5) setTimeout(onSuccess, 1200);
  };

  return (
    <View style={simStyles.container}>
      <Text style={simStyles.title}>I-tap ang bawat bahagi ng phone para malaman ang tungkulin nito</Text>

      <View style={phoneStyles.shell}>
        {/* Left side volume */}
        <View style={phoneStyles.leftSide}>
          <TouchableOpacity
            style={[phoneStyles.volBtn, identified.has("volume") && simStyles.identifiedBtn, highlighted === "volume" && simStyles.highlightedBtn]}
            onPress={() => tap(parts[2])}
          >
            <View style={phoneStyles.volBtnInner} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[phoneStyles.volBtn, { marginTop: 6 }, identified.has("volume") && simStyles.identifiedBtn, highlighted === "volume" && simStyles.highlightedBtn]}
            onPress={() => tap(parts[2])}
          >
            <View style={phoneStyles.volBtnInner} />
          </TouchableOpacity>
        </View>

        <View style={phoneStyles.body}>
          {/* Notch */}
          <TouchableOpacity
            style={[phoneStyles.notch, identified.has("notch") && simStyles.identifiedNotch, highlighted === "notch" && simStyles.highlightedNotch]}
            onPress={() => tap(parts[0])}
            activeOpacity={0.7}
          >
            <View style={phoneStyles.camera} />
            <View style={phoneStyles.speaker} />
          </TouchableOpacity>

          {/* Screen */}
          <TouchableOpacity
            style={[phoneStyles.screen, identified.has("screen") && { borderColor: "#10B981", borderWidth: 2 }]}
            onPress={() => tap(parts[1])}
            activeOpacity={0.85}
          >
            <View style={[simStyles.lockBg, highlighted === "screen" && { backgroundColor: "#F59E0B" }]}>
              <StatusBar />
              <View style={simStyles.clockCenter}>
                <Text style={simStyles.bigClock}>9:41</Text>
                <Text style={simStyles.clockSub}>Martes, Setyembre 10</Text>
              </View>
              <View style={simStyles.slideUp}>
                <Icon name="chevron-up" size={14} color="rgba(255,255,255,0.7)" />
                <Text style={simStyles.slideUpText}>I-swipe pataas</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Home indicator */}
          <TouchableOpacity
            style={[phoneStyles.homeIndicatorWrap, identified.has("home") && simStyles.identifiedHome, highlighted === "home" && simStyles.highlightedHome]}
            onPress={() => tap(parts[4])}
          >
            <View style={[phoneStyles.homeIndicator, identified.has("home") && { backgroundColor: "#10B981" }]} />
          </TouchableOpacity>
        </View>

        {/* Right power */}
        <View style={phoneStyles.rightSide}>
          <TouchableOpacity
            style={[phoneStyles.powerBtn, identified.has("power") && simStyles.identifiedBtn, highlighted === "power" && simStyles.highlightedBtn]}
            onPress={() => tap(parts[3])}
          >
            <View style={phoneStyles.powerBtnInner} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={simStyles.progressPill}>
        <Text style={simStyles.progressText}>{identified.size}/5 bahagi na natukoy</Text>
      </View>

      {/* Label guide */}
      <View style={simStyles.labelGuide}>
        {parts.map(p => (
          <View key={p.id} style={simStyles.labelRow}>
            <Icon name={identified.has(p.id) ? "check-circle" : "circle"} size={12} color={identified.has(p.id) ? "#10B981" : "#CBD5E1"} />
            <Text style={[simStyles.labelText, identified.has(p.id) && { color: "#10B981" }]}>{p.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── 2. Power On/Off Simulator ────────────────────────────────────────────────
const PowerSimulator = ({ onSuccess }) => {
  const [state, setState] = useState("off"); // off | booting | on
  const [held, setHeld] = useState(0);
  const [succeeded, setSucceeded] = useState(false);
  const intervalRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const startPress = () => {
    if (state !== "off") return;
    intervalRef.current = setInterval(() => {
      setHeld(p => p + 100);
    }, 100);
    Animated.timing(progressAnim, { toValue: 1, duration: 2000, useNativeDriver: false }).start();
  };

  const endPress = () => {
    clearInterval(intervalRef.current);
    progressAnim.stopAnimation();
    if (held >= 1800 && state === "off") {
      Vibration.vibrate(30);
      setState("booting");
      setTimeout(() => {
        setState("on");
        if (!succeeded) { setSucceeded(true); onSuccess(); }
        TTS.speak("Nag-on na ang phone!");
      }, 1500);
    } else if (state === "on") {
      Vibration.vibrate(15);
      setState("off");
      setHeld(0);
      progressAnim.setValue(0);
      TTS.speak("Na-off ang phone.");
    } else {
      progressAnim.setValue(0);
    }
    setHeld(0);
  };

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <View style={simStyles.container}>
      <Text style={simStyles.title}>
        {state === "off" ? "Pindutin at hawakan ang Power Button ng 2 segundo para i-on ang phone" :
          state === "booting" ? "Nagsisimula ang phone..." : "Naka-on na! I-tap ang Power para i-off."}
      </Text>

      <PhoneShell
        powerHighlight={held > 0 || state === "on"}
        onPowerPressIn={startPress}
        onPowerPressOut={endPress}
        onVolumeUp={() => {}}
        onVolumeDown={() => {}}
      >
        {state === "off" && (
          <View style={simStyles.blackScreen}>
            <Icon name="mobile-alt" size={32} color="rgba(255,255,255,0.15)" />
            <Text style={simStyles.offText}>Hawakan ang Power Button →</Text>
          </View>
        )}
        {state === "booting" && (
          <View style={simStyles.bootScreen}>
            <View style={simStyles.brandLogo}>
              <Icon name="mobile-alt" size={48} color="#fff" />
            </View>
            <Text style={simStyles.brandText}>SmartPhone</Text>
            <View style={simStyles.bootLoader}>
              <View style={simStyles.bootLoaderFill} />
            </View>
          </View>
        )}
        {state === "on" && (
          <View style={simStyles.lockBg}>
            <StatusBar />
            <View style={simStyles.clockCenter}>
              <Text style={simStyles.bigClock}>9:41</Text>
              <Text style={simStyles.clockSub}>Martes, Setyembre 10</Text>
            </View>
            <View style={simStyles.slideUp}>
              <Icon name="chevron-up" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={simStyles.slideUpText}>Phone naka-on na!</Text>
            </View>
          </View>
        )}
      </PhoneShell>

      {held > 0 && state === "off" && (
        <View style={simStyles.holdBar}>
          <Animated.View style={[simStyles.holdBarFill, { width: progressWidth }]} />
          <Text style={simStyles.holdText}>Hawakan...</Text>
        </View>
      )}
    </View>
  );
};

// ─── 3. Unlock Simulator ──────────────────────────────────────────────────────
const UnlockSimulator = ({ onSuccess }) => {
  const [locked, setLocked] = useState(true);
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState("swipe"); // swipe | pin
  const [succeeded, setSucceeded] = useState(false);
  const swipeX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => locked && mode === "swipe",
    onMoveShouldSetPanResponder: (_, g) => locked && mode === "swipe" && Math.abs(g.dx) > 8,
    onPanResponderMove: Animated.event([null, { dx: swipeX }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (g.dx > 80) {
        Vibration.vibrate(20);
        setLocked(false);
        if (!succeeded) { setSucceeded(true); onSuccess(); }
        TTS.speak("Na-unlock ang phone!");
      } else {
        Animated.spring(swipeX, { toValue: 0, useNativeDriver: false }).start();
      }
    },
  })).current;

  const handlePin = (digit) => {
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin === "1234") {
      Vibration.vibrate(20);
      setLocked(false);
      if (!succeeded) { setSucceeded(true); onSuccess(); }
      TTS.speak("Tamang PIN! Na-unlock ang phone!");
    } else if (newPin.length >= 4) {
      TTS.speak("Maling PIN. Subukan ulit.");
      setTimeout(() => setPin(""), 500);
    }
  };

  const clearPin = () => setPin(p => p.slice(0, -1));

  return (
    <View style={simStyles.container}>
      <Text style={simStyles.title}>
        {locked ? (mode === "swipe" ? "I-swipe papunta sa kanan para i-unlock, O gamitin ang PIN" : "I-type ang PIN: 1-2-3-4") : "Na-unlock na ang phone!"}
      </Text>

      <PhoneShell onVolumeUp={() => {}} onVolumeDown={() => {}} onPowerPressIn={() => {}} onPowerPressOut={() => {}}>
        {locked ? (
          <View style={simStyles.lockBg}>
            <StatusBar />
            <View style={simStyles.clockCenter}>
              <Text style={simStyles.bigClock}>9:41</Text>
              <Text style={simStyles.clockSub}>Martes, Setyembre 10</Text>
              <Icon name="lock" size={20} color="rgba(255,255,255,0.6)" style={{ marginTop: 12 }} />
            </View>

            {mode === "swipe" ? (
              <View style={simStyles.swipeZone} {...panResponder.panHandlers}>
                <Animated.View style={[simStyles.swipeHandle, { transform: [{ translateX: swipeX }] }]}>
                  <Icon name="chevron-right" size={14} color="#fff" />
                  <Text style={simStyles.swipeHandleText}>I-swipe →</Text>
                </Animated.View>
              </View>
            ) : (
              <View style={simStyles.pinDisplay}>
                {[0,1,2,3].map(i => (
                  <View key={i} style={[simStyles.pinDot, pin.length > i && simStyles.pinDotFilled]} />
                ))}
              </View>
            )}

            <TouchableOpacity style={simStyles.modeToggle} onPress={() => { setMode(m => m === "swipe" ? "pin" : "swipe"); setPin(""); }}>
              <Text style={simStyles.modeToggleText}>{mode === "swipe" ? "Gamitin ang PIN" : "I-swipe para mag-unlock"}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={simStyles.homeScreenFull}>
            <StatusBar />
            <View style={simStyles.homeAppGrid}>
              {[["phone","#10B981"],["comment","#3B82F6"],["camera","#8B5CF6"],["envelope","#EF4444"],
                ["globe","#F59E0B"],["music","#EC4899"],["map-marker-alt","#14B8A6"],["cog","#6B7280"]].map(([ic,cl],i) => (
                <View key={i} style={simStyles.homeApp}>
                  <View style={[simStyles.homeAppIcon, { backgroundColor: cl }]}>
                    <Icon name={ic} size={20} color="#fff" />
                  </View>
                  <Text style={simStyles.homeAppLabel}>{["Telepono","Mensahe","Kamera","Gmail","Browser","Musika","Mapa","Settings"][i]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </PhoneShell>

      {/* PIN pad shown below phone when in pin mode */}
      {locked && mode === "pin" && (
        <View style={simStyles.pinPad}>
          {[["1","2","3"],["4","5","6"],["7","8","9"],["","0","⌫"]].map((row, ri) => (
            <View key={ri} style={simStyles.pinRow}>
              {row.map((d, di) => (
                <TouchableOpacity
                  key={di}
                  style={[simStyles.pinKey, d === "" && { opacity: 0 }]}
                  onPress={() => d === "⌫" ? clearPin() : d !== "" && handlePin(d)}
                  disabled={d === ""}
                >
                  <Text style={simStyles.pinKeyText}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── 4. Touchscreen Gestures ──────────────────────────────────────────────────
const TouchSimulator = ({ onSuccess }) => {
  const [done, setDone] = useState({ tap: false, swipe: false, pinch: false });
  const [active, setActive] = useState(null);
  const swipeX = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const complete = (gesture) => {
    const updated = { ...done, [gesture]: true };
    setDone(updated);
    if (Object.values(updated).every(Boolean)) setTimeout(onSuccess, 600);
  };

  const handleTap = () => {
    if (done.tap) return;
    Vibration.vibrate(10);
    setActive("tap");
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    TTS.speak("Magaling! Nag-tap ka.");
    setTimeout(() => { setActive(null); complete("tap"); }, 600);
  };

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !done.swipe,
    onMoveShouldSetPanResponder: (_, g) => !done.swipe && Math.abs(g.dx) > 10,
    onPanResponderMove: Animated.event([null, { dx: swipeX }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (g.dx > 70 && !done.swipe) {
        setActive("swipe");
        TTS.speak("Magaling! Nag-swipe ka.");
        swipeX.setValue(0);
        setTimeout(() => { setActive(null); complete("swipe"); }, 600);
      } else {
        Animated.spring(swipeX, { toValue: 0, useNativeDriver: false }).start();
      }
    },
  })).current;

  const handlePinch = () => {
    if (done.pinch) return;
    Vibration.vibrate(15);
    setActive("pinch");
    TTS.speak("Magaling! Nag-pinch ka.");
    setTimeout(() => { setActive(null); complete("pinch"); }, 600);
  };

  const gestures = [
    { key: "tap", icon: "hand-point-up", label: "Tap", sub: "Pindutin nang isang beses", action: handleTap },
    { key: "swipe", icon: "hand-paper", label: "Swipe", sub: "I-drag papunta sa kanan", action: null },
    { key: "pinch", icon: "compress-arrows-alt", label: "Pinch/Zoom", sub: "Hawakan ng matagal", action: handlePinch },
  ];

  return (
    <View style={simStyles.container}>
      <Text style={simStyles.title}>Subukan ang tatlong paraan ng pag-touch sa screen</Text>

      <PhoneShell onVolumeUp={() => {}} onVolumeDown={() => {}} onPowerPressIn={() => {}} onPowerPressOut={() => {}}>
        <View style={simStyles.gestureScreen}>
          <StatusBar />
          <View style={{ flex: 1, justifyContent: "space-evenly", alignItems: "center", padding: 12 }}>
            {/* Tap */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }], width: "100%" }}>
              <TouchableOpacity
                style={[simStyles.gestureTile, done.tap && simStyles.gestureTileDone, active === "tap" && simStyles.gestureTileActive]}
                onPress={handleTap}
                activeOpacity={0.7}
              >
                <Icon name="hand-point-up" size={22} color={done.tap ? "#10B981" : "#38BDF8"} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={simStyles.gestureName}>Tap</Text>
                  <Text style={simStyles.gestureSub}>I-tap ang kahon na ito</Text>
                </View>
                {done.tap && <Icon name="check-circle" size={18} color="#10B981" />}
              </TouchableOpacity>
            </Animated.View>

            {/* Swipe */}
            <Animated.View style={{ transform: [{ translateX: swipeX }], width: "100%" }} {...panResponder.panHandlers}>
              <View style={[simStyles.gestureTile, done.swipe && simStyles.gestureTileDone, active === "swipe" && simStyles.gestureTileActive]}>
                <Icon name="hand-paper" size={22} color={done.swipe ? "#10B981" : "#38BDF8"} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={simStyles.gestureName}>Swipe →</Text>
                  <Text style={simStyles.gestureSub}>I-drag papunta sa kanan</Text>
                </View>
                {done.swipe && <Icon name="check-circle" size={18} color="#10B981" />}
              </View>
            </Animated.View>

            {/* Pinch */}
            <TouchableOpacity
              style={[simStyles.gestureTile, done.pinch && simStyles.gestureTileDone, active === "pinch" && simStyles.gestureTileActive]}
              onLongPress={handlePinch}
              delayLongPress={300}
              activeOpacity={0.7}
            >
              <Icon name="compress-arrows-alt" size={22} color={done.pinch ? "#10B981" : "#38BDF8"} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={simStyles.gestureName}>Pinch/Zoom</Text>
                <Text style={simStyles.gestureSub}>Hawakan ng matagal</Text>
              </View>
              {done.pinch && <Icon name="check-circle" size={18} color="#10B981" />}
            </TouchableOpacity>
          </View>
        </View>
      </PhoneShell>

      <View style={simStyles.progressPill}>
        <Text style={simStyles.progressText}>{Object.values(done).filter(Boolean).length}/3 gestures nagawa na</Text>
      </View>
    </View>
  );
};

// ─── 5. Volume & Brightness ───────────────────────────────────────────────────
const VolumeSimulator = ({ onSuccess }) => {
  const [volume, setVolume] = useState(30);
  const [brightness, setBrightness] = useState(30);
  const [showVol, setShowVol] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const volTimer = useRef(null);

  const check = (v, b) => {
    if (v >= 75 && b >= 75 && !succeeded) {
      setSucceeded(true);
      TTS.speak("Magaling! Na-adjust mo na ang volume at brightness!");
      setTimeout(onSuccess, 800);
    }
  };

  const onVol = (val) => {
    const v = Math.round(val);
    setVolume(v);
    setShowVol(true);
    clearTimeout(volTimer.current);
    volTimer.current = setTimeout(() => setShowVol(false), 1500);
    check(v, brightness);
  };

  const onBright = (val) => {
    const b = Math.round(val);
    setBrightness(b);
    check(volume, b);
  };

  const physVol = (dir) => {
    const v = Math.min(100, Math.max(0, volume + (dir === "up" ? 10 : -10)));
    Vibration.vibrate(8);
    setVolume(v);
    setShowVol(true);
    clearTimeout(volTimer.current);
    volTimer.current = setTimeout(() => setShowVol(false), 1500);
    check(v, brightness);
  };

  return (
    <View style={simStyles.container}>
      <Text style={simStyles.title}>I-adjust ang volume at brightness sa 75% o mas mataas gamit ang mga slider</Text>

      <PhoneShell
        onVolumeUp={() => physVol("up")}
        onVolumeDown={() => physVol("down")}
        onPowerPressIn={() => {}}
        onPowerPressOut={() => {}}
      >
        <View style={[simStyles.settingsScreen, { opacity: 0.4 + (brightness / 100) * 0.6 }]}>
          <StatusBar />

          {/* Volume OSD */}
          {showVol && (
            <View style={simStyles.volOSD}>
              <Icon name={volume === 0 ? "volume-mute" : volume < 50 ? "volume-down" : "volume-up"} size={14} color="#fff" />
              <View style={simStyles.volOSDBar}>
                <View style={[simStyles.volOSDFill, { width: `${volume}%` }]} />
              </View>
              <Text style={simStyles.volOSDText}>{volume}</Text>
            </View>
          )}

          <Text style={simStyles.settingTitle}>Settings</Text>

          {/* Volume row */}
          <View style={simStyles.settingRow}>
            <Icon name="volume-up" size={14} color="#38BDF8" />
            <Text style={simStyles.settingLabel}>Volume</Text>
            <Text style={[simStyles.settingVal, volume >= 75 && { color: "#10B981" }]}>{volume}%</Text>
          </View>
          <Slider style={{ width: "100%", height: 28 }} value={volume} onValueChange={onVol}
            minimumValue={0} maximumValue={100} step={5}
            minimumTrackTintColor="#38BDF8" maximumTrackTintColor="#374151" thumbTintColor="#38BDF8" />

          {/* Brightness row */}
          <View style={[simStyles.settingRow, { marginTop: 8 }]}>
            <Icon name="sun" size={14} color="#F59E0B" />
            <Text style={simStyles.settingLabel}>Liwanag</Text>
            <Text style={[simStyles.settingVal, brightness >= 75 && { color: "#10B981" }]}>{brightness}%</Text>
          </View>
          <Slider style={{ width: "100%", height: 28 }} value={brightness} onValueChange={onBright}
            minimumValue={0} maximumValue={100} step={5}
            minimumTrackTintColor="#F59E0B" maximumTrackTintColor="#374151" thumbTintColor="#F59E0B" />

          <View style={simStyles.targetHint}>
            <Icon name="info-circle" size={10} color="#64748B" />
            <Text style={simStyles.targetHintText}>Target: 75% o mas mataas para sa dalawa</Text>
          </View>
        </View>
      </PhoneShell>

      <View style={simStyles.twoProgress}>
        <View style={[simStyles.miniProgress, { backgroundColor: volume >= 75 ? "#10B981" : "#E2E8F0" }]}>
          <Icon name="volume-up" size={10} color={volume >= 75 ? "#fff" : "#94A3B8"} />
          <Text style={[simStyles.miniProgressText, { color: volume >= 75 ? "#fff" : "#94A3B8" }]}>Vol {volume}%</Text>
        </View>
        <View style={[simStyles.miniProgress, { backgroundColor: brightness >= 75 ? "#F59E0B" : "#E2E8F0" }]}>
          <Icon name="sun" size={10} color={brightness >= 75 ? "#fff" : "#94A3B8"} />
          <Text style={[simStyles.miniProgressText, { color: brightness >= 75 ? "#fff" : "#94A3B8" }]}>Liwanag {brightness}%</Text>
        </View>
      </View>
    </View>
  );
};

// ─── 6. Call Simulator ────────────────────────────────────────────────────────
const CallSimulator = ({ onSuccess }) => {
  const [state, setState] = useState("incoming"); // incoming | answered | ended
  const [duration, setDuration] = useState(0);
  const [succeeded, setSucceeded] = useState(false);
  const timerRef = useRef(null);
  const ringAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === "incoming") {
      Animated.loop(Animated.sequence([
        Animated.timing(ringAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(ringAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])).start();
    } else {
      ringAnim.stopAnimation();
      ringAnim.setValue(1);
    }
    if (state === "answered") {
      timerRef.current = setInterval(() => setDuration(p => p + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [state]);

  const answer = () => {
    Vibration.vibrate(20);
    setState("answered");
    if (!succeeded) { setSucceeded(true); onSuccess(); }
    TTS.speak("Sinagot ang tawag!");
  };

  const decline = () => {
    Vibration.vibrate(20);
    setState("ended");
    if (!succeeded) { setSucceeded(true); onSuccess(); }
    TTS.speak("Tinanggihan ang tawag.");
  };

  const end = () => {
    clearInterval(timerRef.current);
    Vibration.vibrate(15);
    setState("ended");
    TTS.speak("Natapos na ang tawag.");
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <View style={simStyles.container}>
      <Text style={simStyles.title}>
        {state === "incoming" ? "May tumatawag! I-tap ang berdeng button para sumagot o pula para tanggihan" :
          state === "answered" ? "Kasalukuyang nag-uusap. I-tap ang pula para tapusin ang tawag." :
          "Natapos na ang tawag."}
      </Text>

      <PhoneShell onVolumeUp={() => {}} onVolumeDown={() => {}} onPowerPressIn={() => {}} onPowerPressOut={() => {}}>
        <View style={simStyles.callScreen}>
          <StatusBar />
          <View style={{ flex: 1, justifyContent: "space-between", paddingBottom: 24, alignItems: "center" }}>
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Animated.View style={[simStyles.callerAvatar, state === "incoming" && { transform: [{ scale: ringAnim }] }]}>
                <Text style={simStyles.callerInitial}>M</Text>
              </Animated.View>
              <Text style={simStyles.callerName}>Nanay</Text>
              <Text style={simStyles.callerNum}>+63 912 345 6789</Text>
              <Text style={simStyles.callStatus}>
                {state === "incoming" ? "Tumatawag..." :
                  state === "answered" ? fmt(duration) : "Natapos"}
              </Text>
            </View>

            {state === "incoming" && (
              <View style={simStyles.callBtns}>
                <TouchableOpacity style={simStyles.declineBtn} onPress={decline}>
                  <Icon name="phone-slash" size={22} color="#fff" />
                  <Text style={simStyles.callBtnLabel}>Tanggihan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={simStyles.answerBtn} onPress={answer}>
                  <Icon name="phone" size={22} color="#fff" />
                  <Text style={simStyles.callBtnLabel}>Sagutin</Text>
                </TouchableOpacity>
              </View>
            )}

            {state === "answered" && (
              <View>
                <View style={simStyles.callOptions}>
                  {[["microphone-slash","Mute"],["volume-up","Speaker"],["pause","Hold"]].map(([ic, lb]) => (
                    <View key={lb} style={simStyles.callOption}>
                      <View style={simStyles.callOptIcon}><Icon name={ic} size={16} color="#fff" /></View>
                      <Text style={simStyles.callOptLabel}>{lb}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={[simStyles.declineBtn, { alignSelf: "center", marginTop: 12, flexDirection: "row" }]} onPress={end}>
                  <Icon name="phone-slash" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            {state === "ended" && (
              <View style={{ alignItems: "center" }}>
                <Icon name="phone-slash" size={32} color="#64748B" />
                <Text style={{ color: "#9CA3AF", marginTop: 8, fontSize: 13 }}>Tawag ay natapos</Text>
              </View>
            )}
          </View>
        </View>
      </PhoneShell>
    </View>
  );
};

// ─── 7. Messages Simulator ────────────────────────────────────────────────────
const MessageSimulator = ({ onSuccess }) => {
  const [msgs, setMsgs] = useState([
    { id: 1, text: "Kumusta ka na? Ligtas ka ba?", sender: "contact", time: "9:30" },
  ]);
  const [input, setInput] = useState("");
  const [sent, setSent] = useState(false);
  const scrollRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), text: input, sender: "user", time: "9:41" };
    const updated = [...msgs, newMsg];
    setMsgs(updated);
    setInput("");
    Vibration.vibrate(12);
    TTS.speak("Naipadala ang mensahe!");
    if (!sent) { setSent(true); onSuccess(); }

    // Auto reply after 1.2s
    setTimeout(() => {
      setMsgs(p => [...p, { id: Date.now() + 1, text: "Salamat! Ingat ka rin!", sender: "contact", time: "9:41" }]);
    }, 1200);
  };

  return (
    <View style={simStyles.container}>
      <Text style={simStyles.title}>I-type ang kahit anong mensahe at i-tap ang "Send" para ipadala</Text>

      <PhoneShell onVolumeUp={() => {}} onVolumeDown={() => {}} onPowerPressIn={() => {}} onPowerPressOut={() => {}}>
        <View style={simStyles.msgScreen}>
          {/* Header */}
          <View style={simStyles.msgHeader}>
            <Icon name="chevron-left" size={12} color="#38BDF8" />
            <View style={simStyles.msgContact}>
              <View style={simStyles.msgAvatar}><Text style={{ color: "#fff", fontWeight: "700", fontSize: 11 }}>N</Text></View>
              <View>
                <Text style={simStyles.msgName}>Nanay</Text>
                <Text style={simStyles.msgOnline}>Online</Text>
              </View>
            </View>
            <Icon name="phone" size={12} color="#38BDF8" />
          </View>

          {/* Messages */}
          <ScrollView ref={scrollRef} style={simStyles.msgList} contentContainerStyle={{ padding: 8, paddingBottom: 4 }}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}>
            {msgs.map(m => (
              <View key={m.id} style={[simStyles.bubble, m.sender === "user" ? simStyles.bubbleUser : simStyles.bubbleContact]}>
                <Text style={simStyles.bubbleText}>{m.text}</Text>
                <Text style={simStyles.bubbleTime}>{m.time}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={simStyles.msgInput}>
            <TextInput
              style={simStyles.msgTextInput}
              value={input}
              onChangeText={setInput}
              placeholder="Mag-type ng mensahe..."
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="send"
              onSubmitEditing={send}
            />
            <TouchableOpacity style={[simStyles.sendBtn, input.trim() && simStyles.sendBtnActive]} onPress={send} disabled={!input.trim()}>
              <Icon name="paper-plane" size={11} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </PhoneShell>

      <View style={simStyles.hintPill}>
        <Icon name="lightbulb" size={10} color="#F59E0B" />
        <Text style={simStyles.hintText}>Hint: I-type ang kahit anong salita, halimbawa "Kumusta!"</Text>
      </View>
    </View>
  );
};

// ─── 8. App Launcher ──────────────────────────────────────────────────────────
const AppSimulator = ({ onSuccess }) => {
  const [openApp, setOpenApp] = useState(null);
  const [succeeded, setSucceeded] = useState(false);

  const apps = [
    { id: "phone", label: "Telepono", icon: "phone", color: "#10B981" },
    { id: "messages", label: "Mensahe", icon: "comment-dots", color: "#3B82F6" },
    { id: "camera", label: "Kamera", icon: "camera", color: "#8B5CF6" },
    { id: "gmail", label: "Gmail", icon: "envelope", color: "#EF4444" },
    { id: "browser", label: "Browser", icon: "globe", color: "#F59E0B" },
    { id: "maps", label: "Mapa", icon: "map-marker-alt", color: "#14B8A6" },
    { id: "gallery", label: "Gallery", icon: "images", color: "#EC4899" },
    { id: "settings", label: "Settings", icon: "cog", color: "#6B7280" },
  ];

  const open = (app) => {
    Vibration.vibrate(12);
    setOpenApp(app);
    TTS.speak(`Binuksan ang ${app.label} app!`);
    if (app.id === "camera" && !succeeded) { setSucceeded(true); setTimeout(onSuccess, 800); }
  };

  const goHome = () => setOpenApp(null);

  return (
    <View style={simStyles.container}>
      <Text style={simStyles.title}>I-tap ang app icon para buksan ito. Subukan buksan ang Camera app!</Text>

      <PhoneShell onVolumeUp={() => {}} onVolumeDown={() => {}} onPowerPressIn={() => {}} onPowerPressOut={() => {}}>
        {!openApp ? (
          <View style={simStyles.homeScreenFull}>
            <StatusBar />
            <Text style={simStyles.homeDate}>Martes, Setyembre 10</Text>
            <View style={simStyles.homeAppGrid}>
              {apps.map(app => (
                <TouchableOpacity key={app.id} style={simStyles.homeApp} onPress={() => open(app)}>
                  <View style={[simStyles.homeAppIcon, { backgroundColor: app.color }]}>
                    <Icon name={app.icon} size={20} color="#fff" />
                  </View>
                  <Text style={simStyles.homeAppLabel}>{app.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : openApp.id === "camera" ? (
          <View style={simStyles.cameraApp}>
            <StatusBar />
            <View style={simStyles.cameraViewfinder}>
              <View style={simStyles.cameraCornerTL} /><View style={simStyles.cameraCornerTR} />
              <View style={simStyles.cameraCornerBL} /><View style={simStyles.cameraCornerBR} />
              <Text style={simStyles.cameraLabel}>Camera</Text>
            </View>
            <View style={simStyles.cameraControls}>
              <TouchableOpacity style={simStyles.cameraGalleryBtn}><Icon name="images" size={16} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={simStyles.shutterBtn}><View style={simStyles.shutterInner} /></TouchableOpacity>
              <TouchableOpacity style={simStyles.cameraSwitchBtn}><Icon name="sync" size={16} color="#fff" /></TouchableOpacity>
            </View>
            <TouchableOpacity style={simStyles.backFromApp} onPress={goHome}><Icon name="arrow-left" size={12} color="#fff" /></TouchableOpacity>
          </View>
        ) : (
          <View style={simStyles.genericApp}>
            <StatusBar />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <View style={[simStyles.genericAppIcon, { backgroundColor: openApp.color }]}>
                <Icon name={openApp.icon} size={36} color="#fff" />
              </View>
              <Text style={simStyles.genericAppName}>{openApp.label}</Text>
              <Text style={simStyles.genericAppSub}>Naka-bukas ang app</Text>
            </View>
            <TouchableOpacity style={simStyles.backFromApp} onPress={goHome}><Icon name="arrow-left" size={12} color="#fff" /></TouchableOpacity>
          </View>
        )}
      </PhoneShell>

      <View style={simStyles.hintPill}>
        <Icon name="star" size={10} color="#F59E0B" />
        <Text style={simStyles.hintText}>I-tap ang Camera app para makumpleto ang lesson!</Text>
      </View>
    </View>
  );
};

// ─── 9. WiFi Simulator ────────────────────────────────────────────────────────
const WiFiSimulator = ({ onSuccess }) => {
  const [wifiOn, setWifiOn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [networks, setNetworks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pw, setPw] = useState("");
  const [connected, setConnected] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [step, setStep] = useState("off"); // off | scanning | list | password | connected

  const nets = [
    { name: "Home WiFi", bars: 3, secured: true },
    { name: "Globe_Guest", bars: 2, secured: false },
    { name: "PLDT_5G", bars: 1, secured: true },
  ];

  const toggleWifi = () => {
    if (step === "off") {
      Vibration.vibrate(10);
      setStep("scanning");
      TTS.speak("Naghahanap ng WiFi networks...");
      setTimeout(() => { setStep("list"); setNetworks(nets); }, 1800);
    } else {
      setStep("off");
      setSelected(null);
      setPw("");
      setConnected(null);
    }
  };

  const selectNet = (net) => {
    if (net.secured) { setSelected(net); setStep("password"); }
    else {
      setConnected(net);
      setStep("connected");
      TTS.speak(`Nakakonekta sa ${net.name}!`);
      if (!succeeded) { setSucceeded(true); setTimeout(onSuccess, 800); }
    }
  };

  const connect = () => {
    if (pw === "password123") {
      setConnected(selected);
      setStep("connected");
      Vibration.vibrate(20);
      TTS.speak(`Nakakonekta sa ${selected.name}!`);
      if (!succeeded) { setSucceeded(true); setTimeout(onSuccess, 800); }
    } else {
      TTS.speak("Maling password. Subukan ulit. Ang password ay password123");
      setPw("");
    }
  };

  return (
    <View style={simStyles.container}>
      <Text style={simStyles.title}>I-on ang WiFi at kumonekta sa "Home WiFi" gamit ang password na "password123"</Text>

      <PhoneShell onVolumeUp={() => {}} onVolumeDown={() => {}} onPowerPressIn={() => {}} onPowerPressOut={() => {}}>
        <View style={simStyles.wifiScreen}>
          <StatusBar />
          <View style={simStyles.wifiHeader}>
            <Text style={simStyles.wifiTitle}>WiFi</Text>
            <TouchableOpacity
              style={[simStyles.wifiToggle, step !== "off" && simStyles.wifiToggleOn]}
              onPress={toggleWifi}
            >
              <View style={[simStyles.wifiToggleThumb, step !== "off" && simStyles.wifiToggleThumbOn]} />
            </TouchableOpacity>
          </View>

          {step === "off" && (
            <View style={simStyles.wifiOffState}>
              <Icon name="wifi" size={28} color="#374151" />
              <Text style={simStyles.wifiOffText}>WiFi ay naka-off</Text>
              <Text style={simStyles.wifiOffSub}>I-tap ang switch para i-on</Text>
            </View>
          )}

          {step === "scanning" && (
            <View style={simStyles.wifiOffState}>
              <Icon name="wifi" size={28} color="#38BDF8" />
              <Text style={[simStyles.wifiOffText, { color: "#38BDF8" }]}>Naghahanap...</Text>
            </View>
          )}

          {step === "list" && (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={simStyles.wifiAvail}>Available Networks</Text>
              {nets.map((n, i) => (
                <TouchableOpacity key={i} style={[simStyles.netRow, selected?.name === n.name && simStyles.netRowSelected]} onPress={() => selectNet(n)}>
                  <Icon name="wifi" size={12} color={n.bars === 3 ? "#10B981" : n.bars === 2 ? "#F59E0B" : "#EF4444"} />
                  <Text style={simStyles.netName}>{n.name}</Text>
                  <View style={simStyles.netRight}>
                    {n.secured && <Icon name="lock" size={10} color="#6B7280" />}
                    <View style={simStyles.bars}>
                      {[1,2,3].map(b => <View key={b} style={[simStyles.bar, { height: b * 4, backgroundColor: b <= n.bars ? "#38BDF8" : "#374151" }]} />)}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {step === "password" && (
            <View style={simStyles.pwDialog}>
              <Icon name="lock" size={20} color="#38BDF8" />
              <Text style={simStyles.pwTitle}>{selected?.name}</Text>
              <Text style={simStyles.pwLabel}>Password:</Text>
              <TextInput
                style={simStyles.pwInput}
                value={pw}
                onChangeText={setPw}
                placeholder="I-type ang password..."
                placeholderTextColor="#6B7280"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={connect}
              />
              <View style={simStyles.pwActions}>
                <TouchableOpacity style={simStyles.pwCancel} onPress={() => { setStep("list"); setSelected(null); setPw(""); }}>
                  <Text style={simStyles.pwCancelText}>Kanselahin</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[simStyles.pwConnect, pw.length > 0 && simStyles.pwConnectActive]} onPress={connect}>
                  <Text style={simStyles.pwConnectText}>Kumonekta</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === "connected" && (
            <View style={simStyles.wifiConnected}>
              <Icon name="check-circle" size={32} color="#10B981" />
              <Text style={simStyles.connectedName}>{connected?.name}</Text>
              <Text style={simStyles.connectedLabel}>Nakakonekta</Text>
              <View style={simStyles.connectedDetail}>
                <Icon name="wifi" size={10} color="#10B981" />
                <Text style={simStyles.connectedIP}>192.168.1.105</Text>
              </View>
            </View>
          )}
        </View>
      </PhoneShell>

      {step === "password" && (
        <View style={simStyles.hintPill}>
          <Icon name="key" size={10} color="#F59E0B" />
          <Text style={simStyles.hintText}>Hint: Ang password ay "password123"</Text>
        </View>
      )}
    </View>
  );
};

// ─── Lessons data ─────────────────────────────────────────────────────────────
const lessons = [
  {
    title: "Mga Bahagi ng Phone",
    content: "Alamin ang bawat bahagi ng iyong smartphone: ang screen, power button, volume buttons, camera, at speaker. Mahalaga na malaman mo ang bawat isa para mas madaling gamitin ang phone.",
    simulator: PhoneAnatomySimulator,
    icon: "mobile-alt",
    color: "#3B82F6",
    duration: "5 min",
  },
  {
    title: "Pag-on at Pag-off ng Phone",
    content: "Para i-on ang phone, pindutin at hawakan ang Power Button sa loob ng 2 segundo. Para naman i-off, pindutin ang Power Button at piliin ang 'Power off' sa screen.",
    simulator: PowerSimulator,
    icon: "power-off",
    color: "#EF4444",
    duration: "3 min",
  },
  {
    title: "Pag-unlock ng Phone",
    content: "Para buksan ang iyong phone mula sa lock screen, maaari kang mag-swipe sa screen o mag-enter ng iyong PIN code. Ang PIN ay isang lihim na numero para protektahan ang iyong phone.",
    simulator: UnlockSimulator,
    icon: "lock-open",
    color: "#8B5CF6",
    duration: "4 min",
  },
  {
    title: "Paggamit ng Touchscreen",
    content: "Ang touchscreen ay ang malaking glass sa harap ng phone. Matuto ng tatlong paraan: Tap (isang pindutin), Swipe (mag-slide ng daliri), at Pinch/Zoom (palapit o palayo ang dalawang daliri).",
    simulator: TouchSimulator,
    icon: "hand-point-up",
    color: "#10B981",
    duration: "5 min",
  },
  {
    title: "Volume at Liwanag",
    content: "Maaari mong ayusin ang lakas ng tunog gamit ang Volume Buttons sa gilid ng phone, o ang slider sa Settings. Ang Liwanag naman ay ang liwanag ng screen para mas madaling makita.",
    simulator: VolumeSimulator,
    icon: "volume-up",
    color: "#F59E0B",
    duration: "3 min",
  },
  {
    title: "Pagtawag at Pagtanggap ng Tawag",
    content: "Para tumawag, buksan ang Telepono app at i-dial ang numero. Kapag may tumatawag sa iyo, i-tap ang berdeng button para sagutin, o pula para tanggihan. Maaari mo ring gamitin ang speaker para mas malinaw marinig.",
    simulator: CallSimulator,
    icon: "phone",
    color: "#10B981",
    duration: "5 min",
  },
  {
    title: "Pagpapadala ng SMS / Mensahe",
    content: "Gamitin ang Messages app para mag-text. I-tap ang pangalan ng taong gusto mong kausapin, i-type ang iyong mensahe sa kahon sa ibaba, at i-tap ang Send button para ipadala. Libre ang SMS sa karamihan ng plano.",
    simulator: MessageSimulator,
    icon: "comment-dots",
    color: "#3B82F6",
    duration: "5 min",
  },
  {
    title: "Pagbubukas ng Apps",
    content: "Ang mga app ay mga programa sa iyong phone. I-tap ang icon nito sa Home Screen para buksan. Kapag tapos na, i-tap ang Home button o mag-swipe pataas para bumalik sa Home Screen.",
    simulator: AppSimulator,
    icon: "th",
    color: "#EC4899",
    duration: "4 min",
  },
  {
    title: "Pagkonekta sa WiFi",
    content: "Ang WiFi ay nagbibigay ng libreng internet kapag naka-konekta ka sa bahay o sa coffee shop. Pumunta sa Settings, i-tap ang WiFi, piliin ang iyong network, at i-enter ang password.",
    simulator: WiFiSimulator,
    icon: "wifi",
    color: "#14B8A6",
    duration: "5 min",
  },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SmartPhoneBasicsScreen() {
  const navigation = useNavigation();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [textSize, setTextSize] = useState("medium");
  const [completed, setCompleted] = useState({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
    return () => TTS.stop();
  }, []);

  const tSize = textSize === "small" ? 14 : textSize === "large" ? 20 : 16;
  const tLine = tSize * 1.55;
  const ttSize = textSize === "small" ? 18 : textSize === "large" ? 24 : 20;

  const readLesson = (lesson) => {
    if (isReading) { TTS.stop(); setIsReading(false); return; }
    TTS.speak(`${lesson.title}. ${lesson.content}`, {
      onStart: () => setIsReading(true),
      onDone: () => setIsReading(false),
      onError: () => setIsReading(false),
    });
  };

  const openLesson = (lesson) => { setSelectedLesson(lesson); setIsModalVisible(true); };

  const closeModal = () => {
    if (isReading) { TTS.stop(); setIsReading(false); }
    setIsModalVisible(false);
    setSelectedLesson(null);
  };

  const onSuccess = (title) => {
    setCompleted(p => ({ ...p, [title]: true }));
    Alert.alert("🎉 Magaling!", "Natapos mo ang pagsasanay sa araling ito!", [{ text: "Tuloy-tuloy!", style: "default" }]);
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <View style={mainStyles.container}>
      <LinearGradient colors={['#F0F9FF','#E0F2FE','#BAE6FD','#7DD3FC','#38BDF8','#0EA5E9']} locations={[0,0.15,0.35,0.55,0.75,1]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      {/* Header */}
      <Animated.View style={[mainStyles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={mainStyles.headerTop}>
          <TouchableOpacity style={mainStyles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={16} color="#0F172A" />
            <Text style={mainStyles.backBtnText}>Back</Text>
          </TouchableOpacity>
          <View style={mainStyles.headerBadge}>
            <Icon name="mobile-alt" size={18} color="#38BDF8" />
            <Text style={mainStyles.headerBadgeText}>Smartphone Basics</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <Text style={mainStyles.headerTitle}>Matuto Gumamit ng{"\n"}Smartphone</Text>
        <View style={mainStyles.progressBar}>
          <View style={[mainStyles.progressFill, { width: `${(completedCount / lessons.length) * 100}%` }]} />
        </View>
        <Text style={mainStyles.progressLabel}>{completedCount}/{lessons.length} aralin na natapos</Text>
      </Animated.View>

      {/* Lesson List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={mainStyles.listContainer} showsVerticalScrollIndicator={false}>
        {lessons.map((lesson, idx) => (
          <TouchableOpacity key={idx} style={mainStyles.card} onPress={() => openLesson(lesson)} activeOpacity={0.88}>
            <View style={[mainStyles.cardIcon, { backgroundColor: lesson.color + "22" }]}>
              <Icon name={lesson.icon} size={26} color={lesson.color} />
              {completed[lesson.title] && (
                <View style={mainStyles.checkBadge}>
                  <Icon name="check" size={10} color="#fff" />
                </View>
              )}
            </View>
            <View style={mainStyles.cardBody}>
              <View style={mainStyles.cardTopRow}>
                <Text style={mainStyles.cardNum}>Aralin {idx + 1}</Text>
                <View style={mainStyles.durationTag}>
                  <Icon name="clock" size={9} color="#94A3B8" />
                  <Text style={mainStyles.durationText}>{lesson.duration}</Text>
                </View>
              </View>
              <Text style={mainStyles.cardTitle}>{lesson.title}</Text>
              <Text style={mainStyles.cardSub} numberOfLines={2}>{lesson.content}</Text>
              <View style={mainStyles.cardStatus}>
                <View style={[mainStyles.statusDot, { backgroundColor: completed[lesson.title] ? "#10B981" : "#38BDF8" }]} />
                <Text style={[mainStyles.statusText, { color: completed[lesson.title] ? "#10B981" : "#94A3B8" }]}>
                  {completed[lesson.title] ? "✓ Tapos na" : "Simulan ang aralin"}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={14} color="#38BDF8" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent onRequestClose={closeModal} statusBarTranslucent>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={modalStyles.overlay}>
            <View style={modalStyles.sheet}>
              {selectedLesson && (
                <>
                  {/* Modal header */}
                  <View style={modalStyles.header}>
                    <View style={[modalStyles.lessonIcon, { backgroundColor: selectedLesson.color + "22" }]}>
                      <Icon name={selectedLesson.icon} size={28} color={selectedLesson.color} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={modalStyles.lessonNum}>
                        Aralin {lessons.findIndex(l => l.title === selectedLesson.title) + 1}
                      </Text>
                      <Text style={modalStyles.lessonTitle} numberOfLines={2}>{selectedLesson.title}</Text>
                    </View>
                    <TouchableOpacity style={modalStyles.closeBtn} onPress={closeModal}>
                      <Icon name="times" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={{ flex: 1 }} contentContainerStyle={modalStyles.scrollContent}
                    showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                    {/* Content */}
                    <View style={modalStyles.contentBox}>
                      <Text style={[modalStyles.bodyText, { fontSize: tSize, lineHeight: tLine }]}>
                        {selectedLesson.content}
                      </Text>
                    </View>

                    {/* Controls */}
                    <View style={modalStyles.controls}>
                      <TouchableOpacity style={[modalStyles.ttsBtn, isReading && modalStyles.ttsBtnActive]} onPress={() => readLesson(selectedLesson)}>
                        <Icon name={isReading ? "stop" : "volume-up"} size={16} color={isReading ? "#fff" : "#38BDF8"} />
                        <Text style={[modalStyles.ttsBtnText, isReading && { color: "#fff" }]}>
                          {isReading ? "Ihinto" : "Basahin"}
                        </Text>
                      </TouchableOpacity>
                      <View style={modalStyles.sizeControls}>
                        <Text style={modalStyles.sizeLabel}>Laki:</Text>
                        {["small", "medium", "large"].map((s, i) => (
                          <TouchableOpacity key={s} style={[modalStyles.sizeBtn, textSize === s && modalStyles.sizeBtnActive]} onPress={() => setTextSize(s)}>
                            <Text style={[modalStyles.sizeBtnText, textSize === s && { color: "#fff" }]}>
                              {["A-", "A", "A+"][i]}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Practice */}
                    <View style={modalStyles.practiceBox}>
                      <View style={modalStyles.practiceHeader}>
                        <Icon name="gamepad" size={16} color="#38BDF8" />
                        <Text style={modalStyles.practiceTitle}>Pagsasanay</Text>
                        {completed[selectedLesson.title] && (
                          <View style={modalStyles.completedTag}>
                            <Icon name="check" size={10} color="#fff" />
                            <Text style={modalStyles.completedTagText}>Tapos na</Text>
                          </View>
                        )}
                      </View>
                      {React.createElement(selectedLesson.simulator, {
                        onSuccess: () => onSuccess(selectedLesson.title),
                      })}
                    </View>
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const phoneStyles = StyleSheet.create({
  shell: {
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "center",
  },
  leftSide: {
    marginRight: 2,
    paddingTop: 50,
    gap: 6,
  },
  rightSide: {
    marginLeft: 2,
    paddingTop: 65,
  },
  volBtn: {
    width: 5,
    height: 29,
    backgroundColor: "#374151",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  volBtnInner: {
    width: 3,
    height: 16,
    backgroundColor: "#4B5563",
    borderRadius: 2,
  },
  powerBtn: {
    width: 5,
    height: 44,
    backgroundColor: "#374151",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  powerBtnActive: {
    backgroundColor: "#38BDF8",
  },
  powerBtnInner: {
    width: 3,
    height: 26,
    backgroundColor: "#4B5563",
    borderRadius: 2,
  },
  body: {
    width: PHONE_W,
    height: PHONE_H,
    backgroundColor: "#111827",
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#374151",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
  },
  notch: {
    height: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#111827",
    zIndex: 10,
  },
  camera: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1F2937",
    borderWidth: 1.5,
    borderColor: "#374151",
  },
  speaker: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#1F2937",
  },
  screen: {
    flex: 1,
    backgroundColor: "#000",
    marginHorizontal: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  homeIndicatorWrap: {
    width: "100%",
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#111827",
  },
  homeIndicator: {
    width: 100,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#374151",
  },
});

const simStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  // Status bar
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: "transparent",
  },
  statusBarDark: {
    backgroundColor: "transparent",
  },
  statusTime: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  statusRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  batteryContainer: {
    width: 18,
    height: 9,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 1,
  },
  batteryFillSmall: {
    height: "100%",
    borderRadius: 1,
  },
  // Screens
  lockBg: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "space-between",
  },
  clockCenter: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  bigClock: {
    fontSize: 52,
    fontWeight: "200",
    color: "#fff",
    letterSpacing: -2,
  },
  clockSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
  slideUp: {
    alignItems: "center",
    paddingBottom: 20,
  },
  slideUpText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginTop: 2,
  },
  blackScreen: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  offText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  bootScreen: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  brandLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1E3A5F",
    justifyContent: "center",
    alignItems: "center",
  },
  brandText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },
  bootLoader: {
    width: 80,
    height: 3,
    backgroundColor: "#1E3A5F",
    borderRadius: 2,
    marginTop: 16,
    overflow: "hidden",
  },
  bootLoaderFill: {
    width: "60%",
    height: "100%",
    backgroundColor: "#38BDF8",
    borderRadius: 2,
  },
  // Hold bar
  holdBar: {
    width: "70%",
    marginTop: 16,
    alignItems: "center",
  },
  holdBarFill: {
    width: "100%",
    height: 4,
    backgroundColor: "#38BDF8",
    borderRadius: 2,
    marginBottom: 6,
  },
  holdText: {
    fontSize: 11,
    color: "#64748B",
  },
  // Home screen
  homeScreenFull: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  homeDate: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  homeAppGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 16,
    justifyContent: "center",
  },
  homeApp: {
    alignItems: "center",
    width: 52,
  },
  homeAppIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  homeAppLabel: {
    color: "#fff",
    fontSize: 9,
    marginTop: 4,
    textAlign: "center",
  },
  // Anatomy
  identifiedBtn: { backgroundColor: "#10B981" },
  highlightedBtn: { backgroundColor: "#F59E0B" },
  identifiedNotch: { backgroundColor: "#10B981" },
  highlightedNotch: { backgroundColor: "#F59E0B" },
  identifiedHome: {},
  highlightedHome: {},
  progressPill: {
    backgroundColor: "rgba(16,185,129,0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },
  labelGuide: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  labelText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  // Unlock
  swipeZone: {
    alignSelf: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
    width: "85%",
  },
  swipeHandle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    gap: 8,
  },
  swipeHandleText: {
    color: "#fff",
    fontSize: 12,
  },
  pinDisplay: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 16,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  pinDotFilled: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  modeToggle: {
    alignSelf: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modeToggleText: {
    color: "#38BDF8",
    fontSize: 11,
    textDecorationLine: "underline",
  },
  pinPad: {
    marginTop: 12,
    gap: 8,
  },
  pinRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  pinKey: {
    width: 52,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  pinKeyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  // Gestures
  gestureScreen: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  gestureTile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  gestureTileActive: {
    backgroundColor: "#1E3A5F",
    borderColor: "#38BDF8",
  },
  gestureTileDone: {
    backgroundColor: "#064E3B",
    borderColor: "#10B981",
  },
  gestureName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  gestureSub: {
    color: "#64748B",
    fontSize: 10,
    marginTop: 1,
  },
  // Settings / Volume
  settingsScreen: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 12,
  },
  settingTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 12,
    textAlign: "center",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingLabel: {
    flex: 1,
    color: "#CBD5E1",
    fontSize: 12,
  },
  settingVal: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
    width: 36,
    textAlign: "right",
  },
  targetHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    opacity: 0.7,
  },
  targetHintText: {
    fontSize: 9,
    color: "#64748B",
  },
  volOSD: {
    position: "absolute",
    top: 32,
    left: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 20,
  },
  volOSDBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#374151",
    borderRadius: 2,
  },
  volOSDFill: {
    height: "100%",
    backgroundColor: "#38BDF8",
    borderRadius: 2,
  },
  volOSDText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    width: 24,
    textAlign: "right",
  },
  twoProgress: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  miniProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  miniProgressText: {
    fontSize: 11,
    fontWeight: "600",
  },
  // Call
  callScreen: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  callerAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1E3A5F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#38BDF8",
  },
  callerInitial: {
    fontSize: 32,
    fontWeight: "700",
    color: "#38BDF8",
  },
  callerName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  callerNum: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 6,
  },
  callStatus: {
    fontSize: 12,
    color: "#38BDF8",
  },
  callBtns: {
    flexDirection: "row",
    gap: 40,
    justifyContent: "center",
  },
  declineBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  answerBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  callBtnLabel: {
    color: "#fff",
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
    position: "absolute",
    bottom: -18,
    width: 60,
    left: -2,
  },
  callOptions: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  callOption: {
    alignItems: "center",
    gap: 4,
  },
  callOptIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },
  callOptLabel: {
    color: "#94A3B8",
    fontSize: 10,
  },
  // Messages
  msgScreen: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  msgHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  msgContact: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 8,
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  msgName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  msgOnline: {
    color: "#10B981",
    fontSize: 9,
  },
  msgList: {
    flex: 1,
  },
  bubble: {
    maxWidth: "78%",
    padding: 8,
    borderRadius: 14,
    marginBottom: 6,
  },
  bubbleContact: {
    backgroundColor: "#1E293B",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: "#1D4ED8",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 17,
  },
  bubbleTime: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 9,
    marginTop: 2,
    alignSelf: "flex-end",
  },
  msgInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#111827",
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    gap: 8,
  },
  msgTextInput: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    color: "#fff",
    fontSize: 12,
    minHeight: 32,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnActive: {
    backgroundColor: "#3B82F6",
  },
  // Camera
  cameraApp: {
    flex: 1,
    backgroundColor: "#000",
  },
  cameraViewfinder: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cameraCornerTL: { position: "absolute", top: 8, left: 8, width: 20, height: 20, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#fff" },
  cameraCornerTR: { position: "absolute", top: 8, right: 8, width: 20, height: 20, borderTopWidth: 2, borderRightWidth: 2, borderColor: "#fff" },
  cameraCornerBL: { position: "absolute", bottom: 8, left: 8, width: 20, height: 20, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: "#fff" },
  cameraCornerBR: { position: "absolute", bottom: 8, right: 8, width: 20, height: 20, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#fff" },
  cameraLabel: { color: "rgba(255,255,255,0.3)", fontSize: 11 },
  cameraControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingBottom: 16,
  },
  cameraGalleryBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
  },
  cameraSwitchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
  },
  backFromApp: {
    position: "absolute",
    top: 36,
    left: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  genericApp: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  genericAppIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  genericAppName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  genericAppSub: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },
  // WiFi
  wifiScreen: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 12,
  },
  wifiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  wifiTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  wifiToggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#374151",
    padding: 2,
    justifyContent: "center",
  },
  wifiToggleOn: {
    backgroundColor: "#38BDF8",
  },
  wifiToggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
  },
  wifiToggleThumbOn: {
    alignSelf: "flex-end",
  },
  wifiOffState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  wifiOffText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
  },
  wifiOffSub: {
    color: "#64748B",
    fontSize: 11,
  },
  wifiAvail: {
    color: "#64748B",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  netRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: "transparent",
    gap: 8,
  },
  netRowSelected: {
    backgroundColor: "rgba(56,189,248,0.1)",
    borderColor: "#38BDF8",
  },
  netName: {
    flex: 1,
    color: "#fff",
    fontSize: 12,
  },
  netRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  bar: {
    width: 4,
    borderRadius: 1,
  },
  pwDialog: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
  },
  pwTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  pwLabel: {
    color: "#94A3B8",
    fontSize: 11,
    alignSelf: "flex-start",
  },
  pwInput: {
    backgroundColor: "#1E293B",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
    fontSize: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "#334155",
  },
  pwActions: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  pwCancel: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#1E293B",
    alignItems: "center",
  },
  pwCancelText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  pwConnect: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#374151",
    alignItems: "center",
  },
  pwConnectActive: {
    backgroundColor: "#38BDF8",
  },
  pwConnectText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  wifiConnected: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  connectedName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  connectedLabel: {
    color: "#10B981",
    fontSize: 12,
  },
  connectedDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  connectedIP: {
    color: "#64748B",
    fontSize: 10,
  },
  hintPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(245,158,11,0.08)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.2)",
  },
  hintText: {
    fontSize: 11,
    color: "#92400E",
    fontStyle: "italic",
  },
});

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  backBtnText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(56,189,248,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#38BDF8",
  },
  headerBadgeText: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 36,
    marginBottom: 6,
  },
  headerSub: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#38BDF8",
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    position: "relative",
  },
  checkBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  cardNum: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  durationTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  durationText: {
    fontSize: 10,
    color: "#64748B",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
    marginBottom: 6,
  },
  cardStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: "94%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#fff",
  },
  lessonIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  lessonNum: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 24,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  contentBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bodyText: {
    color: "#334155",
    lineHeight: 24,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 10,
  },
  ttsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#38BDF8",
  },
  ttsBtnActive: {
    backgroundColor: "#38BDF8",
  },
  ttsBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#38BDF8",
  },
  sizeControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sizeLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginRight: 2,
  },
  sizeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  sizeBtnActive: {
    backgroundColor: "#38BDF8",
  },
  sizeBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  practiceBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  practiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  practiceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
  },
  completedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedTagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});