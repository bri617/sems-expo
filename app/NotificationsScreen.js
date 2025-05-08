import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../src/firebase';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const relayRef = ref(rtdb, 'relay/command/state');
    const barRef = ref(rtdb, 'wattage_data/');

    const unsubRelay = onValue(relayRef, snap => {
      if (snap.val() === false) {
        setNotes(n => [{ id: 'relay-off', message: '🔴 Device is OFF' }, ...n]);
      }
    });

    const unsubBar = onValue(barRef, snap => {
      const val = snap.val() || {};
      Object.entries(val).forEach(([key, item]) => {
        if (item.totalpower > 100) {
          setNotes(n => [
            { id: `high-${key}`, message: `⚠️ High usage: ${item.totalpower} W` },
            ...n,
          ]);
        }
      });
      setLoading(false);
    });

    return () => {
      unsubRelay();
      unsubBar();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'NotificationsScreen',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.center}>No notifications</Text>}
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});
