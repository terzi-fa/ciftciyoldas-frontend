import { Feather } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const items = [
  {
    label: 'Hayvan Gübresi',
    price: 0,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'Kompost',
    price: 250,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'Solucan Gübresi',
    price: 999,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
];

export default function PlanOptions() {
  const [value, setValue] = React.useState(0);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Planını seç</Text>
        {items.map(({ label, price, description }, index) => {
          const isActive = value === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setValue(index);
                router.push('/testmanagement' as any);
              }}>
               <View style={[styles.radio, isActive && styles.radioActive]}>
    <Text style={styles.radioLabel}>{label}</Text>
    <Text style={styles.radioPrice}>${price}/month</Text>
    <Text style={styles.radioDescription}>{description}</Text>
    <View
      style={[
        styles.radioInput,
        isActive && styles.radioInputActive,
      ]}
    />
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
        <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/sensorscreen')}>
          <Feather name="search" size={28} color={pathname === '/sensorscreen' ? '#075eec' : 'gray'} />
          <Text style={{ fontSize: 12, color: pathname === '/sensorscreen' ? '#075eec' : 'gray' }}>Sensör</Text>
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
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#006400',
    marginBottom: 12,
  },
  /** Radio */
  radio: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
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
  radioActive: {
    borderColor: '#006400',
  },
  radioLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#006400',
    marginBottom: 4,
  },
  radioPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#006400',
    marginBottom: 12,
  },
  radioDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: '#006400',
  },
  radioInput: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#006400',
  },
  radioInputActive: {
    borderWidth: 7,
    borderColor: '#006400',
  },
  bottomNavFixed: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  navButton: {
    padding: 10,
  },
  navIcon: {
    width: 24,
    height: 24,
  },
});