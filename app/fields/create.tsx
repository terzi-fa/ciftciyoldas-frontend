import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { useRouter } from 'expo-router';

export default function CreateFieldScreen() {
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [soilType, setSoilType] = useState('');
  const [cropType, setCropType] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGetLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Konum izni verilmedi.');
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
    } catch (error) {
      Alert.alert('Hata', 'Konum alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !area || !latitude || !longitude) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.FIELDS, {
        name,
        area: parseFloat(area),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        soilType,
        cropType,
      });
      if (response.data) {
        Alert.alert('Başarılı', 'Tarla başarıyla eklendi!');
        router.replace('/(tabs)/fields');
      } else if (response.error) {
        Alert.alert('Hata', response.error);
      }
    } catch (error) {
      Alert.alert('Hata', 'Tarla eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Tarla Adı *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Tarla adı" />

        <Text style={styles.label}>Alan (dönüm) *</Text>
        <TextInput style={styles.input} value={area} onChangeText={setArea} placeholder="Örn: 10" keyboardType="numeric" />

        <Text style={styles.label}>Enlem (Latitude) *</Text>
        <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} placeholder="Örn: 39.9334" keyboardType="numeric" />

        <Text style={styles.label}>Boylam (Longitude) *</Text>
        <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} placeholder="Örn: 32.8597" keyboardType="numeric" />

        <TouchableOpacity style={styles.locationButton} onPress={handleGetLocation} disabled={loading}>
          <Feather name="map-pin" size={20} color="white" />
          <Text style={styles.locationButtonText}>Konumunu Kullan</Text>
          {loading && <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 8 }} />}
        </TouchableOpacity>

        <Text style={styles.label}>Toprak Tipi</Text>
        <TextInput style={styles.input} value={soilType} onChangeText={setSoilType} placeholder="Örn: Killi Toprak" />

        <Text style={styles.label}>Ekin Tipi</Text>
        <TextInput style={styles.input} value={cropType} onChangeText={setCropType} placeholder="Örn: Buğday" />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  form: {
    marginTop: 24,
  },
  label: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 4,
    justifyContent: 'center',
  },
  locationButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 