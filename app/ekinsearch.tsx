import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { API_URL, API_ENDPOINTS } from './config/api';

interface CropType {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  scientificName: string;
  growingPeriod: number;
  waterRequirement: string;
  soilType: string;
  temperatureRange: string;
}

export default function EkinSearchScreen() {
  const [input, setInput] = useState('');
  const [cropTypes, setCropTypes] = useState<CropType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCropTypes();
  }, []);

  const fetchCropTypes = async () => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.CROP_TYPES}`);
      if (!response.ok) {
        throw new Error('Ekin türleri yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setCropTypes(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    const rows = [];
    const query = input.toLowerCase();

    for (const item of cropTypes) {
      const nameIndex = item.name.toLowerCase().search(query);
      if (nameIndex !== -1) {
        rows.push({
          ...item,
          index: nameIndex,
        });
      }
    }
    return rows.sort((a, b) => a.index - b.index);
  }, [input, cropTypes]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 40, left: 16, zIndex: 10 }}
        onPress={() => router.replace('/deger')}
      >
        <Feather name="arrow-left" size={28} color="#222" />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.searchWrapper}>
          <View style={styles.search}>
            <View style={styles.searchIcon}>
              <Text>90:</Text>
              <Feather color="#848484" name="search" size={17} />
              <Text>132:</Text>
              <Feather color="#9ca3af" name="chevron-right" size={22} />
            </View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={setInput}
              placeholder="Ekin türü ara..."
              placeholderTextColor="#848484"
              returnKeyType="done"
              style={styles.searchControl}
              value={input}
            />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.searchContent}>
          {filteredRows.length ? (
            filteredRows.map(({ id, name, description }, index) => (
              <View key={index} style={styles.cardWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/buyume?cropTypeId=${id}`);
                  }}
                >
                  <View style={styles.card}>
                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>{name}</Text>
                      <Text style={styles.cardPhone}>{description}</Text>
                    </View>
                    <View style={styles.cardAction}>
                      <Feather color="#9ca3af" name="chevron-right" size={22} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.searchEmpty}>Sonuç bulunamadı</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** Search */
  search: {
    position: 'relative',
    backgroundColor: '#efefef',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  searchWrapper: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#efefef',
  },
  searchIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  searchControl: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    paddingLeft: 34,
    width: '100%',
    fontSize: 16,
    fontWeight: '500',
  },
  searchContent: {
    paddingLeft: 24,
  },
  searchEmpty: {
    textAlign: 'center',
    paddingTop: 16,
    fontWeight: '500',
    fontSize: 15,
    color: '#9ca1ac',
  },
  /** Card */
  cardWrapper: {
    borderBottomWidth: 1,
    borderColor: '#d6d6d6',
  },
  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardBody: {
    marginRight: 'auto',
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#616d79',
    marginTop: 3,
  },
  cardAction: {
    paddingRight: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});