import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from './services/api';
import { API_ENDPOINTS } from './config/api';

interface CropRotationPlan {
  id: number;
  name: string;
  description: string;
  duration_years: number;
  rotation_type: string;
  rotation_sequence: CropRotationYear[];
  is_active: boolean;
  expected_yield_increase: number;
  estimated_cost_savings: number;
  benefits: string;
  challenges: string;
  field_id: number;
}

interface CropRotationYear {
  year: number;
  season: string;
  crop_type_id: number;
  crop_name: string;
  crop_family: string;
  nitrogen_fixation: boolean;
  pest_repellent: boolean;
  soil_improvement: boolean;
  notes?: string;
  companion_plants?: string[];
}

interface RotationRecommendation {
  field_id: number;
  soil_type: string;
  recommendations: {
    name: string;
    description: string;
    sequence: Array<{
      year: number;
      season: string;
      crop: string;
      family: string;
      benefits: string[];
    }>;
  };
  benefits: string[];
}

export default function CropRotationScreen() {
  const router = useRouter();
  const [rotationPlans, setRotationPlans] = useState<CropRotationPlan[]>([]);
  const [recommendations, setRecommendations] = useState<RotationRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'plans' | 'recommendations' | 'create'>('plans');
  const [selectedSoilType, setSelectedSoilType] = useState('organik');

  useEffect(() => {
    loadRotationPlans();
  }, []);

  const loadRotationPlans = async () => {
    try {
      const response = await api.get<CropRotationPlan[]>(API_ENDPOINTS.CROP_ROTATION);
      if (response.data) {
        setRotationPlans(response.data);
      } else if (response.error) {
        Alert.alert('Hata', `Rotasyon planları yüklenirken bir hata oluştu: ${response.error}`);
      }
    } catch (error) {
      console.error('Rotasyon planları yüklenirken hata:', error);
      Alert.alert('Hata', 'Beklenmedik bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async (soilType: string) => {
    try {
      setLoading(true);
      const endpoint = API_ENDPOINTS.ROTATION_RECOMMENDATIONS.replace(':fieldId', '1').replace(':soilType', soilType);
      const response = await api.get<RotationRecommendation>(endpoint);
      if (response.data) {
        setRecommendations(response.data);
      }
    } catch (error) {
      console.error('Rotasyon önerileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeasonText = (season: string) => {
    switch (season) {
      case 'spring': return 'İlkbahar';
      case 'summer': return 'Yaz';
      case 'autumn': return 'Sonbahar';
      case 'winter': return 'Kış';
      default: return season;
    }
  };

  const getRotationTypeText = (type: string) => {
    switch (type) {
      case 'traditional': return 'Geleneksel';
      case 'organic': return 'Organik';
      case 'intensive': return 'Yoğun';
      case 'conservation': return 'Koruyucu';
      default: return type;
    }
  };

  const getFamilyColor = (family: string) => {
    switch (family) {
      case 'Tahıl': return '#4CAF50';
      case 'Baklagil': return '#2196F3';
      case 'Yağlı tohum': return '#FF9800';
      case 'Yumru': return '#9C27B0';
      case 'Sebze': return '#795548';
      default: return '#607D8B';
    }
  };

  const renderPlans = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Rotasyon Planlarım</Text>
      {rotationPlans.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="calendar" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Henüz rotasyon planı yok</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setSelectedTab('create')}
          >
            <Text style={styles.addButtonText}>Yeni Plan Oluştur</Text>
          </TouchableOpacity>
        </View>
      ) : (
        rotationPlans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planType}>{getRotationTypeText(plan.rotation_type)}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: plan.is_active ? '#4CAF50' : '#f44336' }]}>
                <Text style={styles.statusText}>{plan.is_active ? 'Aktif' : 'Pasif'}</Text>
              </View>
            </View>
            
            <Text style={styles.description}>{plan.description}</Text>
            
            <View style={styles.planDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Süre:</Text>
                <Text style={styles.detailValue}>{plan.duration_years} yıl</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Verim Artışı:</Text>
                <Text style={styles.detailValue}>{plan.expected_yield_increase}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Tasarruf:</Text>
                <Text style={styles.detailValue}>{plan.estimated_cost_savings} ₺</Text>
              </View>
            </View>

            <View style={styles.sequenceContainer}>
              <Text style={styles.sequenceTitle}>Ekim Sırası:</Text>
              {plan.rotation_sequence.slice(0, 3).map((year, index) => (
                <View key={index} style={styles.sequenceItem}>
                  <Text style={styles.sequenceText}>
                    {year.year}. yıl {getSeasonText(year.season)}: {year.crop_name}
                  </Text>
                  <View style={[styles.familyBadge, { backgroundColor: getFamilyColor(year.crop_family) }]}>
                    <Text style={styles.familyText}>{year.crop_family}</Text>
                  </View>
                </View>
              ))}
              {plan.rotation_sequence.length > 3 && (
                <Text style={styles.moreText}>+{plan.rotation_sequence.length - 3} daha...</Text>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderRecommendations = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Rotasyon Önerileri</Text>
      
      <View style={styles.soilTypeSelector}>
        <Text style={styles.selectorTitle}>Toprak Türü Seçin:</Text>
        <View style={styles.selectorButtons}>
          {['organik', 'killi', 'kumlu'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.selectorButton, selectedSoilType === type && styles.selectedButton]}
              onPress={() => {
                setSelectedSoilType(type);
                loadRecommendations(type);
              }}
            >
              <Text style={[styles.selectorButtonText, selectedSoilType === type && styles.selectedButtonText]}>
                {type === 'organik' ? 'Organik' : type === 'killi' ? 'Killi' : 'Kumlu'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {recommendations && (
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationName}>{recommendations.recommendations.name}</Text>
          <Text style={styles.recommendationDescription}>{recommendations.recommendations.description}</Text>
          
          <View style={styles.sequenceContainer}>
            <Text style={styles.sequenceTitle}>Önerilen Sıra:</Text>
            {recommendations.recommendations.sequence.map((item, index) => (
              <View key={index} style={styles.sequenceItem}>
                <View style={styles.sequenceHeader}>
                  <Text style={styles.sequenceText}>
                    {item.year}. yıl {getSeasonText(item.season)}: {item.crop}
                  </Text>
                  <View style={[styles.familyBadge, { backgroundColor: getFamilyColor(item.family) }]}>
                    <Text style={styles.familyText}>{item.family}</Text>
                  </View>
                </View>
                <View style={styles.benefitsContainer}>
                  {item.benefits.map((benefit, benefitIndex) => (
                    <Text key={benefitIndex} style={styles.benefitText}>• {benefit}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Genel Faydalar:</Text>
            {recommendations.benefits.map((benefit, index) => (
              <Text key={index} style={styles.benefitText}>• {benefit}</Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderCreate = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Yeni Rotasyon Planı</Text>
      <View style={styles.createCard}>
        <Feather name="plus-circle" size={48} color="#4CAF50" />
        <Text style={styles.createTitle}>Plan Oluştur</Text>
        <Text style={styles.createDescription}>
          Tarlanızın özelliklerine göre özel rotasyon planı oluşturun
        </Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => Alert.alert('Bilgi', 'Plan oluşturma özelliği yakında eklenecek')}
        >
          <Text style={styles.createButtonText}>Plan Oluştur</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ekin Rotasyonu</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'plans' && styles.activeTab]}
          onPress={() => setSelectedTab('plans')}
        >
          <Text style={[styles.tabText, selectedTab === 'plans' && styles.activeTabText]}>
            Planlarım
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'recommendations' && styles.activeTab]}
          onPress={() => setSelectedTab('recommendations')}
        >
          <Text style={[styles.tabText, selectedTab === 'recommendations' && styles.activeTabText]}>
            Öneriler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'create' && styles.tabActive]}
          onPress={() => {
            setSelectedTab('create');
            router.push('/crop-rotation/create');
          }}>
          <Feather name="plus" size={18} color={selectedTab === 'create' ? '#fff' : '#333'} />
          <Text style={[styles.tabText, selectedTab === 'create' && styles.tabTextActive]}>Oluştur</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabContent}>
          {selectedTab === 'plans' && renderPlans()}
          {selectedTab === 'recommendations' && renderRecommendations()}
          {selectedTab === 'create' && (
             <View style={styles.emptyState}>
               <Feather name="plus-square" size={48} color="#ccc" />
               <Text style={styles.emptyText}>Yeni Plan Oluştur</Text>
               <TouchableOpacity
                 style={styles.actionButton}
                 onPress={() => router.push('/crop-rotation/create')}
               >
                 <Text style={styles.actionButtonText}>Plan Oluştur</Text>
               </TouchableOpacity>
             </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  planType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  sequenceContainer: {
    marginTop: 10,
  },
  sequenceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sequenceItem: {
    marginBottom: 8,
  },
  sequenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sequenceText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  familyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  familyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  benefitsContainer: {
    marginTop: 4,
    marginLeft: 10,
  },
  benefitText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  moreText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  soilTypeSelector: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  selectorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  selectorButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedButtonText: {
    color: 'white',
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  benefitsSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  createCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  createDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  tabActive: {
    backgroundColor: '#4CAF50',
  },
  tabTextActive: {
    color: 'white',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
}); 