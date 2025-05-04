// app/(tabs)/two.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text }     from 'react-native-elements';
import { signOut }          from 'firebase/auth';
import { auth }             from '../../src/firebase';
import { useRouter }        from 'expo-router';

export default function SettingsTab() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (e: any) {
      // You can also use RNE’s Dialog or Toast component here
      console.error('Logout failed', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        ⚙️ Settings
      </Text>

      {/* …other settings items… */}

      <Button
        title="Log Out"
        onPress={handleLogout}
        buttonStyle={styles.logoutButton}
        titleStyle={{ color: 'white' }}
        icon={{ name: 'exit-to-app', type: 'material', color: 'white' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    borderRadius: 8,
  },
});
