import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, usePathname } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { API_URL } from './config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PlanOptions() {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log('Gelen parametreler:', params); // Debug için eklendi
  const cropTypeId = params.cropTypeId;
  const growthStageId = params.growthStageId;

  // Gelen parametreleri doğru isimlerle al
  const nutrients = {
    potassium_ratio: params.potassium_ratio,
    zinc_ratio: params.zinc_ratio,
    nitrogen_ratio: params.nitrogen_ratio,
    phosphorus_ratio: params.phosphorus_ratio,
    magnesium_ratio: params.magnesium_ratio,
    boron_ratio: params.boron_ratio,
    sulfur_ratio: params.sulfur_ratio,
    calcium_ratio: params.calcium_ratio,
    iron_ratio: params.iron_ratio,
  };

  // API'nin beklediği formata dönüştür
  const nutrientMap = {
    N: nutrients.nitrogen_ratio,
    P: nutrients.phosphorus_ratio,
    K: nutrients.potassium_ratio,
    Mg: nutrients.magnesium_ratio,
    B: nutrients.boron_ratio,
    Ca: nutrients.calcium_ratio,
    Zn: nutrients.zinc_ratio,
    S: nutrients.sulfur_ratio,
  };

  // Parametre kontrolü
  if (!cropTypeId || !growthStageId) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Eksik parametre: Ekin türü veya büyüme evresi seçilmedi.</Text>
      </SafeAreaView>
    );
  }

  // Besin değerlerinden en az biri tanımlı mı kontrolü (örnek)
  const hasNutrient = Object.values(nutrients).some(val => val !== undefined && val !== null && val !== '');
  if (!hasNutrient) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Toprak besin değerleri eksik veya hatalı.</Text>
      </SafeAreaView>
    );
  }

  interface Fertilizer {
    id: number;
    name: string;
    price?: number;
    description?: string;
  }
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!cropTypeId || !growthStageId || !nutrientMap) {
        setLoading(false);
        return;
      }

      try {
        console.log('Gübre önerisi için gönderilen parametreler:', {
          cropTypeId,
          growthStageId,
          nutrients: nutrientMap,
        });

        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_URL}/fertilizer-recommendations`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            cropTypeId: Number(cropTypeId),
            growthStageId: Number(growthStageId),
            nutrients: nutrientMap,
          }),
        });

        if (!response.ok) {
          throw new Error('Gübre önerileri alınamadı.');
        }

        const data = await response.json();
        console.log('Gübre API response:', data);

        // Hava durumu uyarısını göster
        if (data.weatherAdvice) {
          Alert.alert("Hava Durumu Uyarısı", data.weatherAdvice);
        }

        // Benzersiz gübreleri filtrele ve fertilizer_rules alanlarını da ekle
        const uniqueFertilizersMap = new Map();
        
        // Gelen verinin 'rules' dizisini kontrol et
        if (data && Array.isArray(data.rules)) {
          data.rules.forEach((item: any) => {
            if (item.fertilizer && !uniqueFertilizersMap.has(item.fertilizer.id)) {
              uniqueFertilizersMap.set(item.fertilizer.id, {
                ...item.fertilizer,
                application_method: item.application_method,
                recommended_amount: item.recommended_amount,
                frequency: item.frequency,
                nutrient_type: item.nutrient_type,
                operator: item.operator,
                value: item.value,
              });
            }
          });
        } else {
          console.log("API'den beklenen formatta (data.rules bir dizi değil) veri gelmedi.");
        }


        setItems(Array.from(uniqueFertilizersMap.values()));
      } catch (error) {
        console.error("Gübre önerileri alınırken hata oluştu:", error);
        Alert.alert('Hata', 'Gübre önerileri yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [cropTypeId, growthStageId, JSON.stringify(nutrientMap)]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Planını seç</Text>
        {items.map((item, index) => {
          const isActive = value === index;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                setValue(index);
                router.push({ pathname: '/testmanagement', params: { ...item } });
              }}>
              <View style={[styles.radio, isActive && styles.radioActive]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.radioLabel}>{item.name}</Text>
                  <Text style={styles.radioDescription}>{item.description}</Text>
                </View>
                <View style={[styles.radioInput, isActive && styles.radioInputActive]} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.bottomNavFixed}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/newsfeed')}>
          <Feather name="home" size={28} color={pathname === '/newsfeed' ? '#075eec' : 'gray'} />
          <Text style={{ fontSize: 12, color: pathname === '/newsfeed' ? '#075eec' : 'gray' }}>Ana Sayfa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/fields')}>
          <Feather name="map" size={28} color={pathname === '/fields' ? '#075eec' : 'gray'} />
          <Text style={{ fontSize: 12, color: pathname === '/fields' ? '#075eec' : 'gray' }}>Tarlalarım</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/chat')}>
          <Feather name="message-circle" size={28} color={pathname === '/chat' ? '#075eec' : 'gray'} />
          <Text style={{ fontSize: 12, color: pathname === '/chat' ? '#075eec' : 'gray' }}>Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#228B22',
    marginBottom: 24,
    marginTop: 16,
    textAlign: 'left',
  },
  cardWrapper: {
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 18,
    padding: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#228B22',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#228B22',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  cardAction: {
    marginLeft: 12,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#228B22',
    marginBottom: 24,
    marginTop: 16,
    textAlign: 'left',
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 16,
    minHeight: 80,
    backgroundColor: '#fff',
  },
  radioActive: {
    borderColor: '#228B22',
  },
  radioLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#228B22',
    marginBottom: 8,
  },
  radioPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#228B22',
  },
  radioDescription: {
    fontSize: 16,
    color: '#444',
  },
  radioInput: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginLeft: 12,
  },
  radioInputActive: {
    backgroundColor: '#228B22',
  },
  bottomNavFixed: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});