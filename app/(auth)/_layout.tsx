import { Redirect, Stack } from 'expo-router';

// Add the missing import statement for 'useSession' from '../../context/AuthContext'.
import { AuthContext } from '../../context/AuthContext';

import { Text } from '@/components/Themed';
import { useContext } from 'react';

export default function AppLayout() {
  const { currentSession } = useContext(AuthContext);
  // You can keep the splash screen open, or render a loading screen like we do here.
  /*if (isLoading) {
    return <Text>Loading...</Text>;
  }*/

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!currentSession.isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}
