import { Feather } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { API_URL, API_ENDPOINTS } from './config/api';

interface GrowthStage {
  id: number;
  name: string;
  description: string;
  duration: number;
  requirements: string;
  order: number;
}

export default function BuyumeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cropTypeId = params.cropTypeId;
  const [value, setValue] = React.useState(0);
  const [stages, setStages] = useState<GrowthStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthStages();
  }, [cropTypeId]);

  const fetchGrowthStages = async () => {
    try {
      const response = await fetch(`${API_URL}/growth-stages/by-crop-type/${cropTypeId}`);
      if (!response.ok) {
        throw new Error('Büyüme aşamaları yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setStages(data);
    } catch (err) {
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (index: number) => {
    setValue(index);
    router.push('/hazirlaniyo' as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 40, left: 16, zIndex: 10 }}
        onPress={() => router.replace('/ekinsearch')}
      >
        <Feather name="arrow-left" size={28} color="#222" />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bitkinin Büyüme Evresini Seç</Text>
        </View>
        {stages.map((stage, index) => {
          const isActive = value === index;
          return (
            <View
              key={stage.id}
              style={[
                styles.radioWrapper,
                index === 0 && { borderTopWidth: 0 },
              ]}>
              <TouchableOpacity
                onPress={() => handlePress(index)}>
                <View style={styles.radio}>
                  <View
                    style={[
                      styles.radioCheck,
                      isActive && styles.radioCheckActive,
                    ]}>
                    <FontAwesome
                      color="#fff"
                      name="check"
                      style={!isActive && { display: 'none' }}
                      size={11} />
                  </View>

                  <View style={styles.radioBody}>
                    <View style={styles.radioHeader}>
                      <Text style={styles.radioLabel}>{stage.name}</Text>
                    </View>
                    <Text style={styles.radioDescription}>{stage.description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  /** Header */
  header: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  /** Radio */
  radio: {
    position: 'relative',
    paddingTop: 12,
    paddingRight: 16,
    paddingBottom: 14,
    paddingLeft: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  radioWrapper: {
    marginLeft: 24,
    borderTopWidth: 1,
    borderColor: '#e8e8e8',
  },
  radioCheck: {
    marginTop: 4,
    marginRight: 16,
    marginBottom: 0,
    marginLeft: 0,
    width: 20,
    height: 20,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  radioCheckActive: {
    backgroundColor: '#007bff',
  },
  radioBody: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'column',
  },
  radioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  radioLabel: {
    fontSize: 17,
    color: '#000',
  },
  radioDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#959595',
  },
});