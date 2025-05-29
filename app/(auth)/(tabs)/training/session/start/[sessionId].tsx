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
import { useNavigation, useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import RoutineSessionExerciseCard from "@/components/training/RoutineSessionExerciseCard";
import RoutineSessionService from "@/services/routineSessionService";
import TrainingDiaryService from "@/services/trainingDiaryService";
import {
  RoutineSessionExercise,
  RoutineSessionResponse,
} from "@/types/training/services/RoutineSessionResponse";
import { TrainingDiaryEntryRequest } from "@/types/training/services/TrainingDiaryEntryRequest";
import { FormikProps } from "formik";
import { ExerciseLastResultsResponse } from "@/types/diary/services/ExerciseLastResultsResponse";
import { useTranslation } from "react-i18next";

export interface RoutineSessionExerciseFormFields {
  sets: RoutineSessionExerciseSetFormFields[];
}

export interface RoutineSessionExerciseSetFormFields {
  setNumber: number;
  repetitionsCompleted: number;
  weightUsed: number;
}

export default function TrainingSessionScreen() {
  const { getCurrentSession } = useContext(AuthContext);
  const { setLoading, showErrorSnackbar, showSuccessSnackbar } = useUIContext();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [routineSession, setRoutineSession] =
    useState<RoutineSessionResponse | null>(null);
  const routineSessionExerciseFormRefs = useRef<
    FormikProps<RoutineSessionExerciseFormFields>[]
  >([]);
  const router = useRouter();
  const { t } = useTranslation();
  const [
    routineSessionsExercisesLastResults,
    setRoutineSessionsExercisesLastResults,
  ] = useState<ExerciseLastResultsResponse[]>([]);

  const handleSaveSession = async () => {
    let allValid = true;
    for (const form of routineSessionExerciseFormRefs.current) {
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
      let entry: TrainingDiaryEntryRequest = {
        exercises: [],
      };
      routineSessionExerciseFormRefs.current.forEach((form, index) => {
        if (form) {
          entry.exercises.push({
            exerciseId: routineSession!.sessionExercises[index].exerciseId,
            sets: form.values.sets.map((set: any) => ({
              setNumber: Number(set.setNumber),
              repetitionsCompleted: Number(set.repetitions),
              weightUsed: Number(set.weight),
            })),
          });
        }
      });

      console.log(`Datos para enviar:\n${JSON.stringify(entry, null, 2)}`);

      try {
        const session = await getCurrentSession();
        await TrainingDiaryService.createTrainingDiaryEntry(
          entry,
          session!.token!,
          session!.user!.id
        );
        showSuccessSnackbar(
          t("screens.training.start_session.success.session_saved")
        );

        router.back();
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error saving training session:", error.message);
        } else {
          console.error("Error saving training session:", error);
        }
        showErrorSnackbar(
          t("screens.training.start_session.errors.save_session")
        );
      }
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
          session!.token!,
          session!.user!.id
        );
        setRoutineSession(response);

        // Obtenemos los últimos resultados de cada ejercicio (si los hay)
        for (const exercise of response.sessionExercises) {
          const lastResults =
            await TrainingDiaryService.getLastSessionExerciseResults(
              exercise.exerciseId,
              session!.token!,
              session!.user!.id
            );

          if (lastResults.sets.length > 0) {
            setRoutineSessionsExercisesLastResults((prev) => [
              ...prev,
              lastResults,
            ]);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching routine session:", error.message);
        } else {
          console.error("Error fetching routine session:", error);
        }
        showErrorSnackbar(
          t("screens.training.start_session.errors.fetching_session")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserRoutine();
  }, [sessionId]);

  useEffect(() => {
    routineSession?.sessionExercises.forEach((exercise, index) => {
      if (routineSessionExerciseFormRefs.current[index]) {
        exercise.sets.forEach((set, setIndex) => {
          routineSessionExerciseFormRefs.current[index].setFieldValue(
            `sets[${setIndex}].setNumber`,
            String(set.setNumber)
          );
          routineSessionExerciseFormRefs.current[index].setFieldValue(
            `sets[${setIndex}].repetitions`,
            String(set.repetitions)
          );
        });
      }
    });
  }, [routineSession]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("screens.training.start_session.title"),
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
  }, [navigation, routineSession]);

  if (!routineSession) {
    return <Text>{t("common.loading")}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        {routineSession &&
          routineSession.sessionExercises.map(
            (exercise: RoutineSessionExercise, index: number) => (
              <RoutineSessionExerciseCard
                showWeightFields={true}
                key={exercise.id}
                id={exercise.id}
                name={`${exercise.exerciseName}`}
                canDeleteRows={false}
                formRef={(el) => {
                  if (el) {
                    routineSessionExerciseFormRefs.current[index] = el;
                  }
                }}
                lastResults={routineSessionsExercisesLastResults[index]?.sets}
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
