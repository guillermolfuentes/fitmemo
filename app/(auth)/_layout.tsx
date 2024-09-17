import { Redirect, Stack } from "expo-router";

// Add the missing import statement for 'useSession' from '../../context/AuthContext'.
import { AuthContext } from "../../context/AuthContext";

import { Text } from "@/components/Themed";
import { useContext } from "react";

export default function AppLayout() {
  const { currentSession } = useContext(AuthContext);

  if (!currentSession.isAuthenticated) {
    console.log("Redirecting to login");
    return <Redirect href="/login" />;
  }

  return (
    console.log("RENDERIZANDO LAYOUT DE APP"),
    (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    )
  );
}
