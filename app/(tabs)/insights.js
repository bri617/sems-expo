// app/(tabs)/insights.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LineChart }               from 'react-native-gifted-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { ref, onValue }            from 'firebase/database';
import { rtdb }                    from '../../src/firebase';

const { width } = Dimensions.get('window');

export default function InsightsTab() {
  // Chart data: array of { value: number }
  const [chartData, setChartData]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to the single point under /energy_data/
    const dataRef = ref(rtdb, 'energy_data/');
    const unsubscribe = onValue(
      dataRef,
      snapshot => {
        const val = snapshot.val() || {};
        // Map entries to [{ value: power }]
        const pts = Object.entries(val).map(([key, item]) => ({
          // item.power is the field you care about for the chart
          value: item.random || 0,
        }));
        setChartData(pts);
        setLoading(false);
      },
      error => {
        console.error('RTDB error:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If you only have one point, show the dot
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Energy Usage</Text>
      <LineChart
        data={chartData}             // e.g. [{ value: 15.19025 }]
        width={width - 32}
        height={200}
        spacing={20}
        hideDataPoints={false}       // show the dot even with one point
        lineGradient
        lineGradientId="ggrd"
        lineGradientComponent={() => (
          <Defs>
            <LinearGradient id="ggrd" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0"   stopColor="red"   />
              <Stop offset="0.5" stopColor="orange" />
              <Stop offset="1"   stopColor="green"  />
            </LinearGradient>
          </Defs>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center:    { justifyContent: 'center', alignItems: 'center' },
  title:     { fontSize: 18, marginBottom: 12, fontWeight: '600' },
});
