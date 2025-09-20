import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
  Animated,
  Platform,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Speech from 'expo-speech';
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

// Fixed TTS Wrapper - matching smartphone basics design
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

// Reliable image sources matching current Philippine news
const FALLBACK_IMAGES = {
  weather: 'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=400&h=250&fit=crop&auto=format',
  politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=250&fit=crop&auto=format',
  health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop&auto=format',
  education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop&auto=format',
  business: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&auto=format',
  travel: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop&auto=format',
  technology: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop&auto=format',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop&auto=format',
  government: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop&auto=format',
  law: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop&auto=format',
  default: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop&auto=format'
};

const CATEGORIES = [
  { id: 'all', name: 'All News', icon: 'newspaper', query: 'general' },
  { id: 'local', name: 'Local', icon: 'map-marker-alt', query: 'general' },
  { id: 'weather', name: 'Weather', icon: 'cloud-sun', query: 'weather' },
  { id: 'health', name: 'Health', icon: 'heartbeat', query: 'health' },
  { id: 'business', name: 'Business', icon: 'chart-line', query: 'business' },
  { id: 'sports', name: 'Sports', icon: 'futbol', query: 'sports' },
  { id: 'technology', name: 'Tech', icon: 'laptop', query: 'technology' },
];

export default function LiveNewsScreen() {
  const navigation = useNavigation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [textSize, setTextSize] = useState('medium');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Enhanced animations matching smartphone basics design
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseValue = useRef(new Animated.Value(0)).current;
  const floatValue1 = useRef(new Animated.Value(0)).current;
  const floatValue2 = useRef(new Animated.Value(0)).current;
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadNews();
    startAnimations();
    
    // Set up auto-refresh every 30 minutes
    const refreshInterval = setInterval(() => {
      loadNews();
    }, 30 * 60 * 1000);

    return () => {
      clearInterval(refreshInterval);
      TTSWrapper.stop();
    };
  }, [selectedCategory]);

  const startAnimations = () => {
    // Header animations
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

  const loadNews = async () => {
    try {
      setLoading(true);
      const newsData = getReliablePhilippineNews();
      setNews(newsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading news:', error);
      setNews(getReliablePhilippineNews());
    } finally {
      setLoading(false);
    }
  };

  const getReliablePhilippineNews = () => {
    const currentDate = new Date();
    const timeVariations = ['6 hours ago', '13 hours ago', '20 hours ago', '1 day ago', '2 days ago', '3 days ago'];
    
    return [
      {
        id: 1,
        headline: "Tropical Storm Nando May Become Super Typhoon, PAGASA Warns",
        summary: "PAGASA upgraded Nando to tropical storm status and warns it may intensify into a super typhoon with Signal No. 5 possible as it approaches Northern Luzon.",
        content: "The Philippine Atmospheric Geophysical and Astronomical Services Administration (PAGASA) has upgraded Tropical Depression Nando to tropical storm status with maximum sustained winds of 95 km/h. The weather bureau warns that Nando may rapidly intensify into a super typhoon as it moves westward over the Philippine Sea. The center of Nando may pass close to or make landfall over the Babuyan Islands between Monday evening and Tuesday morning. PAGASA urged residents to prepare 'as early as now' with waves possibly reaching up to 14 meters near Extreme Northern Luzon. This is the Philippines' 14th tropical cyclone for 2025 and the fourth for September.",
        category: "Weather",
        image: FALLBACK_IMAGES.weather,
        publishedAt: timeVariations[0],
        source: "PAGASA",
        language: "english",
      },
      {
        id: 2,
        headline: "DOTr Partners with Philippine Airlines to Reduce Siargao Flight Costs",
        summary: "Department of Transportation seeks partnership with PAL to make Siargao more accessible to tourists through reduced airfare costs.",
        content: "The Department of Transportation (DOTr) is looking to partner with Philippine Airlines (PAL) to reduce the cost of airfare to Siargao, one of the country's tourism hotspots and an internationally popular surfing destination. In a statement, DOTr acting Secretary Giovanni announced the initiative aims to boost tourism recovery and make the destination more accessible to both domestic and international travelers. The partnership proposal includes potential subsidies and route optimization to achieve sustainable lower fares. Siargao has been recognized globally as a premier surfing destination, but high airfare costs have been a barrier for many tourists.",
        category: "Travel",
        image: FALLBACK_IMAGES.travel,
        publishedAt: timeVariations[1],
        source: "Department of Transportation",
        language: "english",
      },
      {
        id: 3,
        headline: "Bureau of Immigration Adds 35 Names to Watchlist Over Flood Control Anomalies",
        summary: "BI Commissioner Joel Anthony Viado announces addition of 35 individuals to monitoring list for alleged involvement in fraudulent flood control projects.",
        content: "Bureau of Immigration (BI) Commissioner Joel Anthony Viado announced that 35 individuals have been added to the agency's monitoring list following allegations of their involvement in anomalous flood control projects. The BI received an immigration lookout bulletin requesting enhanced monitoring of these persons of interest. The move is part of the broader investigation into the multi-billion peso flood control scandal that has rocked the government. Commissioner Viado emphasized that the bureau will fully cooperate with investigating agencies to ensure accountability and prevent individuals from leaving the country while under investigation.",
        category: "Law Enforcement",
        image: FALLBACK_IMAGES.law,
        publishedAt: timeVariations[2],
        source: "Bureau of Immigration",
        language: "english",
      },
      {
        id: 4,
        headline: "House Speaker Romualdez Resigns Amid Flood Control Scandals",
        summary: "Political turmoil continues as House Speaker Martin Romualdez steps down following allegations of mismanagement in flood control projects.",
        content: "House Speaker Martin Romualdez officially submitted his resignation amid mounting pressure from ongoing investigations into alleged irregularities in flood control projects worth billions of pesos. The Department of Public Works and Highways (DPWH) has reportedly uncovered over 100 'ghost' and substandard projects under his oversight. The resignation comes as the anti-corruption drive intensifies, with various government officials being scrutinized for their roles in the massive infrastructure scandal. Political analysts describe this as one of the most significant political developments in recent years.",
        category: "Politics",
        image: FALLBACK_IMAGES.politics,
        publishedAt: timeVariations[3],
        source: "The Manila Times",
        language: "english",
      },
      {
        id: 5,
        headline: "DPWH Uncovers Over 100 'Ghost' and Substandard Flood Control Projects",
        summary: "Department of Public Works reveals massive irregularities in infrastructure projects worth billions of pesos across multiple regions.",
        content: "The Department of Public Works and Highways (DPWH) has uncovered over 100 fraudulent and substandard flood control projects during its comprehensive audit. DPWH Undersecretary Cabral, who has since resigned amid budget insertion allegations, was allegedly involved in the systematic manipulation of project allocations. The ghost projects span multiple regions and represent one of the largest infrastructure corruption scandals in Philippine history. The DPWH is working closely with the Commission on Audit to assess the full extent of the damage and recover misused public funds.",
        category: "Government",
        image: FALLBACK_IMAGES.government,
        publishedAt: timeVariations[4],
        source: "DPWH",
        language: "english",
      },
      {
        id: 6,
        headline: "PHINMA Education Network Expands to 9 Schools Nationwide",
        summary: "PHINMA continues expansion in Philippine education sector, reinforcing commitment to accessible quality education for Filipinos.",
        content: "PHINMA Education Network has expanded its presence in the Philippines to nine schools, reinforcing its commitment to providing accessible quality education to Filipino students. The group thanked its leadership, particularly Hilado, for his 'unwavering commitment to making lives better for Filipinos' through educational initiatives. The expansion comes as the education sector continues to recover from pandemic disruptions, with PHINMA focusing on innovative learning solutions and scholarship programs for underprivileged students. The network aims to bridge educational gaps and provide world-class education across different regions in the Philippines.",
        category: "Education",
        image: FALLBACK_IMAGES.education,
        publishedAt: timeVariations[5],
        source: "PHINMA Education",
        language: "english",
      },
    ];
  };

  const formatPublishDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffHours < 1) {
        return 'Just now';
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-PH', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      return 'Recently';
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const filteredNews = news.filter(article => {
    if (selectedCategory === 'all') return true;
    return article.category.toLowerCase().includes(selectedCategory);
  });

  const handleReadArticle = (article) => {
    if (Platform.OS === 'web') {
      Alert.alert('Feature Not Available', 'Text-to-speech is not available on web platform.');
      return;
    }

    if (isReading) {
      TTSWrapper.stop();
      setIsReading(false);
      return;
    }

    const textToRead = `Breaking news from ${article.source}. ${article.headline}. ${article.content}`;
    TTSWrapper.speak(textToRead, {
      onStart: () => setIsReading(true),
      onDone: () => setIsReading(false),
      onStopped: () => setIsReading(false),
      onError: () => setIsReading(false),
    });
  };

  const openArticleModal = (article) => {
    setSelectedArticle(article);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    if (isReading) {
      TTSWrapper.stop();
      setIsReading(false);
    }
    setIsModalVisible(false);
    setSelectedArticle(null);
  };

  const getTextSizeStyle = () => {
    switch (textSize) {
      case 'small': return { fontSize: 14, lineHeight: 20 };
      case 'large': return { fontSize: 20, lineHeight: 28 };
      default: return { fontSize: 16, lineHeight: 24 };
    }
  };

  const getTitleSizeStyle = () => {
    switch (textSize) {
      case 'small': return { fontSize: 18, lineHeight: 24 };
      case 'large': return { fontSize: 24, lineHeight: 32 };
      default: return { fontSize: 20, lineHeight: 28 };
    }
  };

  // Interpolations for background animations
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

  return (
    <View style={styles.container}>
      {/* Enhanced Gradient Background - matching smartphone basics */}
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

      {/* Animated overlay */}
      <Animated.View
        style={[styles.backgroundOverlay, { opacity: pulseOpacity }]}
      />

      {/* Floating background elements */}
      <View style={styles.backgroundElements}>
        <Animated.View
          style={[
            styles.floatingElement1,
            { transform: [{ translateY: float1Y }] },
          ]}
        >
          <Icon name="newspaper" size={28} color="rgba(255, 255, 255, 0.12)" />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingElement2,
            { transform: [{ translateY: float2Y }] },
          ]}
        >
          <Icon name="globe-asia" size={32} color="rgba(255, 255, 255, 0.12)" />
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

      {/* Enhanced Header - matching smartphone basics design */}
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.headerIconContainer}>
          <Icon name="newspaper" size={32} color="#0F172A" />
        </View>
        <Text style={styles.headerTitle}>Philippine News</Text>
        <Text style={styles.headerSubtitle}>
          Latest updates from reliable sources
        </Text>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <View style={styles.headerDivider} />
      </Animated.View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              selectedCategory === cat.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
            activeOpacity={0.8}
          >
            <Icon name={cat.icon} size={16} color={selectedCategory === cat.id ? '#fff' : '#0F172A'} />
            <Text style={[
              styles.categoryText,
              selectedCategory === cat.id && styles.categoryTextActive,
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* News List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#38BDF8" />
          <Text style={styles.loadingText}>Loading latest Philippine news...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.newsScroll} 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#38BDF8']}
              tintColor="#38BDF8"
              title="Pull to refresh news"
              titleColor="#64748B"
            />
          }
        >
          {filteredNews.length === 0 ? (
            <View style={styles.noNewsContainer}>
              <Icon name="newspaper" size={48} color="#94A3B8" />
              <Text style={styles.noNewsText}>No news found for this category.</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
                <Icon name="refresh" size={16} color="#38BDF8" />
                <Text style={styles.refreshButtonText}>Refresh News</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredNews.map(article => (
              <TouchableOpacity
                key={article.id}
                style={styles.newsCard}
                onPress={() => openArticleModal(article)}
                activeOpacity={0.92}
              >
                <View style={styles.newsImageContainer}>
                  <Image 
                    source={{ uri: article.image }} 
                    style={styles.newsImage}
                  />
                </View>
                <View style={styles.newsContent}>
                  <Text style={[styles.newsHeadline, getTitleSizeStyle()]} numberOfLines={2}>
                    {article.headline}
                  </Text>
                  <Text style={[styles.newsSummary, getTextSizeStyle()]} numberOfLines={2}>
                    {article.summary}
                  </Text>
                  <View style={styles.newsMeta}>
                    <Text style={styles.newsCategory}>{article.category}</Text>
                    <Text style={styles.newsTime}>{article.publishedAt}</Text>
                  </View>
                  <Text style={styles.newsSource}>📰 {article.source}</Text>
                </View>
                <View style={styles.arrowIcon}>
                  <Icon name="chevron-right" size={18} color="#38BDF8" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* Enhanced Article Modal - matching smartphone basics design */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedArticle && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconContainer}>
                    <Icon name="newspaper" size={40} color="#38BDF8" />
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
                >
                  <Image 
                    source={{ uri: selectedArticle.image }} 
                    style={styles.modalImage}
                  />
                  <Text style={[styles.modalHeadline, getTitleSizeStyle()]}>
                    {selectedArticle.headline}
                  </Text>
                  <View style={styles.modalMeta}>
                    <Text style={styles.modalSource}>📰 {selectedArticle.source}</Text>
                    <Text style={styles.modalTime}>{selectedArticle.publishedAt}</Text>
                  </View>
                  <Text style={[styles.modalBody, getTextSizeStyle()]}>
                    {selectedArticle.content}
                  </Text>
                  
                  {/* Enhanced Controls Section */}
                  <View style={styles.controlsSection}>
                    <View style={styles.primaryControls}>
                      <TouchableOpacity
                        style={[
                          styles.ttsButton,
                          isReading && styles.ttsButtonActive,
                        ]}
                        onPress={() => handleReadArticle(selectedArticle)}
                        activeOpacity={0.8}
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
                          >
                            <Text
                              style={[
                                styles.textSizeButtonText,
                                textSize === size && styles.textSizeButtonTextActive,
                              ]}
                            >
                              {["A-", "A", "A+"][idx]}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Enhanced Back Button - matching smartphone basics */}
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

const styles = StyleSheet.create({
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
    marginBottom: 15,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    marginBottom: 15,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 1,
  },
  headerDivider: {
    width: 60,
    height: 4,
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  categoryScroll: {
    marginVertical: 12,
    paddingHorizontal: 8,
    maxHeight: 50,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#38BDF8',
    elevation: 4,
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  newsScroll: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
  },
  newsCard: {
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
  newsImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  newsImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
  },
  newsContent: {
    flex: 1,
    paddingRight: 8,
  },
  newsHeadline: {
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  newsSummary: {
    color: '#64748B',
    marginBottom: 8,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  newsCategory: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  newsTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  newsSource: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
  arrowIcon: {
    marginLeft: 12,
  },
  noNewsContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  noNewsText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  refreshButtonText: {
    marginLeft: 8,
    color: '#38BDF8',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
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
  modalScrollView: {
    flex: 1,
  },
  modalScrollContainer: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 40,
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#E0F2FE',
    marginTop: 20,
  },
  modalHeadline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
    lineHeight: 32,
    textAlign: 'left',
  },
  modalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalSource: {
    fontSize: 14,
    color: '#38BDF8',
    fontWeight: '600',
  },
  modalTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  modalBody: {
    color: '#475569',
    marginBottom: 24,
    textAlign: 'left',
    lineHeight: 24,
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
    zIndex: 10,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
});