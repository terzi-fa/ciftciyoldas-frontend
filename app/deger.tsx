import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { API_ENDPOINTS } from './config/api';
import { apiGet, apiPost } from './services/api';

// Sensor verisi arayüzü
interface SensorValue {
  ph_value?: number;
  nitrogen_ratio?: number;
  phosphorus_ratio?: number;
  potassium_ratio?: number;
  humidity_ratio?: number;
  soil_temperature?: number;
  electrical_conductivity?: number;
  calcium_ratio?: number;
  magnesium_ratio?: number;
  boron_ratio?: number;
  zinc_ratio?: number;
  iron_ratio?: number;
  sulfur_ratio?: number;
  [key: string]: number | string | undefined;
}

// Toprak analizi geçmişi arayüzü
interface SoilAnalysis {
  id: number;
  value: number;
  type: string;
  timestamp: string;
}

const screenWidth = Dimensions.get('window').width;

export default function DegerScreen() {
  const router = useRouter();
  const { sensorId, fieldId } = useLocalSearchParams<{ sensorId: string; fieldId: string }>();

  const [activeTab, setActiveTab] = useState<'sensor' | 'analysis'>('sensor');
  const [sensorValues, setSensorValues] = useState<SensorValue | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<SoilAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sensorId) {
      fetchSensorValues();
    }
    if (activeTab === 'analysis' && fieldId) {
      fetchAnalysisHistory();
    }
  }, [sensorId, activeTab, fieldId]);

  const fetchSensorValues = async () => {
    setLoading(true);
    try {
      await apiPost(`/sensors/connect/${sensorId}`, {});
      await apiPost(`/sensors/${sensorId}/update`, {});
      const result = await apiGet<SensorValue>(`${API_ENDPOINTS.SENSORS}/${sensorId}`);
      if (result.data) {
        setSensorValues(result.data);
      }
    } catch (err) {
      console.error('Sensör verisi hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysisHistory = async () => {
    if (!sensorId) return;
    try {
      const result = await apiGet<SoilAnalysis[]>(`/sensors/${sensorId}/history`);
      if (result.data) {
        setAnalysisHistory(result.data);
      }
    } catch (err) {
      console.error('Analiz geçmişi hatası:', err);
    }
  };

  const handleEkinSearchPress = () => {
    if (!sensorValues) {
      return;
    }
    const params = Object.fromEntries(
      Object.entries(sensorValues).map(([key, value]) => [key, String(value ?? '')])
    );
    router.push({
      pathname: '/ekinsearch',
      params,
    });
  };

  const renderSensorTab = () => {
    if (loading) return <ActivityIndicator size="large" color="#075eec" />;
    if (!sensorValues) return <Text>Sensör verisi bulunamadı.</Text>;

    const sensorMetrics = [
      { key: 'nitrogen_ratio', label: 'Azot (N) Oranı', icon: 'wind' },
      { key: 'phosphorus_ratio', label: 'Fosfor (P) Oranı', icon: 'droplet' },
      { key: 'potassium_ratio', label: 'Potasyum (K) Oranı', icon: 'zap' },
      { key: 'humidity_ratio', label: 'Nem Oranı', icon: 'umbrella' },
      { key: 'soil_temperature', label: 'Toprak Sıcaklığı', icon: 'sun' },
      { key: 'ph_value', label: 'pH Değeri', icon: 'thermometer' },
      { key: 'electrical_conductivity', label: 'İletkenlik (EC)', icon: 'activity' },
      { key: 'calcium_ratio', label: 'Kalsiyum (Ca)', icon: 'grid' },
      { key: 'magnesium_ratio', label: 'Magnezyum (Mg)', icon: 'grid' },
      { key: 'boron_ratio', label: 'Bor (B)', icon: 'grid' },
      { key: 'zinc_ratio', label: 'Çinko (Zn)', icon: 'grid' },
      { key: 'iron_ratio', label: 'Demir (Fe)', icon: 'shield' },
      { key: 'sulfur_ratio', label: 'Kükürt (S)', icon: 'shield' },
    ];

    return (
      <ScrollView>
        <View style={styles.statsGrid}>
          {sensorMetrics.map(({ key, label, icon }) => (
            <View key={key} style={styles.statsItem}>
              <Feather name={icon as any} size={24} color="#075eec" />
              <Text style={styles.statsItemLabel}>{label}</Text>
              <Text style={styles.statsItemValue}>{sensorValues[key] ?? '-'}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderAnalysisTab = () => {
    if (analysisHistory.length === 0) return <Text>Analiz geçmişi bulunamadı.</Text>;

    const chartConfig = {
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      color: (opacity = 1) => `rgba(7, 94, 236, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.5,
    };
    
    const chartData = (dataType: string) => {
      const filteredData = analysisHistory.filter(a => a.type === dataType);
      return {
        labels: filteredData.map(a => new Date(a.timestamp).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })),
        datasets: [{ data: filteredData.map(a => a.value) }],
      };
    };

    return (
      <ScrollView>
        <Text style={styles.chartTitle}>pH Değeri Değişimi</Text>
        <LineChart data={chartData('ph_value')} width={screenWidth - 32} height={220} chartConfig={chartConfig} bezier />
        
        <Text style={styles.chartTitle}>Nem Oranı Değişimi</Text>
        <LineChart data={chartData('humidity_ratio')} width={screenWidth - 32} height={220} chartConfig={chartConfig} bezier />

        <Text style={styles.chartTitle}>Azot (N) Değişimi</Text>
        <LineChart data={chartData('nitrogen_ratio')} width={screenWidth - 32} height={220} chartConfig={chartConfig} bezier />
        
        <Text style={styles.chartTitle}>Fosfor (P) Değişimi</Text>
        <LineChart data={chartData('phosphorus_ratio')} width={screenWidth - 32} height={220} chartConfig={chartConfig} bezier />

        <Text style={styles.chartTitle}>Kalsiyum (Ca) Değişimi</Text>
        <LineChart data={chartData('calcium_ratio')} width={screenWidth - 32} height={220} chartConfig={chartConfig} bezier />

        <Text style={styles.chartTitle}>Magnezyum (Mg) Değişimi</Text>
        <LineChart data={chartData('magnesium_ratio')} width={screenWidth - 32} height={220} chartConfig={chartConfig} bezier />

        <Text style={styles.chartTitle}>Çinko (Zn) Değişimi</Text>
        <LineChart data={chartData('zinc_ratio')} width={screenWidth - 32} height={220} chartConfig={chartConfig} bezier />
        
        <Text style={styles.chartTitle}>Bor (B) Değişimi</Text>
        <LineChart data={chartData('boron_ratio')} width={screenWidth - 32} height={220} chartConfig={chartConfig} bezier />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Sensör Detayları</Text>
            <View style={{ width: 24 }} />
        </View>

        <View style={styles.tabContainer}>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'sensor' && styles.activeTab]}
                onPress={() => setActiveTab('sensor')}>
                <Text style={[styles.tabText, activeTab === 'sensor' && styles.activeTabText]}>Sensör Değerleri</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'analysis' && styles.activeTab]}
                onPress={() => setActiveTab('analysis')}>
                <Text style={[styles.tabText, activeTab === 'analysis' && styles.activeTabText]}>Toprak Analizi</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.tab}
                onPress={handleEkinSearchPress}>
                <Text style={styles.tabText}>Ekin Türü Seç</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
            {activeTab === 'sensor' ? renderSensorTab() : renderAnalysisTab()}
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#075eec',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statsItemLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  statsItemValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  chartTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      marginTop: 24,
      marginBottom: 8,
      textAlign: 'center',
  }
});
