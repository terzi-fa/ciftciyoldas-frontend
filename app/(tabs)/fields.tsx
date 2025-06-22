import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { API_ENDPOINTS, API_URL } from '../config/api';
import api from '../services/api';

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

export default function FieldsScreen() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchFields = async () => {
    console.log('=== FETCH FIELDS BAŞLADI ===');
    try {
      console.log('API URL:', API_URL);
      console.log('API Endpoint:', API_ENDPOINTS.FIELDS);
      console.log('Full URL:', `${API_URL}${API_ENDPOINTS.FIELDS}`);
      
      const response = await api.get(API_ENDPOINTS.FIELDS);
      console.log('Tarlalar API cevabı:', response);
      
      if (response.data) {
        console.log('Tarlalar başarıyla yüklendi:', response.data);
        setFields(response.data);
      } else {
        console.error('API Hatası:', response.error);
        Alert.alert('Hata', response.error || 'Tarlalar yüklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Hata', 'Tarlalar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      console.log('=== FETCH FIELDS BİTTİ ===');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFields();
    setRefreshing(false);
  };

  useEffect(() => {
    console.log('FieldsScreen yüklendi!');
    fetchFields();
  }, []);

  const renderFieldCard = ({ item }: { item: Field }) => (
    <TouchableOpacity
      style={styles.fieldCard}
      onPress={() => router.push(`/fields/${item.id}`)}
    >
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldName}>{item.name}</Text>
        <Feather name="chevron-right" size={20} color={Colors.light.icon} />
      </View>
      
      <View style={styles.fieldInfo}>
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={16} color={Colors.light.icon} />
          <Text style={styles.infoText}>
            {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Feather name="square" size={16} color={Colors.light.icon} />
          <Text style={styles.infoText}>{item.area} dönüm</Text>
        </View>
        
        {item.cropType && (
          <View style={styles.infoRow}>
            <Feather name="leaf" size={16} color={Colors.light.icon} />
            <Text style={styles.infoText}>{item.cropType}</Text>
          </View>
        )}
        
        {item.weather && (
          <View style={styles.infoRow}>
            <Feather name="cloud" size={16} color={Colors.light.icon} />
            <Text style={styles.infoText}>
              {item.weather.temperature}°C, {item.weather.humidity}%
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Tarlalar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tarlalarım</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/fields/create')}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {fields.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="map" size={64} color={Colors.light.icon} />
          <Text style={styles.emptyTitle}>Henüz tarla eklenmemiş</Text>
          <Text style={styles.emptyText}>
            İlk tarlanızı eklemek için + butonuna tıklayın
          </Text>
        </View>
      ) : (
        <FlatList
          data={fields}
          renderItem={renderFieldCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: 'center',
    lineHeight: 24,
  },
  listContainer: {
    padding: 16,
  },
  fieldCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  fieldInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
}); 