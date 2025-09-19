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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Speech from 'expo-speech'; // ✅ Expo TTS

const { width } = Dimensions.get('window');

// Mock news data - In real app, replace with API calls
const MOCK_NEWS = [
  {
    id: 1,
    headline: "Weather Update: Sunny Weather Expected Across Metro Manila",
    summary: "The Philippine Atmospheric Geophysical and Astronomical Services Administration forecasts clear skies for the next three days.",
    category: "Weather",
    image: "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Weather",
    content: "PAGASA announced that Metro Manila and surrounding areas will experience mostly sunny weather with occasional cloud cover. Temperature is expected to range from 24°C to 32°C. Residents are advised to stay hydrated and use sun protection when going outdoors.",
    language: "english",
    publishedAt: "2 hours ago",
  },
  {
    id: 2,
    headline: "SSS Pension Increase: Good News for Senior Citizens",
    summary: "The Social Security System announces a 5% pension increase effective this month.",
    category: "Senior News",
    image: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=SSS+News",
    content: "The Social Security System has approved a 5% increase in monthly pension benefits for all qualified retirees. This increase aims to help senior citizens cope with rising living costs. The new rates will be automatically reflected in pension payments starting this month.",
    language: "english",
    publishedAt: "4 hours ago",
  },
  {
    id: 3,
    headline: "Health Advisory: Free Flu Vaccination for Seniors",
    summary: "Department of Health offers free influenza vaccines at all health centers nationwide.",
    category: "Health",
    image: "https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Health",
    content: "The Department of Health encourages all senior citizens to get their annual flu vaccination. Free vaccines are available at barangay health centers and public hospitals. Priority will be given to those aged 60 and above.",
    language: "english",
    publishedAt: "6 hours ago",
  },
  {
    id: 4,
    headline: "Libreng Sakay Program Extended sa Metro Manila",
    summary: "Ang programa para sa mga senior citizen ay pinalawak hanggang susunod na taon.",
    category: "Local News",
    image: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Transport",
    content: "Inanunsyo ng pamahalaan ang pagpapalawak ng Libreng Sakay program para sa mga senior citizen hanggang sa susunod na taon. Kasama dito ang mga bus, jeepney, at MRT/LRT na sakayan sa loob ng Metro Manila.",
    language: "filipino",
    publishedAt: "1 day ago",
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All News', icon: 'newspaper' },
  { id: 'local', name: 'Local', icon: 'map-marker-alt' },
  { id: 'weather', name: 'Weather', icon: 'cloud-sun' },
  { id: 'health', name: 'Health', icon: 'heartbeat' },
  { id: 'senior', name: 'Senior News', icon: 'users' },
];

export default function LiveNewsScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [textSize, setTextSize] = useState('medium');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadNews();
    startAnimations();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setNews(MOCK_NEWS);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading news:', error);
      Alert.alert('Error', 'Failed to load news. Please try again.');
      setLoading(false);
    }
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
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
      Speech.stop();
      setIsReading(false);
      return;
    }

    const language = article.language === 'filipino' ? 'tl-PH' : 'en-US';
    const textToRead = `${article.headline}. ${article.content}`;

    Speech.speak(textToRead, {
      language,
      rate: 0.9, // slower for seniors
      pitch: 1.0,
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
      Speech.stop();
      setIsReading(false);
    }
    setIsModalVisible(false);
    setSelectedArticle(null);
  };

  const getTextSizeStyle = () => {
    switch (textSize) {
      case 'small': return { fontSize: 14 };
      case 'large': return { fontSize: 20 };
      default: return { fontSize: 16 };
    }
  };

  const getTitleSizeStyle = () => {
    switch (textSize) {
      case 'small': return { fontSize: 18 };
      case 'large': return { fontSize: 24 };
      default: return { fontSize: 20 };
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.headerTitle}>📰 Live News</Text>
        <Text style={styles.headerSubtitle}>Daily news updates for seniors</Text>
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
          >
            <Icon name={cat.icon} size={18} color={selectedCategory === cat.id ? '#fff' : '#0F172A'} />
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
        <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.newsScroll} contentContainerStyle={{ paddingBottom: 80 }}>
          {filteredNews.length === 0 ? (
            <Text style={styles.noNewsText}>No news found for this category.</Text>
          ) : (
            filteredNews.map(article => (
              <TouchableOpacity
                key={article.id}
                style={styles.newsCard}
                onPress={() => openArticleModal(article)}
                activeOpacity={0.95}
              >
                <Image source={{ uri: article.image }} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text style={[styles.newsHeadline, getTitleSizeStyle()]}>{article.headline}</Text>
                  <Text style={[styles.newsSummary, getTextSizeStyle()]}>{article.summary}</Text>
                  <View style={styles.newsMeta}>
                    <Text style={styles.newsCategory}>{article.category}</Text>
                    <Text style={styles.newsTime}>{article.publishedAt}</Text>
                  </View>
                </View>
                <View style={styles.arrowIcon}>
                  <Icon name="chevron-right" size={18} color="#38BDF8" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* Article Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedArticle && (
              <>
                <Image source={{ uri: selectedArticle.image }} style={styles.modalImage} />
                <Text style={[styles.modalHeadline, getTitleSizeStyle()]}>{selectedArticle.headline}</Text>
                <Text style={[styles.modalBody, getTextSizeStyle()]}>{selectedArticle.content}</Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[
                      styles.ttsButton,
                      isReading && styles.ttsButtonActive,
                    ]}
                    onPress={() => handleReadArticle(selectedArticle)}
                  >
                    <Icon name="volume-up" size={22} color={isReading ? "#fff" : "#38BDF8"} />
                    <Text style={[
                      styles.ttsButtonText,
                      isReading && styles.ttsButtonTextActive,
                    ]}>
                      {isReading ? "Stop Reading" : "Read Aloud"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Icon name="times" size={22} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                {/* Text Size Controls */}
                <View style={styles.textSizeControls}>
                  <Text style={styles.textSizeLabel}>Text Size:</Text>
                  <TouchableOpacity
                    style={[
                      styles.textSizeButton,
                      textSize === 'small' && styles.textSizeButtonActive,
                    ]}
                    onPress={() => setTextSize('small')}
                  >
                    <Text style={styles.textSizeButtonText}>A-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.textSizeButton,
                      textSize === 'medium' && styles.textSizeButtonActive,
                    ]}
                    onPress={() => setTextSize('medium')}
                  >
                    <Text style={styles.textSizeButtonText}>A</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.textSizeButton,
                      textSize === 'large' && styles.textSizeButtonActive,
                    ]}
                    onPress={() => setTextSize('large')}
                  >
                    <Text style={styles.textSizeButtonText}>A+</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: -1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '400',
  },
  categoryScroll: {
    marginVertical: 8,
    paddingHorizontal: 8,
    maxHeight: 54,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#38BDF8',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  newsScroll: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
  },
  newsImage: {
    width: 90,
    height: 70,
    borderRadius: 12,
    marginLeft: 10,
    marginRight: 14,
    backgroundColor: '#E0F2FE',
  },
  newsContent: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 8,
  },
  newsHeadline: {
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  newsSummary: {
    color: '#475569',
    marginBottom: 6,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newsCategory: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  newsTime: {
    fontSize: 12,
    color: '#64748B',
  },
  arrowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  noNewsText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.92,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    elevation: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 140,
    borderRadius: 18,
    marginBottom: 18,
    backgroundColor: '#E0F2FE',
  },
  modalHeadline: {
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalBody: {
    color: '#475569',
    marginBottom: 18,
    textAlign: 'left',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ttsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  ttsButtonActive: {
    backgroundColor: '#38BDF8',
  },
  ttsButtonText: {
    marginLeft: 8,
    color: '#38BDF8',
    fontWeight: 'bold',
    fontSize: 15,
  },
  ttsButtonTextActive: {
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 8,
  },
  textSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  textSizeLabel: {
    fontSize: 14,
    color: '#334155',
    marginRight: 8,
  },
  textSizeButton: {
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 2,
  },
  textSizeButtonActive: {
    backgroundColor: '#38BDF8',
  },
  textSizeButtonText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: 'bold',
  },
});
// ...existing