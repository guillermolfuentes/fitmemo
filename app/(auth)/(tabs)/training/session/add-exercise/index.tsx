import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
} from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import ExerciseCard from "@/components/training/ExerciseCard";
import ExerciseSearch from "@/components/training/ExerciseSearch";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { NavigationContext } from "@/context/NavigationContext";
import ExerciseService from "@/services/exerciseService";
import { AuthContext } from "@/context/AuthContext";
import { Exercise } from "@/types/training/models/Exercise";
import { useUIContext } from "@/context/UIContext";
import { useTranslation } from "react-i18next";

const AddExerciseScreen = () => {
  const { setData } = useContext(NavigationContext);
  const { getCurrentSession } = useContext(AuthContext);
  const { setLoading, showErrorSnackbar, showSuccessSnackbar } = useUIContext();
  const { t } = useTranslation();

  const [backConfirmationModalVisible, setBackConfirmationModalVisible] =
    useState(false);

  const [
    addExerciseConfirmationModalVisible,
    setaddExerciseConfirmationModalVisible,
  ] = useState(false);

  const [addExerciseModalTitle, setAddExerciseModalTitle] = useState(
    t("screens.training.add_exercise.title")
  );
  const [addExerciseModalMessage, setAddExerciseModalMessage] = useState(
    t("screens.training.add_exercise.add_confirmation_default_label")
  );

  const isBackToSessionConfirmedRef = useRef(false);

  const [selectedExercise, setSelectedExercise] = useState<Exercise>();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("screens.training.add_exercise.title"),
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
    setaddExerciseConfirmationModalVisible(false);
    setData("AddExerciseScreen", {
      selectedExercise: selectedExercise,
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

  const handleSearch = async (filters: any) => {
    console.log("Filtros de búsqueda: ", filters);

    try {
      setLoading(true);
      const session = await getCurrentSession();
      let searchResult: Exercise[] = await ExerciseService.searchExercises(
        filters,
        session!.token!
      );
      setExercises(searchResult);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching exercise search:", error.message);
      } else {
        console.error("Error fetching exercise search:", error);
      }
      showErrorSnackbar(
        t("screens.training.add_exercise.errors.fetching_exercises")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = (exercise: any) => {
    setSelectedExercise(exercise);
    setAddExerciseModalTitle(
      `${t("common.add")} ${exercise.name.toLowerCase()}`
    );
    setAddExerciseModalMessage(
      `${t(
        "screens.training.add_exercise.add_confirmation_message_label_1"
      )} ${exercise.name.toLowerCase()} ${t(
        "screens.training.add_exercise.add_confirmation_message_label_2"
      )}`
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
          title={t(
            "screens.training.add_exercise.add_confirmation_title_label"
          )}
          message={t(
            "screens.training.add_exercise.exit_confirmation_title_label"
          )}
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
              material={exercise.equipmentNeeded}
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
