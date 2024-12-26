import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Text } from "@/components/Themed";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useUIContext } from "@/context/UIContext";
import { AuthContext } from "@/context/AuthContext";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { Button } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import RoutineSessionExerciseCard from "@/components/training/RoutineSessionExerciseCard";
import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationContext } from "@/context/NavigationContext";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

export default function EditTrainingSessionScreen() {
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

  const mockData = [
    { id: 1, name: "Ejercicio 1" },
    { id: 2, name: "Ejercicio 2" },
    { id: 3, name: "Ejercicio 3" },
  ];

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
      title: "Editar sesión",
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
      pathname: "../add-exercise",
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
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
