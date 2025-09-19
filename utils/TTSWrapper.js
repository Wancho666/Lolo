// utils/TTSWrapper.js
import { Platform } from "react-native";
import * as Speech from "expo-speech"; // ✅ Expo-friendly

let TTSWrapper = {
  speak: (text, onDone) => {},
  stop: () => {},
};

if (Platform.OS === "web") {
  // ✅ Web: use browser SpeechSynthesis
  TTSWrapper = {
    speak: (text, onDone) => {
      if (!text) return;
      const synth = window.speechSynthesis;
      if (synth.speaking) synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // slower for seniors
      utterance.lang = "en-US"; // fallback
      if (onDone) utterance.onend = onDone;

      synth.speak(utterance);
    },
    stop: () => window.speechSynthesis.cancel(),
  };
} else {
  // ✅ Mobile: Expo Speech (iOS + Android)
  TTSWrapper = {
    speak: (text, onDone) => {
      if (!text) return;
      Speech.stop();
      Speech.speak(text, {
        language: "en-US", // can switch dynamically (e.g. "fil-PH")
        rate: 0.8,
        onDone: onDone || undefined,
      });
    },
    stop: () => Speech.stop(),
  };
}

export default TTSWrapper;
