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
// Picker ve DateTimePicker gibi bileşenler için kurulum gerekebilir.
// Şimdilik basit TextInput ve Switch kullanalım.

export default function CreateOrganicPestControl() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    field_id: 1, // Şimdilik sabit, daha sonra dinamik hale getirilebilir
    pest_name: '',
    pest_type: 'insect', // Varsayılan değer
    control_method: 'biological', // Varsayılan değer
    description: '',
    effectiveness: '75',
    cost: '100',
    is_preventive: false,
    is_curative: false,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Veri doğrulama
    if (!formData.pest_name || !formData.description) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      effectiveness: parseInt(formData.effectiveness, 10),
      cost: parseInt(formData.cost, 10),
    };
    
    const response = await api.post(API_ENDPOINTS.ORGANIC_PEST_CONTROL, payload);

    setLoading(false);
    if (response.data) {
      Alert.alert('Başarılı', 'Yeni mücadele kaydı başarıyla oluşturuldu.');
      router.back();
    } else {
      Alert.alert('Hata', `Kayıt oluşturulurken bir hata oluştu: ${response.error}`);
    }
  };
  
  // TODO: Bu alanlar için daha kullanıcı dostu Picker bileşenleri eklenebilir.
  const pestTypeOptions = ['insect', 'disease', 'weed', 'nematode', 'rodent'];
  const controlMethodOptions = ['biological', 'cultural', 'physical', 'mechanical', 'companion_planting'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Mücadele Kaydı</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Zararlı Adı *</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Yaprak Biti"
          value={formData.pest_name}
          onChangeText={(val) => handleInputChange('pest_name', val)}
        />
        
        <Text style={styles.label}>Açıklama *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mücadele yöntemi hakkında detaylı bilgi"
          value={formData.description}
          onChangeText={(val) => handleInputChange('description', val)}
          multiline
        />

        <Text style={styles.label}>Etkinlik (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="0-100 arası bir değer"
          value={formData.effectiveness}
          onChangeText={(val) => handleInputChange('effectiveness', val)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Maliyet (₺)</Text>
        <TextInput
          style={styles.input}
          placeholder="Tahmini maliyet"
          value={formData.cost}
          onChangeText={(val) => handleInputChange('cost', val)}
          keyboardType="numeric"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Önleyici Tedbir mi?</Text>
          <Switch
            value={formData.is_preventive}
            onValueChange={(val) => handleInputChange('is_preventive', val)}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Tedavi Edici mi?</Text>
          <Switch
            value={formData.is_curative}
            onValueChange={(val) => handleInputChange('is_curative', val)}
          />
        </View>

        <Text style={styles.label}>Notlar</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ek notlar veya gözlemler"
          value={formData.notes}
          onChangeText={(val) => handleInputChange('notes', val)}
          multiline
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Kaydı Oluştur'}</Text>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 