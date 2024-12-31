import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/Themed";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useUIContext } from "@/context/UIContext";
import { AuthContext } from "@/context/AuthContext";
import { useNavigation } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import RoutineSessionExerciseCard from "@/components/training/RoutineSessionExerciseCard";
import RoutineSessionService from "@/services/routineSessionService";
import {
  RoutineSessionExercise,
  RoutineSessionResponse,
} from "@/types/training/services/RoutineSessionResponse";
import { TrainingDiaryEntryRequest } from "@/types/training/services/TrainingDiaryEntryRequest";
import { FormikProps } from "formik";

export default function TrainingSessionScreen() {
  const { getCurrentSession } = useContext(AuthContext);
  const { setLoading, showErrorSnackbar } = useUIContext();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [routineSession, setRoutineSession] =
    useState<RoutineSessionResponse | null>(null);
  const [trainingDiaryEntry, setTrainingDiaryEntry] =
    useState<TrainingDiaryEntryRequest | null>(null);
  const formRefs = useRef<FormikProps<any>[]>([]);

  const handleSaveSession = async () => {
    let allValid = true;
    for (const form of formRefs.current) {
      if (form) {
        form.setTouched(
          {
            sets: form.values.sets.map(() => ({
              repetitions: true,
              weight: true,
            })),
          },
          true
        );

        const errors = await form.validateForm();

        if (Object.keys(errors).length > 0) {
          allValid = false;
        }
      }
    }

    if (allValid) {
      console.log("All forms are valid. Values:");
      formRefs.current.forEach((form, index) => {
        if (form) {
          console.log(`Form ${index + 1} values:`, form.values);
        } else {
          console.log(`Form ${index + 1} is not initialized.`);
        }
      });
    } else {
      console.log("Some forms are invalid.");
    }
  };

  useEffect(() => {
    const fetchUserRoutine = async () => {
      setLoading(true);

      try {
        setLoading(true);
        const session = await getCurrentSession();
        const response = await RoutineSessionService.getRoutineSession(
          Number(sessionId),
          session.token!
        );
        setRoutineSession(response);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching routine session:", error.message);
        } else {
          console.error("Error fetching routine session:", error);
        }
        showErrorSnackbar(
          "Error fetching routine session. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserRoutine();
  }, [sessionId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Registro de sesión",
      headerRight: () => (
        <Pressable
          onPressIn={handleSaveSession}
          style={({ pressed }) => ({
            marginRight: 15,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <FontAwesome
            name="check"
            size={25}
            color={Colors[colorScheme ?? "light"].text}
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  if (!routineSession) {
    return <Text>Cargando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        {routineSession &&
          routineSession.sessionExercises.map(
            (exercise: RoutineSessionExercise, index: number) => (
              <RoutineSessionExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={`${exercise.exerciseName}`}
                canDeleteRows={false}
                formRef={(el) => {
                  if (el) {
                    formRefs.current[index] = el;
                  }
                }}
              />
            )
          )}
      </View>
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
