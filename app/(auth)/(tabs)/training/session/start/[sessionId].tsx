import { ScrollView, StyleSheet } from "react-native";

import { Text } from "@/components/Themed";
import { useContext, useEffect, useState } from "react";
import { useUIContext } from "@/context/UIContext";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

export default function TrainingSessionScreen() {
  const { getCurrentSession } = useContext(AuthContext);
  const { isLoading, setLoading } = useUIContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  
  useEffect(() => {
    const fetchUserRoutine = async () => {
      setLoading(true);

      try {
      } catch (error) {
        console.error("Error fetching training session", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRoutine();
  }, [sessionId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.routineTitle}>
        Registrando la sesión de entrenamiento con ID: {sessionId}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  routineTitle: {
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  addSessionButton: {},
});
