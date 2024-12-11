import { ScrollView, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import TrainingSessionCard from "@/components/TrainingSessionCard";

export default function TrainingScreen() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    /*const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/sessions`
        );
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();*/

    //todo traer sesiones de backend
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>pantalla entrenamiento</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
