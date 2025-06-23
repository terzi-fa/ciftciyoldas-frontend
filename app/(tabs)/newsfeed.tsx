import FeatherIcon from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking
} from 'react-native';
import { API_URL, API_ENDPOINTS } from '../config/api';

interface News {
  title: string;
  content: string;
  url: string;
  image_url: string;
  published_at: string;
  source: string;
}

export default function NewsFeed() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgricultureNews();
  }, []);

  const fetchAgricultureNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}${API_ENDPOINTS.LATEST_AGRICULTURE_NEWS}`);
      if (!response.ok) {
        throw new Error('Tarım haberleri yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setNews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const openNewsUrl = async (url: string) => {
    try {
      // URL'yi kontrol et
      if (!url || url === '#' || url === '') {
        console.log('Geçersiz URL:', url);
        return;
      }
      
      // URL'nin geçerli olup olmadığını kontrol et
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        console.log('Bu URL desteklenmiyor:', url);
        return;
      }
      
      await Linking.openURL(url);
    } catch (error) {
      console.error('URL açılamadı:', error);
      // Kullanıcıya hata mesajı göster
      alert('Haber linki açılamadı. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const renderQuickAccessCards = () => (
    <View style={styles.quickAccessContainer}>
      <Text style={styles.quickAccessTitle}>Hızlı Erişim</Text>
      <View style={styles.quickAccessGrid}>
        <TouchableOpacity 
          style={styles.quickAccessCard}
          onPress={() => router.push('/organic-protection')}
        >
          <View style={[styles.quickAccessIcon, { backgroundColor: '#4CAF50' }]}>
            <FeatherIcon name="shield" size={24} color="white" />
          </View>
          <Text style={styles.quickAccessText}>Organik Koruma</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAccessCard}
          onPress={() => router.push('/crop-rotation')}
        >
          <View style={[styles.quickAccessIcon, { backgroundColor: '#2196F3' }]}>
            <FeatherIcon name="calendar" size={24} color="white" />
          </View>
          <Text style={styles.quickAccessText}>Ekim Planı</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Tarım haberleri yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAgricultureNews}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Üst Kısım Başlık */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => setModalVisible(true)}>
            <FeatherIcon color="#8B4513" name="log-out" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tarım Haberleri</Text>
        </View>
        <View style={styles.headerAction}>
          <TouchableOpacity onPress={fetchAgricultureNews}>
            <FeatherIcon color="#8B4513" name="refresh-cw" size={21} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Haber Kartları */}
      <ScrollView contentContainerStyle={styles.content}>
        {news.length === 0 ? (
          <View style={styles.noNewsContainer}>
            <Text style={styles.noNewsText}>Henüz tarım haberi bulunamadı</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchAgricultureNews}>
              <Text style={styles.retryButtonText}>Yenile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          news.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openNewsUrl(item.url)}>
              <View style={styles.card}>
                <Image
                  alt=""
                  resizeMode="cover"
                  source={{ uri: item.image_url || 'https://via.placeholder.com/300x200?text=Tarım+Haberi' }}
                  style={styles.cardImg}
                />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTag}>{item.source}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardContent} numberOfLines={3}>
                    {item.content}
                  </Text>
                  <View style={styles.cardRow}>
                    <View style={styles.cardRowItem}>
                      <Text style={styles.cardRowItemText}>
                        {new Date(item.published_at).toLocaleDateString('tr-TR')}
                      </Text>
                    </View>
                    <Text style={styles.cardRowDivider}>·</Text>
                    <View style={styles.cardRowItem}>
                      <Text style={styles.cardRowItemText}>Detayları Gör</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        
        {/* Hızlı Erişim Kartları */}
        {renderQuickAccessCards()}
      </ScrollView>

      {/* Çıkış Onay Modalı */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Çıkış Yapmak İstiyor musunuz?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Hayır</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={() => router.replace('/auth/signin')}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextYes]}>Evet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  /** Header */
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Quick Access Cards */
  quickAccessContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAccessCard: {
    alignItems: 'center',
    width: '45%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
  },
  quickAccessIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  /** Card */
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  cardImg: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  cardBody: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  cardTag: {
    fontWeight: '500',
    fontSize: 12,
    color: '#000000',
    marginBottom: 7,
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 19,
    color: '#000000',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    lineHeight: 18,
    color: '#666666',
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRowItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
  },
  cardRowDivider: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    marginHorizontal: 8,
  },
  /** Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonNo: {
    backgroundColor: '#f3f4f6',
  },
  modalButtonYes: {
    backgroundColor: '#8B4513',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  modalButtonTextYes: {
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  loadingText: {
    fontSize: 16,
    color: '#8B4513',
    marginTop: 16,
  },
  noNewsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNewsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#8B4513',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
