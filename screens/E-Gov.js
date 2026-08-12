import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Dimensions,
  Platform,
  Linking,
} from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

// ─────────────────────────────────────────────
// MODULE DEFINITIONS
// ─────────────────────────────────────────────
const EGOV_MODULES = [
  {
    id: "ids",
    title: "IDs at Rehistrasyon",
    icon: "card",
    description: "OSCA ID, PhilSys, at Digital Senior Citizens ID",
  },
  {
    id: "benefits",
    title: "Mga Benepisyo at Diskwento",
    icon: "gift",
    description: "20% diskwento, VAT exemption, at iba pang pribilehiyo",
  },
  {
    id: "health",
    title: "Serbisyong Pangkalusugan",
    icon: "medical",
    description: "PhilHealth, Dr. PJG Hospital, at libreng medikal na serbisyo",
  },
  {
    id: "pension",
    title: "Social Pension",
    icon: "wallet",
    description: "DSWD SocPen, SSS, at GSIS na pensiyon",
  },
  {
    id: "apps",
    title: "Gabay sa eGov Apps",
    icon: "apps",
    description: "eGovPH, SSS, PhilHealth, at Pag-IBIG apps",
  },
  {
    id: "legal",
    title: "Legal na Proteksyon",
    icon: "shield-checkmark",
    description: "RA 9994 at pag-uulat ng elder abuse",
  },
  {
    id: "lgu",
    title: "LGU / Barangay Serbisyo",
    icon: "business",
    description: "Cabanatuan City Hall, OSCA, at barangay na serbisyo",
  },
  {
    id: "hotlines",
    title: "Mga Hotline at Emergency",
    icon: "call",
    description: "NCSC, DSWD Nueva Ecija, PhilHealth, SSS, at 911",
  },
];

// ─────────────────────────────────────────────
// CONTENT DATA
// ─────────────────────────────────────────────
const IDS_CONTENT = [
  {
    title: "OSCA ID – Cabanatuan City",
    description:
      "Ang OSCA ID ay ang pangunahing ID ng mga senior citizen. Sa Cabanatuan City, ito ay ibinibigay ng Office of the City Mayor – OSCA Office sa Cabanatuan City Hall, M. de Leon Avenue.",
    steps: [
      "Pumunta sa OSCA Office sa Cabanatuan City Hall, M. de Leon Avenue",
      "Magdala ng PSA Birth Certificate at dalawang valid ID",
      "Magdala ng dalawang 1x1 na larawan at barangay certificate of residency",
      "Punan ang application form – libre ang pagproseso",
      "Ang ID ay maaaring makuha sa loob ng ilang araw ng trabaho",
    ],
    requirement: "60 taong gulang pataas, residente ng Cabanatuan City",
    simulatorType: "osca_id",
    icon: "card-outline",
    color: "#0EA5E9",
  },
  {
    title: "PhilSys / National ID",
    description:
      "Ang Philippine Identification System (PhilSys) ay ang pambansang ID ng lahat ng Pilipino. Ang PSA office para sa Nueva Ecija ay matatagpuan sa Cabanatuan City. Libre ito para sa lahat.",
    steps: [
      "Mag-register sa philsys.gov.ph o pumunta sa PSA-Nueva Ecija office",
      "Magdala ng PSA Birth Certificate o passport",
      "Kumuha ng biometrics (fingerprint at litrato) sa designated registration center",
      "Hintayin ang PhilSys card na ipapadala sa inyong tirahan",
    ],
    requirement: "Lahat ng Pilipinong residente ng Cabanatuan City",
    simulatorType: "philsys",
    icon: "id-card-outline",
    color: "#059669",
  },
  {
    title: "Digital NSCID (National Senior Citizen ID)",
    description:
      "Ang Digital NSCID ay available na sa eGovPH Super App. Maaari na ninyong gamitin ang inyong senior citizen ID sa inyong telepono kahit saan sa Cabanatuan City at buong Pilipinas.",
    steps: [
      "I-download ang eGovPH Super App sa inyong Android o iPhone",
      "Gumawa ng account gamit ang inyong numero ng telepono",
      "I-link ang inyong OSCA ID mula sa Cabanatuan City",
      "I-access ang inyong Digital NSCID sa app – tinatanggap sa lahat ng establisyimento",
    ],
    requirement: "May OSCA ID na mula sa Cabanatuan City",
    simulatorType: "digital_id",
    icon: "phone-portrait-outline",
    color: "#7C3AED",
  },
];

const BENEFITS_CONTENT = [
  {
    title: "20% Diskwento + VAT Exemption",
    description:
      "Ang lahat ng senior citizen ng Cabanatuan City ay may karapatang makatanggap ng 20% diskwento at VAT exemption sa maraming pagbili sa lahat ng establisyimento sa lungsod.",
    items: [
      "Pagkain at inumin sa mga restaurant (Jollibee, McDonald's, SM Food Court, at iba pa)",
      "Gamot at medical supplies sa lahat ng botika sa Cabanatuan",
      "Medical at dental services sa mga clinic at ospital",
      "Transportasyon (jeep, bus, tricycle, at iba pa)",
      "SM City Cabanatuan, Robinson's, at iba pang entertainment",
    ],
    simulatorType: "discount",
    icon: "pricetag-outline",
    color: "#D97706",
  },
  {
    title: "Libreng Serbisyo sa Dr. PJG Memorial Hospital",
    description:
      "Ang Dr. Paulino J. Garcia Memorial Research and Medical Center (Dr. PJG) sa Mabini Street, Cabanatuan City ang pangunahing government hospital. PhilHealth-accredited at may libreng serbisyo para sa mga senior.",
    items: [
      "Libreng konsultasyon sa OPD (Out-Patient Department)",
      "Libreng dental check-up sa dental clinic ng ospital",
      "Diskwento sa laboratory tests at diagnostic procedures",
      "Libreng flu at pneumonia vaccines (tuwing may vaccination drive)",
      "Priority lane para sa mga senior citizen sa lahat ng departamento",
    ],
    simulatorType: null,
    icon: "medkit-outline",
    color: "#DC2626",
  },
  {
    title: "5% Diskwento sa Kuryente at Tubig",
    description:
      "Kung ang meter ng kuryente o tubig ay nasa pangalan ng senior citizen, may 5% diskwento sa monthly bills.",
    items: [
      "5% diskwento sa electric bill (hanggang 100 kWh bawat buwan)",
      "5% diskwento sa water bill (hanggang 30 m³ bawat buwan)",
      "Ang meter ng kuryente o tubig ay dapat nasa pangalan ng senior citizen",
      "Ipakita ang OSCA ID sa inyong electric/water provider para ma-avail",
    ],
    simulatorType: null,
    icon: "flash-outline",
    color: "#7C3AED",
  },
];

const HEALTH_CONTENT = [
  {
    title: "PhilHealth – NE Pacific Mall Branch, Cabanatuan",
    description:
      "Ang PhilHealth office sa Cabanatuan City ay nasa 2/F NE Pacific Mall, Km 111, Maharlika Highway, Brgy. H. Concepcion. Ang lahat ng senior citizen na 60 taong gulang pataas ay awtomatikong lifetime member.",
    steps: [
      "Pumunta sa PhilHealth office sa 2/F NE Pacific Mall, Maharlika Highway",
      "Magdala ng OSCA ID at PSA Birth Certificate",
      "Kumuha ng MDR (Member Data Record) para sa records",
      "Gamitin ang PhilHealth card sa Dr. PJG Hospital at iba pang accredited hospitals",
      "Contact: (044) 940-3723",
    ],
    simulatorType: "philhealth",
    icon: "heart-outline",
    color: "#DC2626",
  },
  {
    title: "Dr. PJG Memorial Hospital – DOH Programs",
    description:
      "Ang Dr. Paulino J. Garcia Memorial Research and Medical Center sa Mabini Street, Cabanatuan City ay ang pangunahing DOH-retained hospital sa Nueva Ecija. Ito ay Level 3 hospital na may 600 beds. Hotline: (044) 463-8888.",
    steps: [
      "Libreng medicines sa OPD para sa indigent na senior citizens",
      "Malasakit Center sa loob ng ospital para sa pinansiyal na tulong",
      "YAKAP Mental Health Program para sa senior citizens",
      "TB-DOTS at Cancer Screening programs para sa matatanda",
      "Address: Mabini Street, Brgy. Quezon District, Cabanatuan City | Tel: (044) 463-8888",
    ],
    simulatorType: null,
    icon: "fitness-outline",
    color: "#059669",
  },
  {
    title: "M.V. Gallego Cabanatuan City General Hospital",
    description:
      "Ang M.V. Gallego Cabanatuan City General Hospital ay isa pang government hospital sa Cabanatuan City na nagbibigay ng serbisyo sa mga senior citizen.",
    steps: [
      "Libreng konsultasyon para sa mga senior citizen",
      "Priority lane sa outpatient department",
      "Koordinasyon sa CSWD para sa indigent na pasyente",
      "Referral system para sa mas kumplikadong kaso sa Dr. PJG",
    ],
    simulatorType: null,
    icon: "fitness-outline",
    color: "#0EA5E9",
  },
];

const PENSION_CONTENT = [
  {
    title: "DSWD Social Pension – Cabanatuan City",
    description:
      "Ang DSWD SWAD Nueva Ecija ay nasa Mabini Extension Street, Cabanatuan City. Nagbibigay ng ₱1,000 bawat buwan sa mga kuwalipikadong indigent na senior citizen.",
    requirements: [
      "60 taong gulang pataas, residente ng Cabanatuan City",
      "Walang regular na pensiyon (SSS/GSIS)",
      "Mahirap o indigent ang estado – walang sapat na suporta",
      "Hindi nakatanggap ng iba pang government cash pension",
    ],
    howToApply: [
      "Pumunta sa inyong barangay hall para sa referral at barangay certificate",
      "Makipag-ugnayan sa City Social Welfare and Development Office (CSWDO) ng Cabanatuan",
      "Punan ang DSWD application form at isumite ang mga dokumento",
      "Hintayin ang assessment at validation ng DSWD SWAD Nueva Ecija",
      "DSWD SWAD Nueva Ecija: Mabini Extension Street, Cabanatuan City",
    ],
    amount: "₱1,000 / buwan",
    simulatorType: "dswd",
    icon: "cash-outline",
    color: "#059669",
  },
  {
    title: "SSS Pension – Cabanatuan Branch",
    description:
      "Ang SSS Cabanatuan Branch ay nasa NE Pacific Shopping Center, KM 111, Maharlika Highway, Brgy. H. Concepcion. Para ito sa mga dating empleyado sa private sector.",
    requirements: [
      "60 taong gulang para sa optional retirement",
      "65 taong gulang para sa mandatory retirement",
      "Hindi bababa sa 120 monthly contributions sa SSS",
    ],
    howToApply: [
      "Pumunta sa SSS Cabanatuan Branch sa NE Pacific Mall, Maharlika Highway",
      "O mag-file online sa My.SSS app o website (my.sss.gov.ph)",
      "Magdala ng SSS ID/UMID at PSA Birth Certificate",
      "Piliin ang paraan ng pagbabayad (bank o GCash)",
      "Tel: (044) 463-0691 | Email: cabanatuan@sss.gov.ph",
    ],
    amount: "Depende sa contributions",
    simulatorType: "sss",
    icon: "business-outline",
    color: "#0EA5E9",
  },
  {
    title: "GSIS Pension – Cabanatuan Branch",
    description:
      "Ang GSIS Cabanatuan Branch ay nasa NFA Compound, Maharlika Highway, Cabanatuan City. Para ito sa mga dating empleyado ng pamahalaan sa Nueva Ecija at Aurora.",
    requirements: [
      "Naglingkod sa gobyerno ng Nueva Ecija o iba pang LGU/national agency",
      "15 taon o higit na serbisyo sa gobyerno",
      "60 taong gulang pataas",
    ],
    howToApply: [
      "Pumunta sa GSIS Cabanatuan Branch sa NFA Compound, Maharlika Highway",
      "O gamitin ang GSIS Touch app para sa online transactions",
      "Magdala ng Service Record at GSIS UMID card",
      "Mag-file ng retirement application form",
      "Tel: (044) 463-0572 | Coverage: Nueva Ecija at Aurora",
    ],
    amount: "Depende sa years of service",
    simulatorType: "gsis",
    icon: "shield-outline",
    color: "#7C3AED",
  },
];

const APPS_CONTENT = [
  {
    title: "eGovPH Super App",
    description:
      "Ang opisyal na super app ng pamahalaan ng Pilipinas. Dito maaari mong ma-access ang Digital Senior Citizens ID, PhilSys, at iba pang serbisyo ng gobyerno kahit nasa Cabanatuan City ka.",
    features: [
      "Digital Senior Citizens ID (NSCID) – tinatanggap sa buong Cabanatuan City",
      "National ID (PhilSys) digital copy",
      "Listahan ng government services at offices sa Nueva Ecija",
      "Online appointment booking sa iba't ibang government agencies",
      "Emergency notifications para sa Cabanatuan City at Nueva Ecija",
    ],
    downloadLink: "https://play.google.com/store/apps/details?id=ph.gov.egov",
    simulatorType: "egovph_app",
    icon: "phone-portrait-outline",
    color: "#0EA5E9",
  },
  {
    title: "My.SSS App",
    description:
      "Ang opisyal na app ng SSS para sa mga miyembro. Para sa mga senior ng Cabanatuan City, maaari mong gamitin ito bilang alternatibo sa personal na pagpunta sa SSS Cabanatuan Branch sa NE Pacific Mall.",
    features: [
      "Tingnan ang SSS contributions at pension status",
      "Mag-apply ng loans online – hindi na kailangang pumunta sa branch",
      "I-update ang personal information at paraan ng pagbabayad",
      "I-download ang SSS records at contribution history",
    ],
    downloadLink: "https://play.google.com/store/apps/details?id=com.sss.mysss",
    simulatorType: null,
    icon: "phone-portrait-outline",
    color: "#059669",
  },
  {
    title: "PhilHealth App",
    description:
      "Ang opisyal na app ng PhilHealth. Para sa mga senior ng Cabanatuan City, kapaki-pakinabang ito bilang dagdag sa pagbisita sa PhilHealth office sa NE Pacific Mall, Maharlika Highway.",
    features: [
      "I-check ang PhilHealth contributions at lifetime member status",
      "Tingnan ang mga benefit claims mula sa Dr. PJG Hospital",
      "Hanapin ang mga accredited hospitals at clinics sa Cabanatuan City",
      "E-konsultasyon para sa mga basic na katanungan sa kalusugan",
    ],
    downloadLink: "https://play.google.com/store/apps/details?id=ph.philhealth",
    simulatorType: null,
    icon: "phone-portrait-outline",
    color: "#DC2626",
  },
  {
    title: "Virtual Pag-IBIG App",
    description:
      "Ang Virtual Pag-IBIG app para sa housing loan applications at savings management. Ang Pag-IBIG Cabanatuan Branch ay nasa Duran Building, Quezon District, Maharlika Highway. Tel: (044) 600-1225.",
    features: [
      "Tingnan ang Pag-IBIG savings at contributions",
      "Mag-apply ng housing loan para sa Cabanatuan City area",
      "I-check ang loan balance at payment schedule",
      "Mag-request ng provident fund withdrawal",
    ],
    downloadLink: "https://play.google.com/store/apps/details?id=ph.gov.pagibig",
    simulatorType: null,
    icon: "phone-portrait-outline",
    color: "#D97706",
  },
];

const LEGAL_CONTENT = [
  {
    title: "RA 9994 – Expanded Senior Citizens Act",
    description:
      "Ang Republic Act 9994 ang batas na nagpoprotekta sa karapatan ng lahat ng senior citizen sa Pilipinas, kasama na ang mga nakatira sa Cabanatuan City, Nueva Ecija.",
    rights: [
      "20% diskwento at VAT exemption sa lahat ng establisyimento sa Cabanatuan City",
      "Priority lane sa City Hall, SSS, PhilHealth, GSIS, at lahat ng opisina",
      "Libreng medical services sa Dr. PJG Hospital at M.V. Gallego Hospital",
      "Proteksyon laban sa diskriminasyon at pang-aabuso",
      "Karapatang sa dignidad, respeto, at priority service",
    ],
    simulatorType: "ra9994",
    icon: "document-text-outline",
    color: "#0EA5E9",
  },
  {
    title: "Pag-uulat ng Elder Abuse sa Cabanatuan City",
    description:
      "Kung kayo o ang inyong kakilala ay nag-eexperience ng pang-aabuso sa Cabanatuan City o Nueva Ecija, may mga lugar na maaari kayong humingi ng tulong.",
    reportTo: [
      "NCSC Hotline: 1-800-10-737-0011 (libre ang tawag, bukas 24/7)",
      "Cabanatuan City Police Station: (044) 600-4506 / 0933-622-0720",
      "Cabanatuan City Social Welfare and Development Office (CSWDO) – City Hall",
      "DSWD SWAD Nueva Ecija: Mabini Extension Street, Cabanatuan City",
      "Inyong barangay – VAWC (Violence Against Women and Children) Desk",
    ],
    simulatorType: "elder_abuse",
    icon: "alert-circle-outline",
    color: "#DC2626",
  },
  {
    title: "DTI – Hindi Nirerespeto ang Diskwento sa Cabanatuan",
    description:
      "Kung may establisyimento sa Cabanatuan City na hindi nagbibigay ng inyong senior citizen discount, maaari kayong mag-reklamo sa DTI Region III o sa lokal na OSCA office.",
    steps: [
      "Kumuha ng resibo bilang ebidensya ng pagtanggi sa diskwento",
      "Mag-file ng complaint sa DTI Region III: 1-800-10-384-0349",
      "Mag-report sa Cabanatuan City OSCA Office sa City Hall",
      "Maaari ding mag-report sa Cabanatuan City PNP: (044) 600-4506",
    ],
    simulatorType: null,
    icon: "megaphone-outline",
    color: "#D97706",
  },
];

const LGU_CONTENT = [
  {
    title: "Mga Serbisyo ng Barangay sa Cabanatuan City",
    description:
      "Ang Cabanatuan City ay may 89 barangay. Ang bawat barangay ay nagbibigay ng mga serbisyo para sa mga senior citizen. Pumunta sa inyong barangay hall (Lunes–Biyernes, 8AM–5PM) para sa tulong.",
    services: [
      "Barangay clearance at certificate of residency para sa OSCA application",
      "Referral sa Cabanatuan City OSCA at CSWDO",
      "Community pantry at lokal na relief operations",
      "Barangay VAWC desk para sa pag-uulat ng elder abuse",
      "Koordinasyon sa DSWD Social Pension Program",
    ],
    simulatorType: "barangay",
    icon: "home-outline",
    color: "#059669",
  },
  {
    title: "OSCA Office – Cabanatuan City Hall",
    description:
      "Ang Office for Senior Citizens Affairs ng Cabanatuan City ay nasa Cabanatuan City Hall, M. de Leon Avenue. Ito ang pangunahing opisina para sa lahat ng senior citizen services sa lungsod.",
    services: [
      "Pag-process ng Senior Citizens ID (libre, ilang araw ng trabaho)",
      "Pagtulong sa availing ng 20% diskwento at iba pang benepisyo",
      "Koordinasyon ng DSWD Social Pension para sa indigent seniors",
      "Livelihood programs at Senior Citizens Week activities",
      "Referral sa Dr. PJG Hospital, SSS, PhilHealth, at GSIS",
    ],
    simulatorType: "osca_office",
    icon: "people-outline",
    color: "#0EA5E9",
  },
  {
    title: "Cabanatuan City Hall – Lokal na Benepisyo",
    description:
      "Ang Cabanatuan City Hall sa M. de Leon Avenue ay nagbibigay ng karagdagang lokal na benepisyo para sa mga senior citizen ng lungsod bilang city ordinance.",
    examples: [
      "Birthday cash gift para sa centenarian seniors (100 taong gulang)",
      "Priority service sa lahat ng city government windows at counters",
      "Libre na medikal na check-up sa city-sponsored health missions",
      "Coordination sa CSWD para sa emergency financial assistance",
    ],
    tip: "Makipag-ugnayan sa Cabanatuan City OSCA Office sa City Hall, M. de Leon Avenue para malaman ang lahat ng available na benepisyo para sa mga senior ng Cabanatuan.",
    simulatorType: null,
    icon: "cash-outline",
    color: "#D97706",
  },
];

// ─────────────────────────────────────────────
// VERIFIED HOTLINES – Cabanatuan City, Nueva Ecija
// All numbers verified from official sources
// ─────────────────────────────────────────────
const HOTLINES = [
  {
    name: "Emergency / 911",
    number: "911",
    icon: "call",
    color: "#DC2626",
    desc: "Emergency Response – bukas 24/7 sa buong Pilipinas",
  },
  {
    name: "NCSC Hotline",
    number: "1-800-10-737-0011",
    icon: "people",
    color: "#0EA5E9",
    desc: "National Commission of Senior Citizens – libre ang tawag, 24/7",
  },
  {
    name: "Cabanatuan City PNP",
    number: "(044) 600-4506",
    icon: "shield",
    color: "#1D4ED8",
    desc: "Cabanatuan City Police Station – pangunahing linya",
  },
  {
    name: "Cabanatuan City PNP (Mobile)",
    number: "0998 598 5425",
    icon: "shield",
    color: "#1D4ED8",
    desc: "Cabanatuan City Police Station – mobile number",
  },
  {
    name: "Dr. PJG Hospital",
    number: "0953-574-4529",
    icon: "fitness",
    color: "#DC2626",
    desc: "Dr. Paulino J. Garcia Memorial R&MC – Mabini St., Quezon District",
  },
  {
    name: "PhilHealth Cabanatuan",
    number: "(044) 940-3723",
    icon: "heart",
    color: "#059669",
    desc: "2/F NE Pacific Mall, Km 111, Maharlika Highway",
  },
  {
    name: "SSS Cabanatuan",
    number: "(044) 463-0691",
    icon: "business",
    color: "#7C3AED",
    desc: "NE Pacific Shopping Center, Maharlika Highway – Email: cabanatuan@sss.gov.ph",
  },
  {
    name: "GSIS Cabanatuan",
    number: "(044) 463-0572",
    icon: "shield-checkmark",
    color: "#0EA5E9",
    desc: "NFA Compound, Maharlika Highway – Para sa Nueva Ecija at Aurora",
  },
  {
    name: "Pag-IBIG Cabanatuan",
    number: "(044) 600-1225",
    icon: "home",
    color: "#D97706",
    desc: "Duran Building, Quezon District, Maharlika Highway",
  },
  {
    name: "DTI Region III",
    number: "1-800-10-384-0349",
    icon: "megaphone",
    color: "#059669",
    desc: "Para sa reklamo ng hindi binibigay na senior diskwento – libre ang tawag",
  },
];

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function EGovScreen({ navigation }) {
  const [currentModule, setCurrentModule] = useState("menu");
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorData, setSimulatorData] = useState(null);
  const [currentlyNarrating, setCurrentlyNarrating] = useState(null);

  const GRADIENT = ["#F0F9FF", "#E0F2FE", "#BAE6FD", "#7DD3FC", "#38BDF8", "#0EA5E9"];

  // ── TTS ──────────────────────────────────────
  const narrate = async (text, buttonId) => {
    if (currentlyNarrating === buttonId) { stopNarration(); return; }
    if (currentlyNarrating) await stopNarration();
    setCurrentlyNarrating(buttonId);
    try {
      await Speech.speak(text, {
        language: "fil-PH",
        pitch: 1.0,
        rate: 0.6,
        onDone: () => setCurrentlyNarrating(null),
        onStopped: () => setCurrentlyNarrating(null),
        onError: () => { setCurrentlyNarrating(null); Alert.alert("Audio Error", "Hindi ma-play ang audio. Subukan ulit."); },
      });
    } catch { setCurrentlyNarrating(null); }
  };

  const stopNarration = async () => {
    try { await Speech.stop(); } catch {}
    setCurrentlyNarrating(null);
  };

  const isNarrating = (id) => currentlyNarrating === id;

  const goBack = () => {
    stopNarration();
    if (showSimulator) { setShowSimulator(false); setSimulatorData(null); }
    else if (currentModule === "menu") { navigation.goBack(); }
    else { setCurrentModule("menu"); }
  };

  const goToModule = (id) => { stopNarration(); setCurrentModule(id); };

  const openSimulator = (type, data) => { setSimulatorData({ type, data }); setShowSimulator(true); };

  useEffect(() => () => stopNarration(), []);

  // ─────────────────────────────────────────────
  // SHARED UI COMPONENTS
  // ─────────────────────────────────────────────
  const GradientScreen = ({ children }) => (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <LinearGradient colors={GRADIENT} locations={[0,0.15,0.35,0.55,0.75,1]} style={s.gradientBg} start={{x:0,y:0}} end={{x:1,y:1}} />
        <ScrollView style={s.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
          {children}
        </ScrollView>
        <TouchableOpacity style={s.backButton} onPress={goBack} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={18} color="#0F172A" />
          <Text style={s.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const ReadBtn = ({ text, id }) => (
    <TouchableOpacity style={[s.audioBtn, isNarrating(id) && s.speakingBtn]} onPress={() => narrate(text, id)}>
      <Ionicons name={isNarrating(id) ? "stop" : "volume-high"} size={20} color={isNarrating(id) ? "#fff" : "#38BDF8"} />
      <Text style={[s.audioBtnText, isNarrating(id) && s.audioBtnTextActive]}>{isNarrating(id) ? "Tumutugtog..." : "Basahin"}</Text>
    </TouchableOpacity>
  );

  const SimBtn = ({ type, data, danger }) => (
    <TouchableOpacity style={[s.simBtn, danger && s.simBtnDanger]} onPress={() => openSimulator(type, data)}>
      <Ionicons name="phone-portrait" size={16} color={danger ? "#DC2626" : "#059669"} />
      <Text style={[s.simBtnText, danger && s.simBtnTextDanger]}>Tingnan sa Screen</Text>
    </TouchableOpacity>
  );

  // ─────────────────────────────────────────────
  // SCREEN SIMULATORS
  // Only shown for cases where visual demo adds real value
  // ─────────────────────────────────────────────
  const renderSimulator = () => {
    if (!simulatorData) return null;
    const { type, data } = simulatorData;

    const PhoneShell = ({ headerBg, headerTitle, children, headerIcon }) => (
      <View style={s.phoneSim}>
        <View style={s.phoneStatusBar}>
          <Text style={s.phoneTime}>9:41 AM</Text>
          <View style={s.phoneSignal}>
            {[1,2,3].map(i=><View key={i} style={s.signalBar}/>)}
            <Text style={s.batteryTxt}>100%</Text>
          </View>
        </View>
        <View style={[s.phoneAppBar, {backgroundColor: headerBg || "#0EA5E9"}]}>
          {headerIcon && <Ionicons name={headerIcon} size={20} color="#fff" style={{marginRight:8}}/>}
          <Text style={s.phoneAppTitle}>{headerTitle}</Text>
        </View>
        <View style={s.phoneBody}>{children}</View>
      </View>
    );

    const InfoRow = ({ icon, text, color }) => (
      <View style={s.infoRow}>
        <Ionicons name={icon} size={18} color={color||"#0EA5E9"} />
        <Text style={s.infoRowText}>{text}</Text>
      </View>
    );

    const StatusBadge = ({ safe, text }) => (
      <View style={[s.statusBadge, safe ? s.badgeSafe : s.badgeDanger]}>
        <Ionicons name={safe ? "checkmark-circle" : "warning"} size={18} color={safe ? "#059669" : "#DC2626"} />
        <Text style={[s.badgeText, safe ? s.badgeTextSafe : s.badgeTextDanger]}>{text}</Text>
      </View>
    );

    switch (type) {
      // ── OSCA ID Card ──────────────────────────────
      case "osca_id":
        return (
          <PhoneShell headerBg="#0EA5E9" headerTitle="OSCA – Cabanatuan City" headerIcon="card">
            <View style={s.idCard}>
              <View style={[s.idCardHeader, {backgroundColor:"#0EA5E9"}]}>
                <Ionicons name="people" size={30} color="#fff"/>
                <Text style={s.idCardHeaderTitle}>Republic of the Philippines</Text>
                <Text style={s.idCardHeaderSub}>Senior Citizens ID – Cabanatuan City</Text>
              </View>
              <View style={s.idCardBody}>
                <View style={s.idPhotoPlaceholder}>
                  <Ionicons name="person" size={40} color="#94A3B8"/>
                </View>
                <View style={s.idDetails}>
                  <Text style={s.idLabel}>Pangalan:</Text>
                  <Text style={s.idValue}>Maria D. Santos</Text>
                  <Text style={s.idLabel}>Edad:</Text>
                  <Text style={s.idValue}>72 taong gulang</Text>
                  <Text style={s.idLabel}>Barangay:</Text>
                  <Text style={s.idValue}>Brgy. H. Concepcion, Cabanatuan City</Text>
                  <Text style={s.idLabel}>ID No.:</Text>
                  <Text style={s.idValue}>CAB-2024-00123</Text>
                </View>
              </View>
              <View style={s.idCardFooter}>
                <Text style={s.idFooterText}>Issued by: OSCA – Cabanatuan City Hall, M. de Leon Ave.</Text>
              </View>
            </View>
            <StatusBadge safe text="Ang OSCA ID mula sa Cabanatuan City Hall ang official ID ng senior citizens. Gamitin sa lahat ng establisyimento sa Nueva Ecija at buong Pilipinas."/>
          </PhoneShell>
        );

      // ── PhilSys / National ID ─────────────────────
      case "philsys":
        return (
          <PhoneShell headerBg="#059669" headerTitle="PhilSys – National ID" headerIcon="id-card">
            <View style={[s.idCard, {borderColor:"#059669"}]}>
              <View style={[s.idCardHeader, {backgroundColor:"#059669"}]}>
                <Text style={s.idCardHeaderTitle}>Philippine Identification System</Text>
                <Text style={s.idCardHeaderSub}>PhilSys ID – Nueva Ecija (PSC 3100)</Text>
              </View>
              <View style={s.idCardBody}>
                <View style={[s.idPhotoPlaceholder, {borderColor:"#059669"}]}>
                  <Ionicons name="person" size={40} color="#94A3B8"/>
                </View>
                <View style={s.idDetails}>
                  <Text style={s.idLabel}>PCN:</Text>
                  <Text style={[s.idValue, {fontFamily: Platform.OS==="ios"?"Courier":"monospace"}]}>1234-5678-9012</Text>
                  <Text style={s.idLabel}>Pangalan:</Text>
                  <Text style={s.idValue}>Maria D. Santos</Text>
                  <Text style={s.idLabel}>Lugar:</Text>
                  <Text style={s.idValue}>Cabanatuan City, N.E.</Text>
                  <Text style={s.idLabel}>Petsa ng Kapanganakan:</Text>
                  <Text style={s.idValue}>01 Enero 1952</Text>
                </View>
              </View>
            </View>
            <StatusBadge safe text="Ang PhilSys ay libre para sa lahat. I-register sa PSA-Nueva Ecija office sa Cabanatuan City. Tinatanggap bilang valid ID sa lahat ng government at private offices sa buong Pilipinas."/>
          </PhoneShell>
        );

      // ── Digital ID (eGovPH) ───────────────────────
      case "digital_id":
        return (
          <PhoneShell headerBg="#7C3AED" headerTitle="eGovPH App" headerIcon="phone-portrait">
            <View style={s.appScreen}>
              <View style={s.appIconRow}>
                <Ionicons name="shield-checkmark" size={48} color="#7C3AED"/>
              </View>
              <Text style={s.appScreenTitle}>Digital Senior Citizen ID</Text>
              <View style={[s.digitalIdCard, {borderColor:"#7C3AED"}]}>
                <View style={[s.digitalIdBanner, {backgroundColor:"#7C3AED"}]}>
                  <Ionicons name="person-circle" size={40} color="#fff"/>
                  <View style={{marginLeft:12}}>
                    <Text style={s.digitalIdName}>Maria D. Santos</Text>
                    <Text style={s.digitalIdType}>Senior Citizen – Cabanatuan City</Text>
                    <Text style={[s.digitalIdType,{marginTop:2}]}>Brgy. H. Concepcion, N.E. 3100</Text>
                  </View>
                </View>
                <View style={s.qrPlaceholder}>
                  <Ionicons name="qr-code" size={60} color="#7C3AED"/>
                  <Text style={s.qrLabel}>I-scan para i-verify</Text>
                  <Text style={[s.qrLabel,{fontSize:10,marginTop:4,color:"#94A3B8"}]}>Valid • Verified by eGovPH</Text>
                </View>
              </View>
              <StatusBadge safe text="Available na ang Digital NSCID sa eGovPH app. Tinatanggap sa mga establisyimento sa Cabanatuan City! Hindi na kailangan ng physical card."/>
            </View>
          </PhoneShell>
        );

      // ── Discount Receipt ──────────────────────────
      case "discount":
        return (
          <PhoneShell headerBg="#D97706" headerTitle="Senior Discount" headerIcon="pricetag">
            <View style={s.receiptSim}>
              <Text style={s.receiptTitle}>Official Receipt</Text>
              <Text style={s.receiptStore}>Jollibee – SM City Cabanatuan</Text>
              <Text style={[s.receiptStore,{fontSize:11,color:"#94A3B8",marginBottom:8}]}>Maharlika Highway, Cabanatuan City</Text>
              <View style={s.receiptDivider}/>
              <View style={s.receiptRow}><Text style={s.receiptItem}>Chickenjoy Meal</Text><Text style={s.receiptPrice}>₱185.00</Text></View>
              <View style={s.receiptRow}><Text style={s.receiptItem}>Palabok</Text><Text style={s.receiptPrice}>₱99.00</Text></View>
              <View style={s.receiptDivider}/>
              <View style={s.receiptRow}><Text style={s.receiptItem}>Subtotal</Text><Text style={s.receiptPrice}>₱284.00</Text></View>
              <View style={s.receiptRow}><Text style={[s.receiptItem,{color:"#D97706"}]}>20% SC Discount</Text><Text style={[s.receiptPrice,{color:"#D97706"}]}>-₱56.80</Text></View>
              <View style={s.receiptRow}><Text style={[s.receiptItem,{color:"#D97706"}]}>VAT Exemption</Text><Text style={[s.receiptPrice,{color:"#D97706"}]}>-₱30.43</Text></View>
              <View style={s.receiptDivider}/>
              <View style={s.receiptRow}><Text style={[s.receiptItem,{fontWeight:"bold",fontSize:16}]}>TOTAL</Text><Text style={[s.receiptPrice,{fontWeight:"bold",fontSize:16}]}>₱196.77</Text></View>
              <View style={s.receiptDivider}/>
              <Text style={[s.receiptStore,{fontSize:10,color:"#94A3B8",marginTop:4}]}>OSCA ID No.: CAB-2024-00123</Text>
            </View>
            <StatusBadge safe text="Ang 20% diskwento at VAT exemption ay inyong karapatan sa lahat ng establisyimento sa Cabanatuan City. Magdala palagi ng OSCA ID!"/>
          </PhoneShell>
        );

      // ── PhilHealth Card ───────────────────────────
      case "philhealth":
        return (
          <PhoneShell headerBg="#DC2626" headerTitle="PhilHealth Cabanatuan" headerIcon="heart">
            <View style={[s.idCard, {borderColor:"#DC2626"}]}>
              <View style={[s.idCardHeader, {backgroundColor:"#DC2626"}]}>
                <Ionicons name="heart" size={24} color="#fff"/>
                <Text style={s.idCardHeaderTitle}>Philippine Health Insurance</Text>
                <Text style={s.idCardHeaderSub}>2/F NE Pacific Mall, Km 111, Maharlika Hwy</Text>
              </View>
              <View style={s.idCardBody}>
                <View style={[s.idPhotoPlaceholder, {borderColor:"#DC2626"}]}>
                  <Ionicons name="person" size={40} color="#94A3B8"/>
                </View>
                <View style={s.idDetails}>
                  <Text style={s.idLabel}>PIN:</Text>
                  <Text style={[s.idValue,{fontFamily:Platform.OS==="ios"?"Courier":"monospace"}]}>12-123456789-0</Text>
                  <Text style={s.idLabel}>Type:</Text>
                  <Text style={s.idValue}>Senior Citizen (Lifetime)</Text>
                  <Text style={s.idLabel}>Tel:</Text>
                  <Text style={s.idValue}>(044) 940-3723</Text>
                </View>
              </View>
            </View>
            <StatusBadge safe text="Ang lahat ng 60+ na senior ng Cabanatuan City ay awtomatikong lifetime member ng PhilHealth. Gamitin sa Dr. PJG Hospital at iba pang accredited hospitals."/>
          </PhoneShell>
        );

      // ── DSWD Social Pension ───────────────────────
      case "dswd":
        return (
          <PhoneShell headerBg="#059669" headerTitle="DSWD – Cabanatuan City" headerIcon="cash">
            <View style={s.appScreen}>
              <View style={s.pensionCard}>
                <View style={[s.pensionCardHeader, {backgroundColor:"#059669"}]}>
                  <Ionicons name="cash" size={28} color="#fff"/>
                  <Text style={s.pensionCardTitle}>Social Pension Program</Text>
                </View>
                <View style={s.pensionCardBody}>
                  <Text style={s.pensionLabel}>Buwanang Stipend:</Text>
                  <Text style={s.pensionAmount}>₱1,000.00</Text>
                  <View style={s.pensionDivider}/>
                  <InfoRow icon="location" text="DSWD SWAD Nueva Ecija – Mabini Extension St., Cabanatuan City" color="#059669"/>
                  <InfoRow icon="checkmark-circle" text="Indigent Senior Citizen ng Cabanatuan City" color="#059669"/>
                  <InfoRow icon="checkmark-circle" text="Walang iba pang regular na pension" color="#059669"/>
                  <InfoRow icon="checkmark-circle" text="60 taong gulang pataas" color="#059669"/>
                </View>
              </View>
              <StatusBadge safe text="Mag-apply sa inyong barangay hall sa Cabanatuan City para sa DSWD Social Pension. Ang DSWD SWAD Nueva Ecija ay nasa Mabini Extension Street."/>
            </View>
          </PhoneShell>
        );

      // ── SSS Dashboard ─────────────────────────────
      case "sss":
        return (
          <PhoneShell headerBg="#0EA5E9" headerTitle="SSS – Cabanatuan Branch" headerIcon="business">
            <View style={s.appScreen}>
              <View style={s.appDashboard}>
                <View style={s.dashCard}>
                  <Text style={s.dashLabel}>Monthly Pension (Sample)</Text>
                  <Text style={[s.dashValue, {color:"#0EA5E9"}]}>₱3,500.00</Text>
                </View>
                <View style={s.dashCard}>
                  <Text style={s.dashLabel}>SSS Cabanatuan Branch</Text>
                  <Text style={[s.dashValue,{color:"#059669",fontSize:11}]}>NE Pacific Shopping Center</Text>
                  <Text style={[s.dashValue,{color:"#059669",fontSize:11}]}>Maharlika Highway, Brgy. H. Concepcion</Text>
                </View>
                <View style={s.dashCard}>
                  <Text style={s.dashLabel}>Tel / Email</Text>
                  <Text style={[s.dashValue,{color:"#0EA5E9",fontSize:12}]}>(044) 463-0691</Text>
                  <Text style={[s.dashValue,{color:"#64748B",fontSize:10}]}>cabanatuan@sss.gov.ph</Text>
                </View>
              </View>
              <StatusBadge safe text="Ang SSS Cabanatuan Branch ay nasa NE Pacific Shopping Center, Maharlika Highway. Maaari ring gamitin ang My.SSS app para sa online transactions."/>
            </View>
          </PhoneShell>
        );

      // ── GSIS Dashboard ────────────────────────────
      case "gsis":
        return (
          <PhoneShell headerBg="#7C3AED" headerTitle="GSIS – Cabanatuan Branch" headerIcon="shield-checkmark">
            <View style={s.appScreen}>
              <View style={s.appDashboard}>
                <View style={s.dashCard}>
                  <Text style={s.dashLabel}>Retirement Pension (Sample)</Text>
                  <Text style={[s.dashValue, {color:"#7C3AED"}]}>₱8,200.00</Text>
                </View>
                <View style={s.dashCard}>
                  <Text style={s.dashLabel}>GSIS Cabanatuan Branch</Text>
                  <Text style={[s.dashValue,{color:"#7C3AED",fontSize:11}]}>NFA Compound, Maharlika Highway</Text>
                  <Text style={[s.dashValue,{color:"#64748B",fontSize:10}]}>Coverage: Nueva Ecija & Aurora</Text>
                </View>
                <View style={s.dashCard}>
                  <Text style={s.dashLabel}>Telephone</Text>
                  <Text style={[s.dashValue,{color:"#7C3AED",fontSize:12}]}>(044) 463-0572</Text>
                </View>
              </View>
              <StatusBadge safe text="Ang GSIS Cabanatuan Branch ay para sa mga dating empleyado ng pamahalaan sa Nueva Ecija at Aurora. Gamitin ang GSIS Touch app para sa online transactions."/>
            </View>
          </PhoneShell>
        );

      // ── eGovPH App ────────────────────────────────
      case "egovph_app":
        return (
          <PhoneShell headerBg="#0EA5E9" headerTitle="eGovPH Super App" headerIcon="phone-portrait">
            <View style={s.appScreen}>
              <Text style={s.appGridTitle}>Mga Serbisyo – Cabanatuan City</Text>
              <View style={s.appGrid}>
                {[
                  {icon:"card", label:"Senior ID", color:"#0EA5E9"},
                  {icon:"id-card", label:"PhilSys", color:"#059669"},
                  {icon:"heart", label:"PhilHealth", color:"#DC2626"},
                  {icon:"business", label:"SSS", color:"#7C3AED"},
                  {icon:"home", label:"Pag-IBIG", color:"#D97706"},
                  {icon:"shield", label:"GSIS", color:"#0EA5E9"},
                ].map((item,i)=>(
                  <View key={i} style={s.appGridItem}>
                    <View style={[s.appGridIcon, {backgroundColor: item.color+"22"}]}>
                      <Ionicons name={item.icon} size={24} color={item.color}/>
                    </View>
                    <Text style={s.appGridLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
              <StatusBadge safe text="Ang eGovPH Super App ay ang opisyal na app ng pamahalaan. Dito makikita ang lahat ng government services – kasama ang mga opisina sa Cabanatuan City!"/>
            </View>
          </PhoneShell>
        );

      // ── RA 9994 ───────────────────────────────────
      case "ra9994":
        return (
          <PhoneShell headerBg="#0EA5E9" headerTitle="RA 9994 – Inyong Karapatan" headerIcon="document-text">
            <View style={s.lawCard}>
              <View style={s.lawBanner}>
                <Ionicons name="document-text" size={32} color="#0EA5E9"/>
                <Text style={s.lawTitle}>Republic Act 9994</Text>
                <Text style={s.lawSubtitle}>Expanded Senior Citizens Act</Text>
              </View>
              {[
                "20% diskwento sa lahat ng establisyimento sa Cabanatuan City",
                "VAT exemption sa lahat ng covered na pagbili",
                "Priority lane sa City Hall, SSS, PhilHealth, Dr. PJG Hospital",
                "Libreng medical services sa government hospitals ng Cabanatuan",
                "Proteksyon laban sa diskriminasyon at elder abuse",
              ].map((r,i)=>(
                <View key={i} style={s.lawItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#059669"/>
                  <Text style={s.lawItemText}>{r}</Text>
                </View>
              ))}
              <StatusBadge safe text="Ito ang inyong karapatan bilang senior citizen ng Cabanatuan City. Kung hindi ito ibinibigay, mag-report sa OSCA o DTI Region III: 1-800-10-384-0349!"/>
            </View>
          </PhoneShell>
        );

      // ── Elder Abuse Hotlines ──────────────────────
      case "elder_abuse":
        return (
          <PhoneShell headerBg="#DC2626" headerTitle="I-Report ang Pang-aabuso" headerIcon="alert-circle">
            <View style={s.appScreen}>
              <View style={[s.alertBanner, {backgroundColor:"#FEF2F2", borderColor:"#DC2626"}]}>
                <Ionicons name="warning" size={32} color="#DC2626"/>
                <Text style={[s.alertTitle, {color:"#DC2626"}]}>Humingi ng Tulong Agad!</Text>
              </View>
              {[
                {name:"Emergency 911", number:"911", color:"#DC2626"},
                {name:"NCSC Hotline (libre)", number:"18001737-0011", color:"#0EA5E9"},
                {name:"Cabanatuan City PNP", number:"0446004506", color:"#1D4ED8"},
              ].map((h,i)=>(
                <TouchableOpacity key={i} style={s.hotlineCard} onPress={()=>Linking.openURL(`tel:${h.number}`)}>
                  <Ionicons name="call" size={20} color={h.color}/>
                  <View style={{marginLeft:12,flex:1}}>
                    <Text style={s.hotlineCardName}>{h.name}</Text>
                    <Text style={[s.hotlineCardNum, {color:h.color}]}>{h.number === "18001737-0011" ? "1-800-10-737-0011" : h.number === "0446004506" ? "(044) 600-4506" : h.number}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8"/>
                </TouchableOpacity>
              ))}
              <StatusBadge safe={false} text="Kung may nang-aabuso sa inyo sa Cabanatuan City, tumawag kaagad. May batas na nagpoprotekta sa inyo – ang RA 9994 at iba pang batas ng Pilipinas!"/>
            </View>
          </PhoneShell>
        );

      // ── Barangay Services ─────────────────────────
      case "barangay":
        return (
          <PhoneShell headerBg="#059669" headerTitle="Barangay – Cabanatuan City" headerIcon="home">
            <View style={s.appScreen}>
              <Text style={s.appGridTitle}>89 Barangay ng Cabanatuan City</Text>
              {[
                {icon:"document-text", label:"Barangay Clearance at Certificate of Residency", color:"#059669"},
                {icon:"people", label:"Senior Citizen Programs at Referral sa OSCA", color:"#0EA5E9"},
                {icon:"cash", label:"Referral sa DSWD Social Pension", color:"#D97706"},
                {icon:"medkit", label:"Health Referral sa Dr. PJG Hospital", color:"#DC2626"},
              ].map((item,i)=>(
                <View key={i} style={s.menuListItem}>
                  <View style={[s.menuListIcon, {backgroundColor:item.color+"22"}]}>
                    <Ionicons name={item.icon} size={20} color={item.color}/>
                  </View>
                  <Text style={s.menuListText}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8"/>
                </View>
              ))}
              <StatusBadge safe text="Pumunta sa inyong barangay hall (Lunes-Biyernes, 8AM-5PM) para sa tulong at serbisyo para sa senior citizens ng Cabanatuan City!"/>
            </View>
          </PhoneShell>
        );

      // ── OSCA Office ───────────────────────────────
      case "osca_office":
        return (
          <PhoneShell headerBg="#0EA5E9" headerTitle="OSCA – Cabanatuan City Hall" headerIcon="people">
            <View style={s.appScreen}>
              <View style={s.appDashboard}>
                <View style={s.dashCard}>
                  <Text style={s.dashLabel}>OSCA Office</Text>
                  <Text style={[s.dashValue,{color:"#0EA5E9",fontSize:11}]}>Cabanatuan City Hall</Text>
                  <Text style={[s.dashValue,{color:"#64748B",fontSize:10,marginTop:2}]}>M. de Leon Avenue, Cabanatuan City</Text>
                </View>
                <View style={s.dashCard}>
                  <Text style={s.dashLabel}>Oras ng Serbisyo</Text>
                  <Text style={[s.dashValue,{color:"#059669",fontSize:12}]}>Lunes – Biyernes</Text>
                  <Text style={[s.dashValue,{color:"#64748B",fontSize:11}]}>8:00 AM – 5:00 PM</Text>
                </View>
              </View>
              {[
                "Pag-process ng Senior Citizens ID (libre)",
                "Tulong sa 20% diskwento at benepisyo",
                "DSWD Social Pension coordination",
                "Livelihood at Senior Citizens Week programs",
              ].map((svc,i)=>(
                <View key={i} style={s.menuListItem}>
                  <View style={[s.menuListIcon, {backgroundColor:"#0EA5E9"+"22"}]}>
                    <Ionicons name="checkmark-circle" size={20} color="#0EA5E9"/>
                  </View>
                  <Text style={s.menuListText}>{svc}</Text>
                </View>
              ))}
              <StatusBadge safe text="Ang OSCA Office sa Cabanatuan City Hall ang inyong pangunahing lugar para sa lahat ng senior citizen services. Libre ang lahat ng serbisyo!"/>
            </View>
          </PhoneShell>
        );

      // ── Default ───────────────────────────────────
      default:
        return (
          <PhoneShell headerBg="#0EA5E9" headerTitle="E-Government Services" headerIcon="globe">
            <View style={s.appScreen}>
              <Ionicons name="construct" size={48} color="#94A3B8" style={{alignSelf:"center", marginVertical:24}}/>
              <Text style={{textAlign:"center",color:"#475569",fontSize:15}}>Demo screen para sa: {type}</Text>
            </View>
          </PhoneShell>
        );
    }
  };

  // ─────────────────────────────────────────────
  // SIMULATOR FULL SCREEN
  // ─────────────────────────────────────────────
  if (showSimulator) {
    return (
      <SafeAreaView style={s.safeArea}>
        <View style={s.container}>
          <LinearGradient colors={GRADIENT} locations={[0,0.15,0.35,0.55,0.75,1]} style={s.gradientBg} start={{x:0,y:0}} end={{x:1,y:1}}/>
          <ScrollView style={s.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
            <View style={s.lessonHeader}>
              <Text style={s.lessonTitle}>Screen Simulator</Text>
              <Text style={s.lessonSubtitle}>Tingnan ang halimbawa sa screen</Text>
            </View>
            <View style={{alignItems:"center", marginBottom:24}}>{renderSimulator()}</View>
            <View style={s.tipBox}>
              <Text style={s.tipBoxTitle}>💡 Tandaan:</Text>
              <Text style={s.tipBoxText}>
                {"• Gamitin ang mga totoong government websites at apps lamang\n• Huwag ibigay ang personal information sa hindi kilalang websites\n• Kung hindi sigurado, magtanong sa pamilya o sa OSCA Office sa Cabanatuan City Hall, M. de Leon Avenue"}
              </Text>
            </View>
          </ScrollView>
          <TouchableOpacity style={s.backButton} onPress={goBack} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={18} color="#0F172A"/>
            <Text style={s.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────────
  // MAIN MENU
  // ─────────────────────────────────────────────
  if (currentModule === "menu") {
    return (
      <GradientScreen>
        <View style={s.header}>
          <View style={s.headerIconWrap}>
            <Ionicons name="globe" size={32} color="#0F172A"/>
          </View>
          <Text style={s.headerTitle}>E-Government Services</Text>
          <Text style={s.headerSubtitle}>Para sa mga Senior Citizens ng Cabanatuan City, Nueva Ecija</Text>
          <View style={s.headerDivider}/>
        </View>
        <View style={s.moduleGrid}>
          {EGOV_MODULES.map((mod) => (
            <TouchableOpacity key={mod.id} style={s.moduleCard} onPress={() => goToModule(mod.id)} activeOpacity={0.92}>
              <View style={s.moduleIconBg}>
                <Ionicons name={mod.icon} size={30} color="#38BDF8"/>
              </View>
              <View style={s.moduleContent}>
                <Text style={s.moduleTitle}>{mod.title}</Text>
                <Text style={s.moduleDesc}>{mod.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#38BDF8"/>
            </TouchableOpacity>
          ))}
        </View>
        <View style={s.footer}>
          <Text style={s.footerText}>💡 Pindutin ang Basahin para marinig ang bawat seksyon</Text>
          <Text style={s.footerSub}>May screen simulator para sa mga ID, diskwento, at iba pang serbisyo!</Text>
        </View>
      </GradientScreen>
    );
  }

  // ─────────────────────────────────────────────
  // MODULE: IDs at Rehistrasyon
  // ─────────────────────────────────────────────
  if (currentModule === "ids") {
    return (
      <GradientScreen>
        <View style={s.lessonHeader}>
          <Text style={s.lessonTitle}>IDs at Rehistrasyon</Text>
          <ReadBtn text="Ang IDs at Rehistrasyon ay ang unang hakbang para ma-access ang lahat ng senior citizen benefits sa Cabanatuan City, Nueva Ecija. Matutuhan natin ang OSCA ID mula sa Cabanatuan City Hall, PhilSys National ID, at Digital Senior Citizens ID." id="ids-main"/>
        </View>
        {IDS_CONTENT.map((item, i) => (
          <View key={i} style={[s.infoCard, {borderLeftColor: item.color}]}>
            <View style={s.infoCardHeader}>
              <Ionicons name={item.icon} size={22} color={item.color}/>
              <Text style={s.infoCardTitle}>{item.title}</Text>
            </View>
            <Text style={s.infoCardDesc}>{item.description}</Text>
            <View style={s.stepList}>
              <Text style={s.stepListLabel}>Mga Hakbang:</Text>
              {item.steps.map((step, j) => (
                <View key={j} style={s.stepItem}>
                  <View style={[s.stepNum, {backgroundColor: item.color}]}><Text style={s.stepNumText}>{j+1}</Text></View>
                  <Text style={s.stepText}>{step}</Text>
                </View>
              ))}
            </View>
            <View style={s.requirementBadge}>
              <Ionicons name="person-circle-outline" size={16} color={item.color}/>
              <Text style={[s.requirementText, {color: item.color}]}>Para sa: {item.requirement}</Text>
            </View>
            <View style={s.cardActions}>
              <TouchableOpacity style={s.listenBtn} onPress={()=>narrate(`${item.title}. ${item.description}`, `ids-${i}`)}>
                <Ionicons name={isNarrating(`ids-${i}`)?"stop":"play"} size={16} color="#38BDF8"/>
                <Text style={s.listenBtnText}>{isNarrating(`ids-${i}`)?"Tumutugtog...":"Basahin"}</Text>
              </TouchableOpacity>
              {item.simulatorType && <SimBtn type={item.simulatorType} data={item}/>}
            </View>
          </View>
        ))}
      </GradientScreen>
    );
  }

  // ─────────────────────────────────────────────
  // MODULE: Benefits & Discounts
  // ─────────────────────────────────────────────
  if (currentModule === "benefits") {
    return (
      <GradientScreen>
        <View style={s.lessonHeader}>
          <Text style={s.lessonTitle}>Mga Benepisyo at Diskwento</Text>
          <ReadBtn text="Bilang senior citizen ng Cabanatuan City, Nueva Ecija, marami kayong karapatan sa ilalim ng Batas RA 9994 o Expanded Senior Citizens Act. Matutuhan natin ang lahat ng mga benepisyo na dapat ninyong matanggap sa lahat ng establisyimento sa Cabanatuan." id="ben-main"/>
        </View>
        {BENEFITS_CONTENT.map((item, i) => (
          <View key={i} style={[s.infoCard, {borderLeftColor: item.color}]}>
            <View style={s.infoCardHeader}>
              <Ionicons name={item.icon} size={22} color={item.color}/>
              <Text style={s.infoCardTitle}>{item.title}</Text>
            </View>
            <Text style={s.infoCardDesc}>{item.description}</Text>
            <View style={s.bulletList}>
              {item.items.map((b,j)=>(
                <View key={j} style={s.bulletItem}>
                  <Ionicons name="checkmark-circle" size={16} color={item.color}/>
                  <Text style={s.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
            <View style={s.cardActions}>
              <TouchableOpacity style={s.listenBtn} onPress={()=>narrate(`${item.title}. ${item.description}`, `ben-${i}`)}>
                <Ionicons name={isNarrating(`ben-${i}`)?"stop":"play"} size={16} color="#38BDF8"/>
                <Text style={s.listenBtnText}>{isNarrating(`ben-${i}`)?"Tumutugtog...":"Basahin"}</Text>
              </TouchableOpacity>
              {item.simulatorType && <SimBtn type={item.simulatorType} data={item}/>}
            </View>
          </View>
        ))}
      </GradientScreen>
    );
  }

  // ─────────────────────────────────────────────
  // MODULE: Health
  // ─────────────────────────────────────────────
  if (currentModule === "health") {
    return (
      <GradientScreen>
        <View style={s.lessonHeader}>
          <Text style={s.lessonTitle}>Serbisyong Pangkalusugan</Text>
          <ReadBtn text="Ang kalusugan ang pinakamahalagang bagay para sa mga senior citizen ng Cabanatuan City. Mayroon tayong PhilHealth office sa NE Pacific Mall, ang Dr. Paulino J. Garcia Memorial Hospital sa Mabini Street na may hotline na 044-463-8888, at ang M.V. Gallego City General Hospital para sa inyong kalusugan." id="health-main"/>
        </View>
        {HEALTH_CONTENT.map((item, i) => (
          <View key={i} style={[s.infoCard, {borderLeftColor: item.color}]}>
            <View style={s.infoCardHeader}>
              <Ionicons name={item.icon} size={22} color={item.color}/>
              <Text style={s.infoCardTitle}>{item.title}</Text>
            </View>
            <Text style={s.infoCardDesc}>{item.description}</Text>
            <View style={s.stepList}>
              <Text style={s.stepListLabel}>Mga Hakbang / Serbisyo:</Text>
              {item.steps.map((step, j) => (
                <View key={j} style={s.stepItem}>
                  <View style={[s.stepNum, {backgroundColor: item.color}]}><Text style={s.stepNumText}>{j+1}</Text></View>
                  <Text style={s.stepText}>{step}</Text>
                </View>
              ))}
            </View>
            <View style={s.cardActions}>
              <TouchableOpacity style={s.listenBtn} onPress={()=>narrate(`${item.title}. ${item.description}`, `health-${i}`)}>
                <Ionicons name={isNarrating(`health-${i}`)?"stop":"play"} size={16} color="#38BDF8"/>
                <Text style={s.listenBtnText}>{isNarrating(`health-${i}`)?"Tumutugtog...":"Basahin"}</Text>
              </TouchableOpacity>
              {item.simulatorType && <SimBtn type={item.simulatorType} data={item}/>}
            </View>
          </View>
        ))}
      </GradientScreen>
    );
  }

  // ─────────────────────────────────────────────
  // MODULE: Social Pension
  // ─────────────────────────────────────────────
  if (currentModule === "pension") {
    return (
      <GradientScreen>
        <View style={s.lessonHeader}>
          <Text style={s.lessonTitle}>Social Pension</Text>
          <ReadBtn text="Ang social pension ay tumutulong sa mga senior citizen ng Cabanatuan City para sa kanilang pangangailangan. Mayroon tayong DSWD Social Pension sa Mabini Extension Street, SSS Cabanatuan Branch sa NE Pacific Mall na may numero 044-463-0691, at GSIS Cabanatuan Branch sa NFA Compound Maharlika Highway na may numero 044-463-0572." id="pen-main"/>
        </View>
        {PENSION_CONTENT.map((item, i) => (
          <View key={i} style={[s.infoCard, {borderLeftColor: item.color}]}>
            <View style={s.infoCardHeader}>
              <Ionicons name={item.icon} size={22} color={item.color}/>
              <Text style={s.infoCardTitle}>{item.title}</Text>
            </View>
            <Text style={s.infoCardDesc}>{item.description}</Text>
            <View style={[s.amountBadge, {backgroundColor: item.color+"15", borderColor: item.color}]}>
              <Ionicons name="cash" size={18} color={item.color}/>
              <Text style={[s.amountText, {color: item.color}]}>Halaga: {item.amount}</Text>
            </View>
            <View style={s.stepList}>
              <Text style={s.stepListLabel}>Mga Kinakailangan:</Text>
              {item.requirements.map((r,j)=>(
                <View key={j} style={s.bulletItem}>
                  <Ionicons name="checkmark-circle" size={16} color={item.color}/>
                  <Text style={s.bulletText}>{r}</Text>
                </View>
              ))}
            </View>
            <View style={s.stepList}>
              <Text style={s.stepListLabel}>Paano Mag-apply:</Text>
              {item.howToApply.map((h,j)=>(
                <View key={j} style={s.stepItem}>
                  <View style={[s.stepNum, {backgroundColor: item.color}]}><Text style={s.stepNumText}>{j+1}</Text></View>
                  <Text style={s.stepText}>{h}</Text>
                </View>
              ))}
            </View>
            <View style={s.cardActions}>
              <TouchableOpacity style={s.listenBtn} onPress={()=>narrate(`${item.title}. ${item.description}. Halaga: ${item.amount}`, `pen-${i}`)}>
                <Ionicons name={isNarrating(`pen-${i}`)?"stop":"play"} size={16} color="#38BDF8"/>
                <Text style={s.listenBtnText}>{isNarrating(`pen-${i}`)?"Tumutugtog...":"Basahin"}</Text>
              </TouchableOpacity>
              {item.simulatorType && <SimBtn type={item.simulatorType} data={item}/>}
            </View>
          </View>
        ))}
      </GradientScreen>
    );
  }

  // ─────────────────────────────────────────────
  // MODULE: eGov Apps
  // ─────────────────────────────────────────────
  if (currentModule === "apps") {
    return (
      <GradientScreen>
        <View style={s.lessonHeader}>
          <Text style={s.lessonTitle}>Gabay sa eGov Apps</Text>
          <ReadBtn text="Ang mga eGov apps ay nagbibigay ng madaling access sa mga serbisyo ng pamahalaan sa inyong telepono. Para sa mga senior ng Cabanatuan City, matutuhan natin ang eGovPH, My SSS, PhilHealth, at Pag-IBIG apps bilang alternatibo sa personal na pagpunta sa mga opisina." id="apps-main"/>
        </View>
        {APPS_CONTENT.map((item, i) => (
          <View key={i} style={[s.infoCard, {borderLeftColor: item.color}]}>
            <View style={s.infoCardHeader}>
              <Ionicons name={item.icon} size={22} color={item.color}/>
              <Text style={s.infoCardTitle}>{item.title}</Text>
            </View>
            <Text style={s.infoCardDesc}>{item.description}</Text>
            <View style={s.bulletList}>
              <Text style={s.stepListLabel}>Mga Magagawa:</Text>
              {item.features.map((f,j)=>(
                <View key={j} style={s.bulletItem}>
                  <Ionicons name="checkmark-circle" size={16} color={item.color}/>
                  <Text style={s.bulletText}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={s.cardActions}>
              <TouchableOpacity style={s.listenBtn} onPress={()=>narrate(`${item.title}. ${item.description}`, `apps-${i}`)}>
                <Ionicons name={isNarrating(`apps-${i}`)?"stop":"play"} size={16} color="#38BDF8"/>
                <Text style={s.listenBtnText}>{isNarrating(`apps-${i}`)?"Tumutugtog...":"Basahin"}</Text>
              </TouchableOpacity>
              {item.simulatorType && <SimBtn type={item.simulatorType} data={item}/>}
              <TouchableOpacity style={[s.listenBtn, {borderColor: item.color, backgroundColor: item.color+"15"}]} onPress={()=>Linking.openURL(item.downloadLink)}>
                <Ionicons name="download-outline" size={16} color={item.color}/>
                <Text style={[s.listenBtnText, {color: item.color}]}>I-download</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </GradientScreen>
    );
  }

  // ─────────────────────────────────────────────
  // MODULE: Legal Protection
  // ─────────────────────────────────────────────
  if (currentModule === "legal") {
    return (
      <GradientScreen>
        <View style={s.lessonHeader}>
          <Text style={s.lessonTitle}>Legal na Proteksyon</Text>
          <ReadBtn text="Bilang senior citizen ng Cabanatuan City, Nueva Ecija, kayo ay protektado ng batas. Ang Republic Act 9994 at iba pang batas ay nagbibigay ng karapatan at proteksyon sa lahat ng matatanda sa lungsod." id="legal-main"/>
        </View>
        {LEGAL_CONTENT.map((item, i) => (
          <View key={i} style={[s.infoCard, {borderLeftColor: item.color}]}>
            <View style={s.infoCardHeader}>
              <Ionicons name={item.icon} size={22} color={item.color}/>
              <Text style={s.infoCardTitle}>{item.title}</Text>
            </View>
            <Text style={s.infoCardDesc}>{item.description}</Text>
            {item.rights && (
              <View style={s.bulletList}>
                <Text style={s.stepListLabel}>Mga Karapatan:</Text>
                {item.rights.map((r,j)=>(
                  <View key={j} style={s.bulletItem}>
                    <Ionicons name="checkmark-circle" size={16} color={item.color}/>
                    <Text style={s.bulletText}>{r}</Text>
                  </View>
                ))}
              </View>
            )}
            {item.reportTo && (
              <View style={s.bulletList}>
                <Text style={s.stepListLabel}>Saan Mag-report sa Cabanatuan City:</Text>
                {item.reportTo.map((r,j)=>(
                  <View key={j} style={s.bulletItem}>
                    <Ionicons name="call" size={16} color={item.color}/>
                    <Text style={s.bulletText}>{r}</Text>
                  </View>
                ))}
              </View>
            )}
            {item.steps && (
              <View style={s.stepList}>
                <Text style={s.stepListLabel}>Mga Hakbang:</Text>
                {item.steps.map((step, j) => (
                  <View key={j} style={s.stepItem}>
                    <View style={[s.stepNum, {backgroundColor: item.color}]}><Text style={s.stepNumText}>{j+1}</Text></View>
                    <Text style={s.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={s.cardActions}>
              <TouchableOpacity style={s.listenBtn} onPress={()=>narrate(`${item.title}. ${item.description}`, `legal-${i}`)}>
                <Ionicons name={isNarrating(`legal-${i}`)?"stop":"play"} size={16} color="#38BDF8"/>
                <Text style={s.listenBtnText}>{isNarrating(`legal-${i}`)?"Tumutugtog...":"Basahin"}</Text>
              </TouchableOpacity>
              {item.simulatorType && <SimBtn type={item.simulatorType} data={item} danger={item.color==="#DC2626"}/>}
            </View>
          </View>
        ))}
      </GradientScreen>
    );
  }

  // ─────────────────────────────────────────────
  // MODULE: LGU
  // ─────────────────────────────────────────────
  if (currentModule === "lgu") {
    return (
      <GradientScreen>
        <View style={s.lessonHeader}>
          <Text style={s.lessonTitle}>LGU / Barangay Serbisyo</Text>
          <ReadBtn text="Ang Cabanatuan City Hall sa M. de Leon Avenue at ang inyong barangay sa isa sa 89 barangay ng Cabanatuan City ang pinakamalapit na lugar para humingi ng tulong at serbisyo bilang senior citizen." id="lgu-main"/>
        </View>
        {LGU_CONTENT.map((item, i) => (
          <View key={i} style={[s.infoCard, {borderLeftColor: item.color}]}>
            <View style={s.infoCardHeader}>
              <Ionicons name={item.icon} size={22} color={item.color}/>
              <Text style={s.infoCardTitle}>{item.title}</Text>
            </View>
            <Text style={s.infoCardDesc}>{item.description}</Text>
            <View style={s.bulletList}>
              {(item.services || item.examples || []).map((b,j)=>(
                <View key={j} style={s.bulletItem}>
                  <Ionicons name="checkmark-circle" size={16} color={item.color}/>
                  <Text style={s.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
            {item.tip && (
              <View style={[s.tipBox, {marginTop:0, marginBottom:12}]}>
                <Text style={s.tipBoxText}>💡 {item.tip}</Text>
              </View>
            )}
            <View style={s.cardActions}>
              <TouchableOpacity style={s.listenBtn} onPress={()=>narrate(`${item.title}. ${item.description}`, `lgu-${i}`)}>
                <Ionicons name={isNarrating(`lgu-${i}`)?"stop":"play"} size={16} color="#38BDF8"/>
                <Text style={s.listenBtnText}>{isNarrating(`lgu-${i}`)?"Tumutugtog...":"Basahin"}</Text>
              </TouchableOpacity>
              {item.simulatorType && <SimBtn type={item.simulatorType} data={item}/>}
            </View>
          </View>
        ))}
      </GradientScreen>
    );
  }

  // ─────────────────────────────────────────────
  // MODULE: Hotlines
  // ─────────────────────────────────────────────
  if (currentModule === "hotlines") {
    return (
      <GradientScreen>
        <View style={s.lessonHeader}>
          <Text style={s.lessonTitle}>Mga Hotline at Emergency</Text>
          <ReadBtn text="Narito ang lahat ng mahahalagang numero para sa mga senior citizen ng Cabanatuan City, Nueva Ecija. I-save ang mga numerong ito sa inyong telepono para sa inyong kaligtasan at kaginhawahan. Para sa emergency, tumawag sa 911 anumang oras ng araw o gabi." id="hotlines-main"/>
        </View>
        <View style={[s.tipBox, {marginBottom:20}]}>
          <Text style={s.tipBoxTitle}>📞 I-save ang mga numerong ito!</Text>
          <Text style={s.tipBoxText}>Mga opisyal na numero ng government offices sa Cabanatuan City at Nueva Ecija. Pindutin ang numero para direktang tumawag.</Text>
        </View>
        {HOTLINES.map((h, i) => (
          <TouchableOpacity
            key={i}
            style={s.hotlineFullCard}
            onPress={()=>Linking.openURL(`tel:${h.number.replace(/[^0-9]/g,"")}`)}
          >
            <View style={[s.hotlineIconWrap, {backgroundColor: h.color+"22"}]}>
              <Ionicons name={h.icon} size={26} color={h.color}/>
            </View>
            <View style={s.hotlineInfo}>
              <Text style={s.hotlineFullName}>{h.name}</Text>
              <Text style={s.hotlineFullDesc}>{h.desc}</Text>
              <Text style={[s.hotlineFullNum, {color: h.color}]}>{h.number}</Text>
            </View>
            <View style={[s.callBtn, {backgroundColor: h.color}]}>
              <Ionicons name="call" size={18} color="#fff"/>
              <Text style={s.callBtnText}>Tawag</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={[s.tipBox, {marginTop:8}]}>
          <Text style={s.tipBoxTitle}>⚠️ Emergency sa Cabanatuan City:</Text>
          <Text style={s.tipBoxText}>Para sa emergency na sitwasyon sa Cabanatuan City at Nueva Ecija, tumawag kaagad sa 911. Bukas ito 24 na oras, 7 araw sa isang linggo.</Text>
        </View>
      </GradientScreen>
    );
  }

  return null;
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F9FF" },
  container: { flex: 1, backgroundColor: "#F0F9FF" },
  gradientBg: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 80, paddingBottom: 50 },

  // Back Button
  backButton: {
    position: "absolute", top: Platform.OS === "ios" ? 50 : 30, left: 20,
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)", paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  backButtonText: { marginLeft: 8, fontSize: 16, fontWeight: "600", color: "#0F172A" },

  // Header
  header: {
    alignItems: "center", marginBottom: 30,
    backgroundColor: "rgba(255,255,255,0.9)", padding: 24, borderRadius: 24,
    elevation: 8, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8,
  },
  headerIconWrap: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "#F0F9FF",
    justifyContent: "center", alignItems: "center", marginBottom: 15,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1,
    shadowRadius: 8, elevation: 5,
  },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#0F172A", textAlign: "center", marginBottom: 5 },
  headerSubtitle: { fontSize: 15, color: "#64748B", textAlign: "center", marginBottom: 20 },
  headerDivider: { width: 60, height: 4, backgroundColor: "#38BDF8", borderRadius: 2 },

  // Module Cards
  moduleGrid: { gap: 14 },
  moduleCard: {
    backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 16, padding: 18,
    flexDirection: "row", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  moduleIconBg: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: "#F0F9FF",
    justifyContent: "center", alignItems: "center", marginRight: 14,
  },
  moduleContent: { flex: 1 },
  moduleTitle: { fontSize: 17, fontWeight: "600", color: "#0F172A", marginBottom: 3 },
  moduleDesc: { fontSize: 13, color: "#64748B", lineHeight: 18 },

  // Footer
  footer: {
    backgroundColor: "rgba(255,255,255,0.9)", padding: 20, borderRadius: 16, marginTop: 24,
    alignItems: "center", elevation: 4,
  },
  footerText: { fontSize: 15, color: "#0F172A", fontWeight: "600", textAlign: "center" },
  footerSub: { fontSize: 13, color: "#475569", textAlign: "center", marginTop: 6, fontStyle: "italic" },

  // Lesson Header
  lessonHeader: {
    alignItems: "center", marginBottom: 24, backgroundColor: "rgba(255,255,255,0.9)",
    padding: 20, borderRadius: 20, elevation: 6,
  },
  lessonTitle: { fontSize: 22, fontWeight: "bold", color: "#0F172A", textAlign: "center", marginBottom: 14 },
  lessonSubtitle: { fontSize: 15, color: "#64748B", textAlign: "center" },

  // Audio Button
  audioBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#F0F9FF",
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: "#38BDF8",
  },
  speakingBtn: { backgroundColor: "#38BDF8" },
  audioBtnText: { marginLeft: 8, fontSize: 15, fontWeight: "600", color: "#38BDF8" },
  audioBtnTextActive: { color: "#fff" },

  // Info Card
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 16, marginBottom: 18,
    borderLeftWidth: 5, elevation: 5,
    shadowColor: "#0F172A", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 6,
    overflow: "hidden",
  },
  infoCardHeader: { flexDirection: "row", alignItems: "center", padding: 18, paddingBottom: 8 },
  infoCardTitle: { fontSize: 17, fontWeight: "bold", color: "#0F172A", marginLeft: 10, flex: 1 },
  infoCardDesc: { fontSize: 15, color: "#475569", lineHeight: 22, paddingHorizontal: 18, paddingBottom: 12 },

  // Step List
  stepList: { paddingHorizontal: 18, paddingBottom: 12 },
  stepListLabel: { fontSize: 14, fontWeight: "700", color: "#0F172A", marginBottom: 10 },
  stepItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  stepNum: {
    width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 10, marginTop: 1,
  },
  stepNumText: { fontSize: 12, fontWeight: "bold", color: "#fff" },
  stepText: { fontSize: 14, color: "#475569", flex: 1, lineHeight: 20 },

  // Bullet List
  bulletList: { paddingHorizontal: 18, paddingBottom: 12 },
  bulletItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  bulletText: { fontSize: 14, color: "#475569", flex: 1, marginLeft: 8, lineHeight: 20 },

  // Requirement Badge
  requirementBadge: {
    flexDirection: "row", alignItems: "center", marginHorizontal: 18, marginBottom: 14,
    backgroundColor: "#F0F9FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: "flex-start",
  },
  requirementText: { fontSize: 13, fontWeight: "600", marginLeft: 6 },

  // Amount Badge
  amountBadge: {
    flexDirection: "row", alignItems: "center", marginHorizontal: 18, marginBottom: 14,
    borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, alignSelf: "flex-start",
  },
  amountText: { fontSize: 16, fontWeight: "bold", marginLeft: 8 },

  // Card Actions
  cardActions: {
    flexDirection: "row", flexWrap: "wrap", gap: 10, padding: 18, paddingTop: 6,
  },
  listenBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#F0F9FF",
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#38BDF8",
  },
  listenBtnText: { color: "#38BDF8", fontSize: 13, marginLeft: 6, fontWeight: "600" },

  // Simulator Button
  simBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "rgba(5,150,105,0.1)",
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#059669",
  },
  simBtnDanger: { backgroundColor: "rgba(220,38,38,0.1)", borderColor: "#DC2626" },
  simBtnText: { marginLeft: 6, fontSize: 13, fontWeight: "600", color: "#059669" },
  simBtnTextDanger: { color: "#DC2626" },

  // Tip Box
  tipBox: {
    backgroundColor: "rgba(255,255,255,0.9)", padding: 18, borderRadius: 14,
    marginBottom: 20, elevation: 3,
  },
  tipBoxTitle: { fontSize: 16, fontWeight: "bold", color: "#0F172A", marginBottom: 8 },
  tipBoxText: { fontSize: 14, color: "#475569", lineHeight: 22 },

  // Hotline Full Card
  hotlineFullCard: {
    backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 16, padding: 16,
    flexDirection: "row", alignItems: "center", marginBottom: 12,
    elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6,
  },
  hotlineIconWrap: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginRight: 14 },
  hotlineInfo: { flex: 1 },
  hotlineFullName: { fontSize: 16, fontWeight: "bold", color: "#0F172A", marginBottom: 2 },
  hotlineFullDesc: { fontSize: 12, color: "#64748B", marginBottom: 4 },
  hotlineFullNum: { fontSize: 15, fontWeight: "700" },
  callBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  callBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold", marginTop: 2 },

  // ── Phone Simulator ──────────────────────────
  phoneSim: {
    width: width * 0.82, maxWidth: 320, backgroundColor: "#fff",
    borderRadius: 24, overflow: "hidden",
    elevation: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16,
    borderWidth: 6, borderColor: "#0F172A",
  },
  phoneStatusBar: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 18, paddingVertical: 10, backgroundColor: "#fff",
  },
  phoneTime: { fontSize: 14, fontWeight: "bold", color: "#0F172A" },
  phoneSignal: { flexDirection: "row", alignItems: "center", gap: 3 },
  signalBar: { width: 3, height: 12, backgroundColor: "#0F172A", borderRadius: 1 },
  batteryTxt: { fontSize: 12, color: "#0F172A", marginLeft: 6 },
  phoneAppBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingHorizontal: 16, paddingVertical: 14,
  },
  phoneAppTitle: { fontSize: 16, fontWeight: "bold", color: "#fff", textAlign: "center" },
  phoneBody: { backgroundColor: "#fff", padding: 16, minHeight: 320 },

  // ID Card (simulator)
  idCard: {
    borderRadius: 12, borderWidth: 2, borderColor: "#0EA5E9", overflow: "hidden", marginBottom: 16,
  },
  idCardHeader: { padding: 14, alignItems: "center" },
  idCardHeaderTitle: { fontSize: 12, color: "#fff", fontWeight: "bold", textAlign: "center", marginTop: 4 },
  idCardHeaderSub: { fontSize: 11, color: "rgba(255,255,255,0.85)", textAlign: "center", marginTop: 2 },
  idCardBody: { flexDirection: "row", padding: 14, backgroundColor: "#F8FAFC" },
  idPhotoPlaceholder: {
    width: 64, height: 80, borderRadius: 8, backgroundColor: "#E2E8F0",
    justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#0EA5E9",
  },
  idDetails: { flex: 1, marginLeft: 14 },
  idLabel: { fontSize: 10, color: "#94A3B8", fontWeight: "600", marginTop: 6 },
  idValue: { fontSize: 13, color: "#0F172A", fontWeight: "500" },
  idCardFooter: { backgroundColor: "#E2E8F0", padding: 8, alignItems: "center" },
  idFooterText: { fontSize: 11, color: "#475569" },

  // App Screen
  appScreen: { paddingBottom: 8 },
  appIconRow: { alignItems: "center", marginBottom: 8 },
  appScreenTitle: { fontSize: 15, fontWeight: "bold", color: "#0F172A", textAlign: "center", marginBottom: 14 },
  appDashboard: { gap: 10, marginBottom: 12 },
  dashCard: {
    backgroundColor: "#F8FAFC", borderRadius: 10, padding: 14, alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0",
  },
  dashLabel: { fontSize: 11, color: "#64748B", marginBottom: 4 },
  dashValue: { fontSize: 20, fontWeight: "bold" },

  // App Grid
  appGridTitle: { fontSize: 14, fontWeight: "bold", color: "#0F172A", marginBottom: 12 },
  appGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  appGridItem: { width: "30%", alignItems: "center" },
  appGridIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 6 },
  appGridLabel: { fontSize: 11, color: "#475569", textAlign: "center", fontWeight: "500" },

  // Digital ID Card
  digitalIdCard: { borderRadius: 12, borderWidth: 2, overflow: "hidden", marginBottom: 16 },
  digitalIdBanner: { flexDirection: "row", alignItems: "center", padding: 14 },
  digitalIdName: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  digitalIdType: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
  qrPlaceholder: { alignItems: "center", padding: 20, backgroundColor: "#F8FAFC" },
  qrLabel: { fontSize: 12, color: "#64748B", marginTop: 8 },

  // Receipt Sim
  receiptSim: {
    backgroundColor: "#FFFBEB", borderRadius: 10, padding: 16, borderWidth: 1,
    borderColor: "#FDE68A", borderStyle: "dashed", marginBottom: 16,
  },
  receiptTitle: { fontSize: 16, fontWeight: "bold", color: "#0F172A", textAlign: "center", marginBottom: 2 },
  receiptStore: { fontSize: 12, color: "#64748B", textAlign: "center", marginBottom: 4 },
  receiptDivider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 8 },
  receiptRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 3 },
  receiptItem: { fontSize: 13, color: "#475569" },
  receiptPrice: { fontSize: 13, color: "#0F172A", fontWeight: "500" },

  // Pension Card
  pensionCard: { borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 14 },
  pensionCardHeader: { flexDirection: "row", alignItems: "center", padding: 14, gap: 10 },
  pensionCardTitle: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  pensionCardBody: { padding: 16, backgroundColor: "#F8FAFC" },
  pensionLabel: { fontSize: 12, color: "#64748B", marginBottom: 4 },
  pensionAmount: { fontSize: 32, fontWeight: "bold", color: "#059669", marginBottom: 12 },
  pensionDivider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 10 },

  // Law Card
  lawCard: { backgroundColor: "#F0F9FF", borderRadius: 12, padding: 16, marginBottom: 14 },
  lawBanner: { alignItems: "center", marginBottom: 16 },
  lawTitle: { fontSize: 18, fontWeight: "bold", color: "#0F172A", marginTop: 8 },
  lawSubtitle: { fontSize: 13, color: "#64748B", marginTop: 4 },
  lawItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  lawItemText: { fontSize: 14, color: "#475569", flex: 1, marginLeft: 10, lineHeight: 20 },

  // Alert Banner
  alertBanner: {
    flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 10,
    borderWidth: 2, marginBottom: 16, gap: 10,
  },
  alertTitle: { fontSize: 16, fontWeight: "bold" },

  // Hotline Card (in simulator)
  hotlineCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC",
    padding: 14, borderRadius: 10, marginBottom: 10,
    borderWidth: 1, borderColor: "#E2E8F0",
  },
  hotlineCardName: { fontSize: 14, fontWeight: "bold", color: "#0F172A" },
  hotlineCardNum: { fontSize: 13, fontWeight: "600", marginTop: 2 },

  // Menu List (barangay/osca simulator)
  menuListItem: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC",
    padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: "#E2E8F0",
  },
  menuListIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12 },
  menuListText: { fontSize: 14, color: "#0F172A", flex: 1, fontWeight: "500" },

  // Status Badge (simulator)
  statusBadge: {
    flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 10, borderWidth: 1.5, marginTop: 4,
  },
  badgeSafe: { backgroundColor: "rgba(5,150,105,0.08)", borderColor: "#059669" },
  badgeDanger: { backgroundColor: "rgba(220,38,38,0.08)", borderColor: "#DC2626" },
  badgeText: { fontSize: 12, flex: 1, marginLeft: 8, lineHeight: 18, fontWeight: "500" },
  badgeTextSafe: { color: "#059669" },
  badgeTextDanger: { color: "#DC2626" },

  // Info Row
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  infoRowText: { fontSize: 13, color: "#475569", flex: 1 },
});