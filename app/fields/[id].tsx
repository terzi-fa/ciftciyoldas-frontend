import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';

interface Field {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  area: number;
  description?: string;
  soilType?: string;
  cropType?: string;
  createdAt: string;
  weather?: any;
}

interface SoilAnalysis {
  id: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  salinity: number;
  organicMatter: number;
  analysisDate: string;
  notes?: string;
}

interface FieldAnalytics {
  soilTrends: {
    ph: Array<{ date: string; value: number }>;
    nitrogen: Array<{ date: string; value: number }>;
    phosphorus: Array<{ date: string; value: number }>;
    potassium: Array<{ date: string; value: number }>;
  };
  cropTrends: {
    height: Array<{ date: string; value: number }>;
    healthScore: Array<{ date: string; value: number }>;
    diseaseIncidence: Array<{ date: string; value: number }>;
  };
  fertilizerUsage: {
    dates: string[];
    amounts: number[];
    types: string[];
  };
  recommendations: string[];
}

const { width } = Dimensions.get('window');

export default function FieldDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [field, setField] = useState<Field | null>(null);
  const [soilAnalyses, setSoilAnalyses] = useState<SoilAnalysis[]>([]);
  const [analytics, setAnalytics] = useState<FieldAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sensors'>('overview');

  const fetchFieldData = async () => {
    try {
      const fieldResponse = await api.get<Field>(`${API_ENDPOINTS.FIELDS}/${id}`);
      if (fieldResponse.data) setField(fieldResponse.data);
    } catch (error) {
      Alert.alert('Hata', 'Tarla bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFieldData();
    }
  }, [id]);

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Tarla Bilgileri */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tarla Bilgileri</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Feather name="map-pin" size={20} color={Colors.light.tint} />
            <Text style={styles.infoLabel}>Konum</Text>
            <Text style={styles.infoValue}>
              {field?.latitude.toFixed(4)}, {field?.longitude.toFixed(4)}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Feather name="square" size={20} color={Colors.light.tint} />
            <Text style={styles.infoLabel}>Alan</Text>
            <Text style={styles.infoValue}>{field?.area} dönüm</Text>
          </View>
          
          {field?.cropType && (
            <View style={styles.infoItem}>
              <Feather name="shield" size={20} color={Colors.light.tint} />
              <Text style={styles.infoLabel}>Ekin</Text>
              <Text style={styles.infoValue}>{field.cropType}</Text>
            </View>
          )}
          
          {field?.soilType && (
            <View style={styles.infoItem}>
              <Feather name="layers" size={20} color={Colors.light.tint} />
              <Text style={styles.infoLabel}>Toprak Tipi</Text>
              <Text style={styles.infoValue}>{field.soilType}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Hava Durumu */}
      {field?.weather && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hava Durumu</Text>
          <View style={styles.weatherContainer}>
            <View style={styles.weatherItem}>
              <Feather name="thermometer" size={24} color={Colors.light.tint} />
              <Text style={styles.weatherValue}>{field.weather.temperature}°C</Text>
              <Text style={styles.weatherLabel}>Sıcaklık</Text>
            </View>
            <View style={styles.weatherItem}>
              <Feather name="droplet" size={24} color={Colors.light.tint} />
              <Text style={styles.weatherValue}>{field.weather.humidity}%</Text>
              <Text style={styles.weatherLabel}>Nem</Text>
            </View>
            <View style={styles.weatherItem}>
              <Feather name="wind" size={24} color={Colors.light.tint} />
              <Text style={styles.weatherValue}>{field.weather.windSpeed} km/h</Text>
              <Text style={styles.weatherLabel}>Rüzgar</Text>
            </View>
          </View>
        </View>
      )}

      {/* Harita Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Harita</Text>
        <View style={styles.mapPlaceholder}>
          <Feather name="map" size={48} color={Colors.light.icon} />
          <Text style={styles.mapPlaceholderText}>Harita yükleniyor...</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Koordinat: {field?.latitude.toFixed(4)}, {field?.longitude.toFixed(4)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSoilTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.emptyContainer}>
        <Feather name="layers" size={64} color={Colors.light.icon} />
        <Text style={styles.emptyTitle}>Toprak analizi bulunamadı</Text>
        <Text style={styles.emptyText}>
          Bu tarla için henüz toprak analizi yapılmamış
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Tarla bilgileri yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!field) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Tarla bulunamadı</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Feather name="arrow-left" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{field.name}</Text>
        <TouchableOpacity onPress={() => {}}>
          <Feather name="edit" size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'overview' && styles.activeTabButton]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'overview' && styles.activeTabButtonText]}>
            Genel Bakış
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'sensors' && styles.activeTabButton]}
          onPress={() => router.push(`/sensorscreen?fieldId=${id}&fieldName=${encodeURIComponent(field.name)}`)}
        >
          <Text style={[styles.tabButtonText, activeTab === 'sensors' && styles.activeTabButtonText]}>
            Sensörlerim
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView>
        {activeTab === 'overview' && renderOverviewTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: Colors.light.tint,
  },
  tabButtonText: {
    fontSize: 14,
    color: Colors.light.icon,
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    width: (width - 80) / 2,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weatherItem: {
    alignItems: 'center',
  },
  weatherValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 8,
  },
  weatherLabel: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 4,
  },
  mapPlaceholder: {
    backgroundColor: 'white',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 12,
    fontWeight: '500',
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: Colors.light.icon,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.icon,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 