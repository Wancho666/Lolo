import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView, Dimensions, Platform } from "react-native";
import * as Speech from 'expo-speech';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// Tutorial modules (removed practice quiz)
const TUTORIAL_MODULES = [
  { id: 'basics', title: 'Basic Internet Safety', icon: 'shield-checkmark', description: 'Matuto ng mga pangunahing kaligtasan sa internet' },
  { id: 'browsing', title: 'Safe Browsing Tips', icon: 'globe', description: 'Paano mag-browse nang ligtas sa internet' },
  { id: 'scams', title: 'Avoiding Scams', icon: 'warning', description: 'Makilala at iwasan ang mga scam sa internet' }
];

// Safe browsing tips content with simulator examples
const BROWSING_TIPS = [
  {
    title: "Tingnan ang URL ng website",
    description: "Ang URL ay ang address ng website sa address bar. Tignan kung may https at lock icon.",
    example: "Tama: https://www.google.com\nMali: http://fake-google.com",
    simulatorType: "url"
  },
  {
    title: "I-check ang spelling ng website",
    description: "Mga scam websites ay may mali sa spelling. Halimbawa: gooogle.com instead of google.com",
    example: "Tama: www.facebook.com\nMali: www.faceb00k.com",
    simulatorType: "url"
  },
  {
    title: "Gamitin ang search engines",
    description: "Huwag mag-type ng URL directly. Gamitin ang Google o Bing para mag-search.",
    example: "I-search: Bank of the Philippine Islands official website",
    simulatorType: "search"
  },
  {
    title: "I-verify ang contact information",
    description: "Tignan kung may contact number, address, at email ang website. Legitimate websites ay may complete information.",
    example: "Hanapin: Phone number, physical address, customer service email",
    simulatorType: "contact"
  },
  {
    title: "Magbasa ng reviews",
    description: "Bago mag-transact, magbasa ng reviews online para malaman kung legitimate ang website.",
    example: "I-search: website name reviews sa Google",
    simulatorType: "reviews"
  }
];

// Enhanced scam examples with actual message format
const SCAM_EXAMPLES = [
  {
    type: "Fake Prize SMS",
    message: "CONGRATULATIONS! Ikaw ang nanalo ng P500,000! Txt CLAIM sa 2366 o click bit.ly/win500k",
    warning: "Walang libreng prize sa internet. Ito ay scam na nangongolekta ng personal information.",
    safe: false,
    simulatorType: "sms"
  },
  {
    type: "Fake Bank Email",
    message: "FROM: security@bpi-bank.net\nSUBJECT: Account Alert\nYour account will be closed. Click here to verify your password.",
    warning: "Banks ay hindi hihingi ng password sa email. Ito ay scam na nagnanakaw ng inyong pera.",
    safe: false,
    simulatorType: "email"
  },
  {
    type: "Fake Tech Support Call",
    message: "CALLER: Microsoft Support\n\"Your computer has virus. We need to access your computer remotely. Give us your password.\"",
    warning: "Microsoft ay hindi tatawag sa inyo. Ito ay scam na nagnanakaw ng inyong data.",
    safe: false,
    simulatorType: "call"
  },
  {
    type: "Fake Social Media Message",
    message: "Facebook notification: Click here to see who viewed your profile! Amazing results!",
    warning: "Facebook ay hindi nagbibigay ng feature na ito. Mga ganyang links ay scam.",
    safe: false,
    simulatorType: "social"
  },
  {
    type: "Fake Government SMS",
    message: "FROM: BIR Philippines\nYou have unpaid taxes P25,000. Pay now via GCash 09171234567 or face arrest.",
    warning: "Government agencies ay hindi nangangolekta ng bayad sa text. Ito ay scam.",
    safe: false,
    simulatorType: "sms"
  },
  {
    type: "Legitimate Government Site",
    message: "Welcome to Department of Health - www.doh.gov.ph\nSecure connection (https://) with complete contact information",
    warning: "Ito ay legitimate government website na safe gamitin para sa official information.",
    safe: true,
    simulatorType: "website"
  }
];

// Safe browsing do's and don'ts with simulator examples
const SAFETY_RULES = {
  dos: [
    { 
      text: "Tingnan ang lock icon sa address bar", 
      detail: "Ang lock icon ay nagpapakita na secure ang website na inyong binibisita",
      simulatorType: "browser"
    },
    { 
      text: "Gamitin ang mga kilalang website", 
      detail: "Tulad ng Google, Facebook, at mga government websites na mapagkakatiwalaan",
      simulatorType: "website"
    },
    { 
      text: "I-update ang browser regularly", 
      detail: "Para sa security patches at mga bagong improvements",
      simulatorType: "settings"
    },
    { 
      text: "Mag-logout pagkatapos gamitin", 
      detail: "Lalo na sa shared computers o public computers",
      simulatorType: "logout"
    },
    { 
      text: "Magtanong sa pamilya kung hindi sigurado", 
      detail: "Mas mabuti na magtanong kaysa magkamali at maging biktima ng scam",
      simulatorType: "family"
    },
    { 
      text: "Gamitin ang strong passwords", 
      detail: "Gumamit ng malakas na password na mahirap hulaan ng mga hackers",
      simulatorType: "password"
    },
    { 
      text: "I-check ang website URL", 
      detail: "Tingnan kung tama ang spelling ng website address bago mag-click",
      simulatorType: "url"
    },
    { 
      text: "Gamitin ang antivirus software", 
      detail: "Mag-install ng antivirus para sa proteksyon laban sa mga virus",
      simulatorType: "antivirus"
    }
  ],
  donts: [
    { 
      text: "Huwag mag-click sa suspicious links", 
      detail: "Lalo na sa email o text messages na hindi kilala ang sender",
      simulatorType: "suspicious_link"
    },
    { 
      text: "Huwag i-download ang hindi kilala", 
      detail: "Baka may virus o malware na makakasira sa inyong computer",
      simulatorType: "download"
    },
    { 
      text: "Huwag magbigay ng personal info sa calls", 
      detail: "Banks ay hindi tumatawag para humingi ng password o personal details",
      simulatorType: "phone_call"
    },
    { 
      text: "Huwag maniwala sa You Won messages", 
      detail: "Mga scam yan na nangongolekta ng personal information para sa panloloko",
      simulatorType: "prize_scam"
    },
    { 
      text: "Huwag gumamit ng public WiFi para sa banking", 
      detail: "Hindi secure ang public connections para sa sensitive data tulad ng banking",
      simulatorType: "wifi"
    },
    { 
      text: "Huwag mag-share ng password", 
      detail: "Huwag ibigay ang password sa kahit sino, kahit pa sabihin nila na taga-bank sila",
      simulatorType: "password_sharing"
    },
    { 
      text: "Huwag mag-click sa pop-up ads", 
      detail: "Mga pop-up ads ay maaaring may virus o scam na makakasira sa computer",
      simulatorType: "popup"
    },
    { 
      text: "Huwag mag-open ng attachments na hindi kilala", 
      detail: "Mga email attachments na hindi kilala ay maaaring may virus",
      simulatorType: "email_attachment"
    }
  ]
};

export default function InternetBrowsingScreen({ navigation }) {
  const [currentModule, setCurrentModule] = useState('menu');
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorData, setSimulatorData] = useState(null);
  
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

  // Stop TTS when going back
  const goBack = () => {
    stopNarration();
    if (showSimulator) {
      setShowSimulator(false);
      setSimulatorData(null);
    } else if (currentModule === 'menu') {
      navigation.goBack();
    } else {
      setCurrentModule('menu');
    }
  };

  // Helper function to get back button text
  const getBackButtonText = () => {
    if (showSimulator) {
      return "Back";
    } else if (currentModule === 'menu') {
      return "Back";
    } else {
      return "Back";
    }
  };

  const goToModule = (moduleId) => {
    stopNarration();
    setCurrentModule(moduleId);
  };

  const showScreenSimulator = (type, data) => {
    setSimulatorData({ type, data });
    setShowSimulator(true);
  };

  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  // Screen Simulator Component
  const renderScreenSimulator = () => {
    if (!simulatorData) return null;

    const { type, data } = simulatorData;

   const renderSimulatorContent = () => {
    switch (type) {
      case "browser":
        return (
          <View style={styles.browserSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.browserHeader}>
              <View style={[styles.addressBar, data.safe ? styles.secureBar : styles.unsecureBar]}>
                {data.safe && <Ionicons name="lock-closed" size={16} color="#059669" />}
                {!data.safe && <Ionicons name="warning" size={16} color="#DC2626" />}
                <Text style={[styles.urlText, data.safe ? styles.secureUrl : styles.unsecureUrl]}>
                  {data.safe ? "https://www.bpi.com.ph" : "http://fake-website.com"}
                </Text>
              </View>
            </View>
            <View style={styles.browserContent}>
              <Text style={styles.websiteTitle}>
                {data.safe ? "🔒 Secure Connection" : "⚠️ Not Secure"}
              </Text>
              <Text style={styles.websiteContent}>
                {data.safe 
                  ? "Ang lock icon ay nangangahulugang secure ang connection. Safe mag-browse dito!" 
                  : "Walang lock icon! Hindi secure ang website na ito. Huwag mag-input ng personal info!"}
              </Text>
              <View style={[styles.warningBubble, data.safe && { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: '#059669' }]}>
                <Ionicons name={data.safe ? "checkmark-circle" : "warning"} size={20} color={data.safe ? "#059669" : "#DC2626"} />
                <Text style={[styles.warningText, data.safe && styles.safeText]}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "url":
        return (
          <View style={styles.browserSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.browserHeader}>
              <View style={[styles.addressBar, data.safe ? styles.secureBar : styles.unsecureBar]}>
                {data.safe && <Ionicons name="lock-closed" size={16} color="#059669" />}
                {!data.safe && <Ionicons name="warning" size={16} color="#DC2626" />}
                <Text style={[styles.urlText, data.safe ? styles.secureUrl : styles.unsecureUrl]}>
                  {data.safe ? "https://www.google.com" : "http://gooogle.com"}
                </Text>
              </View>
            </View>
            <View style={styles.browserContent}>
              <View style={styles.urlComparison}>
                <Text style={styles.comparisonTitle}>✅ Tama:</Text>
                <Text style={styles.correctUrl}>https://www.facebook.com</Text>
                <Text style={styles.comparisonTitle}>❌ Mali:</Text>
                <Text style={styles.wrongUrl}>http://faceb00k.com</Text>
              </View>
              <View style={[styles.warningBubble, data.safe && { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: '#059669' }]}>
                <Ionicons name={data.safe ? "checkmark-circle" : "warning"} size={20} color={data.safe ? "#059669" : "#DC2626"} />
                <Text style={[styles.warningText, data.safe && styles.safeText]}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "search":
        return (
          <View style={styles.browserSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.browserHeader}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={16} color="#64748B" />
                <Text style={styles.searchText}>Bank of the Philippine Islands</Text>
              </View>
            </View>
            <View style={styles.browserContent}>
              <View style={styles.searchResult}>
                <Text style={styles.searchResultTitle}>🔒 Bank of the Philippine Islands</Text>
                <Text style={styles.searchResultUrl}>https://www.bpi.com.ph</Text>
                <Text style={styles.searchResultDesc}>Official website - Secure banking services</Text>
              </View>
              <View style={[styles.warningBubble, { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: '#059669' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <Text style={styles.safeText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "contact":
        return (
          <View style={styles.websiteSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.browserHeader}>
              <View style={styles.secureBar}>
                <Ionicons name="lock-closed" size={16} color="#059669" />
                <Text style={styles.secureUrl}>https://www.bpi.com.ph</Text>
              </View>
            </View>
            <View style={styles.websiteContent}>
              <Text style={styles.govTitle}>Bank of the Philippine Islands</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Complete Contact Information:</Text>
                <Text style={styles.contactText}>📞 (02) 889-10000</Text>
                <Text style={styles.contactText}>📧 customercare@bpi.com.ph</Text>
                <Text style={styles.contactText}>📍 BPI Head Office, Ayala Ave, Makati</Text>
              </View>
              <View style={[styles.warningBubble, { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: '#059669' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <Text style={styles.safeText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "reviews":
        return (
          <View style={styles.browserSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.browserHeader}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={16} color="#64748B" />
                <Text style={styles.searchText}>Online shop reviews</Text>
              </View>
            </View>
            <View style={styles.browserContent}>
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewSite}>Trustpilot</Text>
                  <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐ 4.5/5</Text>
                </View>
                <Text style={styles.reviewText}>"Legitimate website, fast delivery!"</Text>
              </View>
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewSite}>Google Reviews</Text>
                  <Text style={styles.reviewStars}>⭐⭐⭐⭐ 4.2/5</Text>
                </View>
                <Text style={styles.reviewText}>"Good customer service"</Text>
              </View>
              <View style={[styles.warningBubble, { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: '#059669' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <Text style={styles.safeText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "settings":
        return (
          <View style={styles.phoneSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Browser Settings</Text>
            </View>
            <View style={styles.settingsContent}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Auto-Update</Text>
                <View style={styles.toggleOn}>
                  <Text style={styles.toggleText}>ON</Text>
                </View>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Security Updates</Text>
                <View style={styles.toggleOn}>
                  <Text style={styles.toggleText}>ON</Text>
                </View>
              </View>
              <View style={[styles.warningBubble, { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: '#059669' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <Text style={styles.safeText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "logout":
        return (
          <View style={styles.browserSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.accountHeader}>
              <Text style={styles.accountTitle}>My Account</Text>
            </View>
            <View style={styles.browserContent}>
              <TouchableOpacity style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
              <View style={[styles.warningBubble, { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: '#059669', marginTop: 20 }]}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <Text style={styles.safeText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "family":
        return (
          <View style={styles.phoneSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.smsHeader}>
              <Text style={styles.smsTitle}>Messages</Text>
            </View>
            <View style={styles.smsContent}>
              <View style={[styles.smsMessage, { backgroundColor: '#E5F3FF' }]}>
                <Text style={styles.smsText}>Anak/Apo, may natatanggap ako na message. Totoo ba ito?</Text>
              </View>
              <View style={[styles.smsMessage, { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' }]}>
                <Text style={styles.smsText}>Ipakita niyo po sa akin, tutulungan ko kayong i-check!</Text>
              </View>
              <View style={[styles.warningBubble, { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: '#059669' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <Text style={styles.safeText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "password":
        return (
          <View style={styles.phoneSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.passwordHeader}>
              <Text style={styles.passwordTitle}>Create Password</Text>
            </View>
            <View style={styles.passwordContent}>
              <View style={styles.passwordExample}>
                <Text style={styles.passwordLabel}>❌ Weak Password:</Text>
                <Text style={styles.weakPassword}>123456</Text>
              </View>
              <View style={styles.passwordExample}>
                <Text style={styles.passwordLabel}>✅ Strong Password:</Text>
                <Text style={styles.strongPassword}>M@r1a2024!Phl</Text>
              </View>
              <View style={styles.passwordTips}>
                <Text style={styles.tipBullet}>• Use 12+ characters</Text>
                <Text style={styles.tipBullet}>• Mix letters, numbers, symbols</Text>
                <Text style={styles.tipBullet}>• Avoid personal info</Text>
              </View>
              <View style={[styles.warningBubble, { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: '#059669' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <Text style={styles.safeText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "antivirus":
        return (
          <View style={styles.phoneSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.antivirusHeader}>
              <Text style={styles.antivirusTitle}>Antivirus Protection</Text>
            </View>
            <View style={styles.antivirusContent}>
              <View style={styles.scanStatus}>
                <Ionicons name="shield-checkmark" size={60} color="#059669" />
                <Text style={styles.scanText}>Protected</Text>
                <Text style={styles.scanDetail}>Last scan: Today</Text>
              </View>
              <TouchableOpacity style={styles.scanButton}>
                <Text style={styles.scanButtonText}>Run Full Scan</Text>
              </TouchableOpacity>
              <View style={[styles.warningBubble, { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: '#059669' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <Text style={styles.safeText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "suspicious_link":
        return (
          <View style={styles.emailSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.emailHeader}>
              <Text style={styles.emailTitle}>Email</Text>
            </View>
            <View style={styles.emailContent}>
              <View style={[styles.emailMessage, styles.dangerMessage]}>
                <Text style={styles.emailText}>FROM: unknown@suspicious-site.xyz{'\n'}SUBJECT: URGENT! Click now!</Text>
                <TouchableOpacity style={styles.dangerLink}>
                  <Text style={styles.dangerLinkText}>Click here NOW! ⚠️</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.warningBubble}>
                <Ionicons name="warning" size={20} color="#DC2626" />
                <Text style={styles.warningText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "download":
        return (
          <View style={styles.browserSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.browserContent}>
              <View style={styles.downloadPopup}>
                <Ionicons name="warning" size={40} color="#DC2626" />
                <Text style={styles.popupTitle}>Unknown File</Text>
                <Text style={styles.popupText}>suspicious_file.exe</Text>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel Download</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.warningBubble}>
                <Ionicons name="warning" size={20} color="#DC2626" />
                <Text style={styles.warningText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "phone_call":
        return (
          <View style={styles.callSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.callContent}>
              <View style={styles.callerInfo}>
                <View style={styles.callerIcon}>
                  <Ionicons name="person" size={30} color="#64748B" />
                </View>
                <Text style={styles.callerName}>Unknown Caller</Text>
                <Text style={styles.callerNumber}>+1-800-FAKE-BANK</Text>
                <View style={styles.callMessage}>
                  <Text style={styles.callText}>"Give us your password now!"</Text>
                </View>
              </View>
              <View style={styles.warningBubble}>
                <Ionicons name="warning" size={20} color="#DC2626" />
                <Text style={styles.warningText}>{data.warning}</Text>
              </View>
              <View style={styles.callButtons}>
                <TouchableOpacity style={styles.declineButton}>
                  <Ionicons name="call" size={24} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                  <Text style={styles.callButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case "prize_scam":
        return (
          <View style={styles.phoneSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.smsHeader}>
              <Text style={styles.smsTitle}>Messages</Text>
            </View>
            <View style={styles.smsContent}>
              <View style={[styles.smsMessage, styles.dangerMessage]}>
                <Text style={styles.smsText}>🎉 CONGRATULATIONS! You won P1,000,000! Click: bit.ly/fake-prize</Text>
                <Text style={styles.smsTime}>Now</Text>
              </View>
              <View style={styles.warningBubble}>
                <Ionicons name="warning" size={20} color="#DC2626" />
                <Text style={styles.warningText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "wifi":
        return (
          <View style={styles.phoneSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Wi-Fi Networks</Text>
            </View>
            <View style={styles.settingsContent}>
              <View style={styles.wifiList}>
                <View style={[styles.wifiItem, styles.dangerWifi]}>
                  <Ionicons name="wifi" size={24} color="#DC2626" />
                  <Text style={styles.wifiName}>Free Public WiFi ⚠️</Text>
                </View>
                <View style={styles.wifiItem}>
                  <Ionicons name="lock-closed" size={24} color="#059669" />
                  <Text style={styles.wifiName}>Home WiFi (Secure)</Text>
                </View>
              </View>
              <View style={styles.warningBubble}>
                <Ionicons name="warning" size={20} color="#DC2626" />
                <Text style={styles.warningText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "password_sharing":
        return (
          <View style={styles.phoneSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.smsHeader}>
              <Text style={styles.smsTitle}>Messages</Text>
            </View>
            <View style={styles.smsContent}>
              <View style={[styles.smsMessage, styles.dangerMessage]}>
                <Text style={styles.smsText}>FROM: BPI Customer Service{'\n\n'}We need to verify your account. Please reply with your password.</Text>
              </View>
              <View style={styles.warningBubble}>
                <Ionicons name="warning" size={20} color="#DC2626" />
                <Text style={styles.warningText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "popup":
        return (
          <View style={styles.browserSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.browserContent}>
              <View style={styles.popupAd}>
                <Text style={styles.popupAdTitle}>⚠️ VIRUS DETECTED!</Text>
                <Text style={styles.popupAdText}>Click here to remove virus NOW!</Text>
                <TouchableOpacity style={styles.popupAdButton}>
                  <Text style={styles.popupAdButtonText}>Click Here!</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.warningBubble}>
                <Ionicons name="warning" size={20} color="#DC2626" />
                <Text style={styles.warningText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "email_attachment":
        return (
          <View style={styles.emailSimulator}>
            <View style={styles.phoneHeader}>
              <Text style={styles.phoneTime}>9:41 AM</Text>
              <View style={styles.phoneSignal}>
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <View style={styles.signalBar} />
                <Text style={styles.batteryText}>100%</Text>
              </View>
            </View>
            <View style={styles.emailHeader}>
              <Text style={styles.emailTitle}>Email</Text>
            </View>
            <View style={styles.emailContent}>
              <View style={[styles.emailMessage, styles.dangerMessage]}>
                <Text style={styles.emailText}>FROM: unknown-sender@fake.com{'\n'}SUBJECT: Important Document</Text>
                <View style={styles.attachmentBox}>
                  <Ionicons name="document" size={24} color="#DC2626" />
                  <Text style={styles.attachmentText}>invoice.exe ⚠️</Text>
                </View>
              </View>
              <View style={styles.warningBubble}>
                <Ionicons name="warning" size={20} color="#DC2626" />
                <Text style={styles.warningText}>{data.warning}</Text>
              </View>
            </View>
          </View>
        );

      case "sms":
  return (
    <View style={styles.phoneSimulator}>
      <View style={styles.phoneHeader}>
        <Text style={styles.phoneTime}>9:41 AM</Text>
        <View style={styles.phoneSignal}>
          <View style={styles.signalBar} />
          <View style={styles.signalBar} />
          <View style={styles.signalBar} />
          <Text style={styles.batteryText}>100%</Text>
        </View>
      </View>
      <View style={styles.smsHeader}>
        <Text style={styles.smsTitle}>Messages</Text>
      </View>
      <View style={styles.smsContent}>
        <View style={[styles.smsMessage, !data.safe && styles.dangerMessage]}>
          <Text style={styles.smsText}>{data.message}</Text>
          <Text style={styles.smsTime}>Now</Text>
        </View>
        <View style={styles.warningBubble}>
          <Ionicons name={data.safe ? "checkmark-circle" : "warning"} size={20} color={data.safe ? "#059669" : "#DC2626"} />
          <Text style={[styles.warningText, data.safe && styles.safeText]}>{data.warning}</Text>
        </View>
      </View>
    </View>
  );

case "email":
  return (
    <View style={styles.emailSimulator}>
      <View style={styles.phoneHeader}>
        <Text style={styles.phoneTime}>9:41 AM</Text>
        <View style={styles.phoneSignal}>
          <View style={styles.signalBar} />
          <View style={styles.signalBar} />
          <View style={styles.signalBar} />
          <Text style={styles.batteryText}>100%</Text>
        </View>
      </View>
      <View style={styles.emailHeader}>
        <Text style={styles.emailTitle}>Email</Text>
      </View>
      <View style={styles.emailContent}>
        <View style={[styles.emailMessage, !data.safe && styles.dangerMessage]}>
          <Text style={styles.emailText}>{data.message}</Text>
        </View>
        <View style={styles.warningBubble}>
          <Ionicons name={data.safe ? "checkmark-circle" : "warning"} size={20} color={data.safe ? "#059669" : "#DC2626"} />
          <Text style={[styles.warningText, data.safe && styles.safeText]}>{data.warning}</Text>
        </View>
      </View>
    </View>
  );

case "call":
  return (
    <View style={styles.callSimulator}>
      <View style={styles.phoneHeader}>
        <Text style={styles.phoneTime}>9:41 AM</Text>
        <View style={styles.phoneSignal}>
          <View style={styles.signalBar} />
          <View style={styles.signalBar} />
          <View style={styles.signalBar} />
          <Text style={styles.batteryText}>100%</Text>
        </View>
      </View>
      <View style={styles.callContent}>
        <View style={styles.callerInfo}>
          <View style={styles.callerIcon}>
            <Ionicons name="person" size={30} color="#64748B" />
          </View>
          <Text style={styles.callerName}>Unknown Caller</Text>
          <Text style={styles.callerNumber}>+1-800-SCAMMER</Text>
          <Text style={styles.callStatus}>Incoming call...</Text>
        </View>
        <View style={styles.callMessage}>
          <Text style={styles.callText}>{data.message}</Text>
        </View>
        <View style={styles.warningBubble}>
          <Ionicons name="warning" size={20} color="#DC2626" />
          <Text style={styles.warningText}>{data.warning}</Text>
        </View>
        <View style={styles.callButtons}>
          <TouchableOpacity style={styles.declineButton}>
            <Ionicons name="call" size={24} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
            <Text style={styles.callButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

case "social":
  return (
    <View style={styles.socialSimulator}>
      <View style={styles.phoneHeader}>
        <Text style={styles.phoneTime}>9:41 AM</Text>
        <View style={styles.phoneSignal}>
          <View style={styles.signalBar} />
          <View style={styles.signalBar} />
          <View style={styles.signalBar} />
          <Text style={styles.batteryText}>100%</Text>
        </View>
      </View>
      <View style={styles.socialHeader}>
        <Text style={styles.socialTitle}>Facebook</Text>
      </View>
      <View style={styles.socialContent}>
        <View style={styles.socialPost}>
          <Text style={styles.socialText}>{data.message}</Text>
          <TouchableOpacity style={styles.suspiciousLink}>
            <Text style={styles.linkText}>Click here now! →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.warningBubble}>
          <Ionicons name="warning" size={20} color="#DC2626" />
          <Text style={styles.warningText}>{data.warning}</Text>
        </View>
      </View>
    </View>
  );

case "website":
  return (
    <View style={styles.websiteSimulator}>
      <View style={styles.phoneHeader}>
        <Text style={styles.phoneTime}>9:41 AM</Text>
        <View style={styles.phoneSignal}>
          <View style={styles.signalBar} />
          <View style={styles.signalBar} />
          <View style={styles.signalBar} />
          <Text style={styles.batteryText}>100%</Text>
        </View>
      </View>
      <View style={styles.browserHeader}>
        <View style={styles.secureBar}>
          <Ionicons name="lock-closed" size={16} color="#059669" />
          <Text style={styles.secureUrl}>https://www.doh.gov.ph</Text>
        </View>
      </View>
      <View style={styles.websiteContent}>
        <Text style={styles.govTitle}>Department of Health</Text>
        <Text style={styles.govSubtitle}>Republic of the Philippines</Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Contact Information:</Text>
          <Text style={styles.contactText}>📞 (02) 8651-7800</Text>
          <Text style={styles.contactText}>📧 info@doh.gov.ph</Text>
          <Text style={styles.contactText}>📍 San Lazaro Compound, Rizal Avenue, Sta. Cruz, Manila</Text>
        </View>
        <View style={[styles.warningBubble, { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: '#059669' }]}>
          <Ionicons name="checkmark-circle" size={20} color="#059669" />
          <Text style={styles.safeText}>{data.warning}</Text>
        </View>
      </View>
    </View>
  );

default:
  return <Text>Screen simulator not available</Text>;
    }
  };
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
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
            <View style={styles.simulatorHeader}>
              <Text style={styles.simulatorTitle}>Screen Simulator</Text>
              <Text style={styles.simulatorSubtitle}>Tingnan ang halimbawa sa screen</Text>
            </View>

            <View style={styles.simulatorContainer}>
              {renderSimulatorContent()}
            </View>

            <View style={styles.simulatorTips}>
              <Text style={styles.tipsTitle}>💡 Mga Tip:</Text>
              <Text style={styles.tipsText}>
                • Tingnan ang mga warning signs sa screen{'\n'}
                • Alamin kung paano makilala ang mga scam{'\n'}
                • I-practice ang safe browsing habits
              </Text>
            </View>
          </ScrollView>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color="#0F172A" />
            <Text style={styles.backButtonText}>{getBackButtonText()}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  const renderMainMenu = () => (
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
          {/* Header Section */}
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
              May screen simulator na din para makita ang mga halimbawa!
            </Text>
          </View>
        </ScrollView>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color="#0F172A" />
          <Text style={styles.backButtonText}>{getBackButtonText()}</Text>
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
              onPress={() =>
                narrate(
                  "Ang basic internet safety o kaligtasan sa internet ay nagsisimula sa pag-unawa kung paano protektahan ang inyong sarili habang nag-iinternet. Matutuhan natin ang mga dapat at hindi dapat gawin.",
                  'basics-main'
                )
              }
            >
              <Ionicons
                name={isButtonNarrating('basics-main') ? "stop" : "volume-high"}
                size={20}
                color={isButtonNarrating('basics-main') ? "#fff" : "#38BDF8"}
              />
              <Text
                style={[styles.audioBtnText, isButtonNarrating('basics-main') && styles.audioBtnTextActive]}
              >
                {isButtonNarrating('basics-main') ? "Tumutugtog..." : "Read"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ MGA DAPAT GAWIN (DO's)</Text>
            {SAFETY_RULES.dos.map((rule, index) => (
              <View key={index} style={styles.ruleCard}>
                <TouchableOpacity
                  style={styles.ruleContent}
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

                {rule.simulatorType && (
                  <TouchableOpacity
                    style={styles.simulatorBtn}
                    onPress={() =>
                      showScreenSimulator(rule.simulatorType, { safe: true, warning: rule.detail })
                    }
                  >
                    <Ionicons name="phone-portrait" size={16} color="#059669" />
                    <Text style={styles.simulatorBtnText}>Tingnan sa Screen</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#d32f2f' }]}>❌ MGA HUWAG GAWIN (DON'Ts)</Text>
            {SAFETY_RULES.donts.map((rule, index) => (
              <View key={index} style={[styles.ruleCard, styles.dontCard]}>
                <TouchableOpacity
                  style={styles.ruleContent}
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

                {rule.simulatorType && (
                  <TouchableOpacity
                    style={[styles.simulatorBtn, styles.dangerSimulatorBtn]}
                    onPress={() =>
                      showScreenSimulator(rule.simulatorType, { safe: false, warning: rule.detail })
                    }
                  >
                    <Ionicons name="phone-portrait" size={16} color="#d32f2f" />
                    <Text style={[styles.simulatorBtnText, styles.dangerSimulatorText]}>Tingnan sa Screen</Text>
                  </TouchableOpacity>
                )}
              </View>
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
          <Text style={styles.backButtonText}>{getBackButtonText()}</Text>
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
              onPress={() =>
                narrate(
                  "Ang safe browsing tips ay mga paraan para makapag-browse kayo sa internet nang ligtas. Matutuhan natin ang mga importanteng tips para maiwasan ang mga scam at virus.",
                  'browsing-main'
                )
              }
            >
              <Ionicons
                name={isButtonNarrating('browsing-main') ? "stop" : "volume-high"}
                size={20}
                color={isButtonNarrating('browsing-main') ? "#fff" : "#38BDF8"}
              />
              <Text
                style={[styles.audioBtnText, isButtonNarrating('browsing-main') && styles.audioBtnTextActive]}
              >
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

              <View style={styles.tipActions}>
                <TouchableOpacity
                  style={styles.listenBtn}
                  onPress={() =>
                    narrate(`${tip.title}. ${tip.description}. Halimbawa: ${tip.example}`, `browsing-tip-${index}`)
                  }
                >
                  <Ionicons
                    name={isButtonNarrating(`browsing-tip-${index}`) ? "stop" : "play"}
                    size={16}
                    color="#1976d2"
                  />
                  <Text style={styles.listenText}>
                    {isButtonNarrating(`browsing-tip-${index}`) ? "Tumutugtog..." : "Read"}
                  </Text>
                </TouchableOpacity>

                {tip.simulatorType && (
                  <TouchableOpacity
                    style={styles.simulatorBtn}
                    onPress={() =>
                      showScreenSimulator(tip.simulatorType, { safe: true, warning: tip.description })
                    }
                  >
                    <Ionicons name="phone-portrait" size={16} color="#059669" />
                    <Text style={styles.simulatorBtnText}>Screen Demo</Text>
                  </TouchableOpacity>
                )}
              </View>
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
          <Text style={styles.backButtonText}>{getBackButtonText()}</Text>
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
              onPress={() =>
                narrate(
                  "Maraming uri ng scam o panloloko sa internet. Matutuhan natin kung paano sila makilala at iwasan. Ang mga scammer ay gumagamit ng iba't ibang paraan para manlinlang ng mga tao.",
                  'scams-main'
                )
              }
            >
              <Ionicons
                name={isButtonNarrating('scams-main') ? "stop" : "volume-high"}
                size={20}
                color={isButtonNarrating('scams-main') ? "#fff" : "#38BDF8"}
              />
              <Text
                style={[styles.audioBtnText, isButtonNarrating('scams-main') && styles.audioBtnTextActive]}
              >
                {isButtonNarrating('scams-main') ? "Tumutugtog..." : "Read"}
              </Text>
            </TouchableOpacity>
          </View>

          {SCAM_EXAMPLES.map((scam, index) => (
            <View key={index} style={[styles.scamCard, scam.safe ? styles.safeCard : styles.dangerCard]}>
              <Text style={styles.scamType}>{scam.type}</Text>
              <Text style={styles.scamMessage}>"{scam.message}"</Text>
              <Text style={styles.scamWarning}>{scam.warning}</Text>

              <View style={styles.scamActions}>
                <TouchableOpacity
                  style={styles.listenBtn}
                                    onPress={() =>
                    narrate(`Halimbawa ng ${scam.type}. ${scam.message}. Paalala: ${scam.warning}`, `scam-${index}`)
                  }
                >
                  <Ionicons name={isButtonNarrating(`scam-${index}`) ? "stop" : "play"} size={16} color="#1976d2" />
                  <Text style={styles.listenText}>
                    {isButtonNarrating(`scam-${index}`) ? "Tumutugtog..." : "Read"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.simulatorBtn, scam.safe ? null : styles.dangerSimulatorBtn]}
                  onPress={() => showScreenSimulator(scam.simulatorType, scam)}
                >
                  <Ionicons name="phone-portrait" size={16} color={scam.safe ? "#059669" : "#d32f2f"} />
                  <Text style={[styles.simulatorBtnText, scam.safe ? null : styles.dangerSimulatorText]}>
                    Tingnan sa Screen
                  </Text>
                </TouchableOpacity>
              </View>
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
          <Text style={styles.backButtonText}>{getBackButtonText()}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Main render function
  if (showSimulator) {
    return renderScreenSimulator();
  }

  // Render current module
  switch (currentModule) {
    case 'basics':
      return renderBasics();
    case 'browsing':
      return renderBrowsingTips();
    case 'scams':
      return renderScamAwareness();
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
    borderRadius: 16,
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#059669',
    overflow: 'hidden',
  },
  dontCard: {
    borderLeftColor: '#DC2626',
  },
  ruleContent: {
    padding: 20,
    position: 'relative',
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
  simulatorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 20,
    marginTop: 0,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#059669',
  },
  dangerSimulatorBtn: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderColor: '#DC2626',
  },
  simulatorBtnText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  dangerSimulatorText: {
    color: '#DC2626',
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
  tipActions: {
    flexDirection: 'row',
    gap: 12,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
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
  scamActions: {
    flexDirection: 'row',
    gap: 12,
  },
  
  // Screen Simulator Styles
  simulatorHeader: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 20,
    elevation: 6,
  },
  simulatorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  simulatorSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  simulatorContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  simulatorTips: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  
  // Phone Simulator Styles
  phoneSimulator: {
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  emailSimulator: {
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  browserSimulator: {
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  callSimulator: {
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  socialSimulator: {
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  websiteSimulator: {
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  phoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  phoneTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  phoneSignal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signalBar: {
    width: 3,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  batteryText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 8,
  },
  
  // SMS Styles
  smsHeader: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  smsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'jsx',
    color: '#fff',
    textAlign: 'center',
  },
  smsContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    minHeight: 400,
  },
  smsMessage: {
    backgroundColor: '#E5E5EA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  dangerMessage: {
    backgroundColor: '#FFE5E5',
    borderColor: '#DC2626',
    borderWidth: 2,
  },
  smsText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 22,
  },
  smsTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
  },
  
  // Email Styles
  emailHeader: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  emailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  emailContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    minHeight: 400,
  },
  emailMessage: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  emailText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  
  // Browser Styles
  browserHeader: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  secureBar: {
    borderColor: '#059669',
  },
  unsecureBar: {
    borderColor: '#DC2626',
  },
  urlText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  secureUrl: {
    color: '#059669',
  },
  unsecureUrl: {
    color: '#DC2626',
  },
  browserContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    minHeight: 400,
  },
  websiteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  websiteContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 20,
  },
  
  // Call Styles
  callContent: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    minHeight: 400,
    justifyContent: 'space-between',
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: 40,
  },
  callerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  callerNumber: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 14,
    color: '#8E8E93',
  },
  callMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
  },
  callText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  callButtons: {
    alignItems: 'center',
    marginBottom: 40,
  },
  declineButton: {
    backgroundColor: '#FF3B30',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  
  // Social Media Styles
  socialHeader: {
    backgroundColor: '#1877F2',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  socialContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    minHeight: 400,
  },
  socialPost: {
    backgroundColor: '#F0F2F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  socialText: {
    fontSize: 16,
    color: '#1C1E21',
    marginBottom: 12,
    lineHeight: 22,
  },
  suspiciousLink: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Website Styles
  websiteContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    minHeight: 400,
  },
  govTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 8,
  },
  govSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  contactInfo: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  
  // Warning Bubble Styles
  warningBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  warningText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  safeText: {
    color: '#059669',
  },
  // Add these to your existing styles object:

// URL Comparison Styles
urlComparison: {
  backgroundColor: '#F8FAFC',
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
},
comparisonTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 8,
  marginTop: 8,
},
correctUrl: {
  fontSize: 14,
  color: '#059669',
  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  padding: 8,
  backgroundColor: 'rgba(5, 150, 105, 0.1)',
  borderRadius: 4,
  marginBottom: 12,
},
wrongUrl: {
  fontSize: 14,
  color: '#DC2626',
  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  padding: 8,
  backgroundColor: 'rgba(220, 38, 38, 0.1)',
  borderRadius: 4,
},

// Search Bar Styles
searchBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#E2E8F0',
},
searchText: {
  marginLeft: 8,
  fontSize: 14,
  color: '#64748B',
  flex: 1,
},

// Search Result Styles
searchResult: {
  backgroundColor: '#F8FAFC',
  padding: 16,
  borderRadius: 12,
  marginBottom: 20,
  borderLeftWidth: 4,
  borderLeftColor: '#059669',
},
searchResultTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#0F172A',
  marginBottom: 6,
},
searchResultUrl: {
  fontSize: 12,
  color: '#059669',
  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  marginBottom: 8,
},
searchResultDesc: {
  fontSize: 14,
  color: '#64748B',
  lineHeight: 20,
},

// Settings Styles
settingsHeader: {
  backgroundColor: '#64748B',
  paddingHorizontal: 20,
  paddingVertical: 15,
},
settingsTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
},
settingsContent: {
  backgroundColor: '#fff',
  padding: 20,
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  minHeight: 400,
},
settingItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#E2E8F0',
},
settingLabel: {
  fontSize: 16,
  color: '#0F172A',
  fontWeight: '500',
},
toggleOn: {
  backgroundColor: '#059669',
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 12,
},
toggleText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},

// Account/Logout Styles
accountHeader: {
  backgroundColor: '#475569',
  paddingHorizontal: 20,
  paddingVertical: 15,
},
accountTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
},
logoutButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#DC2626',
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 12,
  gap: 10,
},
logoutText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

// Password Styles
passwordHeader: {
  backgroundColor: '#7C3AED',
  paddingHorizontal: 20,
  paddingVertical: 15,
},
passwordTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
},
passwordContent: {
  backgroundColor: '#fff',
  padding: 20,
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  minHeight: 400,
},
passwordExample: {
  marginBottom: 20,
},
passwordLabel: {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 8,
},
weakPassword: {
  fontSize: 18,
  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  color: '#DC2626',
  backgroundColor: 'rgba(220, 38, 38, 0.1)',
  padding: 12,
  borderRadius: 8,
},
strongPassword: {
  fontSize: 18,
  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  color: '#059669',
  backgroundColor: 'rgba(5, 150, 105, 0.1)',
  padding: 12,
  borderRadius: 8,
},
passwordTips: {
  backgroundColor: '#F8FAFC',
  padding: 16,
  borderRadius: 12,
  marginBottom: 20,
},
tipBullet: {
  fontSize: 14,
  color: '#475569',
  marginBottom: 8,
  lineHeight: 20,
},

// Antivirus Styles
antivirusHeader: {
  backgroundColor: '#059669',
  paddingHorizontal: 20,
  paddingVertical: 15,
},
antivirusTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
},
antivirusContent: {
  backgroundColor: '#fff',
  padding: 20,
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  minHeight: 400,
  alignItems: 'center',
},
scanStatus: {
  alignItems: 'center',
  marginVertical: 40,
},
scanText: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#059669',
  marginTop: 16,
},
scanDetail: {
  fontSize: 14,
  color: '#64748B',
  marginTop: 8,
},
scanButton: {
  backgroundColor: '#059669',
  paddingVertical: 14,
  paddingHorizontal: 32,
  borderRadius: 12,
  marginBottom: 20,
},
scanButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

// Danger Link Styles
dangerLink: {
  backgroundColor: '#DC2626',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  marginTop: 12,
  alignItems: 'center',
},
dangerLinkText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},

// Download Popup Styles
downloadPopup: {
  backgroundColor: '#fff',
  padding: 30,
  borderRadius: 16,
  alignItems: 'center',
  marginVertical: 60,
  borderWidth: 2,
  borderColor: '#DC2626',
},
popupTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#DC2626',
  marginTop: 16,
  marginBottom: 8,
},
popupText: {
  fontSize: 14,
  color: '#475569',
  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  marginBottom: 20,
},
cancelButton: {
  backgroundColor: '#64748B',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
},
cancelButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},

// Wi-Fi Styles
wifiList: {
  marginBottom: 20,
},
wifiItem: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 16,
  backgroundColor: '#F8FAFC',
  borderRadius: 12,
  marginBottom: 12,
  gap: 12,
},
dangerWifi: {
  backgroundColor: 'rgba(220, 38, 38, 0.1)',
  borderWidth: 2,
  borderColor: '#DC2626',
},
wifiName: {
  fontSize: 16,
  color: '#0F172A',
  fontWeight: '500',
},

// Popup Ad Styles
popupAd: {
  backgroundColor: '#FEF2F2',
  padding: 24,
  borderRadius: 16,
  borderWidth: 3,
  borderColor: '#DC2626',
  marginVertical: 60,
  alignItems: 'center',
},
popupAdTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#DC2626',
  marginBottom: 12,
  textAlign: 'center',
},
popupAdText: {
  fontSize: 16,
  color: '#0F172A',
  marginBottom: 20,
  textAlign: 'center',
},
popupAdButton: {
  backgroundColor: '#DC2626',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
},
popupAdButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

// Email Attachment Styles
attachmentBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(220, 38, 38, 0.1)',
  padding: 12,
  borderRadius: 8,
  marginTop: 12,
  borderWidth: 2,
  borderColor: '#DC2626',
  gap: 10,
},
attachmentText: {
  fontSize: 14,
  color: '#DC2626',
  fontWeight: 'bold',
},

// Review Styles
reviewCard: {
  backgroundColor: '#F8FAFC',
  padding: 16,
  borderRadius: 12,
  marginBottom: 16,
  borderLeftWidth: 4,
  borderLeftColor: '#38BDF8',
},
reviewHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},
reviewSite: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#0F172A',
},
reviewStars: {
  fontSize: 14,
  color: '#F59E0B',
},
reviewText: {
  fontSize: 14,
  color: '#475569',
  fontStyle: 'italic',
  lineHeight: 20,
},

});