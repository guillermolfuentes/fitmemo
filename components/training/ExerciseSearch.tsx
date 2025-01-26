import { Equipment } from "@/types/training/models/Equipment";
import { MuscleGroup } from "@/types/training/models/MuscleGroup";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

interface ExerciseSearchProps {
  onSearch: (filters: {
    name: string;
    muscleGroup?: MuscleGroup;
    equipment?: Equipment;
  }) => void;
}

const ExerciseSearch = ({ onSearch }: ExerciseSearchProps) => {
  const [name, setExerciseName] = useState("");
  const [equipment, setEquipment] = useState<Equipment>();
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>();

  const handleSearch = () => {
    onSearch({ name, equipment, muscleGroup });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre de ejercicio"
        value={name}
        onChangeText={setExerciseName}
        left={<TextInput.Icon icon="magnify" />}
      />
      <View style={styles.dropdownContainer}>
        <View style={styles.filterDropdown}>
          <Dropdown
            label="Material"
            value={equipment}
            hideMenuHeader={true}
            onSelect={(value) => {
              setEquipment(value as Equipment);
            }}
            options={[
              { label: "Mancuernas", value: "dumbbells" },
              { label: "Barra", value: "barbell" },
              { label: "Bandas", value: "resistance_band" },
              { label: "Gimnasio", value: "gym" },
              { label: "Sin equipamiento", value: "no_equipment" },
            ]}
          />
        </View>

        <Dropdown
          label="Músculo"
          value={muscleGroup}
          hideMenuHeader={true}
          onSelect={(value) => {
            setMuscleGroup(value as MuscleGroup);
          }}
          options={[
            { label: "Pecho", value: "chest" },
            { label: "Espalda", value: "back" },
            { label: "Piernas", value: "legs" },
            { label: "Brazos", value: "arms" },
            { label: "Hombros", value: "shoulders" },
            { label: "Abdominales", value: "abs" },
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
  container: {},
  input: {
    marginBottom: 10,
  },
  dropdownContainer: {
    flexDirection: "column",
    marginBottom: 15,
    marginTop: 10,
  },
  filterDropdown: {
    marginBottom: 10,
  },
});

export default ExerciseSearch;
