import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Text } from "@/components/Themed";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useUIContext } from "@/context/UIContext";
import { AuthContext } from "@/context/AuthContext";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { Button, TextInput } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import RoutineSessionExerciseCard from "@/components/training/RoutineSessionExerciseCard";
import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationContext } from "@/context/NavigationContext";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import * as Yup from "yup";
import { Formik } from "formik";

const SessionNameSchema = Yup.object().shape({
  sessionName: Yup.string().required("El nombre de la sesión es obligatorio"),
});

export default function CreateTrainingSessionScreen() {
  const { getCurrentSession } = useContext(AuthContext);
  const { getData, clearData } = useContext(NavigationContext);
  const { isLoading, setLoading } = useUIContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [exercises, setExercises] = useState<{ id: number; name: string }[]>(
    []
  );
  const [
    deleteExerciseConfirmationModalVisible,
    setDeleteExerciseConfirmationModalVisible,
  ] = useState(false);

  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null);
  const [sessionName, setSessionName] = useState("");

  const mockData = [{ id: 1, name: "Ejercicio 1" }];

  useEffect(() => {
    const fetchUserRoutine = async () => {
      setLoading(true);

      try {
        setExercises(mockData);
      } catch (error) {
        console.error("Error fetching training session", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRoutine();
  }, [sessionId]);

  useFocusEffect(() => {
    const data = getData("EditTrainingSessionScreen");
    if (data) {
      console.log("Nuevo ejercicio seleccionado:", data.selectedExerciseId);
      clearData("EditTrainingSessionScreen");
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Nueva sesión",
      headerRight: () => (
        <Pressable
          onPressIn={() => {
            console.log("Guardando sesion...!");
          }}
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
  }, [navigation]);

  const handleNewExercise = () => {
    console.log("Añadiendo nuevo ejercicio...");
    router.push({
      pathname: "./add-exercise",
      params: {
        sessionId: sessionId,
      },
    });
  };

  const deleteExercise = (id: number) => {
    const updatedExercises = exercises.filter((exercise) => exercise.id !== id);
    setExercises(updatedExercises);
  };

  const handleDeleteExerciseConfirm = () => {
    console.log("Borrando ejercicio con ID:", exerciseToDelete);
    deleteExercise(exerciseToDelete as number);
    setDeleteExerciseConfirmationModalVisible(false);
    setExerciseToDelete(null);
  };

  const handleOnDeleteExercise = (exerciseId: number) => {
    setDeleteExerciseConfirmationModalVisible(true);
    setExerciseToDelete(exerciseId);
  };

  return (
    <Formik
      initialValues={{ sessionName: "" }}
      validationSchema={SessionNameSchema}
      onSubmit={(values) => {
        setSessionName(values.sessionName);
      }}
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
            {exercises.map((exercise) => (
              <RoutineSessionExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                onStartSession={() => {}}
                onEditSession={() => {}}
                onDeletePress={() => handleOnDeleteExercise(exercise.id)}
                canDeleteRows={true}
              />
            ))}
          </View>
          <Button
            style={styles.addSessionButton}
            mode="outlined"
            icon="plus"
            onPress={handleNewExercise}
          >
            Añadir ejercicio
          </Button>
        </ScrollView>
      )}
    </Formik>
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
});
