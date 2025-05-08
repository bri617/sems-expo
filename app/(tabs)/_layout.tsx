// app/_layout.tsx
import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function TabLayout(): JSX.Element {
  const router = useRouter();

  return (
    <Tabs>
      {/* Home tab with bell in header */}
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/NotificationsScreen')}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Finance tab */}
      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finance',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" color={color} size={size} />
          ),
          tabBarActiveTintColor: '#2ecc71',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: '#f5f5f5' },
        }}
      />

      {/* Insights (bar/line charts) tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" color={color} size={size} />
          ),
          tabBarActiveTintColor: '#F44336',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: '#f5f5f5' },
        }}
      />

      {/* Settings tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: '#f5f5f5' },
        }}
      />
    </Tabs>
  );
}
