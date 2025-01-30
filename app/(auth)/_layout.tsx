import { Redirect, Stack } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

import { useContext } from "react";

export default function AppLayout() {
  const { getCurrentSession, currentSession } = useContext(AuthContext);

  console.log("Comprobando la session...");
  if (!currentSession || !currentSession.isAuthenticated) {
    console.log("Redirecting to login");
    return <Redirect href="/login" />;
  }

  return (
    console.log("Renderizando layout principal de la app..."),
    (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    )
  );
}
