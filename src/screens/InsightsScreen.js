// src/screens/InsightsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InsightsScreen() {
  return (
    <View style={styles.center}>
      <Text>Insights (charts, trends, recommendations…)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
