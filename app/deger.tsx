import { Feather } from '@expo/vector-icons';
import FeatherIcon from '@expo/vector-icons/Feather';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_URL, API_ENDPOINTS } from './config/api';
import { apiGet, apiPost } from './services/api';

interface SensorValue {
  id: number;
  sensorId: number;
  value: number;
  unit: string;
  timestamp: string;
  type: string;
  ph_value?: number;
  nitrogen_ratio?: number;
  phosphorus_ratio?: number;
  potassium_ratio?: number;
  humidity_ratio?: number;
  soil_temperature?: number;
  electrical_conductivity?: number;
  magnesium_ratio?: number;
  iron_ratio?: number;
  calcium_ratio?: number;
  boron_ratio?: number;
  zinc_ratio?: number;
  sulfur_ratio?: number;
}

export default function GridStatsWithIcons() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const sensorId = params.sensorId as string;
  if (!sensorId) {
    console.error('Geçersiz sensorId:', sensorId);
    return;
  }
  const [sensorValues, setSensorValues] = useState<SensorValue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSensorValues();
  }, []);

  const fetchSensorValues = async () => {
    try {
      // Önce sensörü bağla (bağlı değilse)
      await apiPost(`/sensors/connect/${sensorId}`, {});
      // Sonra random değerleri güncelle
      await apiPost(`/sensors/${sensorId}/update`, {});
      // Sonra güncel veriyi çek
      const result = await apiGet<SensorValue>(`${API_ENDPOINTS.SENSORS}/${sensorId}`);
      if (result.error) {
        throw new Error(result.error);
      }
      setSensorValues([result.data!]);
    } catch (err) {
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 40, left: 16, zIndex: 10 }}
        onPress={() => router.replace('/(tabs)/sensorscreen')}
      >
        <Feather name="arrow-left" size={28} color="#222" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Analiz </Text>
        <ScrollView contentContainerStyle={styles.stats}>

          {/* Row 1: pH ve Azot */}
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>pH{ '\n' }Değeri:</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.ph_value ?? '-'}</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Azot (N){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.nitrogen_ratio ?? '-'}</Text>
              </View>
            </View>
          </View>

          {/* Row 2: Fosfor ve Potasyum */}
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Fosfor (P){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.phosphorus_ratio ?? '-'}</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Potasyum (K){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.potassium_ratio ?? '-'}</Text>
              </View>
            </View>
          </View>

          {/* Row 3: Nem ve Toprak Sıcaklığı */}
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Nem{ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.humidity_ratio ?? '-'}</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="sun" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Toprak{ '\n' }Sıcaklığı</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.soil_temperature ? `${sensorValues[0].soil_temperature}°C` : '-'}</Text>
              </View>
            </View>
          </View>

          {/* Row 4: Elektriksel İletkenlik ve Magnezyum (Mg) */}
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="zap" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Elektriksel{ '\n' }İletkenlik (EC)</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.electrical_conductivity ?? '-'}</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Magnezyum (Mg){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.magnesium_ratio ?? '-'}</Text>
              </View>
            </View>
          </View>

          {/* Row 5: Demir (Fe) ve Kalsiyum (Ca) */}
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Demir (Fe){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.iron_ratio ?? '-'}</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Kalsiyum (Ca){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.calcium_ratio ?? '-'}</Text>
              </View>
            </View>
          </View>

          {/* Row 6: Bor (B) ve Çinko (Zn) */}
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Bor (B){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.boron_ratio ?? '-'}</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Çinko (Zn){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.zinc_ratio ?? '-'}</Text>
              </View>
            </View>
          </View>

          {/* Row 7: Kükürt (S) */}
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Kükürt (S){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>{sensorValues[0]?.sulfur_ratio ?? '-'}</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </View>

      
        
        

       

      {/* Alt sağ köşede FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          const values = sensorValues[0];
          router.push({
            pathname: '/ekinsearch',
            params: {
              ph_value: values?.ph_value ?? '',
              nitrogen: values?.nitrogen_ratio ?? '',
              phosphorus: values?.phosphorus_ratio ?? '',
              potassium: values?.potassium_ratio ?? '',
              magnesium: values?.magnesium_ratio ?? '',
              zinc: values?.zinc_ratio ?? '',
              boron: values?.boron_ratio ?? '',
              sulfur: values?.sulfur_ratio ?? '',
              calcium: values?.calcium_ratio ?? '',
              iron: values?.iron_ratio ?? '',
              humidity: values?.humidity_ratio ?? '',
              soil_temperature: values?.soil_temperature ?? '',
              electrical_conductivity: values?.electrical_conductivity ?? '',
            }
          });
        }}
      >
        <Text style={styles.fabText}>Ekin Türüm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 12,
  },
  /** Stats */
  stats: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  statsItem: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginHorizontal: 6,
    marginBottom: 12,
    width: 140, // Kare için genişlik ve yükseklik eşit
    height: 140, // Kare için yükseklik
  },
  statsItemIcon: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
    marginRight: 8,
    borderRadius: 8,
  },
  statsItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8e8e93',
    marginBottom: 2,
  },
  statsItemValue: {
    fontSize: 22,
    fontWeight: '600',
    color: '#081730',
  },
  // FAB (Floating Action Button)
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  
 
});
