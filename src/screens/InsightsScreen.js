// src/screens/InsightsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export default function InsightsScreen() {
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const energyRef = ref(db, 'energy_data');
    const unsubscribe = onValue(energyRef, snapshot => {
      const raw = snapshot.val() || {};
      // assume each record has a `.power` field
      const pts = Object.values(raw)
        // sort by timestamp if you have one, e.g. .timestamp
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        .map(item => ({ value: Number(item.power) || 0 }));
      setDataPoints(pts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const maxVal = Math.max(...dataPoints.map(p => p.value), 0) * 1.1;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real‑time Energy (W/h)</Text>
      <View style={styles.chartBox}>
        <LineChart
          data={dataPoints}
          width={screenWidth - 40}
          height={200}
          spacing={10}
          hideDataPoints
          maxValue={maxVal}
          lineGradient
          lineGradientId="grad"
          lineGradientComponent={() => (
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="blue" />
                <Stop offset="0.5" stopColor="orange" />
                <Stop offset="1" stopColor="green" />
              </LinearGradient>
            </Defs>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  chartBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
