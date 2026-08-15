import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Alert, SafeAreaView, Dimensions, Platform
} from "react-native";
import * as Speech from 'expo-speech';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

// ─── Tutorial modules ────────────────────────────────────────────────────────
const TUTORIAL_MODULES = [
  { id: 'basics',   title: 'Basic Internet Safety',  icon: 'shield-checkmark', description: 'Internet safety essentials' },
  { id: 'browsing', title: 'Safe Browsing Tips',      icon: 'globe',            description: 'How to browse safely' },
  { id: 'scams',    title: 'Avoiding Scams',          icon: 'warning',          description: 'Identify and avoid scams' },
  { id: 'apps',     title: 'Common Apps Tutorial',    icon: 'apps',             description: 'How to use Facebook, YouTube, and Messenger' },
];

// ─── Safe browsing tips ───────────────────────────────────────────────────────
const BROWSING_TIPS = [
  {
    title: "Check the lock icon in the address bar",
    description: "If there is a lock icon (🔒) in the address bar, the website is safe. If not, be careful and do not enter your personal information.",
    example: "Correct: https://www.bpi.com.ph  ✅\nIncorrect: http://fake-bpi.com  ❌",
    simulatorType: "url_compare",
  },
  {
    title: "Use a search engine to find websites",
    description: "Do not type the website address directly. Search Google first to find the correct website and avoid fake sites.",
    example: "Search on Google: Bank of the Philippine Islands",
    simulatorType: "search",
  },
  {
    title: "Ask your family if you are not sure",
    description: "It is better to ask than to make a mistake. Show your child or grandchild the unknown message or website.",
    example: "Say: 'Child, look at this - is it real?'",
    simulatorType: "family",
  },
];

// ─── Scam examples ────────────────────────────────────────────────────────────
const SCAM_EXAMPLES = [
  {
    type: "Fake Prize SMS",
    message: "CONGRATULATIONS! You won P500,000! Text CLAIM to 2366 or click bit.ly/win500k",
    warning: "This is a SCAM! There are no free prizes in texts. Do not click the link and do not reply. Just delete the message.",
    safe: false,
    simulatorType: "sms_scam",
  },
  {
    type: "Fake Bank Email",
    message: "FROM: security@bpi-bank.net\nYour account will be closed. Click here to verify your password.",
    warning: "This is a SCAM! Real banks will not ask for your password in an email. Call the official hotline of your bank to verify.",
    safe: false,
    simulatorType: "email_scam",
  },
  {
    type: "Fake Government Text",
    message: "FROM: BIR Philippines\nYou have unpaid taxes of P25,000. Pay now via GCash 09171234567.",
    warning: "This is a SCAM! The government does not collect payments through text messages or GCash in this way.",
    safe: false,
    simulatorType: "govt_scam",
  },
  {
    type: "Legitimate Government Website",
    message: "Department of Health – www.doh.gov.ph\nSecure connection (https://) with complete contact information.",
    warning: "This is LEGITIMATE! It has a lock icon, has https, and has complete contact details such as phone number and official email.",
    safe: true,
    simulatorType: "legit_website",
  },
];

// ─── Basic Do's & Don'ts ──────────────────────────────────────────────────────
const SAFETY_RULES = {
  dos: [
    {
      text: "Check the lock icon (🔒) in the address bar",
      detail: "It shows that the website you are visiting is safe. Do not enter your password or personal information if there is no lock.",
      simulatorType: "lock_icon",
    },
    {
      text: "Use well-known websites",
      detail: "Such as Google, Facebook, and government websites that end in .gov.ph. Well-known sites are safer.",
      simulatorType: "known_website",
    },
    {
      text: "Log out after using",
      detail: "Especially on a shared or public computer. Tap your name or profile picture, then find 'Log Out' or 'Sign Out'.",
      simulatorType: "logout",
    },
    {
      text: "Ask your family if you are not sure",
      detail: "It is better to ask than to become a victim of scams. Show the suspicious message to your child or grandchild.",
      simulatorType: "ask_family",
    },
    {
      text: "Use a hard to guess password",
      detail: "Use a hard to guess password. Do not use your name, birthday, or '123456' as a password. Use a mix of letters, numbers, and symbols.",
      simulatorType: "strong_password",
    },
  ],
  donts: [
    {
      text: "Do not click on unknown links",
      detail: "Especially in emails or texts from unknown senders. These links can take you to fake websites to steal your information.",
      simulatorType: "unknown_link",
    },
    {
      text: "Do not give personal information on calls",
      detail: "Real banks will not call to ask for your password, OTP, or account number. Hang up and call the official hotline.",
      simulatorType: "phone_call",
    },
    {
      text: "Do not believe 'You Won' messages",
      detail: "That is a scam. There is no free money or prize on the internet without a reason. Delete such messages immediately.",
      simulatorType: "prize_scam",
    },
    {
      text: "Do not share your password",
      detail: "Do not give your password to anyone – even if they say they are from a bank or government. Your password is only for you.",
      simulatorType: "password_sharing",
    },
    {
      text: "Do not click on pop-up ads",
      detail: "Pop-ups that say 'You have a virus!' or 'You won!' are also scams. Close the window and do not click any button inside.",
      simulatorType: "popup",
    },
  ],
};

// ─── Common Apps content ─────────────────────────────────────────────────────
const COMMON_APPS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'logo-facebook',
    color: '#1877F2',
    description: 'For communicating with friends and family.',
    steps: [
      {
        title: 'News Feed',
        detail: 'This is the first thing you will see when you open Facebook. Here you will see posts from your friends and family.',
        highlight: 'newsfeed',
      },
      {
        title: 'Liking a Post',
        detail: "Tap the 'Like' button (thumbs up) below the post to show that you liked it.",
        highlight: 'like',
      },
      {
        title: 'Commenting',
        detail: "Tap 'Comment' to leave a message on your friend's post.",
        highlight: 'comment',
      },
      {
        title: 'Sharing a Post',
        detail: "Tap 'Share' to share the post with your friends.",
        highlight: 'share',
      },
      {
        title: 'Messenger Icon',
        detail: 'Tap the chat bubble icon at the top to open Messenger and chat with your family.',
        highlight: 'messenger',
      },
    ],
    simulatorType: 'facebook',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'logo-youtube',
    color: '#FF0000',
    description: 'For watching videos, news, and tutorials.',
    steps: [
      {
        title: 'Home Feed',
        detail: 'You will see videos that are recommended for you based on videos you have watched before.',
        highlight: 'home',
      },
      {
        title: 'Search for a Video',
        detail: 'Tap the magnifying glass icon at the top and type what you want to watch, for example: "how to cook sinigang".',
        highlight: 'search',
      },
      {
        title: 'Play the Video',
        detail: 'Tap the video to play it. Tap the screen again to show the play and pause buttons in the middle.',
        highlight: 'play',
      },
      {
        title: 'Adjust Volume',
        detail: 'Slide the volume bar on the screen or use the side buttons of your phone to turn the volume up or down.',
        highlight: 'volume',
      },
      {
        title: 'Return to Home',
        detail: 'Tap the Home icon at the bottom of the screen to return to the list of videos.',
        highlight: 'navhome',
      },
    ],
    simulatorType: 'youtube',
  },
  {
    id: 'messenger',
    name: 'Messenger',
    icon: 'chatbubble-ellipses',
    color: '#0084FF',
    description: 'For sending messages and calling family.',
    steps: [
      {
        title: 'Chat List',
        detail: 'You will see all your conversations. Tap the name of a person to open your chat with them.',
        highlight: 'chatlist',
      },
      {
        title: 'Type a Message',
        detail: "Tap the text box at the bottom and type your message using the keyboard. Tap the send button (arrow) to send it.",
        highlight: 'typemsg',
      },
      {
        title: 'Make a Video Call',
        detail: 'Tap the video camera icon at the right corner at the top of the chat to make a video call and see the person you are talking to.',
        highlight: 'videocall',
      },
      {
        title: 'Make a Voice Call',
        detail: 'Tap the phone icon to make a regular voice call if you do not want to use the camera.',
        highlight: 'voicecall',
      },
      {
        title: 'Send a Photo',
        detail: 'Tap the camera icon or gallery icon next to the text box to choose a photo from your phone and send it.',
        highlight: 'sendphoto',
      },
    ],
    simulatorType: 'messenger',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
export default function InternetBrowsingScreen({ navigation }) {
  const [currentModule, setCurrentModule]           = useState('menu');
  const [showSimulator, setShowSimulator]           = useState(false);
  const [simulatorData, setSimulatorData]           = useState(null);
  const [currentlyNarrating, setCurrentlyNarrating] = useState(null);
  const [selectedApp, setSelectedApp]               = useState(null);

  // ── TTS helpers ──────────────────────────────────────────────────────────────
  const narrate = async (text, buttonId) => {
    if (currentlyNarrating === buttonId) { stopNarration(); return; }
    if (currentlyNarrating) await stopNarration();
    setCurrentlyNarrating(buttonId);
    try {
      await Speech.speak(text, {
        language: 'en-US', pitch: 1.0, rate: 0.55,
        onDone:    () => setCurrentlyNarrating(null),
        onStopped: () => setCurrentlyNarrating(null),
        onError:   () => { setCurrentlyNarrating(null); Alert.alert('Audio Error', 'Could not play audio. Please try again.'); },
      });
    } catch { setCurrentlyNarrating(null); }
  };

  const stopNarration = async () => {
    try { await Speech.stop(); } catch {}
    setCurrentlyNarrating(null);
  };

  const isNarrating = (id) => currentlyNarrating === id;

  // ── Navigation ───────────────────────────────────────────────────────────────
  const goBack = () => {
    stopNarration();
    if (showSimulator) { setShowSimulator(false); setSimulatorData(null); return; }
    if (currentModule === 'apps' && selectedApp) { setSelectedApp(null); return; }
    if (currentModule === 'menu') { navigation.goBack(); return; }
    setCurrentModule('menu');
  };

  const goToModule = (id) => { stopNarration(); setCurrentModule(id); };

  const showScreenSimulator = (type, data) => {
    setSimulatorData({ type, data });
    setShowSimulator(true);
  };

  useEffect(() => () => { stopNarration(); }, []);

  // ── Read button ──────────────────────────────────────────────────────────────
  const ReadBtn = ({ id, text }) => (
    <TouchableOpacity
      style={[styles.audioBtn, isNarrating(id) && styles.speakingBtn]}
      onPress={() => narrate(text, id)}
    >
      <Ionicons name={isNarrating(id) ? 'stop' : 'volume-high'} size={18} color={isNarrating(id) ? '#fff' : '#38BDF8'} />
      <Text style={[styles.audioBtnText, isNarrating(id) && styles.audioBtnTextActive]}>
        {isNarrating(id) ? 'Tumutugtog...' : 'Basahin'}
      </Text>
    </TouchableOpacity>
  );

  const SimBtn = ({ type, data, danger, appColor }) => (
    <TouchableOpacity
      style={[
        styles.simulatorBtn,
        danger && styles.dangerSimulatorBtn,
        appColor && { borderColor: appColor, backgroundColor: `${appColor}18` },
      ]}
      onPress={() => showScreenSimulator(type, data)}
    >
      <Ionicons name="phone-portrait" size={15} color={appColor || (danger ? '#DC2626' : '#059669')} />
      <Text style={[
        styles.simulatorBtnText,
        danger && styles.dangerSimulatorText,
        appColor && { color: appColor },
      ]}>
        See on Screen
      </Text>
    </TouchableOpacity>
  );

  // ── Back Button ──────────────────────────────────────────────────────────────
  const BackBtn = () => (
    <TouchableOpacity style={styles.backButton} onPress={goBack} activeOpacity={0.8}>
      <Ionicons name="arrow-back" size={18} color="#0F172A" />
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
  );

  const PageHeader = ({ title, subtitle, badgeIcon, badgeText, progress }) => (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderTop}>
        <BackBtn />
        <View style={styles.pageHeaderBadge}>
          <Ionicons name={badgeIcon || 'shield-checkmark'} size={18} color="#38BDF8" />
          <Text style={styles.pageHeaderBadgeText}>{badgeText || 'Internet Safety'}</Text>
        </View>
      </View>
      <Text style={styles.pageHeaderTitle}>{title}</Text>
      {subtitle ? <Text style={styles.pageHeaderSub}>{subtitle}</Text> : null}
      {progress ? (
        <>
          <View style={styles.pageHeaderProgressBar}>
            <View style={[styles.pageHeaderProgressFill, { width: `${(progress.value / progress.total) * 100}%` }]} />
          </View>
          <Text style={styles.pageHeaderProgressLabel}>{progress.label}</Text>
        </>
      ) : null}
    </View>
  );

  // ── Gradient wrapper ─────────────────────────────────────────────────────────
  const GradientBg = () => (
    <LinearGradient
      colors={['#F0F9FF','#E0F2FE','#BAE6FD','#7DD3FC','#38BDF8','#0EA5E9']}
      locations={[0,0.15,0.35,0.55,0.75,1]}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    />
  );

  // ── Highlight box (NO finger badge) ─────────────────────────────────────────
  // Wraps content with a colored border to show the active/highlighted element.
  const Highlight = ({ active, color = '#1877F2', children, style }) => (
    <View style={[
      active && {
        borderWidth: 2.5,
        borderColor: color,
        borderRadius: 8,
        backgroundColor: `${color}15`,
      },
      style,
    ]}>
      {children}
    </View>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN SIMULATORS
  // ════════════════════════════════════════════════════════════════════════════
  const renderSimulatorContent = () => {
    if (!simulatorData) return null;
    const { type, data } = simulatorData;

    // ── Phone shell wrapper ──────────────────────────────────────────────────
    const PhoneShell = ({ children, header }) => (
      <View style={styles.phoneShell}>
        <View style={styles.statusBar}>
          <Text style={styles.statusTime}>9:41 AM</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="cellular" size={14} color="#000" />
            <Ionicons name="wifi"     size={14} color="#000" />
            <Ionicons name="battery-full" size={16} color="#000" />
          </View>
        </View>
        {header}
        <View style={styles.phoneBody}>{children}</View>
      </View>
    );

    switch (type) {

      // ── URL Compare (Safe Browsing Tip 1: Lock icon) ──────────────────────
      case 'url_compare':
        return (
          <PhoneShell header={
            <View style={[styles.addrBarRow, styles.secureBar]}>
              <Ionicons name="lock-closed" size={14} color="#059669" />
              <Text style={[styles.addrText, { color: '#059669' }]}>https://www.bpi.com.ph</Text>
            </View>
          }>
            <Text style={styles.simSectionTitle}>Difference between Safe and Unsafe Websites</Text>
            <View style={[styles.compareBlock, { borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.06)' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Ionicons name="lock-closed" size={16} color="#059669" />
                <Text style={[styles.compareLabel, { color: '#059669' }]}>SAFE – Has lock and https://</Text>
              </View>
              <Text style={styles.correctUrl}>https://www.bpi.com.ph</Text>
              <Text style={styles.correctUrl}>https://www.facebook.com</Text>
            </View>
            <View style={[styles.compareBlock, { borderColor: '#DC2626', backgroundColor: 'rgba(220,38,38,0.06)', marginTop: 10 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Ionicons name="warning" size={16} color="#DC2626" />
                <Text style={[styles.compareLabel, { color: '#DC2626' }]}>UNSAFE – No lock, only http</Text>
              </View>
              <Text style={styles.wrongUrl}>http://fake-bpi.com</Text>
              <Text style={styles.wrongUrl}>http://faceb00k-login.net</Text>
            </View>
            <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 12 }]}>
              <Ionicons name="checkmark-circle" size={18} color="#059669" />
              <Text style={[styles.warningText, styles.safeText]}>Always look for 🔒 and "https://" before entering a password or personal information.</Text>
            </View>
          </PhoneShell>
        );

      // ── Lock icon (Do: Check lock icon) ──────────────────────────────────
      case 'lock_icon':
        return (
          <PhoneShell header={
            <View style={[styles.addrBarRow, styles.secureBar]}>
              <Ionicons name="lock-closed" size={14} color="#059669" />
              <Text style={[styles.addrText, { color: '#059669' }]}>https://www.bpi.com.ph</Text>
            </View>
          }>
            <Text style={styles.simSectionTitle}>How to Find the Lock Icon</Text>
            <View style={styles.instructionCard}>
              <View style={styles.instructionStep}>
                <View style={styles.stepNum}><Text style={styles.stepNumTxt}>1</Text></View>
                <Text style={styles.stepTxt}>Check the address bar at the top of the browser</Text>
              </View>
              <View style={styles.instructionStep}>
                <View style={styles.stepNum}><Text style={styles.stepNumTxt}>2</Text></View>
                <Text style={styles.stepTxt}>Hanapin ang 🔒 lock icon sa kaliwa ng web address</Text>
              </View>
              <View style={styles.instructionStep}>
                <View style={styles.stepNum}><Text style={styles.stepNumTxt}>3</Text></View>
                <Text style={styles.stepTxt}>Check if the address starts with "https://"</Text>
              </View>
            </View>
            <View style={[styles.addrBarRow, styles.unsecureBar, { marginTop: 12 }]}>
              <Ionicons name="warning" size={14} color="#DC2626" />
              <Text style={[styles.addrText, { color: '#DC2626' }]}>http://mapanganib-site.com</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#DC2626', fontWeight: '600', marginTop: 4, marginLeft: 4 }}>
              Walang lock = Do not enter personal information here
            </Text>
            <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 10 }]}>
              <Ionicons name="checkmark-circle" size={18} color="#059669" />
              <Text style={[styles.warningText, styles.safeText]}>{data.detail}</Text>
            </View>
          </PhoneShell>
        );

      // ── Known Website (Do: Use known websites) ────────────────────────────
      case 'known_website':
        return (
          <PhoneShell header={
            <View style={styles.searchRow}>
              <Ionicons name="search" size={14} color="#64748B" />
              <Text style={styles.searchInputText}>philhealth.gov.ph</Text>
            </View>
          }>
            <Text style={styles.simSectionTitle}>Safe Websites</Text>
            {[
              { name: 'Google', url: 'https://www.google.com', icon: 'search', color: '#4285F4' },
              { name: 'Facebook', url: 'https://www.facebook.com', icon: 'logo-facebook', color: '#1877F2' },
              { name: 'PhilHealth', url: 'https://www.philhealth.gov.ph', icon: 'shield-checkmark', color: '#0D6E3D' },
              { name: 'SSS', url: 'https://www.sss.gov.ph', icon: 'business', color: '#1565C0' },
            ].map((site, i) => (
              <View key={i} style={styles.knownSiteRow}>
                <View style={[styles.siteIconCircle, { backgroundColor: `${site.color}20` }]}>
                  <Ionicons name={site.icon} size={18} color={site.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.siteName}>{site.name}</Text>
                  <Text style={styles.siteUrl}>{site.url}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={18} color="#059669" />
              </View>
            ))}
            <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 8 }]}>
              <Ionicons name="checkmark-circle" size={18} color="#059669" />
              <Text style={[styles.warningText, styles.safeText]}>{data.detail}</Text>
            </View>
          </PhoneShell>
        );

      // ── Search (Safe Browsing Tip 2: Use search engine) ───────────────────
      case 'search':
        return (
          <PhoneShell header={
            <View style={styles.searchRow}>
              <Ionicons name="search" size={14} color="#64748B" />
              <Text style={styles.searchInputText}>Bank of the Philippine Islands</Text>
            </View>
          }>
            <Text style={styles.simSectionTitle}>Resulta ng Google Search</Text>
            <View style={[styles.searchResult, { borderLeftColor: '#059669' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <Ionicons name="lock-closed" size={12} color="#059669" />
                <Text style={styles.srUrl}>https://www.bpi.com.ph</Text>
              </View>
              <Text style={styles.srTitle}>BPI – Bank of the Philippine Islands (Official)</Text>
              <Text style={styles.srDesc}>Safe to use – Official website of BPI</Text>
            </View>
            <View style={[styles.searchResult, { borderLeftColor: '#DC2626', backgroundColor: 'rgba(220,38,38,0.05)', marginTop: 8 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <Ionicons name="warning" size={12} color="#DC2626" />
                <Text style={[styles.srUrl, { color: '#DC2626' }]}>http://bpi-login-verify.net</Text>
              </View>
              <Text style={[styles.srTitle, { color: '#DC2626' }]}>BPI Login Verification (FAKE SITE)</Text>
              <Text style={[styles.srDesc, { color: '#DC2626' }]}>Do not use – This is not the real BPI</Text>
            </View>
            <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 10 }]}>
              <Ionicons name="checkmark-circle" size={18} color="#059669" />
              <Text style={[styles.warningText, styles.safeText]}>Always search for the bank or agency on Google. Choose the first result with https:// and official name.</Text>
            </View>
          </PhoneShell>
        );

      // ── Family (Safe Browsing Tip 3 & Do: Ask family) ────────────────────
      case 'family':
      case 'ask_family':
        return (
          <PhoneShell header={<View style={styles.smsAppBar}><Text style={styles.appBarTitle}>Messages</Text></View>}>
            <Text style={styles.simSectionTitle}>Sending a Message to Family</Text>
            <View style={[styles.bubble, { backgroundColor: '#E5E5EA', alignSelf: 'flex-start', marginBottom: 8 }]}>
              <Text style={styles.bubbleSender}>You (Lolo/Lola)</Text>
              <Text style={styles.bubbleText}>Child, I received a message. Is it real?{'\n\n'}"You won P500,000! Click here to claim."</Text>
            </View>
            <View style={[styles.bubble, { backgroundColor: '#DCF8C6', alignSelf: 'flex-end', marginBottom: 8 }]}>
              <Text style={[styles.bubbleSender, { textAlign: 'right' }]}>Your Child</Text>
              <Text style={styles.bubbleText}>That is a scam! Do not click. Just delete. Always ask me before clicking any link.</Text>
            </View>
            <View style={[styles.bubble, { backgroundColor: '#E5E5EA', alignSelf: 'flex-start' }]}>
              <Text style={styles.bubbleSender}>You</Text>
              <Text style={styles.bubbleText}>Thank you child! I am deleting it now.</Text>
            </View>
            <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 10 }]}>
              <Ionicons name="checkmark-circle" size={18} color="#059669" />
              <Text style={[styles.warningText, styles.safeText]}>Do not be shy to ask your family. It is better to ask than to become a victim of scams.</Text>
            </View>
          </PhoneShell>
        );

      // ── Logout (Do: Log out after use) ────────────────────────────────────
      case 'logout':
        return (
          <PhoneShell header={<View style={[styles.appBarSolid, { backgroundColor: '#1877F2' }]}><Text style={styles.appBarTitle}>Facebook</Text></View>}>
            <Text style={styles.simSectionTitle}>How to Log Out from Facebook</Text>
            <View style={styles.instructionCard}>
              <View style={styles.instructionStep}>
                <View style={styles.stepNum}><Text style={styles.stepNumTxt}>1</Text></View>
                <Text style={styles.stepTxt}>Tap the three lines (menu) at the right corner at the top</Text>
              </View>
              <View style={styles.instructionStep}>
                <View style={styles.stepNum}><Text style={styles.stepNumTxt}>2</Text></View>
                <Text style={styles.stepTxt}>Scroll down until you see "Log Out"</Text>
              </View>
              <View style={styles.instructionStep}>
                <View style={styles.stepNum}><Text style={styles.stepNumTxt}>3</Text></View>
                <Text style={styles.stepTxt}>Tap "Log Out" to safely exit</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutTxt}>Log Out</Text>
            </TouchableOpacity>
            <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 12 }]}>
              <Ionicons name="checkmark-circle" size={18} color="#059669" />
              <Text style={[styles.warningText, styles.safeText]}>Especially on a shared or public computer, always log out after using Facebook, email, or any account.</Text>
            </View>
          </PhoneShell>
        );

      // ── Strong Password (Do: Use strong password) ─────────────────────────
      case 'strong_password':
        return (
          <PhoneShell header={<View style={[styles.appBarSolid, { backgroundColor: '#7C3AED' }]}><Text style={styles.appBarTitle}>Gumawa ng Password</Text></View>}>
            <Text style={styles.simSectionTitle}>Mahina vs. Matibay na Password</Text>
            <View style={[styles.compareBlock, { borderColor: '#DC2626', backgroundColor: 'rgba(220,38,38,0.06)' }]}>
              <Text style={[styles.compareLabel, { color: '#DC2626' }]}>MAHINA – Madaling hulaan</Text>
              {['123456', 'password', 'maria1960', 'birthday'].map((pw, i) => (
                <Text key={i} style={styles.weakPw}>{pw}</Text>
              ))}
            </View>
            <View style={[styles.compareBlock, { borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.06)', marginTop: 10 }]}>
              <Text style={[styles.compareLabel, { color: '#059669' }]}>MATIBAY – Halo ng letra, numero, simbolo</Text>
              {['M@r1a2024!', 'Ama#Lola99', 'Pamilya$01'].map((pw, i) => (
                <Text key={i} style={styles.strongPw}>{pw}</Text>
              ))}
            </View>
            <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 10 }]}>
              <Ionicons name="checkmark-circle" size={18} color="#059669" />
              <Text style={[styles.warningText, styles.safeText]}>Do not use your name, birthday, or simple numbers as a password. Use a mix of uppercase letters, lowercase letters, numbers, and symbols.</Text>
            </View>
          </PhoneShell>
        );

      // ── Unknown Link (Don't: Click unknown links) ─────────────────────────
      case 'unknown_link':
        return (
          <PhoneShell header={<View style={[styles.appBarSolid, { backgroundColor: '#1976D2' }]}><Text style={styles.appBarTitle}>Email</Text></View>}>
            <Text style={styles.simSectionTitle}>Example of a Dangerous Email</Text>
            <View style={styles.dangerEmailMsg}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <Ionicons name="warning" size={14} color="#DC2626" />
                <Text style={{ fontSize: 11, color: '#DC2626', fontWeight: '700' }}>UNKNOWN SENDER</Text>
              </View>
              <Text style={styles.emailTxt}>FROM: noreply@suspicious-prize.xyz{'\n'}SUBJECT: URGENT – Verify your account now!</Text>
              <Text style={[styles.emailTxt, { marginTop: 8, lineHeight: 18 }]}>
                Dear Customer,{'\n'}Your account will be suspended. Click the link below to verify immediately.
              </Text>
              <View style={styles.dangerLinkBox}>
                <Text style={styles.dangerLinkTxt}>CLICK HERE NOW</Text>
                <Text style={{ color: '#ffcccc', fontSize: 10, textAlign: 'center', marginTop: 2 }}>bit.ly/account-verify-fake</Text>
              </View>
            </View>
            <View style={styles.warningBubble}>
              <Ionicons name="warning" size={18} color="#DC2626" />
              <Text style={styles.warningText}>DO NOT CLICK! Email from unknown addresses with links is a scam. Delete immediately. Real banks do not send such emails.</Text>
            </View>
          </PhoneShell>
        );

      // ── Phone Call (Don't: Give personal info on calls) ───────────────────
      case 'phone_call':
        return (
          <PhoneShell header={null}>
            <View style={styles.callScreen}>
              <View style={styles.callerAvatar}><Ionicons name="call" size={28} color="#DC2626" /></View>
              <Text style={styles.callerName}>Unknown Call</Text>
              <Text style={styles.callerNum}>+63-2-FAKE-NUM</Text>
              <View style={[styles.callQuote, { borderColor: '#DC2626', borderWidth: 1.5 }]}>
                <Text style={{ fontSize: 11, color: '#DC2626', fontWeight: '700', marginBottom: 4 }}>SCAMMER SAYS:</Text>
                <Text style={styles.callQtxt}>"This is BPI. Your account has a problem. Give us your password and OTP now to fix it."</Text>
              </View>
              <View style={[styles.warningBubble, { marginTop: 8 }]}>
                <Ionicons name="warning" size={18} color="#DC2626" />
                <Text style={styles.warningText}>DO NOT GIVE! Real banks WILL NOT call to ask for your password or OTP. Hang up and call the official hotline of your bank.</Text>
              </View>
              <TouchableOpacity style={styles.declineBtn}>
                <Ionicons name="call" size={22} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                <Text style={styles.declineTxt}>Decline</Text>
              </TouchableOpacity>
            </View>
          </PhoneShell>
        );

      // ── Prize Scam (Don't: Believe "Nanalo Ka" messages) ─────────────────
      case 'prize_scam':
        return (
          <PhoneShell header={<View style={styles.smsAppBar}><Text style={styles.appBarTitle}>Messages</Text></View>}>
            <Text style={styles.simSectionTitle}>Halimbawa ng Prize Scam SMS</Text>
            <View style={[styles.bubble, styles.dangerBubble, { alignSelf: 'flex-start', marginBottom: 8 }]}>
              <Text style={{ fontSize: 10, color: '#DC2626', fontWeight: '700', marginBottom: 4 }}>+63-999-SCAM-NUM</Text>
              <Text style={styles.bubbleText}>🎉 CONGRATULATIONS! Nanalo ka ng P1,000,000 sa aming raffle!{'\n\n'}I-claim na sa pamamagitan ng: bit.ly/fake-prize{'\n\n'}Mag-register na ng P500 para ma-release ang iyong premyo!</Text>
            </View>
            <View style={styles.warningBubble}>
              <Ionicons name="warning" size={18} color="#DC2626" />
              <Text style={styles.warningText}>SCAM ITO! Mga palatandaan:{'\n'}• Walang nagpapalabas ng raffle na hindi mo sinali{'\n'}• Nagtatanong ng bayad para "i-release" ang premyo{'\n'}• Hindi kilalang numero{'\n\n'}I-DELETE agad ang ganitong mensahe!</Text>
            </View>
          </PhoneShell>
        );

      // ── Password Sharing (Don't: Share password) ──────────────────────────
      case 'password_sharing':
        return (
          <PhoneShell header={<View style={styles.smsAppBar}><Text style={styles.appBarTitle}>Messages</Text></View>}>
            <Text style={styles.simSectionTitle}>Halimbawa ng Password Phishing</Text>
            <View style={[styles.bubble, styles.dangerBubble, { alignSelf: 'flex-start', marginBottom: 8 }]}>
              <Text style={{ fontSize: 10, color: '#DC2626', fontWeight: '700', marginBottom: 4 }}>PEKE – "BPI Customer Service"</Text>
              <Text style={styles.bubbleText}>Mahal na Customer,{'\n\n'}Napansin namin na may kahina-hinalang aktibidad sa inyong account.{'\n\n'}Para ma-secure ang inyong account, mangyaring i-reply ang inyong:{'\n'}• Username:{'\n'}• Password:{'\n'}• OTP Code:</Text>
            </View>
            <View style={styles.warningBubble}>
              <Ionicons name="warning" size={18} color="#DC2626" />
              <Text style={styles.warningText}>DO NOT REPLY! Real banks WILL NEVER ask for your password or OTP via text. Delete and report such messages.</Text>
            </View>
          </PhoneShell>
        );

      // ── Pop-up (Don't: Click pop-up ads) ─────────────────────────────────
      case 'popup':
        return (
          <PhoneShell header={<View style={[styles.addrBarRow, styles.unsecureBar]}><Ionicons name="warning" size={12} color="#DC2626" /><Text style={[styles.addrText, { color: '#DC2626' }]}>http://shady-site.com</Text></View>}>
            <Text style={styles.simSectionTitle}>Halimbawa ng Mapanganib na Pop-up</Text>
            <View style={styles.popupAd}>
              <Ionicons name="warning" size={24} color="#DC2626" style={{ marginBottom: 8 }} />
              <Text style={styles.popupTitle}>VIRUS DETECTED!</Text>
              <Text style={styles.popupTxt}>Nahanap ang 5 virus sa inyong telepono!{'\n'}I-click dito para alisin NGAYON bago masira ang inyong telepono!</Text>
              <TouchableOpacity style={styles.popupBtn}>
                <Text style={styles.popupBtnTxt}>FIX NOW (DO NOT CLICK THIS)</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.warningBubble}>
              <Ionicons name="warning" size={18} color="#DC2626" />
              <Text style={styles.warningText}>THIS IS A SCAM! No website can detect viruses on your phone. Do not click – CLOSE the browser and do not enter any information.</Text>
            </View>
          </PhoneShell>
        );

      // ── SMS Scam (Scams module) ────────────────────────────────────────────
      case 'sms_scam':
        return (
          <PhoneShell header={<View style={styles.smsAppBar}><Text style={styles.appBarTitle}>Messages</Text></View>}>
            <Text style={styles.simSectionTitle}>Fake Prize SMS</Text>
            <View style={[styles.bubble, styles.dangerBubble, { alignSelf: 'flex-start', marginBottom: 8 }]}>
              <Text style={{ fontSize: 10, color: '#DC2626', fontWeight: '700', marginBottom: 4 }}>HINDI KILALANG NUMERO</Text>
              <Text style={styles.bubbleText}>{data.message}</Text>
            </View>
            <View style={styles.warningBubble}>
              <Ionicons name="warning" size={18} color="#DC2626" />
              <Text style={styles.warningText}>{data.warning}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TouchableOpacity style={[styles.actionChip, { backgroundColor: 'rgba(220,38,38,0.1)', borderColor: '#DC2626' }]}>
                <Ionicons name="trash" size={14} color="#DC2626" />
                <Text style={{ fontSize: 12, color: '#DC2626', fontWeight: '600' }}>I-Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionChip, { backgroundColor: 'rgba(220,38,38,0.1)', borderColor: '#DC2626' }]}>
                <Ionicons name="ban" size={14} color="#DC2626" />
                <Text style={{ fontSize: 12, color: '#DC2626', fontWeight: '600' }}>I-Block</Text>
              </TouchableOpacity>
            </View>
          </PhoneShell>
        );

      // ── Email Scam (Scams module) ─────────────────────────────────────────
      case 'email_scam':
        return (
          <PhoneShell header={<View style={[styles.appBarSolid, { backgroundColor: '#1976D2' }]}><Text style={styles.appBarTitle}>Email</Text></View>}>
            <Text style={styles.simSectionTitle}>Fake Bank Email</Text>
            <View style={styles.dangerEmailMsg}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <Ionicons name="warning" size={14} color="#DC2626" />
                <Text style={{ fontSize: 11, color: '#DC2626', fontWeight: '700' }}>KAHINA-HINALANG EMAIL</Text>
              </View>
              <Text style={styles.emailTxt}>{data.message}</Text>
              <View style={styles.dangerLinkBox}>
                <Text style={styles.dangerLinkTxt}>Verify Account – DO NOT CLICK</Text>
              </View>
            </View>
            <View style={styles.warningBubble}>
              <Ionicons name="warning" size={18} color="#DC2626" />
              <Text style={styles.warningText}>{data.warning}</Text>
            </View>
          </PhoneShell>
        );

      // ── Govt Scam (Scams module) ──────────────────────────────────────────
      case 'govt_scam':
        return (
          <PhoneShell header={<View style={styles.smsAppBar}><Text style={styles.appBarTitle}>Messages</Text></View>}>
            <Text style={styles.simSectionTitle}>Fake Government SMS</Text>
            <View style={[styles.bubble, styles.dangerBubble, { alignSelf: 'flex-start', marginBottom: 8 }]}>
              <Text style={{ fontSize: 10, color: '#DC2626', fontWeight: '700', marginBottom: 4 }}>PEKE – "BIR Philippines"</Text>
              <Text style={styles.bubbleText}>{data.message}</Text>
            </View>
            <View style={styles.warningBubble}>
              <Ionicons name="warning" size={18} color="#DC2626" />
              <Text style={styles.warningText}>{data.warning}</Text>
            </View>
            <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 8 }]}>
              <Ionicons name="information-circle" size={18} color="#059669" />
              <Text style={[styles.warningText, styles.safeText]}>Ang BIR, SSS, at iba pang ahensya ng gobyerno ay HINDI nangongolekta ng bayad sa pamamagitan ng text o GCash sa ganitong paraan. Pumunta sa opisyal na tanggapan o tumawag sa kanilang opisyal na hotline.</Text>
            </View>
          </PhoneShell>
        );

      // ── Legit Website (Scams module) ──────────────────────────────────────
      case 'legit_website':
        return (
          <PhoneShell header={
            <View style={[styles.addrBarRow, styles.secureBar]}>
              <Ionicons name="lock-closed" size={14} color="#059669" />
              <Text style={[styles.addrText, { color: '#059669' }]}>https://www.doh.gov.ph</Text>
            </View>
          }>
            <Text style={styles.simSectionTitle}>Ligitimong Government Website</Text>
            <View style={styles.instructionCard}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#059669', marginBottom: 8 }}>Mga Palatandaan na Ligitimo:</Text>
              {[
                'May 🔒 lock icon sa address bar',
                'Nagsisimula sa "https://"',
                'Nagtatapos sa ".gov.ph" para sa gobyerno',
                'May kumpleto na contact information',
                'May opisyal na logo at disenyo',
              ].map((item, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Ionicons name="checkmark-circle" size={14} color="#059669" />
                  <Text style={{ fontSize: 12, color: '#475569', flex: 1 }}>{item}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.govTitle}>Department of Health</Text>
            <Text style={styles.govSub}>Republic of the Philippines</Text>
            <View style={styles.contactBox}>
              <Text style={styles.contactLine}>📞 (02) 8651-7800</Text>
              <Text style={styles.contactLine}>📧 info@doh.gov.ph</Text>
              <Text style={styles.contactLine}>📍 San Lazaro Compound, Manila</Text>
            </View>
            <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 8 }]}>
              <Ionicons name="checkmark-circle" size={18} color="#059669" />
              <Text style={[styles.warningText, styles.safeText]}>{data.warning}</Text>
            </View>
          </PhoneShell>
        );

      // ── Facebook simulator ────────────────────────────────────────────────
      case 'facebook': {
        const hl = data.highlight;
        return (
          <PhoneShell header={
            <View style={[styles.appBarSolid, { backgroundColor: '#1877F2', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14 }]}>
              <Text style={[styles.appBarTitle, { fontSize: 20, fontWeight: 'bold' }]}>facebook</Text>
              <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                <Ionicons name="search" size={22} color="#fff" />
                <Highlight active={hl === 'messenger'} color="#1877F2">
                  <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
                </Highlight>
              </View>
            </View>
          }>
            {/* Nav tabs */}
            <View style={styles.fbTabs}>
              {[
                { ic: 'home', label: 'Home' },
                { ic: 'people', label: 'Friends' },
                { ic: 'play-circle', label: 'Reels' },
                { ic: 'notifications', label: 'Alerts' },
                { ic: 'menu', label: 'Menu' },
              ].map((item, i) => (
                <TouchableOpacity key={i} style={[styles.fbTab, i === 0 && styles.fbTabActive]}>
                  <Ionicons name={item.ic} size={22} color={i === 0 ? '#1877F2' : '#606770'} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Story row */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
              {['Ikaw','Maria','Jose','Ana'].map((name, i) => (
                <View key={i} style={styles.storyItem}>
                  <View style={[styles.storyAvatar, { backgroundColor: i === 0 ? '#1877F2' : '#E4E6EB' }]}>
                    {i === 0 ? <Ionicons name="add" size={18} color="#fff" /> : <Ionicons name="person" size={18} color="#606770" />}
                  </View>
                  <Text style={styles.storyName}>{name}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Post card */}
            <Highlight active={hl === 'newsfeed'} color="#1877F2" style={{ marginBottom: 8 }}>
              <View style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.avatarSmall}><Ionicons name="person" size={16} color="#606770" /></View>
                  <View>
                    <Text style={styles.postName}>Maria Santos</Text>
                    <Text style={styles.postTime}>2 hrs ago · 🌐</Text>
                  </View>
                </View>
                <Text style={styles.postText}>Magandang umaga sa lahat! ☀️ Kumain na ba kayo?</Text>
                <View style={styles.postActions}>
                  <Highlight active={hl === 'like'} color="#1877F2" style={{ flex: 1 }}>
                    <TouchableOpacity style={[styles.postActionBtn, { flex: 1 }]}>
                      <Ionicons name={hl === 'like' ? 'thumbs-up' : 'thumbs-up-outline'} size={18} color={hl === 'like' ? '#1877F2' : '#606770'} />
                      <Text style={[styles.postActionTxt, hl === 'like' && { color: '#1877F2' }]}>Like</Text>
                    </TouchableOpacity>
                  </Highlight>
                  <Highlight active={hl === 'comment'} color="#1877F2" style={{ flex: 1 }}>
                    <TouchableOpacity style={[styles.postActionBtn, { flex: 1 }]}>
                      <Ionicons name="chatbubble-outline" size={18} color={hl === 'comment' ? '#1877F2' : '#606770'} />
                      <Text style={[styles.postActionTxt, hl === 'comment' && { color: '#1877F2' }]}>Comment</Text>
                    </TouchableOpacity>
                  </Highlight>
                  <Highlight active={hl === 'share'} color="#1877F2" style={{ flex: 1 }}>
                    <TouchableOpacity style={[styles.postActionBtn, { flex: 1 }]}>
                      <Ionicons name="share-social-outline" size={18} color={hl === 'share' ? '#1877F2' : '#606770'} />
                      <Text style={[styles.postActionTxt, hl === 'share' && { color: '#1877F2' }]}>Share</Text>
                    </TouchableOpacity>
                  </Highlight>
                </View>
              </View>
            </Highlight>

            {hl === 'messenger' && (
              <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 4 }]}>
                <Ionicons name="information-circle" size={18} color="#1877F2" />
                <Text style={[styles.warningText, { color: '#1877F2' }]}>I-tap ang chat bubble icon sa itaas para buksan ang Messenger at makausap ang inyong mga kamag-anak.</Text>
              </View>
            )}
            {(hl === 'newsfeed' || hl === 'like' || hl === 'comment' || hl === 'share') && (
              <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 4 }]}>
                <Ionicons name="information-circle" size={18} color="#1877F2" />
                <Text style={[styles.warningText, { color: '#1877F2' }]}>{data.detail}</Text>
              </View>
            )}
          </PhoneShell>
        );
      }

      // ── YouTube simulator ─────────────────────────────────────────────────
      case 'youtube': {
        const hl = data.highlight;
        return (
          <PhoneShell header={
            <View style={[styles.appBarSolid, { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="logo-youtube" size={24} color="#FF0000" />
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>YouTube</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                <Highlight active={hl === 'search'} color="#FF0000">
                  <Ionicons name="search" size={22} color={hl === 'search' ? '#FF0000' : '#000'} />
                </Highlight>
                <Ionicons name="notifications-outline" size={22} color="#000" />
                <View style={styles.ytAvatar}><Ionicons name="person" size={14} color="#fff" /></View>
              </View>
            </View>
          }>
            {/* Search bar shown when search is highlighted */}
            {hl === 'search' && (
              <View style={[styles.searchRow, { marginBottom: 10, borderColor: '#FF0000', borderWidth: 1.5 }]}>
                <Ionicons name="search" size={14} color="#FF0000" />
                <Text style={[styles.searchInputText, { color: '#FF0000' }]}>paano magluto ng sinigang</Text>
              </View>
            )}

            {/* Video cards */}
            {[
              { title: 'Paano Magluto ng Adobo', ch: 'Panlasang Pinoy', views: '1.2M views', time: '12:34' },
              { title: 'Balita Ngayon: Latest News', ch: 'GMA News', views: '850K views', time: '8:21' },
            ].map((v, i) => (
              <Highlight key={i} active={hl === 'play' && i === 0} color="#FF0000" style={{ marginBottom: 12 }}>
                <View style={styles.ytCard}>
                  <View style={[styles.ytThumb, hl === 'volume' && i === 0 ? { backgroundColor: '#222' } : {}]}>
                    <Ionicons
                      name={hl === 'play' && i === 0 ? 'pause-circle' : 'play-circle'}
                      size={36}
                      color="#fff"
                    />
                    <View style={styles.ytDuration}><Text style={styles.ytDurTxt}>{v.time}</Text></View>
                  </View>
                  <View style={styles.ytInfo}>
                    <Text style={styles.ytTitle} numberOfLines={2}>{v.title}</Text>
                    <Text style={styles.ytMeta}>{v.ch} · {v.views}</Text>
                    {hl === 'volume' && i === 0 && (
                      <View style={styles.volumeBar}>
                        <Ionicons name="volume-high" size={12} color="#FF0000" />
                        <View style={styles.volumeTrack}><View style={styles.volumeFill} /></View>
                        <Text style={{ fontSize: 10, color: '#FF0000', fontWeight: '700' }}>70%</Text>
                      </View>
                    )}
                  </View>
                </View>
              </Highlight>
            ))}

            {/* Bottom nav */}
            <View style={styles.ytBottomNav}>
              {[
                { ic: 'home', lb: 'Home', hlKey: 'navhome' },
                { ic: 'search', lb: 'Search', hlKey: 'search' },
                { ic: 'add-circle', lb: '', hlKey: null },
                { ic: 'film', lb: 'Library', hlKey: null },
                { ic: 'person', lb: 'You', hlKey: null },
              ].map(({ ic, lb, hlKey }, i) => (
                <Highlight key={i} active={hlKey && hl === hlKey} color="#FF0000">
                  <TouchableOpacity style={styles.ytNavItem}>
                    <Ionicons
                      name={ic}
                      size={i === 2 ? 30 : 22}
                      color={hl === hlKey ? '#FF0000' : i === 0 && hl === 'home' ? '#FF0000' : '#909090'}
                    />
                    {lb !== '' && (
                      <Text style={[styles.ytNavTxt, hl === hlKey && { color: '#FF0000' }]}>{lb}</Text>
                    )}
                  </TouchableOpacity>
                </Highlight>
              ))}
            </View>

            <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 8 }]}>
              <Ionicons name="information-circle" size={18} color="#FF0000" />
              <Text style={[styles.warningText, { color: '#CC0000' }]}>{data.detail}</Text>
            </View>
          </PhoneShell>
        );
      }

      // ── Messenger simulator ───────────────────────────────────────────────
      case 'messenger': {
        const hl = data.highlight;
        return (
          <PhoneShell header={
            <View style={[styles.appBarSolid, { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#0084FF" />
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Chats</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <Ionicons name="camera-outline" size={22} color="#000" />
                <Ionicons name="create-outline" size={22} color="#000" />
              </View>
            </View>
          }>
            {/* Chat list */}
            {[
              { name: 'Maria (Anak)', msg: 'Kumain na po kayo?', time: '5m', unread: true },
              { name: 'Jose (Asawa)', msg: 'Okay lang ako.', time: '1h', unread: false },
              { name: 'Ana (Kaibigan)', msg: 'Magkita tayo bukas!', time: '2h', unread: false },
            ].map((c, i) => (
              <Highlight key={i} active={hl === 'chatlist' && i === 0} color="#0084FF" style={{ marginBottom: 2 }}>
                <View style={styles.chatRow}>
                  <View style={styles.chatAvatar}><Ionicons name="person" size={18} color="#fff" /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.chatName, c.unread && { fontWeight: 'bold' }]}>{c.name}</Text>
                    <Text style={[styles.chatMsg, c.unread && { color: '#000', fontWeight: '600' }]} numberOfLines={1}>{c.msg}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
                      {hl === 'videocall' && i === 0 && (
                        <Highlight active color="#0084FF">
                          <Ionicons name="videocam" size={20} color="#0084FF" />
                        </Highlight>
                      )}
                      {hl === 'voicecall' && i === 0 && (
                        <Highlight active color="#0084FF">
                          <Ionicons name="call" size={20} color="#0084FF" />
                        </Highlight>
                      )}
                    </View>
                    <Text style={styles.chatTime}>{c.time}</Text>
                    {c.unread && <View style={styles.unreadDot} />}
                  </View>
                </View>
              </Highlight>
            ))}

            {/* Call icons shown when highlighted */}
            {(hl === 'videocall' || hl === 'voicecall') && (
              <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginVertical: 8 }}>
                <Highlight active={hl === 'voicecall'} color="#0084FF">
                  <View style={[styles.callIconBtn, { backgroundColor: hl === 'voicecall' ? '#0084FF20' : '#F0F2F5' }]}>
                    <Ionicons name="call" size={22} color="#0084FF" />
                    <Text style={{ fontSize: 10, color: '#0084FF', marginTop: 2 }}>Voice</Text>
                  </View>
                </Highlight>
                <Highlight active={hl === 'videocall'} color="#0084FF">
                  <View style={[styles.callIconBtn, { backgroundColor: hl === 'videocall' ? '#0084FF20' : '#F0F2F5' }]}>
                    <Ionicons name="videocam" size={22} color="#0084FF" />
                    <Text style={{ fontSize: 10, color: '#0084FF', marginTop: 2 }}>Video</Text>
                  </View>
                </Highlight>
              </View>
            )}

            {/* Chat input bar */}
            <Highlight active={hl === 'typemsg' || hl === 'sendphoto'} color="#0084FF" style={{ marginTop: 4 }}>
              <View style={styles.msgrInput}>
                <Highlight active={hl === 'sendphoto'} color="#0084FF">
                  <Ionicons name="camera-outline" size={22} color={hl === 'sendphoto' ? '#0084FF' : '#909090'} />
                </Highlight>
                <Highlight active={hl === 'typemsg'} color="#0084FF" style={{ flex: 1 }}>
                  <View style={styles.msgrTextBox}>
                    <Text style={{ color: hl === 'typemsg' ? '#0084FF' : '#999', fontWeight: hl === 'typemsg' ? '600' : '400' }}>
                      {hl === 'typemsg' ? 'I-type ang mensahe dito...' : 'Aa'}
                    </Text>
                  </View>
                </Highlight>
                <Highlight active={hl === 'sendphoto'} color="#0084FF">
                  <Ionicons name="image-outline" size={22} color={hl === 'sendphoto' ? '#0084FF' : '#909090'} />
                </Highlight>
                <Ionicons name="thumbs-up" size={22} color="#0084FF" />
              </View>
            </Highlight>

            <View style={[styles.warningBubble, styles.safeBubble, { marginTop: 10 }]}>
              <Ionicons name="information-circle" size={18} color="#0084FF" />
              <Text style={[styles.warningText, { color: '#005DB2' }]}>{data.detail}</Text>
            </View>
          </PhoneShell>
        );
      }

      default:
        return (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#475569', fontSize: 14, textAlign: 'center' }}>
              Hindi available ang simulator na ito. Pakisubukan ulit.
            </Text>
          </View>
        );
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SIMULATOR SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (showSimulator) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <GradientBg />
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.simHeader}>
              <View style={styles.simHeaderTop}>
                <BackBtn />
              </View>
              <Text style={styles.simHeaderTitle}>Screen Demo</Text>
              <Text style={styles.simHeaderSub}>Tingnan ang halimbawa sa screen</Text>
            </View>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              {renderSimulatorContent()}
            </View>
            <View style={styles.tipBox}>
              <Text style={styles.tipBoxTitle}>Tandaan:</Text>
              <Text style={styles.tipBoxTxt}>
                • Pag-aralan ang mga warning signs{'\n'}
                • Huwag i-click ang mga kahina-hinalang links{'\n'}
                • Magtanong sa pamilya kung hindi sigurado{'\n'}
                • Ang mga scammer ay laging nagmamadali – huwag magpadali
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // MAIN MENU
  // ════════════════════════════════════════════════════════════════════════════
  if (currentModule === 'menu') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <GradientBg />
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <PageHeader
              title="Internet Safety Tutorial"
              subtitle="Para sa mga Senior Citizens"
              badgeIcon="shield-checkmark"
              badgeText="Internet Safety"
            />
            <View style={styles.moduleList}>
              {TUTORIAL_MODULES.map((m) => (
                <TouchableOpacity key={m.id} style={styles.moduleCard} onPress={() => goToModule(m.id)} activeOpacity={0.9}>
                  <View style={styles.moduleIconBg}><Ionicons name={m.icon} size={30} color="#38BDF8" /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.moduleTitle}>{m.title}</Text>
                    <Text style={styles.moduleSub}>{m.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#38BDF8" />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.menuFooter}>
              <Text style={styles.menuFooterTxt}>I-tap ang "Basahin" para marinig ang bawat lesson</Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // BASICS MODULE
  // ════════════════════════════════════════════════════════════════════════════
  if (currentModule === 'basics') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <GradientBg />
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <PageHeader
              title="Basic Internet Safety"
              subtitle="Matutuhan natin ang mga dapat at hindi dapat gawin para manatiling ligtas."
              badgeIcon="shield-checkmark"
              badgeText="Module"
            />
            <ReadBtn id="basics-main" text="Basic internet safety is knowing how to protect yourself on the internet. Let us learn what to do and what not to do to stay safe." />

            <Text style={styles.sectionLabel}>MGA DAPAT GAWIN</Text>
            {SAFETY_RULES.dos.map((r, i) => (
              <View key={i} style={[styles.ruleCard, { borderLeftColor: '#059669', marginBottom: 12 }]}>
                <TouchableOpacity style={styles.ruleInner} onPress={() => narrate(`${r.text}. ${r.detail}`, `do-${i}`)}>
                  <Text style={styles.ruleTxt}>{r.text}</Text>
                  <Text style={styles.ruleDetail}>{r.detail}</Text>
                  <Ionicons name={isNarrating(`do-${i}`) ? 'stop' : 'volume-medium'} size={20} color="#059669" style={styles.speakIco} />
                </TouchableOpacity>
                <View style={styles.cardFooter}>
                  <SimBtn type={r.simulatorType} data={{ safe: true, detail: r.detail }} />
                </View>
              </View>
            ))}

            <Text style={[styles.sectionLabel, { color: '#DC2626' }]}>DO NOT DO</Text>
            {SAFETY_RULES.donts.map((r, i) => (
              <View key={i} style={[styles.ruleCard, { borderLeftColor: '#DC2626', marginBottom: 12 }]}>
                <TouchableOpacity style={styles.ruleInner} onPress={() => narrate(`${r.text}. ${r.detail}`, `dont-${i}`)}>
                  <Text style={styles.ruleTxt}>{r.text}</Text>
                  <Text style={styles.ruleDetail}>{r.detail}</Text>
                  <Ionicons name={isNarrating(`dont-${i}`) ? 'stop' : 'volume-medium'} size={20} color="#DC2626" style={styles.speakIco} />
                </TouchableOpacity>
                <View style={styles.cardFooter}>
                  <SimBtn type={r.simulatorType} data={{ safe: false, detail: r.detail }} danger />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // BROWSING TIPS MODULE
  // ════════════════════════════════════════════════════════════════════════════
  if (currentModule === 'browsing') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <GradientBg />
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <PageHeader
              title="Safe Browsing Tips"
              subtitle="Matutuhan natin ang tatlong simpleng paraan para mag-browse nang ligtas sa internet."
              badgeIcon="globe"
              badgeText="Browsing"
            />
            <ReadBtn id="browsing-main" text="Let us learn three simple ways to browse the internet safely. Always check the lock icon, use a search engine, and do not be shy to ask your family." />
            {BROWSING_TIPS.map((t, i) => (
              <View key={i} style={styles.tipCard}>
                <TouchableOpacity style={styles.listenIconCorner} onPress={() => narrate(`${t.title}. ${t.description}`, `tip-${i}`)}>
                  <Ionicons name={isNarrating(`tip-${i}`) ? 'stop' : 'volume-medium'} size={18} color="#38BDF8" />
                </TouchableOpacity>
                <Text style={styles.tipTitle}>{t.title}</Text>
                <Text style={styles.tipDesc}>{t.description}</Text>
                <View style={styles.exampleBox}><Text style={styles.exampleTxt}>{t.example}</Text></View>
                <View style={styles.cardFooter}>
                  <SimBtn type={t.simulatorType} data={{ safe: true, detail: t.description }} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCAMS MODULE
  // ════════════════════════════════════════════════════════════════════════════
  if (currentModule === 'scams') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <GradientBg />
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <PageHeader
              title="Paano Makilala ang mga Scam"
              subtitle="Maraming uri ng scam sa internet. Matutuhan natin kung paano sila makilala para hindi kayo maging biktima."
              badgeIcon="warning"
              badgeText="Scam"
            />
            <ReadBtn id="scams-main" text="There are many kinds of scams on the internet. Let us learn how to identify them so you do not become a victim. Scammers pretend to be banks, governments, or offer fake prizes." />
            {SCAM_EXAMPLES.map((s, i) => (
              <View key={i} style={[styles.scamCard, s.safe ? styles.safeCard : styles.dangerCard, { marginBottom: 16 }]}> 
                <TouchableOpacity style={styles.listenIconCorner} onPress={() => narrate(`${s.type}. ${s.message}. ${s.warning}`, `scam-${i}`)}>
                  <Ionicons name={isNarrating(`scam-${i}`) ? 'stop' : 'volume-medium'} size={18} color="#38BDF8" />
                </TouchableOpacity>
                <Text style={styles.scamType}>{s.type}</Text>
                <Text style={styles.scamMsg}>"{s.message}"</Text>
                <Text style={[styles.scamWarning, s.safe && { color: '#059669' }]}>{s.warning}</Text>
                <View style={styles.cardFooter}>
                  <SimBtn type={s.simulatorType} data={s} danger={!s.safe} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // COMMON APPS MODULE
  // ════════════════════════════════════════════════════════════════════════════
  if (currentModule === 'apps') {
    if (selectedApp) {
      const app = COMMON_APPS.find(a => a.id === selectedApp);
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <GradientBg />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              <PageHeader
                title={app.name}
                subtitle={app.description}
                badgeIcon={app.icon}
                badgeText={app.name}
              />
              <ReadBtn
                id={`app-${app.id}`}
                text={`${app.name}. ${app.description}. ${app.steps.map(s => s.title + ': ' + s.detail).join('. ')}`}
              />
                {app.steps.map((s, i) => (
                  <View key={i} style={[styles.ruleCard, { borderLeftColor: app.color }]}>
                    <TouchableOpacity
                      style={styles.ruleInner}
                      onPress={() => narrate(`Step ${i + 1}: ${s.title}. ${s.detail}`, `apstep-${i}`)}
                    >
                      <Text style={[styles.ruleTxt, { color: app.color }]}>
                        Step {i + 1}: {s.title}
                      </Text>
                      <Text style={styles.ruleDetail}>{s.detail}</Text>
                      <Ionicons
                        name={isNarrating(`apstep-${i}`) ? 'stop' : 'volume-medium'}
                        size={20}
                        color={app.color}
                        style={styles.speakIco}
                      />
                    </TouchableOpacity>
                    <View style={styles.cardFooter}>
                      <SimBtn
                        type={app.simulatorType}
                        data={{ detail: s.detail, highlight: s.highlight }}
                        appColor={app.color}
                      />
                    </View>
                  </View>
                ))}

              <View style={styles.quickTryCard}>
                <Text style={styles.quickTryTitle}>Subukan ang buong simulator</Text>
                <Text style={styles.quickTryDesc}>Tingnan ang {app.name} sa screen demo</Text>
                <SimBtn
                  type={app.simulatorType}
                  data={{ detail: `Ito ang ${app.name} app. I-tap ang bawat Step button sa itaas para makita ang bawat bahagi ng app.`, highlight: null }}
                  appColor={app.color}
                />
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <GradientBg />
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <PageHeader
              title="Common Apps Tutorial"
              subtitle="Matutuhan natin kung paano gamitin ang mga sikat na apps tulad ng Facebook, YouTube, at Messenger."
              badgeIcon="apps"
              badgeText="Apps"
            />
            <ReadBtn
              id="apps-main"
              text="Matutuhan natin kung paano gamitin ang mga sikat na apps tulad ng Facebook para makipag-ugnayan sa pamilya, YouTube para manood ng video, at Messenger para makausap ang mga mahal sa buhay."
            />

            <Text style={styles.sectionLabel}>PILIIN ANG APP</Text>

            <View style={styles.moduleList}>
              {COMMON_APPS.map((app) => (
                <TouchableOpacity
                  key={app.id}
                  style={styles.moduleCard}
                  onPress={() => setSelectedApp(app.id)}
                  activeOpacity={0.9}
                >
                  <View style={styles.moduleCardLeft}>
                    <View style={[styles.moduleIconBg, { backgroundColor: `${app.color}20` }]}> 
                      <Ionicons name={app.icon} size={30} color={app.color} />
                    </View>
                    <View style={styles.moduleCardText}>
                      <Text style={styles.moduleTitle}>{app.name}</Text>
                      <Text style={styles.moduleSub}>{app.description}</Text>
                    </View>
                  </View>
                  <View style={styles.moduleCardRight}>
                    <View style={styles.appStepBadge}>
                      <Text style={[styles.appStepBadgeTxt, { color: app.color }]}>
                        {app.steps.length} Steps
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={app.color} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  safeArea:           { flex: 1, backgroundColor: '#F0F9FF' },
  container:          { flex: 1 },
  gradientBackground: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  scrollView:         { flex: 1 },
  scrollContent:      { padding: 20, paddingTop: 0, paddingBottom: 60 },

  // ── Back button ────────────────────────────────────────────────────────────
  backButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 4,
  },
  backButtonText: { marginLeft: 6, fontSize: 15, fontWeight: '600', color: '#0F172A' },

  pageHeader: {
    marginBottom: 10,
    marginHorizontal: -20,
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 20,
    paddingBottom: 12,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  pageHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  pageHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: 'rgba(56,189,248,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  pageHeaderBadgeText: { color: '#38BDF8', fontSize: 12, fontWeight: '600' },
  pageHeaderTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', lineHeight: 36, marginBottom: 6 },
  pageHeaderSub: { fontSize: 15, color: '#475569', marginBottom: 8 },
  pageHeaderProgressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 6,
  },
  pageHeaderProgressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  pageHeaderProgressLabel: {
    fontSize: 11,
    color: '#64748B',
  },

  moduleList: { rowGap: 16, marginTop: 18 },

  // ── Menu ───────────────────────────────────────────────────────────────────
  menuHeader: {
    alignItems: 'center', marginBottom: 28, backgroundColor: 'rgba(255,255,255,0.96)',
    padding: 24, borderRadius: 28, elevation: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16,
  },
  menuIconCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#F0F9FF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  menuTitle:   { fontSize: 28, fontWeight: 'bold', color: '#0F172A', textAlign: 'center', marginBottom: 6 },
  menuSub:     { fontSize: 15, color: '#475569', textAlign: 'center', marginBottom: 16 },
  menuDivider: { width: 56, height: 4, backgroundColor: '#38BDF8', borderRadius: 2 },
  menuFooter: {
    backgroundColor: 'rgba(255,255,255,0.9)', padding: 18, borderRadius: 14, marginTop: 24, alignItems: 'center',
  },
  menuFooterTxt: { fontSize: 15, color: '#0F172A', fontWeight: '500', textAlign: 'center' },

  moduleCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 16, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 3,
    borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8,
  },
  moduleCardLeft: {
    flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 14, minWidth: 0,
  },
  moduleCardText: {
    flex: 1, minWidth: 0,
  },
  moduleCardRight: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
  },
  moduleIconBg: {
    width: 52, height: 52, borderRadius: 20, backgroundColor: '#EFF6FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: '#DBEAFE',
  },
  moduleTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  moduleSub:   { fontSize: 14, color: '#64748B', lineHeight: 20 },
  appStepBadge:    { backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 0 },
  appStepBadgeTxt: { fontSize: 12, fontWeight: '700' },

  // ── Lesson header ──────────────────────────────────────────────────────────
  lessonHeader: {
    alignItems: 'center', marginBottom: 24, backgroundColor: 'rgba(255,255,255,0.96)',
    padding: 24, borderRadius: 26, elevation: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16,
  },
  lessonTitle: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', textAlign: 'center', marginBottom: 16 },

  // ── Audio button ───────────────────────────────────────────────────────────
  audioBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9FF',
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    borderWidth: 2, borderColor: '#38BDF8',
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 16,
  },
  speakingBtn:         { backgroundColor: '#38BDF8' },
  audioBtnText:        { marginLeft: 7, fontSize: 15, fontWeight: '600', color: '#38BDF8' },
  audioBtnTextActive:  { color: '#fff' },

  // ── Section label ──────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 18, fontWeight: 'bold', color: '#059669',
    marginBottom: 14, marginTop: 10, textAlign: 'left',
  },

  // ── Rule card ──────────────────────────────────────────────────────────────
  ruleCard: {
    backgroundColor: 'rgba(255,255,255,0.93)', borderRadius: 14,
    elevation: 4, borderLeftWidth: 5, overflow: 'hidden', marginBottom: 16, padding: 20,
  },
  ruleInner:  { position: 'relative' },
  ruleTxt:    { fontSize: 17, fontWeight: 'bold', color: '#0F172A', paddingRight: 40, lineHeight: 23, marginBottom: 6 },
  ruleDetail: { fontSize: 15, color: '#475569', lineHeight: 21, paddingRight: 40 },
  speakIco:   { position: 'absolute', top: 18, right: 18 },

  simulatorBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(5,150,105,0.1)',
    paddingHorizontal: 12, paddingVertical: 8, marginTop: 14, marginHorizontal: 0,
    borderRadius: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#059669',
  },
  dangerSimulatorBtn:  { backgroundColor: 'rgba(220,38,38,0.08)', borderColor: '#DC2626' },
  simulatorBtnText:    { marginLeft: 6, fontSize: 13, fontWeight: '600', color: '#059669' },
  dangerSimulatorText: { color: '#DC2626' },

  // ── Tip card ───────────────────────────────────────────────────────────────
  tipCard: {
    backgroundColor: 'rgba(255,255,255,0.93)', padding: 20, borderRadius: 14, marginBottom: 18,
    elevation: 4, borderLeftWidth: 5, borderLeftColor: '#0EA5E9',
  },
  tipTitle:   { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 8, paddingRight: 48 },
  tipDesc:    { fontSize: 15, color: '#475569', lineHeight: 21, marginBottom: 12 },
  exampleBox: { backgroundColor: 'rgba(14,165,233,0.1)', padding: 12, borderRadius: 8, marginBottom: 14 },
  exampleTxt: { fontSize: 13, color: '#0F172A', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', lineHeight: 20 },
  tipActions: { flexDirection: 'row', gap: 10 },
  listenBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9FF',
    paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: '#38BDF8',
  },
  listenIconBtn: {
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F9FF', borderRadius: 12,
    borderWidth: 1, borderColor: '#38BDF8', marginRight: 10,
  },
  listenIconCorner: {
    position: 'absolute', top: 14, right: 14, width: 38, height: 38,
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F9FF', borderRadius: 12,
    borderWidth: 1, borderColor: '#38BDF8', zIndex: 2,
  },
  cardFooter: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  listenTxt: { color: '#38BDF8', fontSize: 13, marginLeft: 5, fontWeight: '600' },

  // ── Scam card ──────────────────────────────────────────────────────────────
  scamCard: {
    backgroundColor: 'rgba(255,255,255,0.93)', padding: 20, borderRadius: 14,
    elevation: 4, borderLeftWidth: 5,
  },
  safeCard:    { borderLeftColor: '#10B981' },
  dangerCard:  { borderLeftColor: '#DC2626' },
  scamType:    { fontSize: 17, fontWeight: 'bold', color: '#0F172A', marginBottom: 10, paddingRight: 48 },
  scamMsg:     { fontSize: 14, fontStyle: 'italic', color: '#475569', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, lineHeight: 20, marginBottom: 10 },
  scamWarning: { fontSize: 15, fontWeight: '600', color: '#DC2626', marginBottom: 14, lineHeight: 21 },
  scamActions: { flexDirection: 'row', gap: 10 },

  // ── App detail ─────────────────────────────────────────────────────────────
  appDetailIcon: {
    width: 72, height: 72, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  appDetailDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 16 },

  // ── Quick try card ─────────────────────────────────────────────────────────
  quickTryCard: {
    backgroundColor: 'rgba(255,255,255,0.95)', padding: 20, borderRadius: 18, marginTop: 18,
    elevation: 4, alignItems: 'flex-start', borderWidth: 1, borderColor: '#E2E8F0',
  },
  quickTryTitle:  { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  quickTryDesc:   { fontSize: 14, color: '#64748B', marginBottom: 14 },
  quickTryBtn:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, gap: 8 },
  quickTryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },

  // ── Simulator shell ────────────────────────────────────────────────────────
  phoneShell: {
    width: width * 0.82, maxWidth: 330,
    backgroundColor: '#1C1C1E', borderRadius: 22, overflow: 'hidden',
    elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 14,
  },
  statusBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff',
  },
  statusTime: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  phoneBody:  { backgroundColor: '#fff', padding: 14, minHeight: 320, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },

  simSectionTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 10, textAlign: 'center' },

  // App bars
  appBarSolid: { paddingHorizontal: 14, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  appBarTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  smsAppBar:   { backgroundColor: '#007AFF', paddingHorizontal: 14, paddingVertical: 13 },

  // Address bar
  addrBarRow: {
    flexDirection: 'row', alignItems: 'center', margin: 8, paddingHorizontal: 10, paddingVertical: 7,
    borderRadius: 8, borderWidth: 2, backgroundColor: '#fff',
  },
  secureBar:  { borderColor: '#059669' },
  unsecureBar:{ borderColor: '#DC2626' },
  addrText:   { marginLeft: 6, fontSize: 13, flex: 1 },

  // Search bar
  searchRow: {
    flexDirection: 'row', alignItems: 'center', margin: 8, paddingHorizontal: 10, paddingVertical: 8,
    borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
  },
  searchInputText: { marginLeft: 6, fontSize: 13, color: '#64748B', flex: 1 },

  // Compare block
  compareBlock: { padding: 10, borderRadius: 8, borderWidth: 1.5 },
  compareLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },

  // Instruction card
  instructionCard: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginBottom: 12 },
  instructionStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  stepNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#38BDF8', justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  stepNumTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepTxt: { flex: 1, fontSize: 13, color: '#475569', lineHeight: 18 },

  // Known sites
  knownSiteRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  siteIconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  siteName: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  siteUrl:  { fontSize: 11, color: '#059669', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  // Chat bubbles
  bubble:       { padding: 12, borderRadius: 14, marginBottom: 6, maxWidth: '85%' },
  dangerBubble: { backgroundColor: '#FFE5E5', borderWidth: 2, borderColor: '#DC2626' },
  bubbleSender: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 3 },
  bubbleText:   { fontSize: 13, color: '#000', lineHeight: 19 },

  // Action chips
  actionChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },

  // Email
  emailMsg:      { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: '#1976D2' },
  dangerEmailMsg:{ backgroundColor: '#FFE5E5', padding: 12, borderRadius: 8, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: '#DC2626' },
  emailTxt:      { fontSize: 13, color: '#333', lineHeight: 19, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  dangerLinkBox: { marginTop: 10, backgroundColor: '#DC2626', padding: 8, borderRadius: 6 },
  dangerLinkTxt: { color: '#fff', fontWeight: 'bold', fontSize: 13, textAlign: 'center' },

  // Warning bubbles
  warningBubble: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(220,38,38,0.08)',
    padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#DC2626', marginTop: 6,
  },
  safeBubble: { backgroundColor: 'rgba(5,150,105,0.08)', borderColor: '#059669' },
  warningText:{ marginLeft: 8, fontSize: 13, color: '#DC2626', fontWeight: '600', flex: 1, lineHeight: 18 },
  safeText:   { color: '#059669' },

  // Call screen
  callScreen:   { padding: 10 },
  callerAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 10, marginTop: 10 },
  callerName:   { fontSize: 18, fontWeight: 'bold', color: '#0F172A', textAlign: 'center', marginBottom: 4 },
  callerNum:    { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 14 },
  callQuote:    { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, marginBottom: 12 },
  callQtxt:     { fontSize: 13, color: '#0F172A', fontStyle: 'italic', textAlign: 'center', lineHeight: 18 },
  declineBtn:   {
    backgroundColor: '#FF3B30', width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10,
  },
  declineTxt: { color: '#fff', fontSize: 11, marginTop: 3, fontWeight: '600' },

  // Call icon buttons (messenger video/voice)
  callIconBtn: { alignItems: 'center', padding: 10, borderRadius: 12, minWidth: 60 },

  // Website
  govTitle:   { fontSize: 16, fontWeight: 'bold', color: '#1976D2', textAlign: 'center', marginBottom: 4 },
  govSub:     { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 10 },
  contactBox: { backgroundColor: '#F5F5F5', padding: 10, borderRadius: 10, marginBottom: 10 },
  contactLine:{ fontSize: 12, color: '#475569', marginBottom: 5, lineHeight: 17 },

  // Search result
  searchResult: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#059669' },
  srTitle:      { fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  srUrl:        { fontSize: 11, color: '#059669', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 4 },
  srDesc:       { fontSize: 12, color: '#64748B' },

  // URL compare
  correctUrl: { fontSize: 12, color: '#059669', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', backgroundColor: 'rgba(5,150,105,0.1)', padding: 6, borderRadius: 4, marginBottom: 4 },
  wrongUrl:   { fontSize: 12, color: '#DC2626', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', backgroundColor: 'rgba(220,38,38,0.1)', padding: 6, borderRadius: 4, marginBottom: 4 },

  // Logout
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#DC2626', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, gap: 8, marginBottom: 10, marginTop: 10 },
  logoutTxt: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  // Password
  pwLabel:  { fontSize: 13, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  weakPw:   { fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#DC2626', backgroundColor: 'rgba(220,38,38,0.1)', padding: 8, borderRadius: 6, marginBottom: 4 },
  strongPw: { fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', padding: 8, borderRadius: 6, marginBottom: 4 },

  // Pop-up
  popupAd:     { backgroundColor: '#FEF2F2', padding: 16, borderRadius: 14, borderWidth: 2, borderColor: '#DC2626', alignItems: 'center', marginBottom: 10 },
  popupTitle:  { fontSize: 16, fontWeight: 'bold', color: '#DC2626', marginBottom: 8, textAlign: 'center' },
  popupTxt:    { fontSize: 13, color: '#0F172A', marginBottom: 14, textAlign: 'center', lineHeight: 18 },
  popupBtn:    { backgroundColor: '#DC2626', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  popupBtnTxt: { color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },

  // ── Facebook styles ────────────────────────────────────────────────────────
  fbTabs:      { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E4E6EB', marginBottom: 10 },
  fbTab:       { flex: 1, paddingVertical: 10, alignItems: 'center' },
  fbTabActive: { borderBottomWidth: 3, borderBottomColor: '#1877F2' },
  storyItem:   { alignItems: 'center', marginRight: 10, width: 60 },
  storyAvatar: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 4, borderWidth: 2, borderColor: '#1877F2' },
  storyName:   { fontSize: 11, color: '#333', textAlign: 'center' },
  postCard:    { backgroundColor: '#fff', borderRadius: 8, marginBottom: 4, borderWidth: 1, borderColor: '#E4E6EB' },
  postHeader:  { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 8 },
  avatarSmall: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E4E6EB', justifyContent: 'center', alignItems: 'center' },
  postName:    { fontSize: 14, fontWeight: 'bold', color: '#000' },
  postTime:    { fontSize: 11, color: '#606770' },
  postText:    { fontSize: 14, color: '#1C1E21', paddingHorizontal: 10, paddingBottom: 10, lineHeight: 20 },
  postActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E4E6EB' },
  postActionBtn:{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 4 },
  postActionTxt:{ fontSize: 13, color: '#606770', fontWeight: '600' },

  // ── YouTube styles ─────────────────────────────────────────────────────────
  ytAvatar:   { width: 28, height: 28, borderRadius: 14, backgroundColor: '#909090', justifyContent: 'center', alignItems: 'center' },
  ytCard:     { flexDirection: 'row', gap: 10 },
  ytThumb:    { width: 110, height: 65, backgroundColor: '#0F172A', borderRadius: 6, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  ytDuration: { position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3 },
  ytDurTxt:   { fontSize: 10, color: '#fff', fontWeight: '600' },
  ytInfo:     { flex: 1 },
  ytTitle:    { fontSize: 13, fontWeight: '600', color: '#0F172A', lineHeight: 18, marginBottom: 4 },
  ytMeta:     { fontSize: 11, color: '#606060', lineHeight: 15 },
  volumeBar:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  volumeTrack:{ flex: 1, height: 4, backgroundColor: '#E4E6EB', borderRadius: 2 },
  volumeFill: { width: '70%', height: '100%', backgroundColor: '#FF0000', borderRadius: 2 },
  ytBottomNav:{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E4E6EB', paddingTop: 6, marginTop: 6, marginBottom: 4 },
  ytNavItem:  { flex: 1, alignItems: 'center', gap: 2 },
  ytNavTxt:   { fontSize: 10, color: '#909090' },

  // ── Messenger styles ───────────────────────────────────────────────────────
  chatRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F2F5', gap: 10 },
  chatAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#0084FF', justifyContent: 'center', alignItems: 'center' },
  chatName:   { fontSize: 14, color: '#000', fontWeight: '500' },
  chatMsg:    { fontSize: 13, color: '#606770', lineHeight: 18 },
  chatTime:   { fontSize: 11, color: '#606770' },
  unreadDot:  { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0084FF', marginTop: 4 },
  msgrInput:  { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#E4E6EB', marginTop: 4 },
  msgrTextBox:{ flex: 1, backgroundColor: '#F0F2F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },

  // ── Simulator screen header ────────────────────────────────────────────────
  simHeader: {
    alignItems: 'stretch', marginBottom: 18, backgroundColor: 'transparent',
    padding: 0, borderRadius: 0, elevation: 0,
    shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0,
  },
  simHeaderTop: {
    alignItems: 'flex-start', marginBottom: 12,
  },
  simHeaderTitle: { fontSize: 22, fontWeight: 'bold', color: '#0F172A', marginBottom: 4, textAlign: 'center' },
  simHeaderSub:   { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 16 },
  tipBox:     { backgroundColor: 'rgba(255,255,255,0.92)', padding: 18, borderRadius: 14, elevation: 4 },
  tipBoxTitle:{ fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 10 },
  tipBoxTxt:  { fontSize: 14, color: '#475569', lineHeight: 22 },
});