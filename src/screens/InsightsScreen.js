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
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../src/firebase';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'energyData'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        // plain JS: no type assertions
        const pts = snapshot.docs.map(doc => {
          const d = doc.data();
          return { value: d.random || 0 };
        });
        setData(pts);
        setLoading(false);
      },
      err => {
        console.warn('Firestore listen error:', err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>Real‑Time Energy Usage</Text>
  //     <LineChart
  //       data={data}
  //       width={width - 32}
  //       height={200}
  //       spacing={10}
  //       hideDataPoints
  //       lineGradient
  //       lineGradientId="ggrd"
  //       lineGradientComponent={() => (
  //         <Defs>
  //           <LinearGradient id="ggrd" x1="0" y1="0" x2="0" y2="1">
  //             <Stop offset="0" stopColor="red" />
  //             <Stop offset="0.5" stopColor="orange" />
  //             <Stop offset="1" stopColor="green" />
  //           </LinearGradient>
  //         </Defs>
  //       )}
  //     />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
  },
});
