import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Alert, Platform } from "react-native";
import { Audio } from 'expo-av';
import { Ionicons } from "@expo/vector-icons";

// Tutorial modules
const TUTORIAL_MODULES = [
  { id: 'basics', title: 'Basic Internet Safety', icon: 'shield-checkmark' },
  { id: 'browsing', title: 'Safe Browsing', icon: 'globe' },
  { id: 'scams', title: 'Avoiding Scams', icon: 'warning' },
  { id: 'simulator', title: 'Practice Simulator', icon: 'desktop' }
];

// Safe browsing do's and don'ts
const SAFETY_RULES = {
  dos: [
    { text: "Tingnan ang lock icon (🔒) sa address bar", detail: "Ang lock icon ay nagpapakita na secure ang website" },
    { text: "Gumamit ng mga kilalang website", detail: "Tulad ng Google, Facebook, government websites" },
    { text: "I-update ang browser regularly", detail: "Para sa security patches at improvements" },
    { text: "Mag-logout pagkatapos gamitin", detail: "Lalo na sa shared computers" },
    { text: "Itanong sa pamilya kung hindi sigurado", detail: "Mas mabuti na magtanong kaysa magkamali" }
  ],
  donts: [
    { text: "Huwag mag-click sa suspicious links", detail: "Lalo na sa email o text messages" },
    { text: "Huwag i-download ang hindi kilala", detail: "Baka may virus o malware" },
    { text: "Huwag magbigay ng personal info sa calls", detail: "Banks ay hindi tumatawag para humingi ng password" },
    { text: "Huwag maniwala sa 'You Won' messages", detail: "Mga scam yan na nangongolekta ng info" },
    { text: "Huwag gumamit ng public WiFi para sa banking", detail: "Hindi secure ang public connections" }
  ]
};

// Scam examples for education
const SCAM_EXAMPLES = [
  {
    type: "Fake Prize",
    message: "CONGRATULATIONS! Ikaw ang nanalo ng P500,000! Click here to claim!",
    warning: "Walang libreng prize sa internet. Ito ay scam.",
    safe: false
  },
  {
    type: "Fake Bank Alert",
    message: "Your account will be closed. Click to verify your password.",
    warning: "Banks ay hindi hihihingi ng password sa email.",
    safe: false
  },
  {
    type: "Legitimate Government Site",
    message: "Welcome to Department of Health - www.doh.gov.ph",
    warning: "Ito ay legitimate government website.",
    safe: true
  }
];

// Enhanced practice scenarios with proper Tagalog
const PRACTICE_SCENARIOS = [
  {
    question: "Anong website ang mas ligtas para sa panahon?",
    options: [
      { text: "www.pagasa.dost.gov.ph", safe: true, reason: "Tama! Ito ang opisyal na website ng PAGASA" },
      { text: "free-weather-prizes.com", safe: false, reason: "Mali! Suspicious ang domain name na ito" },
      { text: "weather-click-here.xyz", safe: false, reason: "Mali! May mga salitang nakakapagtaka tulad ng click-here" }
    ]
  },
  {
    question: "May nag-email sa inyo na nagsasabing nanalo kayo ng 100,000 pesos. Ano ang gagawin ninyo?",
    options: [
      { text: "I-delete ang email", safe: true, reason: "Tama! Mga scam ang ganyang email na nagsasabing nanalo kayo" },
      { text: "I-click para tingnan", safe: false, reason: "Mali! Delikado yan - baka ma-hack ang inyong account" },
      { text: "Magbigay ng bank details", safe: false, reason: "Mali! Huwag kailanman magbigay ng personal na impormasyon" }
    ]
  },
  {
    question: "Nakita ninyo sa website na walang lock icon sa address bar. Ano ang dapat gawin?",
    options: [
      { text: "Huwag maglagay ng personal info", safe: true, reason: "Tama! Walang lock icon ay ibig sabihin hindi secure ang website" },
      { text: "Okay lang, magpatuloy", safe: false, reason: "Mali! Delikado mag-browse sa website na walang security" },
      { text: "Maglagay ng password", safe: false, reason: "Mali! Huwag maglagay ng sensitive info sa unsecure site" }
    ]
  }
];

export default function SeniorInternetTutorial() {
  const [currentModule, setCurrentModule] = useState('menu');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState('');
  const [isNarrating, setIsNarrating] = useState(false);
  const [sound, setSound] = useState(null);

  // 🔑 Replace with your Azure credentials
  const AZURE_KEY = "YOUR_AZURE_KEY";
  const AZURE_REGION = "YOUR_REGION"; // e.g., "southeastasia"
  const AZURE_ENDPOINT = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

  // Audio setup
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log('Audio setup error:', error);
      }
    };

    setupAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // 🔊 Azure TTS
  const generateAzureTTS = async (text, voice = "female") => {
    try {
      // Validate API key
      if (!AZURE_KEY || AZURE_KEY === "YOUR_AZURE_KEY") {
        throw new Error('Azure API key not configured');
      }

      // Clean and validate text
      const cleanText = text.trim().substring(0, 5000); // Limit text length
      if (!cleanText) {
        throw new Error('Empty text provided');
      }

      const voiceName = voice === "male" ? "fil-PH-AngeloNeural" : "fil-PH-BlessicaNeural";

      const ssml = `
        <speak version='1.0' xml:lang='fil-PH'>
          <voice name='${voiceName}'>
            <prosody rate='0.85' pitch='0%'>
              ${cleanText}
            </prosody>
          </voice>
        </speak>
      `;

      console.log('Making Azure TTS request...');
      const response = await fetch(AZURE_ENDPOINT, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_KEY,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        },
        body: ssml,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Azure TTS Error Response:', errorText);
        throw new Error(`Azure TTS failed: ${response.status} - ${errorText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString("base64");
      return `data:audio/mp3;base64,${base64Audio}`;
    } catch (error) {
      console.error("Azure TTS Error:", error);
      throw error;
    }
  };

  // 🎤 Enhanced narration with robust error handling
  const narrate = async (text, options = {}) => {
    if (isNarrating) {
      stopNarration();
      return;
    }

    setIsNarrating(true);

    try {
      console.log('Starting narration for:', text.substring(0, 50) + '...');
      
      // Try Azure TTS first
      try {
        const audioUri = await generateAzureTTS(text, options.voice);

        // Unload previous sound if exists
        if (sound) {
          await sound.unloadAsync();
        }

        // Load and play new audio
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { 
            shouldPlay: true,
            volume: 1.0,
            rate: 1.0,
          }
        );

        setSound(newSound);

        // Handle playback completion
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsNarrating(false);
            newSound.unloadAsync();
            setSound(null);
          }
          if (status.error) {
            console.error('Audio playback error:', status.error);
            setIsNarrating(false);
          }
        });

        console.log('Azure TTS audio playing successfully');
        return; // Success - exit function

      } catch (azureError) {
        console.warn('Azure TTS failed, falling back to device TTS:', azureError.message);

        // Fallback to device TTS
        try {
          // Import expo-speech dynamically to avoid errors if not installed
          const Speech = require('expo-speech');

          await Speech.speak(text, {
            language: "tl-PH", // Try Tagalog first
            pitch: options.voice === 'male' ? 0.8 : 1.1,
            rate: 0.65,
            quality: "enhanced",
            onDone: () => {
              setIsNarrating(false);
              console.log('Device TTS completed');
            },
            onStopped: () => {
              setIsNarrating(false);
              console.log('Device TTS stopped');
            },
            onError: (error) => {
              console.error('Device TTS error:', error);
              setIsNarrating(false);
            }
          });

          console.log('Device TTS started successfully');
          return; // Success with fallback

        } catch (deviceError) {
          console.warn('Device TTS also failed, trying alternative language codes...');

          // Try alternative language codes
          const langCodes = ['fil-PH', 'fil', 'en-PH', 'en-US'];
          let speechWorked = false;

          for (const langCode of langCodes) {
            try {
              const Speech = require('expo-speech');
              await Speech.speak(text, {
                language: langCode,
                pitch: options.voice === 'male' ? 0.8 : 1.1,
                rate: 0.65,
                onDone: () => setIsNarrating(false),
                onStopped: () => setIsNarrating(false),
                onError: () => setIsNarrating(false)
              });

              console.log(`TTS working with language: ${langCode}`);
              speechWorked = true;
              break;
            } catch (e) {
              continue; // Try next language code
            }
          }

          if (!speechWorked) {
            throw new Error('All TTS methods failed');
          }
        }
      }

    } catch (error) {
      console.error('Complete narration failure:', error);
      setIsNarrating(false);

      // Show user-friendly error message
      Alert.alert(
        'Audio Error',
        'Hindi ma-play ang audio. Subukan ulit o i-check ang internet connection.\n\n(Audio playback failed. Please try again or check internet connection.)',
        [
          { text: 'OK', style: 'default' },
          {
            text: 'Try Again',
            style: 'default',
            onPress: () => {
              // Retry after a short delay
              setTimeout(() => narrate(text, options), 1000);
            }
          }
        ]
      );
    }
  };

  // Alternative narration with male voice
  const narrateMaleVoice = async (text) => {
    return narrate(text, { voice: 'male' });
  };

  const stopNarration = async () => {
    setIsNarrating(false);
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } catch (error) {
        console.log('Stop audio error:', error);
      }
    }
  };

  const renderMainMenu = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="school" size={48} color="#1976d2" />
        <Text style={styles.title}>Internet Safety Tutorial</Text>
        <Text style={styles.subtitle}>Para sa mga Senior Citizens</Text>
        
        <View style={styles.audioControls}>
          <TouchableOpacity 
            style={[styles.audioBtn, isNarrating && styles.speakingBtn]}
            onPress={() => narrate("Maligayang pagdating sa Safe Internet Tutorial para sa mga Lolo at Lola. Dito matututo kayo kung paano mag-internet nang ligtas. Pumili ng lesson na gusto ninyong matutuhan.")}
            disabled={isNarrating}
          >
            <Ionicons name={isNarrating ? "stop" : "volume-high"} size={24} color="#fff" />
            <Text style={styles.audioBtnText}>
              {isNarrating ? "Tumutugtog..." : "Pakinggan ang Welcome"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.audioBtn, styles.maleVoiceBtn]}
            onPress={() => narrateMaleVoice("Maligayang pagdating sa Safe Internet Tutorial. Ako ay lalaking boses na tutulong sa inyo matutuhan ang internet safety.")}
            disabled={isNarrating}
          >
            <Ionicons name="person" size={24} color="#fff" />
            <Text style={styles.audioBtnText}>Lalaking Boses</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.audioBtn, styles.testBtn]}
            onPress={() => narrate("Test lang ito. Kung narinig ninyo ito, gumagana ang audio.", { voice: 'female' })}
            disabled={isNarrating}
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.audioBtnText}>Test Audio</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.moduleGrid}>
        {TUTORIAL_MODULES.map((module) => (
          <TouchableOpacity
            key={module.id}
            style={styles.moduleCard}
            onPress={() => {
              setCurrentModule(module.id);
            }}
          >
            <Ionicons name={module.icon} size={48} color="#1976d2" />
            <Text style={styles.moduleTitle}>{module.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Tip: Pindutin ang speaker icon para marinig ang bawat lesson
        </Text>
        <Text style={styles.footerSubtext}>
          Kailangan ng internet connection para sa high-quality na boses
        </Text>
      </View>
    </ScrollView>
  );

  const renderBasics = () => (
    <ScrollView style={styles.container}>
      <View style={styles.lessonHeader}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => setCurrentModule('menu')}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Bumalik</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.audioBtn, isNarrating && styles.speakingBtn]}
          onPress={() => narrate("Ang basic internet safety o kaligtasan sa internet ay nagsisimula sa pag-unawa kung paano protektahan ang inyong sarili habang nag-iinternet. Matutuhan natin ang mga dapat at hindi dapat gawin.")}
          disabled={isNarrating}
        >
          <Ionicons name={isNarrating ? "stop" : "volume-high"} size={24} color="#fff" />
          <Text style={styles.audioBtnText}>
            {isNarrating ? "Tumutugtog..." : "Pakinggan ang Lesson"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.lessonTitle}>Basic Internet Safety</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ MGA DAPAT GAWIN (DO's)</Text>
        {SAFETY_RULES.dos.map((rule, index) => (
          <TouchableOpacity
            key={index}
            style={styles.ruleCard}
            onPress={() => narrate(`${rule.text}. ${rule.detail}`)}
            disabled={isNarrating}
          >
            <Text style={styles.ruleText}>{rule.text}</Text>
            <Text style={styles.ruleDetail}>{rule.detail}</Text>
            <View style={styles.speakIconContainer}>
              <Ionicons 
                name={isNarrating ? "stop" : "volume-medium"} 
                size={20} 
                color="#1976d2" 
                style={styles.speakIcon} 
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#d32f2f' }]}>❌ MGA HUWAG GAWIN (DON'Ts)</Text>
        {SAFETY_RULES.donts.map((rule, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.ruleCard, styles.dontCard]}
            onPress={() => narrate(`${rule.text}. ${rule.detail}`)}
            disabled={isNarrating}
          >
            <Text style={styles.ruleText}>{rule.text}</Text>
            <Text style={styles.ruleDetail}>{rule.detail}</Text>
            <View style={styles.speakIconContainer}>
              <Ionicons 
                name={isNarrating ? "stop" : "volume-medium"} 
                size={20} 
                color="#d32f2f" 
                style={styles.speakIcon} 
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderScamAwareness = () => (
    <ScrollView style={styles.container}>
      <View style={styles.lessonHeader}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => setCurrentModule('menu')}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Bumalik</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.lessonTitle}>Paano Makilala ang mga Scam</Text>
      
      <TouchableOpacity 
        style={[styles.audioBtn, isNarrating && styles.speakingBtn]}
        onPress={() => narrate("Maraming uri ng scam o panloloko sa internet. Matutuhan natin kung paano sila makilala at iwasan. Ang mga scammer ay gumagamit ng iba't ibang paraan para manlinlang ng mga tao.")}
        disabled={isNarrating}
      >
        <Ionicons name={isNarrating ? "stop" : "volume-high"} size={24} color="#fff" />
        <Text style={styles.audioBtnText}>
          {isNarrating ? "Tumutugtog..." : "Pakinggan ang Introduction"}
        </Text>
      </TouchableOpacity>

      {SCAM_EXAMPLES.map((scam, index) => (
        <View key={index} style={[styles.scamCard, scam.safe ? styles.safeCard : styles.dangerCard]}>
          <Text style={styles.scamType}>{scam.type}</Text>
          <Text style={styles.scamMessage}>"{scam.message}"</Text>
          <Text style={styles.scamWarning}>{scam.warning}</Text>
          
          <TouchableOpacity 
            style={styles.listenBtn}
            onPress={() => narrate(`Halimbawa ng ${scam.type}. ${scam.message}. Paalala: ${scam.warning}`)}
            disabled={isNarrating}
          >
            <Ionicons name={isNarrating ? "stop" : "play"} size={16} color="#1976d2" />
            <Text style={styles.listenText}>
              {isNarrating ? "Tumutugtog..." : "Pakinggan"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderSimulator = () => {
    const scenario = PRACTICE_SCENARIOS[currentScenario];
    
    return (
      <View style={styles.container}>
        <View style={styles.lessonHeader}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => setCurrentModule('menu')}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backText}>Bumalik</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.lessonTitle}>Practice Simulator</Text>
        <Text style={styles.scoreText}>Score: {score}/{PRACTICE_SCENARIOS.length}</Text>
        
        <TouchableOpacity 
          style={[styles.audioBtn, isNarrating && styles.speakingBtn]}
          onPress={() => narrate(scenario.question)}
          disabled={isNarrating}
        >
          <Ionicons name={isNarrating ? "stop" : "volume-high"} size={24} color="#fff" />
          <Text style={styles.audioBtnText}>
            {isNarrating ? "Tumutugtog..." : "Pakinggan ang Tanong"}
          </Text>
        </TouchableOpacity>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{scenario.question}</Text>
          
          {scenario.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionBtn, isNarrating && styles.disabledBtn]}
              onPress={() => !isNarrating && handleOptionSelect(option)}
              disabled={isNarrating}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {showFeedback && (
          <View style={[styles.feedbackCard, showFeedback.includes('Tama') ? styles.correctFeedback : styles.wrongFeedback]}>
            <Text style={styles.feedbackText}>{showFeedback}</Text>
            <TouchableOpacity 
              style={styles.feedbackSpeakBtn}
              onPress={() => narrate(showFeedback)}
              disabled={isNarrating}
            >
              <Ionicons name={isNarrating ? "stop" : "volume-high"} size={20} color="#1976d2" />
              <Text style={styles.feedbackSpeakText}>
                {isNarrating ? "Tumutugtog..." : "Pakinggan"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const handleOptionSelect = (option) => {
    const feedback = option.safe 
      ? `✅ Tama! ${option.reason}` 
      : `❌ Mali. ${option.reason}`;
    
    setShowFeedback(feedback);
    
    if (option.safe) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentScenario < PRACTICE_SCENARIOS.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setShowFeedback('');
      } else {
        const finalScore = score + (option.safe ? 1 : 0);
        const finalMessage = `Tapos na ang practice! Nakakuha kayo ng ${finalScore} out of ${PRACTICE_SCENARIOS.length}. ${finalScore >= PRACTICE_SCENARIOS.length/2 ? 'Magaling kayo!' : 'Kailangan pa ng practice.'}`;
        Alert.alert("Practice Complete", finalMessage);
        setCurrentModule('menu');
        setCurrentScenario(0);
        setScore(0);
        setShowFeedback('');
      }
    }, 4000);
  };

  // Render current module
  switch (currentModule) {
    case 'basics':
      return renderBasics();
    case 'scams':
      return renderScamAwareness();
    case 'simulator':
      return renderSimulator();
    default:
      return renderMainMenu();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1976d2",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  audioControls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1976d2",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    opacity: 1,
  },
  maleVoiceBtn: {
    backgroundColor: "#2e7d32",
  },
  testBtn: {
    backgroundColor: "#ff9800",
  },
  speakingBtn: {
    backgroundColor: "#ff9800", // Orange when speaking
  },
  audioBtnText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  moduleGrid: {
    gap: 16,
  },
  moduleCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '600',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#666",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976d2",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 12,
  },
  ruleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
    position: 'relative',
  },
  dontCard: {
    borderLeftColor: '#d32f2f',
  },
  ruleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    paddingRight: 40,
  },
  ruleDetail: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    paddingRight: 40,
  },
  speakIconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  speakIcon: {
    // Style handled by container
  },
  disabledBtn: {
    opacity: 0.6,
  },
  scamCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  safeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  scamType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  scamMessage: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
  },
  scamWarning: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 12,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
  },
  listenText: {
    color: '#1976d2',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 16,
  },
  questionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    marginTop: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionBtn: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#1976d2',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  feedbackCard: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    elevation: 2,
  },
  correctFeedback: {
    backgroundColor: '#e8f5e9',
    borderColor: '#2e7d32',
    borderWidth: 2,
  },
  wrongFeedback: {
    backgroundColor: '#ffebee',
    borderColor: '#d32f2f',
    borderWidth: 2,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 12,
  },
  feedbackSpeakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
  },
  feedbackSpeakText: {
    color: '#1976d2',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '600',
  },
});