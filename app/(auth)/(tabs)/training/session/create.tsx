import { Pressable, ScrollView, StyleSheet, View, Text } from "react-native";

import {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import { useUIContext } from "@/context/UIContext";
import { AuthContext } from "@/context/AuthContext";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { Button, TextInput } from "react-native-paper";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import RoutineSessionExerciseCard from "@/components/training/RoutineSessionExerciseCard";
import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationContext } from "@/context/NavigationContext";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import {
  RoutineSessionExercise,
  RoutineSessionResponse,
} from "@/types/training/services/RoutineSessionResponse";
import RoutineSessionService from "@/services/routineSessionService";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { RoutineSessionCreationRequest } from "@/types/training/services/RoutineSessionCreationRequest";
import { useTranslation } from "react-i18next";

export interface RoutineSessionExerciseFormFields {
  sets: RoutineSessionExerciseSetFormFields[];
}

export interface RoutineSessionExerciseSetFormFields {
  setNumber: number;
  repetitions: string;
  weight: string;
}

export default function CreateTrainingSessionScreen() {
  const { t } = useTranslation();
  const SessionNameSchema = Yup.object().shape({
    sessionName: Yup.string().required(
      t("screens.training.create_session.errors.required_name")
    ),
  });

  const { getCurrentSession } = useContext(AuthContext);
  const { getData, clearData } = useContext(NavigationContext);
  const { setLoading, showErrorSnackbar, showSuccessSnackbar } = useUIContext();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [routineSession, setRoutineSession] = useState<RoutineSessionResponse>({
    name: "",
    sessionExercises: [],
  });
  const sessionNameFormRef = useRef<FormikProps<{ sessionName: string }>>(null);
  const routineSessionExerciseFormRefs = useRef<
    FormikProps<RoutineSessionExerciseFormFields>[]
  >([]);
  const router = useRouter();
  const [
    deleteExerciseConfirmationModalVisible,
    setDeleteExerciseConfirmationModalVisible,
  ] = useState(false);
  const [exerciseIdToDelete, setExerciseIdToDelete] = useState<number | null>(
    null
  );

  const handleSaveCreatedSession = async () => {
    let allValid = true;

    if (sessionNameFormRef.current) {
      sessionNameFormRef.current.setTouched(
        {
          sessionName: true,
        },
        true
      );

      const errors = await sessionNameFormRef.current.validateForm();

      if (Object.keys(errors).length > 0) {
        allValid = false;
      }
    }

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
      if (routineSessionExerciseFormRefs.current.length === 0) {
        showErrorSnackbar(
          t("screens.training.create_session.errors.required_minimum_exercises")
        );
        return;
      }

      if (!routineSession) {
        console.error("Routine session to create is null or undefined");
        return;
      }
      console.log("All forms are valid. Values:");
      let newSession: RoutineSessionCreationRequest = {
        name: sessionNameFormRef.current?.values.sessionName || "",
        sessionExercises: [],
      };

      routineSessionExerciseFormRefs.current.forEach((form, index) => {
        console.log("Form index:", index);
        if (form) {
          newSession.sessionExercises.push({
            exerciseId: routineSession!.sessionExercises[index].exerciseId,
            recommendedOrder: index + 1,
            sets: form.values.sets.map((set: any) => ({
              id: set.id,
              setNumber: Number(set.setNumber),
              repetitions: Number(set.repetitions),
            })),
          });
        }
      });

      console.log(`Datos para enviar:\n${JSON.stringify(newSession, null, 2)}`);

      try {
        setLoading(true);
        const session = await getCurrentSession();
        await RoutineSessionService.createRoutineSession(
          newSession,
          session!.token!,
          session!.user!.id
        );
        setLoading(false);
        showSuccessSnackbar(
          t("screens.training.create_session.success.session_created")
        );
        router.back();
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error created training session:", error.message);
        } else {
          console.error("Error created training session:", error);
        }
        showErrorSnackbar(
          t("screens.training.create_session.errors.session_creation")
        );
      }
    } else {
      console.log("Some forms are invalid.");
    }
  };

  useEffect(() => {
    routineSession?.sessionExercises.forEach((exercise, index) => {
      if (routineSessionExerciseFormRefs.current[index]) {
        // Si el ejercicio ha sido recientemente añadido
        // hay que crear el formulario asociado con sus series.
        // Si no ha sido recientemente añadid el ejercicio no hace falta
        // volver a rellenar las series puesto que ya se manejaran con los controles
        if (exercise.recentlyAdded == true) {
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
          exercise.recentlyAdded = false;
        }
      }
    });
  }, [routineSession]);

  useFocusEffect(() => {
    const data = getData("AddExerciseScreen");
    if (data?.selectedExercise) {
      let newExercise: RoutineSessionExercise = {
        exerciseId: data.selectedExercise.id,
        exerciseName: data.selectedExercise.name,
        recommendedOrder: (routineSession?.sessionExercises?.length ?? 0) + 1,
        sets: Array.from({ length: 3 }, (_, i) => ({
          setNumber: i + 1,
          repetitions: 0,
          weight: 0,
        })),
        recentlyAdded: true,
      };

      console.log("Nuevo ejercicio seleccionado:", newExercise);

      setRoutineSession((prevSession) => {
        if (!prevSession) return prevSession;
        return {
          ...prevSession,
          sessionExercises: [...prevSession.sessionExercises, newExercise],
        };
      });

      clearData("AddExerciseScreen");
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("screens.training.create_session.title"),
      headerRight: () => (
        <Pressable
          onPressIn={handleSaveCreatedSession}
          style={({ pressed }) => ({
            marginRight: 15,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <FontAwesome5
            name="check"
            size={25}
            color={Colors[colorScheme ?? "light"].text}
          />
        </Pressable>
      ),
    });
  }, [navigation, routineSession]);

  const handleNewExercise = () => {
    console.log("Añadiendo nuevo ejercicio...");
    router.push({
      pathname: "./add-exercise",
      params: {
        sessionId: sessionId,
      },
    });
  };

  const handleDeleteExerciseConfirm = () => {
    setRoutineSession((prevState) => {
      if (!prevState) return prevState;
      return {
        ...prevState,
        sessionExercises: prevState.sessionExercises.filter(
          (exercise) => exercise.exerciseId !== exerciseIdToDelete
        ),
      };
    });

    const formIndexToDelete =
      routineSession?.sessionExercises.findIndex(
        (exercise) => exercise.exerciseId === exerciseIdToDelete
      ) ?? -1;

    if (formIndexToDelete !== -1) {
      routineSessionExerciseFormRefs.current.splice(formIndexToDelete, 1);
    }

    setDeleteExerciseConfirmationModalVisible(false);
  };

  const handleOnDeleteExercise = (exerciseId: number) => {
    setExerciseIdToDelete(exerciseId);
    setDeleteExerciseConfirmationModalVisible(true);
  };

  return (
    <Formik
      initialValues={{ sessionName: "" }}
      validationSchema={SessionNameSchema}
      onSubmit={() => {}}
      innerRef={sessionNameFormRef}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.container}>
            <Text style={styles.sessionTitle}>
              {t("screens.training.create_session.session_name_label")}
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("sessionName")}
              onBlur={handleBlur("sessionName")}
              value={values.sessionName}
              placeholder={t(
                "screens.training.create_session.session_name_placeholder"
              )}
            />
            {touched.sessionName && errors.sessionName ? (
              <Text style={styles.errorText}>{errors.sessionName}</Text>
            ) : null}
            <ConfirmationModal
              visible={deleteExerciseConfirmationModalVisible}
              onConfirm={handleDeleteExerciseConfirm}
              onCancel={() => {
                setDeleteExerciseConfirmationModalVisible(false);
              }}
              title={t(
                "screens.training.create_session.add_confirmation_title_label"
              )}
              message={t(
                "screens.training.create_session.add_confirmation_message_label"
              )}
            />
            {routineSession &&
              routineSession.sessionExercises.map(
                (exercise: RoutineSessionExercise, index: number) => (
                  <RoutineSessionExerciseCard
                    showWeightFields={false}
                    key={exercise.id}
                    id={(exercise.id ?? 0) + exercise.recommendedOrder}
                    name={`${exercise.exerciseName}`}
                    canDeleteRows={true}
                    onDeletePress={() =>
                      exercise.exerciseId !== undefined &&
                      handleOnDeleteExercise(exercise.exerciseId)
                    }
                    formRef={(el) => {
                      if (el) {
                        routineSessionExerciseFormRefs.current[index] = el;
                      }
                    }}
                  />
                )
              )}
          </View>
          <Button
            style={styles.addSessionButton}
            mode="outlined"
            icon="plus"
            onPress={handleNewExercise}
          >
            {t("screens.training.create_session.add_exercise_button")}
          </Button>
        </ScrollView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "column",
    justifyContent: "center",
  },
  routineTitle: {
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
  input: {
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  addSessionButton: {},
  deleteSessionButton: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: "#8B0000",
    borderWidth: 3,
  },
  buttonContainer: {
    alignItems: "center",
  },
});
