// app/signup.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebase';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/'); // send into the app after sign up
    } catch (e: any) {
      Alert.alert('Sign Up failed', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🆕 Sign Up</Text>
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
      <Button title="Create Account" onPress={handleSignUp} />
      <Link href="/login" style={styles.link}>
        Already have an account? Log In
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
