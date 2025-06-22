import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#075eec',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="newsfeed"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="fields"
        options={{
          title: 'Tarlalar',
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}