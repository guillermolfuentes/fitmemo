import { Redirect, Stack } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

import { useContext } from "react";

export default function AppLayout() {
  const { currentSession, loadingStoredSession } = useContext(AuthContext);

  if (loadingStoredSession) {
    console.log("Cargando la session almacenada...");
    return null;
  }

  console.log("Comprobando la session...", currentSession);
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
