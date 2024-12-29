import { Redirect, Stack } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

import { Text } from "@/components/Themed";
import { useContext, useEffect, useState } from "react";
import { Session } from "@/types/auth/contexts/Session";

export default function AppLayout() {
  const { getCurrentSession } = useContext(AuthContext);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getCurrentSession();
        setCurrentSession(session);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [getCurrentSession]);

  console.log("Renderizando AppLayout");

  if (!loading && !currentSession?.isAuthenticated) {
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
