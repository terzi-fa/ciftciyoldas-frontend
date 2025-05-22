import FeatherIcon from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { API_URL, API_ENDPOINTS } from '../config/api';

export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();       

  // Form validasyonu
  const validate = () => {
    let valid = true;
    let newErrors: { [key: string]: string } = {};

    if (!form.name) {
      newErrors.name = 'İsim zorunlu!';
      valid = false;
    }

    if (!form.email) {
      newErrors.email = 'E-posta zorunlu!';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Geçerli bir e-posta girin!';
      valid = false;
    }

    if (!form.password) {
      newErrors.password = 'Şifre zorunlu!';
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı!';
      valid = false;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı zorunlu!';
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor!';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Kayıt işlemi
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    console.log('Kayıt formu:', form);
    console.log('full_name backend\'e böyle gidiyor:', form.name);

    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kayıt başarısız!');
      }

      Alert.alert('Başarılı', 'Kayıt başarılı! Giriş yapabilirsiniz.');
      router.replace('/auth/signin');
    } catch (err) {
      Alert.alert('Hata', err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace('/auth/signin')}
            style={styles.headerBack}>
            <FeatherIcon
              color="#1D2A32"
              name="chevron-left"
              size={30} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Hadi Başlayalım!</Text>
        <Text style={styles.subtitle}>
          Lütfen boş alanları doldurunuz.
        </Text>

        <KeyboardAwareScrollView style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Ad Soyad</Text>
            <TextInput
              clearButtonMode="while-editing"
              onChangeText={name => setForm({ ...form, name })}
              placeholder="John Doe"
              style={styles.inputControl}
              value={form.name}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email Adres</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={email => setForm({ ...form, email })}
              placeholder="john@example.com"
              style={styles.inputControl}
              value={form.email}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Şifre</Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={password => setForm({ ...form, password })}
              placeholder="********"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Şifreyi Doğrula</Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={confirmPassword =>
                setForm({ ...form, confirmPassword })
              }
              placeholder="********"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.confirmPassword}
            />
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.btn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Kaydol</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>

      <TouchableOpacity
        onPress={() => {
          router.replace('/auth/signin');
        }}>
        <Text style={styles.formFooter}>
          Zaten bir hesabım var?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Giriş Yap</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFC107',
  },
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerBack: {
    padding: 8,
    paddingTop: 0,
    position: 'relative',
    marginLeft: -16,
  },
  /** Form */
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: 24,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 2,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#4CAF50',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
});