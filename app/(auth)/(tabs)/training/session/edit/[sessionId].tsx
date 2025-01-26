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
import { RoutineSessionUpdateRequest } from "@/types/training/services/RoutineSessionUpdateRequest";
import * as Yup from "yup";

export interface RoutineSessionExerciseFormFields {
  sets: RoutineSessionExerciseSetFormFields[];
}

export interface RoutineSessionExerciseSetFormFields {
  setNumber: number;
  repetitions: string;
  weight: string;
}

const SessionNameSchema = Yup.object().shape({
  sessionName: Yup.string().required("El nombre de la sesión es obligatorio"),
});

export default function EditTrainingSessionScreen() {
  const { getCurrentSession } = useContext(AuthContext);
  const { getData, clearData } = useContext(NavigationContext);
  const { setLoading, showErrorSnackbar, showSuccessSnackbar } = useUIContext();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [routineSession, setRoutineSession] =
    useState<RoutineSessionResponse | null>(null);
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

  const handleSaveEditedSession = async () => {
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
      if (!routineSession) {
        console.error("Routine session to edit is null or undefined");
        return;
      }
      console.log("All forms are valid. Values:");
      let editedSession: RoutineSessionUpdateRequest = {
        name: routineSession.name,
        sessionExercises: [],
      };

      routineSessionExerciseFormRefs.current.forEach((form, index) => {
        console.log("Form index:", index);
        if (form) {
          editedSession.sessionExercises.push({
            id: routineSession!.sessionExercises[index].id,
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

      console.log(
        `Datos para enviar:\n${JSON.stringify(editedSession, null, 2)}`
      );

      /*try {
        const session = await getCurrentSession();
        await RoutineSessionService.updateRoutineSession(
          editedSession,
          Number(sessionId),
          session.token!
        );
        showSuccessSnackbar("Edited Training session saved successfully.");

        router.back();
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error saving edited training session:", error.message);
        } else {
          console.error("Error saving edited training session:", error);
        }
        showErrorSnackbar(
          "Error saving edited session. Please try again later."
        );
      }*/
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

  useEffect(() => {
    if (routineSession && sessionNameFormRef.current) {
      sessionNameFormRef.current.setValues({
        sessionName: routineSession.name,
      });
    }

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

  useFocusEffect(() => {
    const data = getData("EditTrainingSessionScreen");
    if (data) {
      console.log("Nuevo ejercicio seleccionado:", data.selectedExerciseId);
      clearData("EditTrainingSessionScreen");
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Editar sesión",
      headerRight: () => (
        <Pressable
          onPressIn={handleSaveEditedSession}
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
      pathname: "../add-exercise",
      params: {
        sessionId: sessionId,
      },
    });
  };

  const handleDeleteSession = () => {
    console.log("Borrando la session: " + sessionId + "...");
    router.back();
  };

  /*const deleteExercise = (id: number) => {
    const updatedExercises = exercises.filter((exercise) => exercise.id !== id);
    setExercises(updatedExercises);
  };

  */

  const handleDeleteExerciseConfirm = () => {
    setRoutineSession((prevState) => {
      if (!prevState) return prevState;
      return {
        ...prevState,
        sessionExercises: prevState.sessionExercises.filter(
          (exercise) => exercise.id !== exerciseIdToDelete
        ),
      };
    });

    const formIndexToDelete =
      routineSession?.sessionExercises.findIndex(
        (exercise) => exercise.id === exerciseIdToDelete
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

  if (!routineSession) {
    return <Text>Cargando...</Text>;
  }

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
            <Text style={styles.sessionTitle}>Nombre de sesión</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("sessionName")}
              onBlur={handleBlur("sessionName")}
              value={values.sessionName}
              placeholder="Introduce el nombre de la sesión"
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
              title="¿Estás seguro?"
              message="¿Estás seguro de que quieres borrar el ejercicio?"
            />
            {routineSession &&
              routineSession.sessionExercises.map(
                (exercise: RoutineSessionExercise, index: number) => (
                  <RoutineSessionExerciseCard
                    showWeightFields={false}
                    key={exercise.id}
                    id={exercise.id}
                    name={`${exercise.exerciseName}`}
                    canDeleteRows={true}
                    onDeletePress={() => handleOnDeleteExercise(exercise.id)}
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
            Añadir ejercicio
          </Button>

          <View style={styles.buttonContainer}>
            <Button
              style={styles.deleteSessionButton}
              mode="contained"
              icon="delete"
              onPress={handleDeleteSession}
            >
              Eliminar sesión
            </Button>
          </View>
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
