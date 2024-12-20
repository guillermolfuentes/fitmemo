import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Button, Text } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

interface ExerciseSearchProps {
  onSearch: (filters: {
    exerciseName: string;
    material: string;
    muscleGroup: string;
  }) => void;
}

const ExerciseSearch = ({ onSearch }: ExerciseSearchProps) => {
  const [exerciseName, setExerciseName] = useState("");
  const [material, setMaterial] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");

  const handleSearch = () => {
    onSearch({ exerciseName, material, muscleGroup });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre de ejercicio"
        value={exerciseName}
        onChangeText={setExerciseName}
      />
      <View style={styles.dropdownContainer}>
        <Dropdown
          label="Material"
          value={material}
          hideMenuHeader={true}
          onSelect={(value) => {
            setMaterial(value as string);
          }}
          options={[
            { label: "Pesas", value: "pesas" },
            { label: "Bandas", value: "bandas" },
          ]}
        />
        <Dropdown
          label="Músculo"
          value={muscleGroup}
          hideMenuHeader={true}
          onSelect={(value) => {
            setMuscleGroup(value as string);
          }}
          options={[
            { label: "Piernas", value: "piernas" },
            { label: "Brazos", value: "brazos" },
          ]}
        />
      </View>
      <Button mode="contained" onPress={handleSearch} icon="magnify">
        Buscar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
});

export default ExerciseSearch;
