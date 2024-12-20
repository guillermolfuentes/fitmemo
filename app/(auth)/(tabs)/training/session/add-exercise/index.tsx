import React, { useState, useEffect, useRef, useContext, useLayoutEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import ExerciseCard from "@/components/training/ExerciseCard";
import ExerciseSearch from "@/components/training/ExerciseSearch";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { NavigationContext } from "@/context/NavigationContext";

const AddExerciseScreen = () => {
  const { setData } = useContext(NavigationContext);

  const [backConfirmationModalVisible, setBackConfirmationModalVisible] =
    useState(false);

  const [
    addExerciseConfirmationModalVisible,
    setaddExerciseConfirmationModalVisible,
  ] = useState(false);

  const [addExerciseModalTitle, setAddExerciseModalTitle] =
    useState("Añadir ejercicio");
  const [addExerciseModalMessage, setAddExerciseModalMessage] = useState(
    "¿Estás seguro de que deseas añadir el ejercicio a la sesión?"
  );

  const isBackToSessionConfirmedRef = useRef(false);

  const [selectedExerciseId, setSelectedExerciseId] = useState<number>();

  const [exercises, setExercises] = useState<
    { id: number; name: string; muscleGroup: string; material: string }[]
  >([]);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Añadir ejercicio",
    });
  }, [navigation]);

  const handleBackConfirm = () => {
    isBackToSessionConfirmedRef.current = true;
    setBackConfirmationModalVisible(false);
    router.back();
  };

  const handleBackCancel = () => {
    setBackConfirmationModalVisible(false);
  };

  const handleAddExerciseConfirm = () => {
    isBackToSessionConfirmedRef.current = true;
    //setBackConfirmationModalVisible(false);
    setaddExerciseConfirmationModalVisible(false);
    setData("EditTrainingSessionScreen", {
      selectedExerciseId: selectedExerciseId,
    });
    navigation.goBack();
  };

  const handleAddExerciseCancel = () => {
    setaddExerciseConfirmationModalVisible(false);
  };

  useEffect(() => {
    const handleBeforeRemove = (e: any) => {
      if (!isBackToSessionConfirmedRef.current) {
        e.preventDefault();
        setBackConfirmationModalVisible(true);
      }
    };

    const unsubscribe = navigation.addListener(
      "beforeRemove",
      handleBeforeRemove
    );

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const handleSearch = (filters: any) => {
    const results = [
      {
        id: 1,
        name: "Sentadilla",
        muscleGroup: "Piernas",
        material: "Pesas",
      },
      {
        id: 2,
        name: "Curl de Bíceps",
        muscleGroup: "Brazos",
        material: "Pesas",
      },
      {
        id: 3,
        name: "Curl de Bíceps",
        muscleGroup: "Brazos",
        material: "Pesas",
      },
      {
        id: 44,
        name: "Curl de Bíceps",
        muscleGroup: "Brazos",
        material: "Pesas",
      },
    ];
    setExercises(results);
  };

  const handleAddExercise = (exercise: any) => {
    setSelectedExerciseId(exercise.id);
    setAddExerciseModalTitle(`Añadir ${exercise.name.toLowerCase()}`);
    setAddExerciseModalMessage(
      `¿Estás seguro de que deseas añadir el ejercicio ${exercise.name.toLowerCase()} a la sesión de entrenamiento?`
    );

    setaddExerciseConfirmationModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <ConfirmationModal
          visible={backConfirmationModalVisible}
          onConfirm={handleBackConfirm}
          onCancel={handleBackCancel}
          title="¿Estás seguro?"
          message="¿Estás seguro de que quieres salir sin guardar los cambios?"
        />
        <ConfirmationModal
          visible={addExerciseConfirmationModalVisible}
          onConfirm={handleAddExerciseConfirm}
          onCancel={handleAddExerciseCancel}
          title={addExerciseModalTitle}
          message={addExerciseModalMessage}
        />
        <ExerciseSearch onSearch={handleSearch} />
        <View style={styles.resultsContainer}>
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              name={exercise.name}
              muscleGroup={exercise.muscleGroup}
              material={exercise.material}
              onAdd={() => handleAddExercise(exercise)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  resultsContainer: {
    marginTop: 16,
  },
});

export default AddExerciseScreen;
