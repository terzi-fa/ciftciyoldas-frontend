import FeatherIcon from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function hazirlaniyo() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.alert}>
          <View style={styles.alertIcon}>
            <FeatherIcon color="#fff" name="check-circle" size={42} />
          </View>

          <Text style={styles.alertTitle}>BAŞARDIN</Text>

          <Text style={styles.alertMessage}>
            Tebrikler!{'\n'}Toprağın adına önemli bir adım attın!
          </Text>

          <TouchableOpacity onPress={() => router.push('/plan')}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Devam et</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Alert */
  alert: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  alertIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#006400',
  },
  alertTitle: {
    marginBottom: 16,
    fontSize: 32,
    fontWeight: '700',
    color: '#006400',
    textAlign: 'center',
  },
  alertMessage: {
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    color: '#9a9a9a',
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
    backgroundColor: '#006400',
    borderColor: '#006400',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
});
