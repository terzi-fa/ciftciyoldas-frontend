import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';

// Basit bir DTO arayüzü
interface CropRotationYearDto {
  year: number;
  season: string;
  crop_type_id: number;
  crop_name: string;
  crop_family: string;
  nitrogen_fixation: boolean;
  pest_repellent: boolean;
  soil_improvement: boolean;
}

export default function CreateCropRotationPlan() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [planName, setPlanName] = useState('');
  const [duration, setDuration] = useState('3');
  const [sequence, setSequence] = useState<CropRotationYearDto[]>([]);

  const addYearToSequence = () => {
    const newYear: CropRotationYearDto = {
      year: sequence.length + 1,
      season: 'spring',
      crop_type_id: 1,
      crop_name: '',
      crop_family: '',
      nitrogen_fixation: false,
      pest_repellent: false,
      soil_improvement: false,
    };
    setSequence([...sequence, newYear]);
  };

  const handleSequenceChange = (index: number, field: keyof CropRotationYearDto, value: string | boolean) => {
    const newSequence = [...sequence];
    const yearData = { ...newSequence[index] };
    
    if(typeof value === 'boolean') {
        (yearData[field] as boolean) = value;
    } else {
        (yearData[field] as string) = value;
    }

    newSequence[index] = yearData;
    setSequence(newSequence);
  };
  

  const handleSubmit = async () => {
    if (!planName || sequence.some(s => !s.crop_name)) {
      Alert.alert('Hata', 'Lütfen Plan Adını ve tüm yıllar için Ekin Adını girin.');
      return;
    }
    setLoading(true);

    const payload = {
      name: planName,
      duration_years: parseInt(duration, 10),
      rotation_type: 'organic', // Varsayılan
      rotation_sequence: sequence.map(s => ({
          ...s,
          year: Number(s.year),
          crop_type_id: Number(s.crop_type_id)
      })),
      field_id: 1, // Sabit
    };

    const response = await api.post(API_ENDPOINTS.CROP_ROTATION, payload);
    setLoading(false);

    if (response.data) {
      Alert.alert('Başarılı', 'Yeni ekin rotasyon planı oluşturuldu.');
      router.back();
    } else {
      Alert.alert('Hata', `Plan oluşturulurken bir hata oluştu: ${response.error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Rotasyon Planı</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Plan Adı *</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Azot Depolama Planı"
          value={planName}
          onChangeText={setPlanName}
        />

        <Text style={styles.label}>Rotasyon Süresi (Yıl) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: 3"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />

        <View style={styles.sequenceHeader}>
            <Text style={styles.sectionTitle}>Rotasyon Sırası</Text>
            <TouchableOpacity onPress={addYearToSequence} style={styles.addButton}>
                <Feather name="plus" size={18} color="white" />
                <Text style={styles.addButtonText}>Yıl Ekle</Text>
            </TouchableOpacity>
        </View>

        {sequence.map((year, index) => (
          <View key={index} style={styles.yearCard}>
            <Text style={styles.yearTitle}>{year.year}. Yıl</Text>
            <TextInput
              style={styles.input}
              placeholder="Ekin Adı (Örn: Buğday)"
              value={year.crop_name}
              onChangeText={(val) => handleSequenceChange(index, 'crop_name', val)}
            />
             <TextInput
              style={styles.input}
              placeholder="Ekin Ailesi (Örn: Tahıl)"
              value={year.crop_family}
              onChangeText={(val) => handleSequenceChange(index, 'crop_family', val)}
            />
            <View style={styles.switchContainer}>
                <Text>Azot Bağlar mı?</Text>
                <Switch value={year.nitrogen_fixation} onValueChange={(val) => handleSequenceChange(index, 'nitrogen_fixation', val)} />
            </View>
             <View style={styles.switchContainer}>
                <Text>Zararlı Kovar mı?</Text>
                <Switch value={year.pest_repellent} onValueChange={(val) => handleSequenceChange(index, 'pest_repellent', val)} />
            </View>
             <View style={styles.switchContainer}>
                <Text>Toprağı İyileştirir mi?</Text>
                <Switch value={year.soil_improvement} onValueChange={(val) => handleSequenceChange(index, 'soil_improvement', val)} />
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Planı Oluştur'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    formContainer: { padding: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#444', marginBottom: 8, },
    input: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', fontSize: 16, marginBottom: 16, },
    button: { backgroundColor: '#2196F3', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20, },
    buttonDisabled: { backgroundColor: '#90CAF9',},
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold',},
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333',},
    sequenceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16},
    addButton: { flexDirection: 'row', backgroundColor: '#4CAF50', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, alignItems: 'center' },
    addButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 4},
    yearCard: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#eee'},
    yearTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8}
  }); 