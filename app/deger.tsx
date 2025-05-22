import { Feather } from '@expo/vector-icons';
import FeatherIcon from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
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

interface SensorValue {
  id: number;
  sensorId: number;
  value: number;
  unit: string;
  timestamp: string;
  type: string;
}

export default function GridStatsWithIcons() {
  const router = useRouter();
  const [sensorValues, setSensorValues] = useState<SensorValue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSensorValues();
  }, []);

  const fetchSensorValues = async () => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.SENSORS}/values`);
      if (!response.ok) {
        throw new Error('Sensör değerleri yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setSensorValues(data);
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
                <Text style={styles.statsItemValue}>832</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Azot (N){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>8</Text>
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
                <Text style={styles.statsItemValue}>22</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Potasyum (K){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>48</Text>
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
                <Text style={styles.statsItemValue}>83</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="sun" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Toprak{ '\n' }Sıcaklığı</Text>
                <Text style={styles.statsItemValue}>25°C</Text>
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
                <Text style={styles.statsItemValue}>3.5</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Magnezyum (Mg){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>5</Text>
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
                <Text style={styles.statsItemValue}>3</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Kalsiyum (Ca){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>7</Text>
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
                <Text style={styles.statsItemValue}>2</Text>
              </View>
            </View>
            <View style={styles.statsItem}>
              <View style={styles.statsItemIcon}>
                <FeatherIcon color="#fff" name="activity" size={25} />
              </View>
              <View>
                <Text style={styles.statsItemLabel}>Çinko (Zn){ '\n' }Oranı</Text>
                <Text style={styles.statsItemValue}>1</Text>
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
                <Text style={styles.statsItemValue}>4</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </View>

      
        
        

       

      {/* Alt sağ köşede FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/ekinsearch')}
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
