// app/_layout.tsx
import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../src/firebase';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      // If no user, send to /login; else to tabs index
      router.replace(u ? '/' : '/login');
    });
    return unsub;
  }, []);

  // while we don’t know yet, don’t render anything
  if (user === undefined) return null;

  return <Slot />;
}
