import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { API_URL, API_ENDPOINTS } from '../config/api';
import { apiGet, apiPost } from '../services/api';

interface Sensor {
  id: number;
  name: string;
  type: string;
  value: number;
  unit: string;
  last_updated: string;
  user: {
    id: number;
    full_name: string;
  };
  sensor_id: string;
}

export default function SensorScreen() {
  const router = useRouter();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [sensorId, setSensorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSensors();
  }, []);

  const fetchSensors = async () => {
    const { data, error } = await apiGet('/sensors/my-sensors');
    if (error) {
      setError(error);
      console.log('API Hatası:', error);
      setLoading(false);
      return;
    }
    setSensors(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const addSensor = async () => {
    if (sensorId.trim() === '') return;

    const { data, error } = await apiPost(API_ENDPOINTS.SENSORS, {
      sensor_id: sensorId.trim(),
    });
    if (error) {
      setError(error);
      console.log('API Hatası:', error);
      return;
    }
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      setSensors(prev => [...prev, data as Sensor]);
    }
    setSensorId('');
    setShowInput(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5D4037" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Hadi sensörünü ekle,toprağının durumuna bakalım!</Text>

        {/* Sensör Ekle Butonu */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowInput(true)}>
          <Text style={styles.addButtonText}>Sensör Ekle</Text>
        </TouchableOpacity>

        {/* Sensör ID girişi için input kutucuğu */}
        {showInput && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Sensör ID giriniz"
              value={sensorId}
              onChangeText={setSensorId}
            />
            <TouchableOpacity style={styles.saveButton} onPress={addSensor}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Eklenen sensör ID'lerini liste olarak göster */}
        <ScrollView style={{ flex: 1 }}>
          {sensors.map((sensor) => (
            <TouchableOpacity
              key={sensor.id}
              onPress={() => router.push(`/deger?sensorId=${sensor.sensor_id}`)}>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Sensör ID: {sensor.sensor_id}</Text>
                <Text style={styles.cardType}>Tür: {sensor.type}</Text>
                <Text style={styles.cardValue}>
                  Değer: {sensor.value} {sensor.unit}
                </Text>
                <Text style={styles.cardTime}>
                  Son Güncelleme: {new Date(sensor.last_updated).toLocaleString('tr-TR')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5D4037',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#5D4037',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#5D4037',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#5D4037',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#5D4037',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 4,
  },
  cardType: {
    fontSize: 14,
    color: '#5D4037',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: '#5D4037',
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 12,
    color: '#5D4037',
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
