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
}

const RoutineSessionExerciseSetRow = ({
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
}: RoutineSessionExerciseSetRowProps) => {
  return (
    <View style={styles.row}>
      <Text style={styles.setName}>Serie {setNumber}</Text>
      <TextInput
        label="Reps"
        onChangeText={onRepetitionsChange}
        onBlur={onRepetitionsBlur}
        value={repetitions}
        style={styles.input}
        error={errorRepetitions}
        keyboardType="numeric"
      />
      <TextInput
        label="Kgs"
        onChangeText={onWeightChange}
        onBlur={onWeightBlur}
        value={weight}
        style={styles.input}
        error={errorWeight}
        keyboardType="numeric"
      />
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
  },
  setName: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    marginRight: 10,
  },
});

export default RoutineSessionExerciseSetRow;
