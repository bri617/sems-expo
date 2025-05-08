import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../../src/firebase';

const { width } = Dimensions.get('window');
const ELECTRICITY_RATE = 0.12; // $ per kWh

export default function FinanceScreen() {
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const barRef = ref(rtdb, 'wattage_data/');
    const unsub = onValue(barRef, snapshot => {
      const val = snapshot.val() || {};
      const pts = Object.entries(val).map(([_, item], i) => ({
        value: Number(item.totalpower) || 0,
        label: `${i + 1}`,
      }));
      setBarData(pts);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const maxBarValue = Math.max(...barData.map(d => d.value), 0);
  const roundedMaxBar = Math.ceil((maxBarValue + 25) / 50) * 50 || 100;

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // prepare data with cost labels
  const costData = barData.slice(0, 10).map(item => {
    const kWh = item.value / 1000;
    const cost = kWh * ELECTRICITY_RATE;
    return {
      value: item.value,
      label: item.label,
      topLabelComponent: () => (
        <Text style={styles.topLabel}>${cost.toFixed(2)}</Text>
      ),
    };
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Electricity Cost History</Text>
      {costData.length === 0 ? (
        <Text style={styles.noData}>⚠️ No data found.</Text>
      ) : (
        <BarChart
          data={costData}
          barWidth={40}
          barBorderRadius={4}
          frontColor="#228B22"
          noOfSections={5}
          maxValue={roundedMaxBar}
          stepValue={Math.ceil(roundedMaxBar / 5)}
          yAxisThickness={1}
          xAxisThickness={1}
          yAxisLabelWidth={40}
          yAxisTextStyle={{ fontSize: 10, color: '#333' }}
          xAxisLabelTextStyle={{ fontSize: 10 }}
          spacing={20}
        />
      )}

      <Text style={[styles.title, { marginTop: 24 }]}>Electricity Cost Readings</Text>
      {barData.length === 0 ? (
        <Text style={styles.noData}>⚠️ No data found.</Text>
      ) : (
        <View style={styles.listContainer}>
          {barData.slice(0, 10).map(item => {
            const kWh = item.value / 1000;
            const cost = kWh * ELECTRICITY_RATE;
            return (
              <View key={item.label} style={styles.card}>
                <Text style={styles.device}>Entry {item.label}</Text>
                <Text style={styles.data}>
                  Total Power: {item.value} W
                </Text>
                <Text style={styles.data}>
                  Cost: ${cost.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center:    { justifyContent: 'center', alignItems: 'center' },
  title:     { fontSize: 18, marginBottom: 12, fontWeight: '600' },
  noData:    { color: 'red' },
  topLabel:  { fontSize: 10, color: '#333', marginBottom: 4 },
  listContainer: { paddingTop: 8 },
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
  device: { fontSize: 16, fontWeight: '600' },
  data:   { fontSize: 14, color: '#333', marginTop: 4 },
});
