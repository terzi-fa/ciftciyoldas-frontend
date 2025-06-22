import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from './services/api';
import { API_ENDPOINTS } from './config/api';

interface OrganicPestControl {
  id: number;
  pest_name: string;
  pest_type: string;
  control_method: string;
  description: string;
  effectiveness: number;
  cost: number;
  application_date: string;
  is_preventive: boolean;
  is_curative: boolean;
}

interface CropType {
  id: number;
  name: string;
}

interface CompanionPlantingResult {
  main_crop: string;
  companion_plants: string[];
  benefits: string[];
}

interface BiologicalControlResult {
    main_pest: string;
    recommendations: Array<{
        name: string;
        target: string;
        effectiveness: number;
        details: string[];
    }>;
    application_tips: string[];
}

export default function OrganicProtectionScreen() {
  const router = useRouter();
  const [pestControls, setPestControls] = useState<OrganicPestControl[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'records' | 'companion' | 'biological'>('records');
  
  // Yeni state'ler
  const [cropTypes, setCropTypes] = useState<CropType[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [companionResult, setCompanionResult] = useState<CompanionPlantingResult | null>(null);
  const [isCropModalVisible, setCropModalVisible] = useState(false);

  const [selectedPestType, setSelectedPestType] = useState<string | null>(null);
  const [biologicalResult, setBiologicalResult] = useState<BiologicalControlResult | null>(null);
  const [isPestModalVisible, setPestModalVisible] = useState(false);
  
  const pestTypeOptions = [
    { key: 'insect', label: 'Böcek' },
    { key: 'disease', label: 'Hastalık' },
    { key: 'weed', label: 'Yabani Ot' },
    { key: 'nematode', label: 'Nematod' },
    { key: 'rodent', label: 'Kemirgen' }
  ];

  useEffect(() => {
    if (selectedTab === 'records') {
        loadPestControls();
    } else if (selectedTab === 'companion') {
        loadCropTypes();
    }
  }, [selectedTab]);

  const loadPestControls = async () => {
    try {
      const response = await api.get<OrganicPestControl[]>(API_ENDPOINTS.ORGANIC_PEST_CONTROL);
      if (response.data) {
        setPestControls(response.data);
      } else if (response.error) {
        Alert.alert('Hata', `Zararlı mücadelesi kayıtları yüklenirken bir hata oluştu: ${response.error}`);
      }
    } catch (error) {
      console.error('Zararlı mücadelesi kayıtları yüklenirken hata:', error);
      Alert.alert('Hata', 'Beklenmedik bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const loadCropTypes = async () => {
    setLoading(true);
    try {
      const response = await api.get<any>(API_ENDPOINTS.CROP_TYPES);

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setCropTypes(response.data.data);
      } else {
        Alert.alert('Hata', 'Ekin türleri beklenilen formatta gelmedi.');
        setCropTypes([]);
      }
    } catch (error) {
      Alert.alert('Hata', 'Ekin türleri yüklenirken bir sorun oluştu.');
      setCropTypes([]);
    } finally {
        setLoading(false);
    }
  };

  const handleSelectCrop = async (crop: CropType) => {
    setSelectedCrop(crop);
    setCropModalVisible(false);
    setLoading(true);
    try {
        const endpoint = API_ENDPOINTS.COMPANION_PLANTING.replace(':cropName', crop.name);
        const response = await api.get<any>(endpoint);
        if(response.data){
            setCompanionResult(response.data);
        } else {
            Alert.alert('Hata', `Öneriler alınamadı: ${response.error}`);
        }
    } catch(e) {
        Alert.alert('Hata', 'Yan yana ekim önerileri alınırken bir sorun oluştu.');
    } finally {
        setLoading(false);
    }
  };

  const handleSelectPestType = async (pestType: {key: string, label: string}) => {
      setSelectedPestType(pestType.label);
      setPestModalVisible(false);
      setLoading(true);
      try {
          const endpoint = API_ENDPOINTS.BIOLOGICAL_CONTROL.replace(':pestType', pestType.key);
          const response = await api.get<any>(endpoint);
          if(response.data){
              setBiologicalResult({ ...response.data, main_pest: pestType.label });
          } else {
              Alert.alert('Hata', `Öneriler alınamadı: ${response.error}`);
          }
      } catch(e) {
          Alert.alert('Hata', 'Biyolojik mücadele önerileri alınırken bir sorun oluştu.');
      } finally {
          setLoading(false);
      }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'biological': return 'bug';
      case 'cultural': return 'leaf';
      case 'physical': return 'shield';
      case 'mechanical': return 'settings';
      case 'companion_planting': return 'users';
      default: return 'help-circle';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'biological': return '#4CAF50';
      case 'cultural': return '#2196F3';
      case 'physical': return '#FF9800';
      case 'mechanical': return '#9C27B0';
      case 'companion_planting': return '#795548';
      default: return '#607D8B';
    }
  };

  const getPestTypeText = (type: string) => {
    switch (type) {
      case 'insect': return 'Böcek';
      case 'disease': return 'Hastalık';
      case 'weed': return 'Yabani Ot';
      case 'nematode': return 'Nematod';
      case 'rodent': return 'Kemirgen';
      default: return type;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case 'biological': return 'Biyolojik Mücadele';
      case 'cultural': return 'Kültürel Mücadele';
      case 'physical': return 'Fiziksel Mücadele';
      case 'mechanical': return 'Mekanik Mücadele';
      case 'companion_planting': return 'Yan Yana Ekim';
      default: return method;
    }
  };

  const renderRecords = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Organik Mücadele Kayıtları</Text>
      {pestControls.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="shield" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Henüz mücadele kaydı yok</Text>
          <Text style={styles.emptySubText}>Yeni kayıt eklemek için sağ alttaki '+' butonuna dokunun.</Text>
        </View>
      ) : (
        pestControls.map((control) => (
          <View key={control.id} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <View style={styles.pestInfo}>
                <Text style={styles.pestName}>{control.pest_name}</Text>
                <Text style={styles.pestType}>{getPestTypeText(control.pest_type)}</Text>
              </View>
              <View style={[styles.methodBadge, { backgroundColor: getMethodColor(control.control_method) }]}>
                <Feather name={getMethodIcon(control.control_method)} size={16} color="white" />
                <Text style={styles.methodText}>{getMethodText(control.control_method)}</Text>
              </View>
            </View>
            
            <Text style={styles.description}>{control.description}</Text>
            
            <View style={styles.recordDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Etkinlik:</Text>
                <Text style={styles.detailValue}>{control.effectiveness}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Maliyet:</Text>
                <Text style={styles.detailValue}>{control.cost} ₺</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Tarih:</Text>
                <Text style={styles.detailValue}>
                  {new Date(control.application_date).toLocaleDateString('tr-TR')}
                </Text>
              </View>
            </View>
            
            <View style={styles.typeBadges}>
              {control.is_preventive && (
                <View style={[styles.typeBadge, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.typeBadgeText}>Önleyici</Text>
                </View>
              )}
              {control.is_curative && (
                <View style={[styles.typeBadge, { backgroundColor: '#FF9800' }]}>
                  <Text style={styles.typeBadgeText}>Tedavi Edici</Text>
                </View>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderCompanionPlanting = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Yan Yana Ekim Önerileri</Text>
      <TouchableOpacity 
        style={styles.selectorCard}
        onPress={() => setCropModalVisible(true)}
      >
        <Text style={styles.selectorTitle}>{selectedCrop ? selectedCrop.name : 'Ekin Türü Seçin'}</Text>
        <Feather name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>
      {loading && <ActivityIndicator style={{marginTop: 20}} size="large" />}
      {companionResult && (
          <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>'{companionResult.main_crop}' için öneriler:</Text>
              <Text style={styles.subTitle}>Refakatçi Bitkiler:</Text>
              {companionResult.companion_plants.map((plant, i) => <Text key={i} style={styles.listItem}>• {plant}</Text>)}
              <Text style={styles.subTitle}>Faydaları:</Text>
              {companionResult.benefits.map((benefit, i) => <Text key={i} style={styles.listItem}>• {benefit}</Text>)}
          </View>
      )}
    </View>
  );

  const renderBiologicalControl = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Biyolojik Mücadele</Text>
       <TouchableOpacity 
        style={styles.selectorCard}
        onPress={() => setPestModalVisible(true)}
      >
        <Text style={styles.selectorTitle}>{selectedPestType || 'Zararlı Türü Seçin'}</Text>
        <Feather name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>
      {loading && <ActivityIndicator style={{marginTop: 20}} size="large" />}
      {biologicalResult && (
          <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>'{biologicalResult.main_pest}' için Biyolojik Mücadele Önerileri:</Text>
              {biologicalResult.recommendations.map((rec, i) => (
                  <View key={i} style={styles.recommendationItem}>
                      <Text style={styles.subTitle}>{rec.name}</Text>
                      {rec.details.map((detail, j) => (
                        <Text key={j} style={styles.listItem}>• {detail}</Text>
                      ))}
                  </View>
              ))}
               <Text style={styles.subTitle}>Genel Uygulama İpuçları:</Text>
              {biologicalResult.application_tips.map((tip, i) => <Text key={i} style={styles.listItem}>• {tip}</Text>)}
          </View>
      )}
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
        <Text style={styles.headerTitle}>Organik Koruma</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'records' && styles.activeTab]}
          onPress={() => setSelectedTab('records')}
        >
          <Text style={[styles.tabText, selectedTab === 'records' && styles.activeTabText]}>
            Kayıtlar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'companion' && styles.activeTab]}
          onPress={() => setSelectedTab('companion')}
        >
          <Text style={[styles.tabText, selectedTab === 'companion' && styles.activeTabText]}>
            Yan Yana Ekim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'biological' && styles.activeTab]}
          onPress={() => setSelectedTab('biological')}
        >
          <Text style={[styles.tabText, selectedTab === 'biological' && styles.activeTabText]}>
            Biyolojik
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'records' && renderRecords()}
        {selectedTab === 'companion' && renderCompanionPlanting()}
        {selectedTab === 'biological' && renderBiologicalControl()}
      </ScrollView>

      {selectedTab === 'records' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/organic-protection/create')}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Crop Type Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCropModalVisible}
        onRequestClose={() => setCropModalVisible(false)}
      >
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Ekin Türü Seçin</Text>
                  <ScrollView>
                      {cropTypes.map(crop => (
                          <TouchableOpacity key={crop.id} style={styles.modalItem} onPress={() => handleSelectCrop(crop)}>
                              <Text style={styles.modalItemText}>{crop.name}</Text>
                          </TouchableOpacity>
                      ))}
                  </ScrollView>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setCropModalVisible(false)}>
                      <Text style={styles.closeButtonText}>Kapat</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

      {/* Pest Type Modal */}
       <Modal
        animationType="slide"
        transparent={true}
        visible={isPestModalVisible}
        onRequestClose={() => setPestModalVisible(false)}
      >
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Zararlı Türü Seçin</Text>
                  <ScrollView>
                      {pestTypeOptions.map(pest => (
                          <TouchableOpacity key={pest.key} style={styles.modalItem} onPress={() => handleSelectPestType(pest)}>
                              <Text style={styles.modalItemText}>{pest.label}</Text>
                          </TouchableOpacity>
                      ))}
                  </ScrollView>
                   <TouchableOpacity style={styles.closeButton} onPress={() => setPestModalVisible(false)}>
                      <Text style={styles.closeButtonText}>Kapat</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginTop: 16
  },
  emptySubText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center'
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
  recordCard: {
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
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  pestInfo: {
    flex: 1,
  },
  pestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pestType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  methodText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  typeBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    flex: 1,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  selectorCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  resultTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10
  },
  subTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#444',
      marginTop: 8,
      marginBottom: 4,
  },
  listItem: {
      fontSize: 15,
      marginLeft: 10,
      lineHeight: 22,
  },
  recommendationItem: {
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
      marginTop: 20,
      backgroundColor: '#f44336',
      padding: 12,
      borderRadius: 8,
  },
  closeButtonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 