import React from "react";
import { TextInput } from "react-native-paper";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTranslation } from "react-i18next";

interface RoutineSessionExerciseSetRowProps {
  setNumber: number;
  repetitions: string;
  weight: string;
  onRepetitionsChange: (text: string) => void;
  onWeightChange: (text: string) => void;
  onRepetitionsBlur: (e: any) => void;
  onWeightBlur: (e: any) => void;
  onDeletePress?: () => void;
  errorRepetitions?: boolean;
  errorWeight?: boolean;
  showWeightField?: boolean;
  showLastResults?: boolean;
  lastResults?: {
    setNumber: number;
    repetitionsCompleted: number;
    weightUsed: number;
  };
}

const RoutineSessionExerciseSetRow: React.FC<
  RoutineSessionExerciseSetRowProps
> = ({
  setNumber,
  repetitions,
  weight,
  onRepetitionsChange,
  onWeightChange,
  onRepetitionsBlur,
  onWeightBlur,
  onDeletePress,
  errorRepetitions,
  errorWeight,
  showWeightField = false,
  lastResults,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      <View style={styles.setContainer}>
        <Text style={styles.setName}>
          {t("components.routine_session_exercise_set_row.set_label")}{" "}
          {setNumber}
        </Text>
      </View>
      {lastResults && (
        <View style={styles.lastResultsContainer}>
          <Text style={styles.lastResults}>
            {t("components.routine_session_exercise_set_row.last_set_label")}
          </Text>
          <Text style={styles.lastResults}>
            {`${lastResults.repetitionsCompleted}x${lastResults.weightUsed}`}
          </Text>
        </View>
      )}

      <TextInput
        label={t("components.routine_session_exercise_set_row.reps_label")}
        onChangeText={onRepetitionsChange}
        onBlur={onRepetitionsBlur}
        value={repetitions}
        style={styles.input}
        error={errorRepetitions}
        keyboardType="numeric"
      />
      {showWeightField && (
        <TextInput
          label={t("components.routine_session_exercise_set_row.weight_label")}
          onChangeText={onWeightChange}
          onBlur={onWeightBlur}
          value={weight}
          style={styles.input}
          error={errorWeight}
          keyboardType="numeric"
        />
      )}
      {onDeletePress && (
        <TouchableOpacity onPress={onDeletePress}>
          <FontAwesome name="trash-o" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    alignContent: "center",
    justifyContent: "space-between",
  },
  setContainer: {
    flexDirection: "row",
    flexBasis: "20%",
  },
  lastResultsContainer: {
    flexDirection: "column",
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  setName: {
    flex: 1,
    fontSize: 16,
  },
  lastResults: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
  },
  input: {
    marginHorizontal: 5,
    marginRight: 10,
  },
});

export default RoutineSessionExerciseSetRow;
