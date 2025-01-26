import React from "react";
import { TextInput } from "react-native-paper";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
  return (
    <View style={styles.row}>
      <View style={styles.setContainer}>
        <Text style={styles.setName}>Serie {setNumber}</Text>
      </View>
      {lastResults && (
        <View style={styles.lastResultsContainer}>
          <Text style={styles.lastResults}>Últ.</Text>
          <Text style={styles.lastResults}>
            {`${lastResults.repetitionsCompleted}x${lastResults.weightUsed}`}
          </Text>
        </View>
      )}

      <TextInput
        label="Reps"
        onChangeText={onRepetitionsChange}
        onBlur={onRepetitionsBlur}
        value={repetitions}
        style={styles.input}
        error={errorRepetitions}
        keyboardType="numeric"
      />
      {showWeightField && (
        <TextInput
          label="Kgs"
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
