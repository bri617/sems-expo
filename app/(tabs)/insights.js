// screens/InsightsScreen.js

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const lineData = [
  { value: 50 },
  { value: 80 },
  { value: 40 },
  { value: 95 },
  { value: 75 },
  { value: 100 },
  { value: 90 },
];

export default function InsightsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Energy Usage Over Time</Text>
      <LineChart
        data={lineData}
        width={width - 32}
        height={200}
        spacing={10}
        hideDataPoints
        lineGradient
        lineGradientId="ggrd"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
  },
});
