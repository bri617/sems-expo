// app/NotificationsScreen._layout.tsx
import { Stack } from 'expo-router';

export default function NotificationsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,  // Show header for this screen
      }}
    />
  );
}
