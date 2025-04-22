// app/(tabs)/index.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { rtdb } from '../../src/firebase';            // make sure you export getDatabase as `rtdb`
import { ref, onValue } from 'firebase/database';

// 1) Define your item type:
type EnergyItem = {
  key: string;
  deviceName: string;
  power: number;
  voltage: number;
  current: number;
  timestamp: number;
};

export default function TabOneScreen() {
  // 2) Tell useState the generic type:
  const [data, setData] = useState<EnergyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const dataRef = ref(rtdb, 'energy_data/');
    const unsubscribe = onValue(
      dataRef,
      snapshot => {
        const val = snapshot.val() as Record<string, Omit<EnergyItem, 'key'>>;
        // 3) Build a typed list:
        const list: EnergyItem[] = Object.entries(val || {}).map(
          ([key, item]) => ({
            key,
            deviceName: item.deviceName,
            power:      item.power,
            voltage:    item.voltage,
            current:    item.current,
            timestamp:  item.timestamp,
          })
        );
        setData(list);
        setLoading(false);
      },
      error => {
        console.error('Firebase RTDB error:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No energy data found 😕</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Energy Readings</Text>
      {/* 4) Optionally, give FlatList the generic too: */}
      <FlatList<EnergyItem>
        data={data}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.device}>{item.deviceName}</Text>
            <Text>Power: {item.power} W</Text>
            <Text>Voltage: {item.voltage} V</Text>
            <Text>Current: {item.current} A</Text>
            <Text>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title:     { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius:  4,
    elevation:     3,
  },
  device: { fontSize: 18, fontWeight: '600' },
});
