import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Switch,
  TextInput,
  Button,
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
  // chart state
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  // relay & automation
  const [relayOn, setRelayOn] = useState(false);
  const [automationOn, setAutomationOn] = useState(false);

  // power limit input
  const [powerLimit, setPowerLimit] = useState('');

  useEffect(() => {
    const lineRef       = ref(rtdb, 'energy_data/');
    const barRef        = ref(rtdb, 'wattage_data/');
    const relayRef      = ref(rtdb, 'relay/command/state');
    const automationRef = ref(rtdb, 'relay/command/automation');

    const unsubLine = onValue(lineRef, snap => {
      const val = snap.val() || {};
      setLineData(
        Object.entries(val).map(([_k, item], i) => ({
          value: item.power || 0,
          label: `${i + 1}`,
        }))
      );
      setLoading(false);
    });
    const unsubBar = onValue(barRef, snap => {
      const val = snap.val() || {};
      setBarData(
        Object.entries(val).map(([_k, item], i) => ({
          value: Number(item.totalpower) || 0,
          label: `${i + 1}`,
        }))
      );
    });
    const unsubRelay = onValue(relayRef, snap => {
      setRelayOn(!!snap.val());
    });
    const unsubAuto = onValue(automationRef, snap => {
      setAutomationOn(!!snap.val());
    });

    return () => {
      unsubLine();
      unsubBar();
      unsubRelay();
      unsubAuto();
    };
  }, []);

  // toggle relay
  const toggleRelay = async (val) => {
    await set(ref(rtdb, 'relay/command/state'), val);
    setRelayOn(val);
  };

  // toggle automation & always reset powerLimit
  const toggleAutomation = async (val) => {
    await set(ref(rtdb, 'relay/command/automation'), val);
    setAutomationOn(val);
    // on on → set huge limit; on off → delete it
    const limitRef = ref(rtdb, 'relay/command/powerLimit');
    if (val) {
      await set(limitRef, 999999);
    } else {
      await set(limitRef, null);
    }
  };

  // manual power limit override
  const handleSetPowerLimit = () => {
    const trimmed = powerLimit.trim();
    const limitRef = ref(rtdb, 'relay/command/powerLimit');
    if (trimmed === '') {
      set(limitRef, null);
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) set(limitRef, num);
    }
    setPowerLimit('');
  };

  // prepare chart data...
  const reversedLineData = [...lineData].reverse().map((pt, idx) => ({
    value: pt.value, label: `${idx + 1}`,
  }));
  const maxLine = Math.max(...lineData.map(d => d.value), 0);
  const roundedMaxLine = Math.ceil((maxLine + 25) / 50) * 50 || 1800;
  const maxBar = Math.max(...barData.map(d => d.value), 0);
  const roundedMaxBar = Math.ceil((maxBar + 25) / 50) * 50 || 1800;

  if (loading) {
    return <View style={[styles.container, styles.center]}><ActivityIndicator size="large"/></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Energy Usage</Text>
      <LineChart
        data={reversedLineData}
        width={width - 32} height={200} spacing={20}
        hideDataPoints={false} lineGradient lineGradientId="ggrd"
        maxValue={roundedMaxLine} stepValue={Math.ceil(roundedMaxLine/5)}
        noOfSections={5} yAxisLabelWidth={40}
        yAxisThickness={1} yAxisTextStyle={{fontSize:10,color:'#333'}}
        lineGradientComponent={() => (
          <Defs>
            <LinearGradient id="ggrd" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="red"/>
              <Stop offset="0.5" stopColor="orange"/>
              <Stop offset="1" stopColor="green"/>
            </LinearGradient>
          </Defs>
        )}
      />

      <Text style={[styles.title, {marginTop:24}]}>Total Wattage History</Text>
      {barData.length===0 ? (
        <Text style={{color:'red'}}>⚠️ No wattage data found.</Text>
      ) : (
        <BarChart
          data={barData.slice(0,10).map(i=>({value:i.value,label:i.label}))}
          barWidth={40} showValuesAsTopLabel
          topLabelTextStyle={{fontSize:10,color:'#333'}}
          barBorderRadius={4} frontColor="#177AD5"
          noOfSections={5} maxValue={roundedMaxBar}
          stepValue={Math.ceil(roundedMaxBar/5)}
          yAxisThickness={1} xAxisThickness={1}
          yAxisLabelWidth={40}
          yAxisTextStyle={{fontSize:10,color:'#333'}}
          xAxisLabelTextStyle={{fontSize:10}} spacing={20}
        />
      )}

      {/* Relay */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Relay:</Text>
        <Switch
          style={styles.bigSwitch}
          value={relayOn}
          onValueChange={toggleRelay}
          trackColor={{true:'#2ecc71',false:'#ccc'}}
          thumbColor="#fff"
        />
      </View>

      {/* Automation */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Automation:</Text>
        <Switch
          style={styles.bigSwitch}
          value={automationOn}
          onValueChange={toggleAutomation}
          trackColor={{true:'#177AD5',false:'#ccc'}}
          thumbColor="#fff"
        />
      </View>

      {/* Power Limit */}
      {automationOn && (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Power Limit:</Text>
          <TextInput
            style={styles.input}
            value={powerLimit}
            onChangeText={setPowerLimit}
            keyboardType="number-pad"
            placeholder="Enter limit (W)"
          />
          <Button title="Set" onPress={handleSetPowerLimit} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      {flex:1,padding:16,backgroundColor:'#fff'},
  center:         {justifyContent:'center',alignItems:'center'},
  title:          {fontSize:18,marginBottom:12,fontWeight:'600'},
  switchContainer:{flexDirection:'row',alignItems:'center',marginTop:24},
  switchLabel:    {fontSize:18,marginRight:15},
  bigSwitch:      {transform:[{scaleX:1.5},{scaleY:1.5}]},
  inputContainer: {marginTop:24},
  inputLabel:     {fontSize:16,marginBottom:8},
  input:          {
    borderWidth:1,borderColor:'#ccc',borderRadius:4,
    padding:8,marginBottom:8,fontSize:16
  },
});
