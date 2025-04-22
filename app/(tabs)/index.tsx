// app/(tabs)/index.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db }           from '../../src/firebase';

export default function TabOneScreen() {
  const [data, setData]       = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataRef = ref(db, 'energy_data/');
    const unsubscribe = onValue(
      dataRef,
      snapshot => {
        const val = snapshot.val();
        console.log('Firebase snapshot at energy_data:', val);
        const list = val
          ? Object.entries(val)
            .map(([key, item]) => ({
               key,
              ...(typeof item === 'object' && item !== null ? item : {})
            }))
          : [];

        setData(list);
        setLoading(false);
      },
      error => {
        console.error('Firebase error:', error);
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
        <Text>Check your Firebase path and rules.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Energy Readings</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.device}>{item.deviceName}</Text>
            <Text>Power: {item.power} W</Text>
            <Text>Voltage: {item.voltage} V</Text>
            <Text>Current: {item.current} A</Text>
            <Text>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title:     { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  card:      {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  device:    { fontSize: 18, fontWeight: '600' }
});

