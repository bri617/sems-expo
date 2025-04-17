// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export default function HomeScreen() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataRef = ref(db, 'energy_data/');
    const unsubscribe = onValue(dataRef, snapshot => {
      const val = snapshot.val() || {};
      // convert { id1: {...}, id2: {...} } → [ {..., key: id1}, {...} ]
      const list = Object.entries(val).map(([key, item]) => ({ key, ...item }));
      setData(list);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
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
            <Text>Timestamp: {new Date(item.timestamp).toLocaleString()}</Text>
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
  card:      {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  device:    { fontSize: 18, fontWeight: '600' }
});
