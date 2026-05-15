// utils/TTSWrapper.js
import { Platform } from "react-native";
import * as Speech from "expo-speech"; // ✅ Expo-friendly

const DEFAULT_RATE = 0.8; // slower for seniors
const DEFAULT_LANG = "en-US";

const detectLanguage = (text) => {
  if (!text) return DEFAULT_LANG;
  // Simple heuristic: common Filipino/Tagalog words
  const filipinoWords = /\b(ang|ng|mga|si|ni|ako|ikaw|kayo|po|opo|salamat|magandang|bahay|kaibigan|gabi|umaga)\b/i;
  if (filipinoWords.test(text)) return "fil-PH"; // detected Filipino
  return DEFAULT_LANG;
};

const normalizeLangForPlatform = (lang) => {
  if (!lang) return DEFAULT_LANG;
  const l = lang.toLowerCase();
  // Expo Speech and some mobile engines expect 'tl-PH' rather than 'fil-PH'
  if (l.startsWith("fil")) return "tl-PH";
  return lang;
};

const chooseWebVoice = (synth, lang) => {
  const voices = synth.getVoices() || [];
  if (!voices.length) return null;
  const requested = (lang || DEFAULT_LANG).toLowerCase();
  const base = requested.split("-")[0];

  // Preferred codes for Filipino detection
  const pref = [];
  if (base === "fil") {
    pref.push("fil", "tl");
  } else {
    pref.push(base);
  }

  let found = voices.find((v) => {
    const vl = (v.lang || "").toLowerCase();
    return pref.some((p) => vl.startsWith(p));
  });

  if (!found) {
    // fallback: exact match on region or first match
    found = voices.find((v) => v.lang && v.lang.toLowerCase().includes(requested));
  }

  return found || voices[0] || null;
};

let TTSWrapper = {
  // speak(text, onDone, language?) — language optional, supports 'fil-PH'
  speak: (text, onDone, language) => {},
  stop: () => {},
};

if (Platform.OS === "web") {
  // ✅ Web: use browser SpeechSynthesis
  TTSWrapper = {
    speak: (text, onDone, language) => {
      if (!text) return;
      const synth = window.speechSynthesis;
      if (synth.speaking) synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = DEFAULT_RATE;
      const requestedLang = language || detectLanguage(text) || DEFAULT_LANG;
      // try to pick a voice that matches requested language
      const voice = chooseWebVoice(synth, requestedLang);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || requestedLang;
      } else {
        // if voices not yet loaded, wait for them
        const voices = synth.getVoices() || [];
        if (!voices.length) {
          synth.onvoiceschanged = () => {
            const v = chooseWebVoice(synth, requestedLang);
            if (v) utterance.voice = v;
            utterance.lang = requestedLang;
            if (onDone) utterance.onend = onDone;
            synth.speak(utterance);
          };
          return;
        }
        utterance.lang = requestedLang;
      }

      if (onDone) utterance.onend = onDone;
      synth.speak(utterance);
    },
    stop: () => window.speechSynthesis.cancel(),
  };
} else {
  // ✅ Mobile: Expo Speech (iOS + Android)
  TTSWrapper = {
    speak: (text, onDone, language) => {
      if (!text) return;
      Speech.stop();
      const requested = language || detectLanguage(text) || DEFAULT_LANG;
      const lang = normalizeLangForPlatform(requested);
      Speech.speak(text, {
        language: lang,
        rate: DEFAULT_RATE,
        onDone: onDone || undefined,
      });
    },
    stop: () => Speech.stop(),
  };
}

export default TTSWrapper;
