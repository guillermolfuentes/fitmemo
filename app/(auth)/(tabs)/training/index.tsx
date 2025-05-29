import { ScrollView, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import TrainingSessionCard from "@/components/training/RoutineSessionCard";
import { useUIContext } from "@/context/UIContext";
import { AuthContext } from "@/context/AuthContext";
import { UserRoutineResponse } from "@/types/training/services/UserRoutineResponse";
import { Button } from "react-native-paper";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import RoutineService from "@/services/routineService";
import { useTranslation } from "react-i18next";

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
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("screens.training.title"),
    });
  }, [navigation]);

  const fetchUserRoutine = async () => {
    setLoading(true);

    try {
      const session = await getCurrentSession();
      const userRoutine: UserRoutineResponse =
        await RoutineService.getUserRoutine(session!.token!, session!.user!.id);
      setUserRoutine(userRoutine);
      setLoading(true);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserRoutine();
    }, [])
  );

  const handleStartSession = (sessionId: number) => {
    console.log("Starting session with id:", sessionId);
    router.push(`/training/session/start/${sessionId}`);
  };

  const handleEditSession = (sessionId: number) => {
    router.push(`/training/session/edit/${sessionId}`);
  };

  const handleNewSession = () => {
    router.push(`/training/session/create`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.routineTitle}>
        {t("screens.training.routine.title")}
      </Text>
      {userRoutine.sessions.length === 0 ? (
        <Text>{t("screens.training.routine.no_sessions_available")}</Text>
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
        mode="outlined"
        icon="plus"
        onPress={handleNewSession}
      >
        {t("screens.training.routine.add_new_session")}
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
  addSessionButton: {
    marginTop: 15,
    marginBottom: 15,
  },
});
