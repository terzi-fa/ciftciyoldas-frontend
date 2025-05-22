import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { API_URL, API_ENDPOINTS } from './config/api';

interface OrganicFertilizer {
  id: number;
  name: string;
  description: string;
  applicationMethod: string;
  dosage: string;
  precautions: string;
  quality: string;
  notes: string;
}

export default function TestManagement() {
  const [value, setValue] = React.useState(0);
  const [fertilizer, setFertilizer] = useState<OrganicFertilizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchFertilizerInfo();
  }, []);

  const fetchFertilizerInfo = async () => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.ORGANIC_FERTILIZERS}`);
      if (!response.ok) {
        throw new Error('Gübre bilgileri yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setFertilizer(data[0]); // İlk gübreyi alıyoruz
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const items = fertilizer ? [
    {
      label: 'Tanım',
      description: fertilizer.description,
    },
    {
      label: 'Uygulama Metodu',
      description: fertilizer.applicationMethod,
    },
    {
      label: 'Dozaj',
      description: fertilizer.dosage,
    },
    {
      label: 'Dikkat Edilmesi Gerekenler',
      description: fertilizer.precautions,
    },
    {
      label: 'Malzeme Kalitesi/İçeriği',
      description: fertilizer.quality,
    },
    {
      label: 'Notlar',
      description: fertilizer.notes,
    },
  ] : [];

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0069fe" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1d1d1d" />
        </TouchableOpacity>
        <Text style={styles.title}>Hakkında</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {items.map(({ label, description }, index) => {
          const isActive = value === index;
          const isLongDescription = ['Uygulama Metodu', 'Dikkat Edilmesi Gerekenler', 'Notlar'].includes(label);
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setValue(index);
              }}>
              <View style={[
                styles.radio, 
                isActive && styles.radioActive,
                isLongDescription && styles.longDescription
              ]}>
                <View style={styles.radioTop}>
                  <Text style={styles.radioLabel}>{label}</Text>
                </View>

                <Text style={styles.radioDescription}>{description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 24,
    paddingTop: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** Radio */
  radio: {
    position: 'relative',
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 6,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  longDescription: {
    minHeight: 150,
  },
  radioActive: {
    borderColor: '#0069fe',
  },
  radioTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  radioDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#848a96',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

