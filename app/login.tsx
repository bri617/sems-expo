// app/login.tsx

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  LogBox,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth }                      from '../src/firebase';
import { Link, useRouter }           from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');   
  const router = useRouter();

  useEffect(() => {
    LogBox.ignoreAllLogs(true); // optional, to suppress other warnings
    console.log('🌐 Testing network…');
    fetch('https://www.google.com')
      .then(res => console.log('🌐 Google.com status:', res.status))
      .catch(err => console.error('🌐 Google fetch error:', err));
  }, []);

  const handleLogin = async () => {
    console.log('🔑 Attempting login:', email);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Signed in:', userCred.user.uid);
      router.replace('/'); 
    } catch (e: any) {
      console.error('❌ signInWithEmailAndPassword ERROR:', e.code, e.message);
      Alert.alert('Login failed', `${e.code}\n${e.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📲 Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Log In" onPress={handleLogin} />
      <Link href="/signup" style={styles.link}>
        Don’t have an account? Sign Up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: 20, justifyContent: 'center' },
  title:     { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input:     { borderWidth:1, borderColor:'#ccc', borderRadius:6, padding:12, marginBottom:12 },
  link:      { marginTop: 16, textAlign:'center', color:'#0066cc' }
});
