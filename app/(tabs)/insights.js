import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import {
  LineChart,
  BarChart,
} from 'react-native-gifted-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { ref, onValue, set } from 'firebase/database';
import { rtdb } from '../../src/firebase';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  // state for the relay switch
  const [relayOn, setRelayOn] = useState(false);

  useEffect(() => {
    const lineRef = ref(rtdb, 'energy_data/');
    const barRef = ref(rtdb, 'wattage_data/');
    const relayStateRef = ref(rtdb, 'relay/command/state');

    const unsubLine = onValue(lineRef, snap => {
      const val = snap.val() || {};
      const pts = Object.entries(val).map(([_k, item], i) => ({
        value: item.power || 0,
        label: `${i + 1}`,
      }));
      setLineData(pts);
      setLoading(false);
    });

    const unsubBar = onValue(barRef, snap => {
      const val = snap.val() || {};
      const pts = Object.entries(val).map(([_k, item], i) => ({
        value: Number(item.totalpower) || 0,
        label: `${i + 1}`,
      }));
      setBarData(pts);
    });

    const unsubRelay = onValue(relayStateRef, snap => {
      setRelayOn(!!snap.val());
    });

    return () => {
      unsubLine();
      unsubBar();
      unsubRelay();
    };
  }, []);

  // toggle and write to Firebase
  const toggleRelay = (value) => {
    set(ref(rtdb, 'relay/command/state'), value)
      .then(() => setRelayOn(value))
      .catch(console.error);
  };

  // prepare reversed line data
  const reversedLineData = [...lineData]
    .reverse()
    .map((pt, idx) => ({
      value: pt.value,
      label: `${idx + 1}`,
    }));

  // chart max values
  const maxLineValue = Math.max(...lineData.map(d => d.value), 0);
  const roundedMaxLine = Math.ceil((maxLineValue + 25) / 50) * 50 || 1800;

  const maxBarValue = Math.max(...barData.map(d => d.value), 0);
  const roundedMaxBar = Math.ceil((maxBarValue + 25) / 50) * 50 || 1800;

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Energy Usage</Text>
      <LineChart
        data={reversedLineData}
        width={width - 32}
        height={200}
        spacing={20}
        hideDataPoints={false}
        lineGradient
        lineGradientId="ggrd"
        maxValue={roundedMaxLine}
        stepValue={Math.ceil(roundedMaxLine / 5)}
        noOfSections={5}
        yAxisLabelWidth={40}
        yAxisThickness={1}
        yAxisTextStyle={{ fontSize: 10, color: '#333' }}
        lineGradientComponent={() => (
          <Defs>
            <LinearGradient id="ggrd" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="red" />
              <Stop offset="0.5" stopColor="orange" />
              <Stop offset="1" stopColor="green" />
            </LinearGradient>
          </Defs>
        )}
      />

      <Text style={[styles.title, { marginTop: 24 }]}>Total Wattage History</Text>
      {barData.length === 0 ? (
        <Text style={{ color: 'red' }}>⚠️ No wattage data found.</Text>
      ) : (
        <BarChart
          data={barData.slice(0, 10).map(item => ({
            value: item.value,
            label: item.label,
          }))}
          barWidth={40}
          showValuesAsTopLabel
          topLabelTextStyle={{ fontSize: 10, color: '#333' }}
          barBorderRadius={4}
          frontColor="#177AD5"
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

      {/* Relay control switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Relay:</Text>
        <Switch
          value={relayOn}
          onValueChange={toggleRelay}
          trackColor={{ true: '#2ecc71', false: '#ccc' }}
          thumbColor="#fff"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, marginBottom: 12, fontWeight: '600' },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 12,
  },
});
