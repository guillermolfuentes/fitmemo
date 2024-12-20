import { ScrollView, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { useContext, useEffect, useState } from "react";
import { useUIContext } from "@/context/UIContext";
import { AuthContext } from "@/context/AuthContext";
import TrainingDiaryService from "@/services/trainingDiaryService";
import { UserRoutineResponse } from "@/types/training/services/UserRoutineResponse";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import TrainingSessionCard from "@/components/training/RoutineSessionCard";

export default function TrainingScreen() {
  const [userRoutine, setUserRoutine] = useState<UserRoutineResponse>({
    name: "",
    weeklyFrequency: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    sessions: [],
  });

  const { getCurrentSession } = useContext(AuthContext);
  const { isLoading, setLoading } = useUIContext();
  const router = useRouter();

  useEffect(() => {
    const fetchUserRoutine = async () => {
      setLoading(true);

      try {
        const session = await getCurrentSession();
        const userRoutine: UserRoutineResponse =
          await TrainingDiaryService.getUserRoutine(session.token!);
        setUserRoutine(userRoutine);
        setLoading(true);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRoutine();
  }, []);

  const handleStartSession = (sessionId: number) => {
    router.push("", { sessionId });
  };

  const handleEditSession = (sessionId: number) => {};

  const handleNewSession = () => {
    //navigation.navigate('EditSession', { sessionId: id });
    console.log("Creando nueva sesión...");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.routineTitle}>My routine</Text>
      {userRoutine.sessions.length === 0 ? (
        <Text>No hay sesiones disponibles.</Text>
      ) : (
        userRoutine.sessions.map((session) => (
          <TrainingSessionCard
            key={session.sessionId}
            id={session.sessionId}
            name={session.name}
            onStartSession={handleStartSession}
            onEditSession={handleEditSession}
          />
        ))
      )}
      <Button
        style={styles.addSessionButton}
        mode="contained"
        icon="plus"
        onPress={handleNewSession}
      >
        Add new session
      </Button>
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
