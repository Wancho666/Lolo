import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView, Dimensions, Platform } from "react-native";
import * as Speech from 'expo-speech';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// Tutorial modules
const TUTORIAL_MODULES = [
  { id: 'basics', title: 'Basic Internet Safety', icon: 'shield-checkmark', description: 'Matuto ng mga pangunahing kaligtasan sa internet' },
  { id: 'browsing', title: 'Safe Browsing Tips', icon: 'globe', description: 'Paano mag-browse nang ligtas sa internet' },
  { id: 'scams', title: 'Avoiding Scams', icon: 'warning', description: 'Makilala at iwasan ang mga scam sa internet' },
  { id: 'simulator', title: 'Practice Quiz', icon: 'desktop', description: 'Subukin ang inyong kaalaman sa interactive questions' }
];

// Safe browsing tips content
const BROWSING_TIPS = [
  {
    title: "Tingnan ang URL ng website",
    description: "Ang URL ay ang address ng website sa address bar. Tignan kung may https at lock icon.",
    example: "Tama: https://www.google.com\nMali: http://fake-google.com"
  },
  {
    title: "I-check ang spelling ng website",
    description: "Mga scam websites ay may mali sa spelling. Halimbawa: gooogle.com instead of google.com",
    example: "Tama: www.facebook.com\nMali: www.faceb00k.com"
  },
  {
    title: "Gamitin ang search engines",
    description: "Huwag mag-type ng URL directly. Gamitin ang Google o Bing para mag-search.",
    example: "I-search: Bank of the Philippine Islands official website"
  },
  {
    title: "I-verify ang contact information",
    description: "Tignan kung may contact number, address, at email ang website. Legitimate websites ay may complete information.",
    example: "Hanapin: Phone number, physical address, customer service email"
  },
  {
    title: "Magbasa ng reviews",
    description: "Bago mag-transact, magbasa ng reviews online para malaman kung legitimate ang website.",
    example: "I-search: website name reviews sa Google"
  }
];

// Safe browsing do's and don'ts - Enhanced Taglish for better TTS
const SAFETY_RULES = {
  dos: [
    { text: "Tingnan ang lock icon sa address bar", detail: "Ang lock icon ay nagpapakita na secure ang website na inyong binibisita" },
    { text: "Gamitin ang mga kilalang website", detail: "Tulad ng Google, Facebook, at mga government websites na mapagkakatiwalaan" },
    { text: "I-update ang browser regularly", detail: "Para sa security patches at mga bagong improvements" },
    { text: "Mag-logout pagkatapos gamitin", detail: "Lalo na sa shared computers o public computers" },
    { text: "Magtanong sa pamilya kung hindi sigurado", detail: "Mas mabuti na magtanong kaysa magkamali at maging biktima ng scam" },
    { text: "Gamitin ang strong passwords", detail: "Gumamit ng malakas na password na mahirap hulaan ng mga hackers" },
    { text: "I-check ang website URL", detail: "Tingnan kung tama ang spelling ng website address bago mag-click" },
    { text: "Gamitin ang antivirus software", detail: "Mag-install ng antivirus para sa proteksyon laban sa mga virus" }
  ],
  donts: [
    { text: "Huwag mag-click sa suspicious links", detail: "Lalo na sa email o text messages na hindi kilala ang sender" },
    { text: "Huwag i-download ang hindi kilala", detail: "Baka may virus o malware na makakasira sa inyong computer" },
    { text: "Huwag magbigay ng personal info sa calls", detail: "Banks ay hindi tumatawag para humingi ng password o personal details" },
    { text: "Huwag maniwala sa You Won messages", detail: "Mga scam yan na nangongolekta ng personal information para sa panloloko" },
    { text: "Huwag gumamit ng public WiFi para sa banking", detail: "Hindi secure ang public connections para sa sensitive data tulad ng banking" },
    { text: "Huwag mag-share ng password", detail: "Huwag ibigay ang password sa kahit sino, kahit pa sabihin nila na taga-bank sila" },
    { text: "Huwag mag-click sa pop-up ads", detail: "Mga pop-up ads ay maaaring may virus o scam na makakasira sa computer" },
    { text: "Huwag mag-open ng attachments na hindi kilala", detail: "Mga email attachments na hindi kilala ay maaaring may virus" }
  ]
};

// Scam examples for education - Enhanced Taglish
const SCAM_EXAMPLES = [
  {
    type: "Fake Prize Scam",
    message: "CONGRATULATIONS! Ikaw ang nanalo ng limang daang libong piso! Click here to claim!",
    warning: "Walang libreng prize sa internet. Ito ay scam na nangongolekta ng personal information para sa panloloko.",
    safe: false
  },
  {
    type: "Fake Bank Alert",
    message: "Your account will be closed. Click to verify your password.",
    warning: "Banks ay hindi hihingi ng password sa email. Ito ay scam na nagnanakaw ng inyong pera.",
    safe: false
  },
  {
    type: "Fake Tech Support",
    message: "Your computer has virus. Call this number immediately.",
    warning: "Legitimate tech support ay hindi tatawag sa inyo. Ito ay scam na nagnanakaw ng inyong pera.",
    safe: false
  },
  {
    type: "Fake Social Media",
    message: "Click here to see who viewed your profile!",
    warning: "Mga ganyang links ay scam. Huwag i-click para hindi ma-hack ang inyong account.",
    safe: false
  },
  {
    type: "Fake Government Call",
    message: "This is from BIR. You have unpaid taxes. Pay now or face arrest.",
    warning: "Government agencies ay hindi tatawag para humingi ng pera. Ito ay scam.",
    safe: false
  },
  {
    type: "Legitimate Government Site",
    message: "Welcome to Department of Health - www.doh.gov.ph",
    warning: "Ito ay legitimate government website na safe gamitin para sa official information.",
    safe: true
  }
];

// Enhanced practice scenarios with improved Taglish
const PRACTICE_SCENARIOS = [
  {
    question: "Anong website ang mas ligtas para sa weather information?",
    options: [
      { text: "www.pagasa.dost.gov.ph", safe: true, reason: "Tama! Ito ang opisyal na website ng PAGASA para sa weather information" },
      { text: "free-weather-prizes.com", safe: false, reason: "Mali! Suspicious ang domain name na may prizes - mga scam yan" },
      { text: "weather-click-here.xyz", safe: false, reason: "Mali! May mga salitang nakakapagtaka tulad ng click-here - mga scam yan" }
    ]
  },
  {
    question: "May nag-email sa inyo na nagsasabing nanalo kayo ng isang daang libong pesos. Ano ang gagawin ninyo?",
    options: [
      { text: "I-delete ang email", safe: true, reason: "Tama! Mga scam ang ganyang email na nagsasabing nanalo kayo ng pera" },
      { text: "I-click para tingnan", safe: false, reason: "Mali! Delikado yan - baka ma-hack ang inyong account at mawala ang pera" },
      { text: "Magbigay ng bank details", safe: false, reason: "Mali! Huwag kailanman magbigay ng personal na impormasyon sa mga ganyang email" }
    ]
  },
  {
    question: "Nakita ninyo sa website na walang lock icon sa address bar. Ano ang dapat gawin?",
    options: [
      { text: "Huwag maglagay ng personal info", safe: true, reason: "Tama! Walang lock icon ay ibig sabihin hindi secure ang website" },
      { text: "Okay lang, magpatuloy", safe: false, reason: "Mali! Delikado mag-browse sa website na walang security - baka ma-hack" },
      { text: "Maglagay ng password", safe: false, reason: "Mali! Huwag maglagay ng sensitive info sa unsecure site" }
    ]
  },
  {
    question: "May tumawag sa inyo na nagsasabing from bank at hihingi ng password. Ano ang gagawin ninyo?",
    options: [
      { text: "Hang up ang phone", safe: true, reason: "Tama! Banks ay hindi tatawag para humingi ng password - mga scam yan" },
      { text: "Ibigay ang password", safe: false, reason: "Mali! Huwag kailanman ibigay ang password sa calls - mga scam yan" },
      { text: "Magtanong sa bank", safe: true, reason: "Tama! Tawagan ang bank directly para i-verify kung totoo ba" }
    ]
  },
  {
    question: "Anong website ang safe para sa online banking?",
    options: [
      { text: "www.bpi.com.ph", safe: true, reason: "Tama! Ito ay official website ng BPI bank na safe gamitin" },
      { text: "bpi-free-money.com", safe: false, reason: "Mali! Suspicious ang domain name na may free-money - mga scam yan" },
      { text: "secure-banking-now.xyz", safe: false, reason: "Mali! Hindi official website ng bank - mga scam yan" }
    ]
  },
  {
    question: "May nag-text sa inyo na nagsasabing nanalo kayo ng iPhone. Ano ang gagawin ninyo?",
    options: [
      { text: "I-delete ang text message", safe: true, reason: "Tama! Mga scam ang ganyang text na nagsasabing nanalo kayo" },
      { text: "I-click ang link", safe: false, reason: "Mali! Delikado yan - baka ma-hack ang inyong phone" },
      { text: "Mag-reply ng personal info", safe: false, reason: "Mali! Huwag magbigay ng personal info sa mga ganyang text" }
    ]
  }
];

export default function InternetBrowsingScreen({ navigation }) {
  const [currentModule, setCurrentModule] = useState('menu');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState('');
  
  // FIXED: Changed from boolean to string to track which specific button is narrating
  const [currentlyNarrating, setCurrentlyNarrating] = useState(null);

  // Enhanced TTS function with individual button tracking
  const narrate = async (text, buttonId, options = {}) => {
    // If this button is already narrating, stop it
    if (currentlyNarrating === buttonId) {
      stopNarration();
      return;
    }

    // If another button is narrating, stop it first
    if (currentlyNarrating) {
      await stopNarration();
    }

    setCurrentlyNarrating(buttonId);

    try {
      await Speech.speak(text, {
        language: "fil-PH", // Filipino
        pitch: 1.0,
        rate: 0.6, // Slower for seniors
        onDone: () => {
          setCurrentlyNarrating(null);
        },
        onStopped: () => {
          setCurrentlyNarrating(null);
        },
        onError: (error) => {
          console.error('TTS error:', error);
          setCurrentlyNarrating(null);
          Alert.alert('Audio Error', 'Hindi ma-play ang audio. Subukan ulit.');
        }
      });
    } catch (error) {
      console.error('TTS failed:', error);
      setCurrentlyNarrating(null);
      Alert.alert('Audio Error', 'Hindi ma-play ang audio. Subukan ulit.');
    }
  };

  const stopNarration = async () => {
    try {
      await Speech.stop();
      setCurrentlyNarrating(null);
    } catch (error) {
      console.error('Stop error:', error);
      setCurrentlyNarrating(null);
    }
  };

  // Helper function to check if a specific button is narrating
  const isButtonNarrating = (buttonId) => currentlyNarrating === buttonId;

  // Helper function to check if any button is narrating
  const isAnyNarrating = () => currentlyNarrating !== null;

  // Stop TTS when going back
  const goBack = () => {
    stopNarration();
    if (currentModule === 'menu') {
      navigation.goBack();
    } else {
      setCurrentModule('menu');
    }
  };

  const goToModule = (moduleId) => {
    stopNarration();
    setCurrentModule(moduleId);
  };

  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  const renderMainMenu = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Enhanced Gradient Background - matching SmartPhone screen */}
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

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Enhanced Header Section - matching SmartPhone screen */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="shield-checkmark" size={32} color="#0F172A" />
            </View>
            <Text style={styles.headerTitle}>Internet Safety Tutorial</Text>
            <Text style={styles.headerSubtitle}>Para sa mga Senior Citizens</Text>
            <View style={styles.headerDivider} />
          </View>

          {/* Modules Grid */}
          <View style={styles.moduleGrid}>
            {TUTORIAL_MODULES.map((module, index) => (
              <TouchableOpacity
                key={module.id}
                style={styles.moduleCard}
                onPress={() => goToModule(module.id)}
                activeOpacity={0.92}
              >
                <View style={styles.moduleImageContainer}>
                  <View style={styles.moduleIconBg}>
                    <Ionicons name={module.icon} size={32} color="#38BDF8" />
                  </View>
                </View>
                <View style={styles.moduleContent}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleDescription}>{module.description}</Text>
                </View>
                <View style={styles.arrowIcon}>
                  <Ionicons name="chevron-forward" size={18} color="#38BDF8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              💡 Tip: Pindutin ang Read button para marinig ang bawat lesson
            </Text>
            <Text style={styles.footerSubtext}>
              Pindutin ulit ang Read button para tumigil ang audio
            </Text>
          </View>
        </ScrollView>

        {/* Back Button - positioned like SmartPhone screen */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color="#0F172A" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderBasics = () => (
    <SafeAreaView style={styles.safeArea}>
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

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.lessonHeader}>
            <Text style={styles.lessonTitle}>Basic Internet Safety</Text>
            
            <TouchableOpacity 
              style={[styles.audioBtn, isButtonNarrating('basics-main') && styles.speakingBtn]}
              onPress={() => narrate("Ang basic internet safety o kaligtasan sa internet ay nagsisimula sa pag-unawa kung paano protektahan ang inyong sarili habang nag-iinternet. Matutuhan natin ang mga dapat at hindi dapat gawin.", 'basics-main')}
            >
              <Ionicons name={isButtonNarrating('basics-main') ? "stop" : "volume-high"} size={20} color={isButtonNarrating('basics-main') ? "#fff" : "#38BDF8"} />
              <Text style={[styles.audioBtnText, isButtonNarrating('basics-main') && styles.audioBtnTextActive]}>
                {isButtonNarrating('basics-main') ? "Tumutugtog..." : "Read"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ MGA DAPAT GAWIN (DO's)</Text>
            {SAFETY_RULES.dos.map((rule, index) => (
              <TouchableOpacity
                key={index}
                style={styles.ruleCard}
                onPress={() => narrate(`${rule.text}. ${rule.detail}`, `dos-${index}`)}
              >
                <Text style={styles.ruleText}>{rule.text}</Text>
                <Text style={styles.ruleDetail}>{rule.detail}</Text>
                <View style={styles.speakIconContainer}>
                  <Ionicons 
                    name={isButtonNarrating(`dos-${index}`) ? "stop" : "volume-medium"} 
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
                onPress={() => narrate(`${rule.text}. ${rule.detail}`, `donts-${index}`)}
              >
                <Text style={styles.ruleText}>{rule.text}</Text>
                <Text style={styles.ruleDetail}>{rule.detail}</Text>
                <View style={styles.speakIconContainer}>
                  <Ionicons 
                    name={isButtonNarrating(`donts-${index}`) ? "stop" : "volume-medium"} 
                    size={20} 
                    color="#d32f2f" 
                    style={styles.speakIcon} 
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color="#0F172A" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderBrowsingTips = () => (
    <SafeAreaView style={styles.safeArea}>
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

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.lessonHeader}>
            <Text style={styles.lessonTitle}>Safe Browsing Tips</Text>
            
            <TouchableOpacity 
              style={[styles.audioBtn, isButtonNarrating('browsing-main') && styles.speakingBtn]}
              onPress={() => narrate("Ang safe browsing tips ay mga paraan para makapag-browse kayo sa internet nang ligtas. Matutuhan natin ang mga importanteng tips para maiwasan ang mga scam at virus.", 'browsing-main')}
            >
              <Ionicons name={isButtonNarrating('browsing-main') ? "stop" : "volume-high"} size={20} color={isButtonNarrating('browsing-main') ? "#fff" : "#38BDF8"} />
              <Text style={[styles.audioBtnText, isButtonNarrating('browsing-main') && styles.audioBtnTextActive]}>
                {isButtonNarrating('browsing-main') ? "Tumutugtog..." : "Read"}
              </Text>
            </TouchableOpacity>
          </View>

          {BROWSING_TIPS.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleText}>{tip.example}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.listenBtn}
                onPress={() => narrate(`${tip.title}. ${tip.description}. Halimbawa: ${tip.example}`, `browsing-tip-${index}`)}
              >
                <Ionicons name={isButtonNarrating(`browsing-tip-${index}`) ? "stop" : "play"} size={16} color="#1976d2" />
                <Text style={styles.listenText}>
                  {isButtonNarrating(`browsing-tip-${index}`) ? "Tumutugtog..." : "Read"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color="#0F172A" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderScamAwareness = () => (
    <SafeAreaView style={styles.safeArea}>
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

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.lessonHeader}>
            <Text style={styles.lessonTitle}>Paano Makilala ang mga Scam</Text>
            
            <TouchableOpacity 
              style={[styles.audioBtn, isButtonNarrating('scams-main') && styles.speakingBtn]}
              onPress={() => narrate("Maraming uri ng scam o panloloko sa internet. Matutuhan natin kung paano sila makilala at iwasan. Ang mga scammer ay gumagamit ng iba't ibang paraan para manlinlang ng mga tao.", 'scams-main')}
            >
              <Ionicons name={isButtonNarrating('scams-main') ? "stop" : "volume-high"} size={20} color={isButtonNarrating('scams-main') ? "#fff" : "#38BDF8"} />
              <Text style={[styles.audioBtnText, isButtonNarrating('scams-main') && styles.audioBtnTextActive]}>
                {isButtonNarrating('scams-main') ? "Tumutugtog..." : "Read"}
              </Text>
            </TouchableOpacity>
          </View>

          {SCAM_EXAMPLES.map((scam, index) => (
            <View key={index} style={[styles.scamCard, scam.safe ? styles.safeCard : styles.dangerCard]}>
              <Text style={styles.scamType}>{scam.type}</Text>
              <Text style={styles.scamMessage}>"{scam.message}"</Text>
              <Text style={styles.scamWarning}>{scam.warning}</Text>
              
              <TouchableOpacity 
                style={styles.listenBtn}
                onPress={() => narrate(`Halimbawa ng ${scam.type}. ${scam.message}. Paalala: ${scam.warning}`, `scam-${index}`)}
              >
                <Ionicons name={isButtonNarrating(`scam-${index}`) ? "stop" : "play"} size={16} color="#1976d2" />
                <Text style={styles.listenText}>
                  {isButtonNarrating(`scam-${index}`) ? "Tumutugtog..." : "Read"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color="#0F172A" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderSimulator = () => {
    const scenario = PRACTICE_SCENARIOS[currentScenario];
    
    return (
      <SafeAreaView style={styles.safeArea}>
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

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.lessonHeader}>
              <Text style={styles.lessonTitle}>Practice Quiz</Text>
              <Text style={styles.scoreText}>Score: {score}/{PRACTICE_SCENARIOS.length}</Text>
              
              <TouchableOpacity 
                style={[styles.audioBtn, isButtonNarrating('quiz-question') && styles.speakingBtn]}
                onPress={() => narrate(scenario.question, 'quiz-question')}
              >
                <Ionicons name={isButtonNarrating('quiz-question') ? "stop" : "volume-high"} size={20} color={isButtonNarrating('quiz-question') ? "#fff" : "#38BDF8"} />
                <Text style={[styles.audioBtnText, isButtonNarrating('quiz-question') && styles.audioBtnTextActive]}>
                  {isButtonNarrating('quiz-question') ? "Tumutugtog..." : "Read"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{scenario.question}</Text>
              
              {scenario.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionBtn}
                  onPress={() => handleOptionSelect(option)}
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
                  onPress={() => narrate(showFeedback, 'quiz-feedback')}
                >
                  <Ionicons name={isButtonNarrating('quiz-feedback') ? "stop" : "volume-high"} size={20} color="#1976d2" />
                  <Text style={styles.feedbackSpeakText}>
                    {isButtonNarrating('quiz-feedback') ? "Tumutugtog..." : "Read"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color="#0F172A" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    case 'browsing':
      return renderBrowsingTips();
    case 'scams':
      return renderScamAwareness();
    case 'simulator':
      return renderSimulator();
    default:
      return renderMainMenu();
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F9FF',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80, // Space for back button
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F9FF',
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
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '400',
  },
  headerDivider: {
    width: 60,
    height: 4,
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  moduleGrid: {
    gap: 16,
  },
  moduleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  moduleImageContainer: {
    marginRight: 16,
  },
  moduleIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  arrowIcon: {
    marginLeft: 12,
  },
  footer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 16,
    marginTop: 30,
    alignItems: 'center',
    elevation: 4,
  },
  footerText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  lessonHeader: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 20,
    elevation: 6,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  speakingBtn: {
    backgroundColor: '#38BDF8',
  },
  audioBtnText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#38BDF8',
  },
  audioBtnTextActive: {
    color: '#fff',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 16,
    textAlign: 'center',
  },
  ruleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#059669',
    position: 'relative',
  },
  dontCard: {
    borderLeftColor: '#DC2626',
  },
  ruleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
    paddingRight: 50,
    lineHeight: 24,
  },
  ruleDetail: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 22,
    paddingRight: 50,
  },
  speakIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  speakIcon: {
    // Additional styles for speak icon if needed
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
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#0EA5E9',
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  tipDescription: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  exampleContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  exampleText: {
    fontSize: 14,
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 20,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  listenText: {
    color: '#38BDF8',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
  scamCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  safeCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#059669',
  },
  dangerCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#DC2626',
  },
  scamType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  scamMessage: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#475569',
    marginBottom: 12,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    padding: 16,
    borderRadius: 8,
    lineHeight: 22,
  },
  scamWarning: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 16,
    lineHeight: 22,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 26,
  },
  optionBtn: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#38BDF8',
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    color: '#0F172A',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  feedbackCard: {
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    elevation: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  correctFeedback: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
    borderWidth: 3,
  },
  wrongFeedback: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
    borderWidth: 3,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0F172A',
    marginBottom: 16,
    lineHeight: 24,
  },
  feedbackSpeakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  feedbackSpeakText: {
    color: '#38BDF8',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
});